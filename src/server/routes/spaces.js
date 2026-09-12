import express from 'express';
import { db, generateInviteCode } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 0. 免登入訪客透過邀請碼 / QR Code 查看空間 (公開唯讀)
router.get('/share/:code', (req, res) => {
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
      SELECT id, space_id, title, type, content, col_span, sort_order, created_at
      FROM tools
      WHERE space_id = ?
      ORDER BY sort_order ASC, id ASC
    `).all(space.id);

    res.json({ space, tools: tools || [], isGuest: true });
  } catch (err) {
    console.error('Get share space error:', err);
    res.status(500).json({ error: '無法讀取空間' });
  }
});

// 所有後續空間操作皆需驗證登入
router.use(requireAuth);

// 1. 取得使用者的空間列表 (包含自己建立的空間 + 透過邀請碼加入的空間)
router.get('/', (req, res) => {
  try {
    const getSpaces = db.prepare(`
      SELECT s.id, s.name, s.description, s.layout, s.invite_code, s.created_at,
             s.user_id as owner_id,
             u.display_name as owner_name,
             (CASE WHEN s.user_id = ? THEN 1 ELSE 0 END) as is_owner,
             COUNT(DISTINCT t.id) as tool_count
      FROM spaces s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN tools t ON s.id = t.space_id
      LEFT JOIN space_members sm ON s.id = sm.space_id
      WHERE s.user_id = ? OR sm.user_id = ?
      GROUP BY s.id
      ORDER BY is_owner DESC, s.id DESC
    `);
    const spaces = getSpaces.all(req.user.id, req.user.id, req.user.id);
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
    if (!name || !name.trim()) {
      return res.status(400).json({ error: '空間名稱為必填' });
    }

    const inviteCode = generateInviteCode();
    const insert = db.prepare(`
      INSERT INTO spaces (user_id, name, description, layout, invite_code)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = insert.run(req.user.id, name.trim(), description.trim(), layout, inviteCode);
    const spaceId = Number(result.lastInsertRowid);

    const getNewSpace = db.prepare(`
      SELECT s.*, u.display_name as owner_name, 1 as is_owner
      FROM spaces s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `).get(spaceId);

    res.status(201).json({ space: { ...getNewSpace, tool_count: 0 } });
  } catch (err) {
    console.error('Create space error:', err);
    res.status(500).json({ error: '建立空間失敗' });
  }
});

// 3. 透過邀請碼加入空間 (學生或協作者)
router.post('/join', (req, res) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode || !inviteCode.trim()) {
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

    // 如果本人就是擁有者
    if (space.user_id === req.user.id) {
      return res.json({
        message: '您是此空間的擁有者，已為您載入空間',
        space: { ...space, is_owner: 1 },
      });
    }

    // 加入成員關聯
    const insertMember = db.prepare(`
      INSERT OR IGNORE INTO space_members (space_id, user_id)
      VALUES (?, ?)
    `);
    insertMember.run(space.id, req.user.id);

    res.json({
      message: `已成功加入「${space.name}」！`,
      space: { ...space, is_owner: 0 },
    });
  } catch (err) {
    console.error('Join space error:', err);
    res.status(500).json({ error: '加入空間失敗' });
  }
});

// 4. 重新產生邀請碼 (僅擁有者教師可操作)
router.post('/:id/regenerate-code', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const space = db.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?').get(spaceId, req.user.id);

    if (!space) {
      return res.status(403).json({ error: '只有空間建立者可以重新產生邀請碼' });
    }

    const newCode = generateInviteCode();
    db.prepare('UPDATE spaces SET invite_code = ? WHERE id = ?').run(newCode, spaceId);

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
    
    // 檢查是否有存取權限 (擁有者或成員)
    const checkAccess = db.prepare(`
      SELECT s.id, s.user_id, s.name, s.description, s.layout, s.invite_code, s.created_at,
             u.display_name as owner_name,
             (CASE WHEN s.user_id = ? THEN 1 ELSE 0 END) as is_owner
      FROM spaces s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN space_members sm ON s.id = sm.space_id AND sm.user_id = ?
      WHERE s.id = ? AND (s.user_id = ? OR sm.user_id = ?)
    `);
    const space = checkAccess.get(req.user.id, req.user.id, spaceId, req.user.id, req.user.id);

    if (!space) {
      return res.status(404).json({ error: '找不到此空間或無權限存取' });
    }

    const getTools = db.prepare(`
      SELECT id, space_id, title, type, content, sort_order, col_span, created_at
      FROM tools WHERE space_id = ?
      ORDER BY sort_order ASC, id ASC
    `);
    const tools = getTools.all(spaceId);

    res.json({ space, tools });
  } catch (err) {
    console.error('Get space detail error:', err);
    res.status(500).json({ error: '無法讀取空間內容' });
  }
});

