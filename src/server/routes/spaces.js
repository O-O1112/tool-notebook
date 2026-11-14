import express from 'express';
import { db, generateInviteCode, generateHostedCode } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { inviteLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * 權限檢查輔助函式
 * 回傳使用者的角色：'owner' | 'editor' | 'viewer' | null
 */
function getSpaceRole(spaceId, userId) {
  if (!spaceId || !userId) return null;
  const space = db.prepare('SELECT id, user_id FROM spaces WHERE id = ?').get(spaceId);
  if (!space) return null;
  if (space.user_id === userId) return 'owner';

  const member = db.prepare('SELECT role FROM space_members WHERE space_id = ? AND user_id = ?').get(spaceId, userId);
  if (member) return member.role || 'editor';
  return null;
}

/**
 * 寫入協作活動日誌輔助函式
 */
function logActivity(spaceId, userId, action, details = '') {
  try {
    const detailStr = typeof details === 'object' ? JSON.stringify(details) : String(details);
    db.prepare(`
      INSERT INTO space_activities (space_id, user_id, action, details)
      VALUES (?, ?, ?, ?)
    `).run(spaceId, userId, action, detailStr);
  } catch (err) {
    console.error('Log activity error:', err);
  }
}

// =========================================================================
// 0. 公開免登入端點 (受速率限制保護)
// =========================================================================

// 0A. 免登入訪客透過邀請碼 / QR Code 查看整套空間 (唯讀)
router.get('/share/:code', inviteLimiter, (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ error: '請提供邀請碼' });
    const cleanCode = code.trim().toUpperCase();

    const space = db.prepare(`
      SELECT s.id, s.name, s.description, s.layout, s.invite_code, s.created_at,
             u.display_name as owner_name,
             0 as is_owner
      FROM spaces s
      JOIN users u ON s.user_id = u.id
      WHERE UPPER(s.invite_code) = ?
    `).get(cleanCode);

    if (!space) {
      return res.status(404).json({ error: '找不到此邀請碼對應的空間' });
    }

    const tools = db.prepare(`
      SELECT id, space_id, title, type, content, col_span, sort_order, created_at,
             created_by_user_id, updated_by_user_id
      FROM tools
      WHERE space_id = ? AND deleted_at IS NULL
      ORDER BY sort_order ASC, id ASC
    `).all(space.id);

    res.json({ space, tools: tools || [], isGuest: true, user_role: 'viewer' });
  } catch (err) {
    console.error('Get share space error:', err);
    res.status(500).json({ error: '無法讀取空間' });
  }
});

// 0B. 獨立代管網站微應用公開讀取 (模式 1: 單一小工具 / 模式 2: 多工具客製分頁門戶 / 模式 3: 外部嵌入)
router.get('/hosted/:code', inviteLimiter, (req, res) => {
  try {
    const { code } = req.params;
    if (!code) return res.status(400).json({ error: '請提供代管分享代碼' });
    const cleanCode = code.trim().toUpperCase();

    const share = db.prepare(`
      SELECT h.*, s.name as space_name, u.display_name as owner_name
      FROM hosted_shares h
      JOIN spaces s ON h.space_id = s.id
      JOIN users u ON h.user_id = u.id
      WHERE UPPER(h.share_code) = ? AND h.is_active = 1
    `).get(cleanCode);

    if (!share) {
      return res.status(404).json({ error: '找不到此代管分享或已被發布者關閉' });
    }

    // 瀏覽次數累加
    try {
      db.prepare('UPDATE hosted_shares SET views = views + 1 WHERE id = ?').run(share.id);
    } catch (e) {}

    let toolIds = [];
    try {
      toolIds = JSON.parse(share.tool_ids);
    } catch (e) {
      toolIds = [];
    }

    let tools = [];
    if (toolIds.length > 0) {
      const placeholders = toolIds.map(() => '?').join(',');
      tools = db.prepare(`
        SELECT id, space_id, title, type, content, col_span, sort_order, created_at
        FROM tools
        WHERE id IN (${placeholders}) AND deleted_at IS NULL
      `).all(...toolIds);

      // 按照原設定順序重排
      const toolMap = new Map(tools.map(t => [t.id, t]));
      tools = toolIds.map(id => toolMap.get(id)).filter(Boolean);
    }

    let customConfig = {};
    try {
      customConfig = JSON.parse(share.custom_config || '{}');
    } catch (e) {}

    res.json({
      share: {
        id: share.id,
        share_code: share.share_code,
        mode: share.mode,
        title: share.title,
        views: share.views + 1,
        created_at: share.created_at,
        custom_config: customConfig,
      },
      space_name: share.space_name,
      owner_name: share.owner_name,
      tools,
      is_embed: req.query.embed === 'true',
    });
  } catch (err) {
    console.error('Get hosted tool error:', err);
    res.status(500).json({ error: '讀取獨立代管應用失敗' });
  }
});