// 6. 更新空間設定 (如切換 layout: 'grid' | 'tabs' | 'collapsed')
router.patch('/:id', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const { name, description, layout } = req.body;

    const checkSpace = db.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?');
    if (!checkSpace.get(spaceId, req.user.id)) {
      return res.status(403).json({ error: '無權限修改此空間' });
    }

    const updates = [];
    const params = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name.trim()); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description.trim()); }
    if (layout !== undefined) { updates.push('layout = ?'); params.push(layout); }

    if (updates.length > 0) {
      params.push(spaceId);
      const updateQuery = `UPDATE spaces SET ${updates.join(', ')} WHERE id = ?`;
      db.prepare(updateQuery).run(...params);
    }

    const getUpdated = db.prepare('SELECT * FROM spaces WHERE id = ?').get(spaceId);
    res.json({ space: getUpdated });
  } catch (err) {
    console.error('Update space error:', err);
    res.status(500).json({ error: '更新空間失敗' });
  }
});

// 7. 拖曳重排小工具順序 (Batch Reorder)
router.patch('/:id/tools/reorder', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const { toolIds } = req.body;

    if (!Array.isArray(toolIds)) {
      return res.status(400).json({ error: 'toolIds 必須為陣列' });
    }

    const checkSpace = db.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?');
    if (!checkSpace.get(spaceId, req.user.id)) {
      return res.status(403).json({ error: '只有空間建立者可以調整排序' });
    }

    const updateStmt = db.prepare('UPDATE tools SET sort_order = ? WHERE id = ? AND space_id = ?');
    toolIds.forEach((id, index) => {
      updateStmt.run(index, id, spaceId);
    });

    res.json({ message: '工具排序已更新' });
  } catch (err) {
    console.error('Reorder tools error:', err);
    res.status(500).json({ error: '重排工具失敗' });
  }
});

// 8. 調整單一工具屬性 (如 col_span 寬度: 1 或 2)
router.patch('/:id/tools/:toolId', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const toolId = Number(req.params.toolId);
    const { colSpan, title, content, type } = req.body;

    const checkSpace = db.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?');
    if (!checkSpace.get(spaceId, req.user.id)) {
      return res.status(403).json({ error: '無權限修改此工具' });
    }

    const updates = [];
    const params = [];
    if (colSpan !== undefined) { updates.push('col_span = ?'); params.push(Number(colSpan)); }
    if (title !== undefined) { updates.push('title = ?'); params.push(title.trim()); }
    if (content !== undefined) { updates.push('content = ?'); params.push(content.trim()); }
    if (type !== undefined) { updates.push('type = ?'); params.push(type.trim()); }

    if (updates.length > 0) {
      params.push(toolId, spaceId);
      db.prepare(`UPDATE tools SET ${updates.join(', ')} WHERE id = ? AND space_id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM tools WHERE id = ?').get(toolId);
    res.json({ tool: updated });
  } catch (err) {
    console.error('Update tool error:', err);
    res.status(500).json({ error: '更新工具失敗' });
  }
});

// 9. 刪除空間
router.delete('/:id', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const deleteSpace = db.prepare('DELETE FROM spaces WHERE id = ? AND user_id = ?');
    const result = deleteSpace.run(spaceId, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: '空間不存在或無權限刪除' });
    }

    res.json({ message: '空間已成功刪除' });
  } catch (err) {
    console.error('Delete space error:', err);
    res.status(500).json({ error: '刪除空間失敗' });
  }
});

// 10. 新增小工具至空間
router.post('/:id/tools', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const { title, type = 'html', content, colSpan = 1 } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: '工具名稱為必填' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: '請貼入程式碼、iframe 或網址' });
    }

    const checkSpace = db.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?');
    if (!checkSpace.get(spaceId, req.user.id)) {
      return res.status(403).json({ error: '只有建立者可新增工具' });
    }

    const maxOrderRow = db.prepare('SELECT MAX(sort_order) as max_order FROM tools WHERE space_id = ?').get(spaceId);
    const sortOrder = (maxOrderRow?.max_order ?? -1) + 1;

    const insertTool = db.prepare(`
      INSERT INTO tools (space_id, title, type, content, sort_order, col_span)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = insertTool.run(spaceId, title.trim(), type, content.trim(), sortOrder, colSpan);
    const toolId = Number(result.lastInsertRowid);

    const newTool = db.prepare('SELECT * FROM tools WHERE id = ?').get(toolId);
    res.status(201).json({ tool: newTool });
  } catch (err) {
    console.error('Add tool error:', err);
    res.status(500).json({ error: '新增小工具失敗' });
  }
});

// 11. 刪除小工具
router.delete('/:id/tools/:toolId', (req, res) => {
  try {
    const spaceId = Number(req.params.id);
    const toolId = Number(req.params.toolId);

    const checkSpace = db.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?');
    if (!checkSpace.get(spaceId, req.user.id)) {
      return res.status(403).json({ error: '無權限操作此空間' });
    }

    const deleteTool = db.prepare('DELETE FROM tools WHERE id = ? AND space_id = ?');
    const result = deleteTool.run(toolId, spaceId);

    if (result.changes === 0) {
      return res.status(404).json({ error: '找不到該工具' });
    }

    res.json({ message: '工具已成功移除' });
  } catch (err) {
    console.error('Delete tool error:', err);
    res.status(500).json({ error: '刪除工具失敗' });
  }
});

export default router;