// =========================================================================
// 所有後續空間操作皆需驗證登入
// =========================================================================
router.use(requireAuth);

// 1. 取得使用者的空間列表 (包含自己建立的空間 + 透過邀請碼加入的空間)
router.get('/', (req, res) => {
  try {
    const getSpaces = db.prepare(`
      SELECT s.id, s.name, s.description, s.layout, s.invite_code, s.created_at,
             s.user_id as owner_id,
             u.display_name as owner_name,
             (CASE WHEN s.user_id = ? THEN 1 ELSE 0 END) as is_owner,
             COALESCE(sm.role, CASE WHEN s.user_id = ? THEN 'owner' ELSE 'editor' END) as user_role,
             COUNT(DISTINCT t.id) as tool_count
      FROM spaces s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN tools t ON s.id = t.space_id AND t.deleted_at IS NULL
      LEFT JOIN space_members sm ON s.id = sm.space_id AND sm.user_id = ?
      WHERE s.user_id = ? OR sm.user_id = ?
      GROUP BY s.id
      ORDER BY is_owner DESC, s.id DESC
    `);
    const spaces = getSpaces.all(req.user.id, req.user.id, req.user.id, req.user.id, req.user.id);
    res.json({ spaces });
  } catch (err) {
    console.error('Get spaces error:', err);
    res.status(500).json({ error: '無法讀取空間列表' });
  }
});

// 2. 建立新空間
router.post('/', (req, res) => {
  try {
    const { name, description = '', layout = 'grid' } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: '空間名稱為必填' });
    }

    const cleanName = name.trim();
    if (cleanName.length > 100) {
      return res.status(400).json({ error: '空間名稱不可超過 100 個字元' });
    }

    const cleanDesc = (typeof description === 'string' ? description.trim() : '').slice(0, 1000);
    const validLayouts = ['grid', 'shelf', 'wall', 'tabs', 'collapsed', 'canvas'];
    const safeLayout = validLayouts.includes(layout) ? layout : 'grid';

    let inviteCode = generateInviteCode();
    for (let r = 0; r < 10; r++) {
      const existing = db.prepare('SELECT id FROM spaces WHERE invite_code = ?').get(inviteCode);
      if (!existing) break;
      inviteCode = generateInviteCode();
    }
    const insert = db.prepare(`
      INSERT INTO spaces (user_id, name, description, layout, invite_code)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insert.run(req.user.id, cleanName, cleanDesc, safeLayout, inviteCode);
    const spaceId = Number(result.lastInsertRowid);

    const getNewSpace = db.prepare(`
      SELECT s.*, u.display_name as owner_name, 1 as is_owner, 'owner' as user_role
      FROM spaces s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `).get(spaceId);

    logActivity(spaceId, req.user.id, 'space_create', { name: cleanName });

    res.status(201).json({ space: { ...getNewSpace, tool_count: 0 } });
  } catch (err) {
    console.error('Create space error:', err);
    res.status(500).json({ error: '建立空間失敗' });
  }
});

// 3. 透過邀請碼加入空間 (預設成為協作者 Editor)
router.post('/join', inviteLimiter, (req, res) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode || typeof inviteCode !== 'string' || !inviteCode.trim()) {
      return res.status(400).json({ error: '請輸入有效的邀請碼' });
    }

    const cleanCode = inviteCode.trim().toUpperCase();
    const space = db.prepare(`
      SELECT s.*, u.display_name as owner_name
      FROM spaces s
      JOIN users u ON s.user_id = u.id
      WHERE UPPER(s.invite_code) = ?
    `).get(cleanCode);

    if (!space) {
      return res.status(404).json({ error: '找不到此邀請碼對應的空間，請核對代碼' });
    }

    // 若本人就是擁有者
    if (space.user_id === req.user.id) {
      return res.json({
        message: '您是此空間的擁有者，已為您載入空間',
        space: { ...space, is_owner: 1, user_role: 'owner' },
      });
    }

    // 加入成員關聯，預設賦予 editor 協作者權限
    const insertMember = db.prepare(`
      INSERT INTO space_members (space_id, user_id, role)
      VALUES (?, ?, 'editor')
      ON CONFLICT(space_id, user_id) DO NOTHING
    `);
    insertMember.run(space.id, req.user.id);

    logActivity(space.id, req.user.id, 'member_join', { userName: req.user.displayName || req.user.username });

    res.json({
      message: `已成功加入「${space.name}」！`,
      space: { ...space, is_owner: 0, user_role: 'editor' },
    });
  } catch (err) {
    console.error('Join space error:', err);
    res.status(500).json({ error: '加入空間失敗' });
  }
});

// 4. 重新產生邀請碼 (擁有者專用)
router.post('/:id/regenerate-code', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (role !== 'owner') {
      return res.status(403).json({ error: '只有空間擁有者可以重新產生邀請碼' });
    }

    const newCode = generateInviteCode();
    db.prepare('UPDATE spaces SET invite_code = ? WHERE id = ?').run(newCode, spaceId);
    logActivity(spaceId, req.user.id, 'regenerate_code', { newCode });

    res.json({ inviteCode: newCode });
  } catch (err) {
    console.error('Regenerate code error:', err);
    res.status(500).json({ error: '重新產生邀請碼失敗' });
  }
});

// 5. 取得單一空間及其包含的全部小工具 (擁有者或成員皆可檢視)
router.get('/:id', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);

    if (!role) {
      return res.status(404).json({ error: '找不到此空間或無權限存取' });
    }

    const space = db.prepare(`
      SELECT s.id, s.user_id, s.name, s.description, s.layout, s.invite_code, s.created_at,
             u.display_name as owner_name,
             (CASE WHEN s.user_id = ? THEN 1 ELSE 0 END) as is_owner
      FROM spaces s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `).get(req.user.id, spaceId);

    const tools = db.prepare(`
      SELECT t.id, t.space_id, t.title, t.type, t.content, t.sort_order, t.col_span, t.created_at,
             t.created_by_user_id, t.updated_by_user_id,
             u_creator.display_name as created_by_name,
             u_updater.display_name as updated_by_name
      FROM tools t
      LEFT JOIN users u_creator ON t.created_by_user_id = u_creator.id
      LEFT JOIN users u_updater ON t.updated_by_user_id = u_updater.id
      WHERE t.space_id = ? AND t.deleted_at IS NULL
      ORDER BY t.sort_order ASC, t.id ASC
    `).all(spaceId);

    // 成員計數
    const memberCountRow = db.prepare(`
      SELECT COUNT(*) as count FROM space_members WHERE space_id = ?
    `).get(spaceId);
    const memberCount = (memberCountRow?.count || 0) + 1; // 加上擁有者

    res.json({ space: { ...space, user_role: role, member_count: memberCount }, tools });
  } catch (err) {
    console.error('Get space detail error:', err);
    res.status(500).json({ error: '無法讀取空間內容' });
  }
});

// 6. 更新空間設定 (擁有者或協作者)
router.patch('/:id', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role || role === 'viewer') {
      return res.status(403).json({ error: '無權限修改此空間' });
    }

    const { name, description, layout } = req.body;
    const updates = [];
    const params = [];

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: '空間名稱不可為空' });
      }
      const cleanName = name.trim();
      if (cleanName.length > 100) {
        return res.status(400).json({ error: '空間名稱不可超過 100 個字元' });
      }
      updates.push('name = ?');
      params.push(cleanName);
    }

    if (description !== undefined) {
      const cleanDesc = typeof description === 'string' ? description.trim() : '';
      if (cleanDesc.length > 1000) {
        return res.status(400).json({ error: '空間描述不可超過 1000 個字元' });
      }
      updates.push('description = ?');
      params.push(cleanDesc);
    }

    if (layout !== undefined) {
      const validLayouts = ['grid', 'shelf', 'wall', 'tabs', 'collapsed', 'canvas'];
      if (!validLayouts.includes(layout)) {
        return res.status(400).json({ error: '無效的排版格式' });
      }
      updates.push('layout = ?');
      params.push(layout);
    }

    if (updates.length > 0) {
      params.push(spaceId);
      db.prepare(`UPDATE spaces SET ${updates.join(', ')} WHERE id = ?`).run(...params);
      logActivity(spaceId, req.user.id, 'space_update', { name, layout });
    }

    const getUpdated = db.prepare('SELECT * FROM spaces WHERE id = ?').get(spaceId);
    res.json({ space: { ...getUpdated, user_role: role } });
  } catch (err) {
    console.error('Update space error:', err);
    res.status(500).json({ error: '更新空間失敗' });
  }
});

// 7. 拖曳重排小工具順序 (協作者與擁有者均可操作)
router.patch('/:id/tools/reorder', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role || role === 'viewer') {
      return res.status(403).json({ error: '檢視者無權限調整排序' });
    }

    const { toolIds } = req.body;
    if (!Array.isArray(toolIds)) {
      return res.status(400).json({ error: 'toolIds 必須為陣列' });
    }

    const updateStmt = db.prepare('UPDATE tools SET sort_order = ? WHERE id = ? AND space_id = ?');
    toolIds.forEach((id, index) => {
      updateStmt.run(index, id, spaceId);
    });

    logActivity(spaceId, req.user.id, 'tools_reorder', { count: toolIds.length });

    res.json({ message: '工具排序已更新' });
  } catch (err) {
    console.error('Reorder tools error:', err);
    res.status(500).json({ error: '重排工具失敗' });
  }
});

// 8. 調整單一工具屬性 (標題、代碼、寬度) - 協作者與擁有者皆可操作
router.patch('/:id/tools/:toolId', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const toolId = Number(req.params.toolId);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role || role === 'viewer') {
      return res.status(403).json({ error: '檢視者無權限修改工具' });
    }

    const { colSpan, title, content, type } = req.body;
    const updates = [];
    const params = [];

    if (colSpan !== undefined) {
      const parsedColSpan = Number(colSpan);
      updates.push('col_span = ?');
      params.push(parsedColSpan === 2 ? 2 : 1);
    }
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: '工具名稱不可為空' });
      }
      const cleanTitle = title.trim();
      if (cleanTitle.length > 100) {
        return res.status(400).json({ error: '工具名稱不可超過 100 個字元' });
      }
      updates.push('title = ?');
      params.push(cleanTitle);
    }
    if (content !== undefined) {
      if (typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ error: '工具內容不可為空' });
      }
      const cleanContent = content.trim();
      if (cleanContent.length > 1048576) {
        return res.status(400).json({ error: '工具內容大小不可超過 1MB' });
      }
      updates.push('content = ?');
      params.push(cleanContent);
    }
    if (type !== undefined) {
      const validTypes = ['html', 'iframe', 'url'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: '無效的工具類型' });
      }
      updates.push('type = ?');
      params.push(type);
    }

    // 標註最後修改者
    updates.push('updated_by_user_id = ?');
    params.push(req.user.id);

    if (updates.length > 0) {
      params.push(toolId, spaceId);
      db.prepare(`UPDATE tools SET ${updates.join(', ')} WHERE id = ? AND space_id = ?`).run(...params);
      logActivity(spaceId, req.user.id, 'tool_update', { toolId, title });
    }

    const updated = db.prepare(`
      SELECT t.*, u.display_name as updated_by_name
      FROM tools t
      LEFT JOIN users u ON t.updated_by_user_id = u.id
      WHERE t.id = ?
    `).get(toolId);

    res.json({ tool: updated });
  } catch (err) {
    console.error('Update tool error:', err);
    res.status(500).json({ error: '更新工具失敗' });
  }
});

// 9. 刪除整個空間 (擁有者專用)
router.delete('/:id', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (role !== 'owner') {
      return res.status(403).json({ error: '只有空間擁有者可以刪除此空間' });
    }

    const result = db.prepare('DELETE FROM spaces WHERE id = ? AND user_id = ?').run(spaceId, req.user.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: '空間不存在或無權限刪除' });
    }

    res.json({ message: '空間已成功刪除' });
  } catch (err) {
    console.error('Delete space error:', err);
    res.status(500).json({ error: '刪除空間失敗' });
  }
});

// 10. 新增小工具至空間 (擁有者與協作者皆可新增)
router.post('/:id/tools', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role || role === 'viewer') {
      return res.status(403).json({ error: '檢視者無權限新增工具' });
    }

    const { title, type = 'html', content, colSpan = 1 } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: '工具名稱為必填' });
    }
    const cleanTitle = title.trim();
    if (cleanTitle.length > 100) {
      return res.status(400).json({ error: '工具名稱不可超過 100 個字元' });
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: '請貼入程式碼、iframe 或網址' });
    }
    const cleanContent = content.trim();
    if (cleanContent.length > 1048576) {
      return res.status(400).json({ error: '工具內容大小不可超過 1MB' });
    }

    const validTypes = ['html', 'iframe', 'url'];
    const safeType = validTypes.includes(type) ? type : 'html';
    const safeColSpan = Number(colSpan) === 2 ? 2 : 1;

    const maxOrderRow = db.prepare('SELECT MAX(sort_order) as max_order FROM tools WHERE space_id = ? AND deleted_at IS NULL').get(spaceId);
    const sortOrder = (maxOrderRow?.max_order ?? -1) + 1;

    const insertTool = db.prepare(`
      INSERT INTO tools (space_id, title, type, content, sort_order, col_span, created_by_user_id, updated_by_user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = insertTool.run(spaceId, cleanTitle, safeType, cleanContent, sortOrder, safeColSpan, req.user.id, req.user.id);
    const toolId = Number(result.lastInsertRowid);

    const newTool = db.prepare(`
      SELECT t.*, u.display_name as created_by_name
      FROM tools t
      LEFT JOIN users u ON t.created_by_user_id = u.id
      WHERE t.id = ?
    `).get(toolId);

    logActivity(spaceId, req.user.id, 'tool_create', { toolId, title: cleanTitle });

    res.status(201).json({ tool: newTool });
  } catch (err) {
    console.error('Add tool error:', err);
    res.status(500).json({ error: '新增小工具失敗' });
  }
});

// 11. 刪除小工具 (軟刪除，支援即時撤銷復原)
router.delete('/:id/tools/:toolId', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const toolId = Number(req.params.toolId);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role || role === 'viewer') {
      return res.status(403).json({ error: '檢視者無權限刪除工具' });
    }

    const tool = db.prepare('SELECT id, title FROM tools WHERE id = ? AND space_id = ? AND deleted_at IS NULL').get(toolId, spaceId);
    if (!tool) {
      return res.status(404).json({ error: '找不到該工具或已被刪除' });
    }

    // 軟刪除：標記 deleted_at
    db.prepare('UPDATE tools SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND space_id = ?').run(toolId, spaceId);

    logActivity(spaceId, req.user.id, 'tool_delete', { toolId, title: tool.title });

    res.json({ message: '工具已移至回收區，可隨時復原', toolId });
  } catch (err) {
    console.error('Delete tool error:', err);
    res.status(500).json({ error: '刪除工具失敗' });
  }
});

// 12. 復原已刪除的小工具 (Undo / Restore)
router.post('/:id/tools/:toolId/restore', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const toolId = Number(req.params.toolId);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role || role === 'viewer') {
      return res.status(403).json({ error: '檢視者無權限復原工具' });
    }

    const tool = db.prepare('SELECT id, title FROM tools WHERE id = ? AND space_id = ? AND deleted_at IS NOT NULL').get(toolId, spaceId);
    if (!tool) {
      return res.status(404).json({ error: '找不到此已刪除工具' });
    }

    db.prepare('UPDATE tools SET deleted_at = NULL, updated_by_user_id = ? WHERE id = ? AND space_id = ?').run(req.user.id, toolId, spaceId);

    const restoredTool = db.prepare(`
      SELECT t.*, u.display_name as updated_by_name
      FROM tools t
      LEFT JOIN users u ON t.updated_by_user_id = u.id
      WHERE t.id = ?
    `).get(toolId);

    logActivity(spaceId, req.user.id, 'tool_restore', { toolId, title: tool.title });

    res.json({ message: '工具已成功復原！', tool: restoredTool });
  } catch (err) {
    console.error('Restore tool error:', err);
    res.status(500).json({ error: '復原工具失敗' });
  }
});

// 13. 取得空間內已刪除的工具列表 (回收庫清單)
router.get('/:id/tools/trash', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role) {
      return res.status(403).json({ error: '無權限存取' });
    }

    const trashTools = db.prepare(`
      SELECT t.id, t.space_id, t.title, t.type, t.col_span, t.deleted_at,
             u.display_name as updated_by_name
      FROM tools t
      LEFT JOIN users u ON t.updated_by_user_id = u.id
      WHERE t.space_id = ? AND t.deleted_at IS NOT NULL
      ORDER BY t.deleted_at DESC
    `).all(spaceId);

    res.json({ trash: trashTools });
  } catch (err) {
    console.error('Get trash tools error:', err);
    res.status(500).json({ error: '無法讀取回收庫' });
  }
});

// =========================================================================
// 14. 團隊成員與角色管理 API (RBAC)
// =========================================================================

// 取得全體空間成員列表
router.get('/:id/members', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role) {
      return res.status(403).json({ error: '無權限查看成員名單' });
    }

    const space = db.prepare('SELECT user_id FROM spaces WHERE id = ?').get(spaceId);
    const owner = db.prepare(`
      SELECT id as user_id, username, display_name, 'owner' as role, created_at as joined_at, 1 as is_owner
      FROM users WHERE id = ?
    `).get(space.user_id);

    const members = db.prepare(`
      SELECT u.id as user_id, u.username, u.display_name, sm.role, sm.joined_at, 0 as is_owner
      FROM space_members sm
      JOIN users u ON sm.user_id = u.id
      WHERE sm.space_id = ?
      ORDER BY sm.joined_at ASC
    `).all(spaceId);

    res.json({
      members: [owner, ...members].filter(Boolean),
      current_user_role: role,
    });
  } catch (err) {
    console.error('Get space members error:', err);
    res.status(500).json({ error: '無法讀取成員名單' });
  }
});

// 調整成員角色 (擁有者專用：切換 editor 或 viewer)
router.patch('/:id/members/:targetUserId', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const targetUserId = Number(req.params.targetUserId);
    const role = getSpaceRole(spaceId, req.user.id);

    if (role !== 'owner') {
      return res.status(403).json({ error: '只有空間擁有者可以調整成員權限' });
    }

    const { targetRole } = req.body;
    if (!['editor', 'viewer'].includes(targetRole)) {
      return res.status(400).json({ error: '目標角色必須為 editor 或 viewer' });
    }

    const result = db.prepare(`
      UPDATE space_members SET role = ? WHERE space_id = ? AND user_id = ?
    `).run(targetRole, spaceId, targetUserId);

    if (result.changes === 0) {
      return res.status(404).json({ error: '找不到該成員' });
    }

    logActivity(spaceId, req.user.id, 'member_role_update', { targetUserId, targetRole });

    res.json({ message: '成員角色已更新', targetRole });
  } catch (err) {
    console.error('Update member role error:', err);
    res.status(500).json({ error: '更新成員角色失敗' });
  }
});

// 移除成員 (擁有者可踢除成員；成員本人可主動退出空間)
router.delete('/:id/members/:targetUserId', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const targetUserId = Number(req.params.targetUserId);
    const role = getSpaceRole(spaceId, req.user.id);

    const isSelfLeaving = req.user.id === targetUserId;
    const isOwnerKicking = role === 'owner';

    if (!isSelfLeaving && !isOwnerKicking) {
      return res.status(403).json({ error: '無權限移除此成員' });
    }

    const result = db.prepare(`
      DELETE FROM space_members WHERE space_id = ? AND user_id = ?
    `).run(spaceId, targetUserId);

    if (result.changes === 0) {
      return res.status(404).json({ error: '成員不在該空間中' });
    }

    logActivity(spaceId, req.user.id, isSelfLeaving ? 'member_leave' : 'member_kick', { targetUserId });

    res.json({ message: isSelfLeaving ? '已退出空間' : '已成功移出成員' });
  } catch (err) {
    console.error('Remove member error:', err);
    res.status(500).json({ error: '移除成員失敗' });
  }
});

// =========================================================================
// 15. 空間團隊對話與活動廣播 (Team Chat)
// =========================================================================

// 取得最近 50 筆團隊對話
router.get('/:id/messages', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role) {
      return res.status(403).json({ error: '無權限存取' });
    }

    const messages = db.prepare(`
      SELECT m.id, m.space_id, m.user_id, m.content, m.created_at,
             u.display_name as sender_name, u.username as sender_username,
             COALESCE(sm.role, CASE WHEN s.user_id = m.user_id THEN 'owner' ELSE 'editor' END) as sender_role
      FROM space_messages m
      JOIN spaces s ON m.space_id = s.id
      JOIN users u ON m.user_id = u.id
      LEFT JOIN space_members sm ON m.space_id = sm.space_id AND m.user_id = sm.user_id
      WHERE m.space_id = ?
      ORDER BY m.id ASC
      LIMIT 100
    `).all(spaceId);

    // 查詢最近 15 筆系統活動動態
    const activities = db.prepare(`
      SELECT a.id, a.space_id, a.user_id, a.action, a.details, a.created_at,
             u.display_name as user_name
      FROM space_activities a
      JOIN users u ON a.user_id = u.id
      WHERE a.space_id = ?
      ORDER BY a.id DESC
      LIMIT 20
    `).all(spaceId);

    res.json({ messages, activities });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: '無法讀取團隊訊息' });
  }
});

// 發送團隊對話訊息
router.post('/:id/messages', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role) {
      return res.status(403).json({ error: '無權限發送訊息' });
    }

    const { content } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: '訊息內容不可為空' });
    }

    const cleanContent = content.trim().slice(0, 2000);

    const insert = db.prepare(`
      INSERT INTO space_messages (space_id, user_id, content)
      VALUES (?, ?, ?)
    `);
    const result = insert.run(spaceId, req.user.id, cleanContent);
    const msgId = Number(result.lastInsertRowid);

    const newMsg = db.prepare(`
      SELECT m.id, m.space_id, m.user_id, m.content, m.created_at,
             u.display_name as sender_name, u.username as sender_username,
             ? as sender_role
      FROM space_messages m
      JOIN users u ON m.user_id = u.id
      WHERE m.id = ?
    `).get(role, msgId);

    res.status(201).json({ message: newMsg });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: '發送訊息失敗' });
  }
});

// =========================================================================
// 16. 三種發布模式：獨立代管與外部嵌入發布引擎 (Hosting Engine)
// =========================================================================

// 建立或更新代管發布 (模式 1: 單一小工具 / 模式 2: 多工具客製分頁套件)
router.post('/:id/hosted', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role || role === 'viewer') {
      return res.status(403).json({ error: '檢視者無權限發布獨立代管應用' });
    }

    const { mode = 'single', toolIds, title, customConfig = {} } = req.body;

    if (!['single', 'multi'].includes(mode)) {
      return res.status(400).json({ error: '模式必須為 single 或 multi' });
    }

    if (!Array.isArray(toolIds) || toolIds.length === 0) {
      return res.status(400).json({ error: '請至少指定一個小工具' });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: '請輸入代管網站標題' });
    }

    const cleanTitle = title.trim().slice(0, 100);
    const shareCode = generateHostedCode();
    const toolIdsStr = JSON.stringify(toolIds.map(Number));
    const configStr = JSON.stringify(customConfig);

    const insert = db.prepare(`
      INSERT INTO hosted_shares (share_code, user_id, space_id, mode, tool_ids, title, custom_config)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = insert.run(shareCode, req.user.id, spaceId, mode, toolIdsStr, cleanTitle, configStr);
    const shareId = Number(result.lastInsertRowid);

    logActivity(spaceId, req.user.id, 'hosted_publish', { mode, title: cleanTitle, shareCode });

    const newShare = db.prepare('SELECT * FROM hosted_shares WHERE id = ?').get(shareId);
    res.status(201).json({ share: newShare });
  } catch (err) {
    console.error('Create hosted share error:', err);
    res.status(500).json({ error: '發布代管應用失敗' });
  }
});

// 取得該空間的所有已發布代管清單
router.get('/:id/hosted', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role) {
      return res.status(403).json({ error: '無權限存取' });
    }

    const shares = db.prepare(`
      SELECT h.*, u.display_name as publisher_name
      FROM hosted_shares h
      JOIN users u ON h.user_id = u.id
      WHERE h.space_id = ?
      ORDER BY h.id DESC
    `).all(spaceId);

    res.json({ shares });
  } catch (err) {
    console.error('Get hosted shares error:', err);
    res.status(500).json({ error: '無法讀取代管發布清單' });
  }
});

// 停用或刪除代管發布
router.delete('/:id/hosted/:shareId', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const shareId = Number(req.params.shareId);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role || role === 'viewer') {
      return res.status(403).json({ error: '無權限操作' });
    }

    db.prepare('DELETE FROM hosted_shares WHERE id = ? AND space_id = ?').run(shareId, spaceId);
    res.json({ message: '代管發布已成功下架移除' });
  } catch (err) {
    console.error('Delete hosted share error:', err);
    res.status(500).json({ error: '移除代管發布失敗' });
  }
});

// =========================================================================
// 17. 協作探測與輕量輪詢同步 (Live Sync Status)
// =========================================================================
router.get('/:id/sync-status', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const role = getSpaceRole(spaceId, req.user.id);
    if (!role) {
      return res.status(403).json({ error: '無權限存取' });
    }

    const toolCountRow = db.prepare('SELECT COUNT(*) as count FROM tools WHERE space_id = ? AND deleted_at IS NULL').get(spaceId);
    const trashCountRow = db.prepare('SELECT COUNT(*) as count FROM tools WHERE space_id = ? AND deleted_at IS NOT NULL').get(spaceId);
    const msgCountRow = db.prepare('SELECT COUNT(*) as count, MAX(id) as max_id FROM space_messages WHERE space_id = ?').get(spaceId);
    const lastActivityRow = db.prepare('SELECT MAX(id) as max_act_id FROM space_activities WHERE space_id = ?').get(spaceId);
    const memberCountRow = db.prepare('SELECT COUNT(*) as count FROM space_members WHERE space_id = ?').get(spaceId);

    res.json({
      active_tools_count: toolCountRow?.count || 0,
      trash_tools_count: trashCountRow?.count || 0,
      toolCount: toolCountRow?.count || 0,
      memberCount: (memberCountRow?.count || 0) + 1,
      message_count: msgCountRow?.count || 0,
      latest_message_id: msgCountRow?.max_id || 0,
      latest_activity_id: lastActivityRow?.max_act_id || 0,
      current_user_role: role,
    });
  } catch (err) {
    console.error('Get sync status error:', err);
    res.status(500).json({ error: '無法取得同步狀態' });
  }
});

export default router;