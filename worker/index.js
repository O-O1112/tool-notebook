/**
 * Cloudflare Worker API 核心
 * 綁定 Cloudflare D1 資料庫 (env.DB) 與 Web Crypto 身分驗證
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...SECURITY_HEADERS,
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

// 邊緣滑動視窗速率限制 (Edge Sliding Window Rate Limiter)
const edgeHits = new Map();
function checkEdgeRateLimit(key, limit = 60, windowMs = 60000) {
  const now = Date.now();
  let record = edgeHits.get(key);
  if (!record || now - record.startTime > windowMs) {
    record = { count: 1, startTime: now };
    edgeHits.set(key, record);
    return { allowed: true };
  }
  record.count += 1;
  if (record.count > limit) {
    const retryAfter = Math.ceil((record.startTime + windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  return { allowed: true };
}

function generateInviteCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SPC-${code}`;
}

// Web Crypto PBKDF2 密碼雜湊
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const key = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashHex = Array.from(new Uint8Array(key)).map(b => b.toString(16).padStart(2, '0')).join('');
  return { hash: hashHex, salt: saltHex };
}

async function verifyPassword(password, storedHash, storedSalt) {
  const salt = new Uint8Array(storedSalt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const key = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashHex = Array.from(new Uint8Array(key)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === storedHash;
}

// Web Crypto JWT 簽章與驗證 (支援 UTF-8 / 中文字元)
function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function signToken(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 86400 * 7;
  const fullPayload = { ...payload, exp };

  const encHeader = base64UrlEncode(JSON.stringify(header));
  const encPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encHeader}.${encPayload}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
}

async function verifyToken(token, secret) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encHeader, encPayload, signature] = parts;
  const data = `${encHeader}.${encPayload}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const sigBytes = new Uint8Array(
    atob(signature.replace(/-/g, '+').replace(/_/g, '/'))
      .split('')
      .map(c => c.charCodeAt(0))
  );

  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
  if (!valid) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

async function getAuthUser(request, secret) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  return await verifyToken(token, secret);
}

export default {
  async fetch(request, env) {
    try {
      const secret = env.JWT_SECRET || 'cf_d1_default_secret_key_2026';
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // 處理 CORS Preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 健康檢查
    if (path === '/api/health') {
      return jsonResponse({ status: 'ok', runtime: 'cloudflare-worker', d1: !!env.DB });
    }

    // 1. 註冊帳號
    if (path === '/api/auth/register' && method === 'POST') {
      const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'edge-client';
      const rl = checkEdgeRateLimit(`auth:${clientIp}`, 15, 15 * 60 * 1000);
      if (!rl.allowed) return jsonResponse({ error: '請求過於頻繁，請稍後再試' }, 429, { 'Retry-After': rl.retryAfter });

      const body = await request.json().catch(() => ({}));
      const { username, password, displayName } = body;
      if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
        return jsonResponse({ error: '帳號與密碼為必填' }, 400);
      }
      const cleanUsername = username.trim();
      if (cleanUsername.length < 3 || cleanUsername.length > 50) {
        return jsonResponse({ error: '帳號長度需介於 3 至 50 個字元' }, 400);
      }
      if (!/^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/.test(cleanUsername)) {
        return jsonResponse({ error: '帳號僅支援中英文字母、數字、底線與連字號' }, 400);
      }
      if (password.length < 4 || password.length > 128) {
        return jsonResponse({ error: '密碼長度需介於 4 至 128 個字元' }, 400);
      }

      const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(cleanUsername).first();
      if (existing) return jsonResponse({ error: '此帳號已存在' }, 409);

      const { hash, salt } = await hashPassword(password);
      const name = (typeof displayName === 'string' ? displayName.trim().slice(0, 50) : '') || cleanUsername;

      const res = await env.DB.prepare(`
        INSERT INTO users (username, password_hash, salt, display_name, role)
        VALUES (?, ?, ?, ?, 'user')
      `).bind(cleanUsername, hash, salt, name).run();

      const userId = res.meta.last_row_id;
      // 建立預設空間
      await env.DB.prepare(`
        INSERT INTO spaces (user_id, name, description, layout, invite_code)
        VALUES (?, ?, ?, 'grid', ?)
      `).bind(userId, `${name} 的工具本`, '個人工具空間', generateInviteCode()).run();

      const userPayload = { id: userId, username: cleanUsername, displayName: name };
      const token = await signToken(userPayload, secret);
      return jsonResponse({ token, user: userPayload }, 201);
    }

    // 2. 登入帳號
    if (path === '/api/auth/login' && method === 'POST') {
      const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'edge-client';
      const rl = checkEdgeRateLimit(`auth:${clientIp}`, 15, 15 * 60 * 1000);
      if (!rl.allowed) return jsonResponse({ error: '登入嘗試過於頻繁，請稍後再試' }, 429, { 'Retry-After': rl.retryAfter });

      const body = await request.json().catch(() => ({}));
      const { username, password } = body;
      if (!username || !password) return jsonResponse({ error: '請輸入有效的帳號與密碼' }, 400);
      if (username.length > 50 || password.length > 128) {
        return jsonResponse({ error: '帳號或密碼格式不符規範' }, 400);
      }

      // 支援體驗訪客帳號快速自動建立或就地登入
      if (username === 'demo' && password === 'demo1234') {
        let demoUser = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind('demo').first();
        if (!demoUser) {
          const { hash, salt } = await hashPassword('demo1234');
          const res = await env.DB.prepare(`
            INSERT INTO users (username, password_hash, salt, display_name, role)
            VALUES (?, ?, ?, '體驗訪客', 'demo')
          `).bind('demo', hash, salt).run();
          const demoUserId = res.meta.last_row_id;
          await env.DB.prepare(`
            INSERT INTO spaces (user_id, name, description, layout, invite_code)
            VALUES (?, '體驗訪客的手帳空間', '預載實用小工具範本，自由探索與使用', 'grid', 'SPC-DEMO')
          `).bind(demoUserId).run();
          demoUser = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(demoUserId).first();
        }
        const userPayload = { id: demoUser.id, username: 'demo', displayName: demoUser.display_name };
        const token = await signToken(userPayload, secret);
        return jsonResponse({ token, user: userPayload });
      }

      const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
      if (!user) return jsonResponse({ error: '帳號或密碼不正確' }, 401);

      const match = await verifyPassword(password, user.password_hash, user.salt);
      if (!match) return jsonResponse({ error: '帳號或密碼不正確' }, 401);

      const userPayload = { id: user.id, username: user.username, displayName: user.display_name };
      const token = await signToken(userPayload, secret);
      return jsonResponse({ token, user: userPayload });
    }

    // 2.5 免登入訪客透過邀請碼 / QR Code 查看空間 (公開唯讀)
    const shareMatch = path.match(/^\/api\/spaces\/share\/([A-Za-z0-9\-]+)$/);
    if (shareMatch && method === 'GET') {
      const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'edge-client';
      const rl = checkEdgeRateLimit(`invite:${clientIp}`, 30, 60 * 1000);
      if (!rl.allowed) return jsonResponse({ error: '請求過於頻繁，請稍後再試' }, 429, { 'Retry-After': rl.retryAfter });

      const cleanCode = decodeURIComponent(shareMatch[1]).trim().toUpperCase();
      const space = await env.DB.prepare(`
        SELECT s.id, s.name, s.description, s.layout, s.invite_code, s.created_at,
               u.display_name as owner_name,
               0 as is_owner
        FROM spaces s
        JOIN users u ON s.user_id = u.id
        WHERE UPPER(s.invite_code) = ?
      `).bind(cleanCode).first();

      if (!space) return jsonResponse({ error: '找不到此邀請碼對應的空間' }, 404);

      const { results: tools } = await env.DB.prepare(`
        SELECT id, space_id, title, type, content, col_span, sort_order, created_at
        FROM tools
        WHERE space_id = ?
        ORDER BY sort_order ASC, id ASC
      `).bind(space.id).all();

      return jsonResponse({ space, tools: tools || [], isGuest: true });
    }

    // 驗證後續需要登入之 API
    const user = await getAuthUser(request, secret);
    if (!user) {
      return jsonResponse({ error: '未授權存取，請先登入' }, 401);
    }

    // 4. 當前使用者資料
    if (path === '/api/auth/me' && method === 'GET') {
      const dbUser = await env.DB.prepare('SELECT id, username, display_name, created_at FROM users WHERE id = ?').bind(user.id).first();
      if (!dbUser) return jsonResponse({ error: '找不到該使用者' }, 404);
      return jsonResponse({
        user: {
          id: dbUser.id,
          username: dbUser.username,
          displayName: dbUser.display_name,
          display_name: dbUser.display_name,
          createdAt: dbUser.created_at,
        }
      });
    }

    // 4.5 更新個人資料 (顯示名稱)
    if (path === '/api/auth/profile' && method === 'PATCH') {
      const body = await request.json().catch(() => ({}));
      const { displayName } = body;
      if (!displayName || !displayName.trim()) return jsonResponse({ error: '請輸入有效的顯示名稱' }, 400);

      const finalName = displayName.trim();
      await env.DB.prepare('UPDATE users SET display_name = ? WHERE id = ?').bind(finalName, user.id).run();

      const userPayload = {
        id: user.id,
        username: user.username,
        displayName: finalName,
        display_name: finalName,
      };
      const token = await signToken(userPayload, secret);
      return jsonResponse({ token, user: userPayload });
    }

    // 5. 取得空間清單
    if (path === '/api/spaces' && method === 'GET') {
      const { results } = await env.DB.prepare(`
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
      `).bind(user.id, user.id, user.id).all();

      return jsonResponse({ spaces: results || [] });
    }

    // 6. 建立空間
    if (path === '/api/spaces' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const { name, description = '', layout = 'grid' } = body;
      if (!name || typeof name !== 'string' || !name.trim()) return jsonResponse({ error: '空間名稱為必填' }, 400);
      const cleanName = name.trim();
      if (cleanName.length > 100) return jsonResponse({ error: '空間名稱不可超過 100 個字元' }, 400);
      const cleanDesc = (typeof description === 'string' ? description.trim() : '').slice(0, 1000);
      const validLayouts = ['grid', 'shelf', 'wall', 'tabs', 'collapsed'];
      const safeLayout = validLayouts.includes(layout) ? layout : 'grid';

      const code = generateInviteCode();
      const res = await env.DB.prepare(`
        INSERT INTO spaces (user_id, name, description, layout, invite_code)
        VALUES (?, ?, ?, ?, ?)
      `).bind(user.id, cleanName, cleanDesc, safeLayout, code).run();

      const newSpace = await env.DB.prepare(`
        SELECT s.*, u.display_name as owner_name, 1 as is_owner, 0 as tool_count
        FROM spaces s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ?
      `).bind(res.meta.last_row_id).first();

      return jsonResponse({ space: newSpace }, 201);
    }

    // 7. 輸入邀請碼加入空間
    if (path === '/api/spaces/join' && method === 'POST') {
      const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'edge-client';
      const rl = checkEdgeRateLimit(`invite:${clientIp}`, 30, 60 * 1000);
      if (!rl.allowed) return jsonResponse({ error: '請求過於頻繁，請稍後再試' }, 429, { 'Retry-After': rl.retryAfter });

      const body = await request.json().catch(() => ({}));
      const { inviteCode } = body;
      if (!inviteCode || typeof inviteCode !== 'string' || !inviteCode.trim()) return jsonResponse({ error: '請提供邀請碼' }, 400);

      const cleanCode = inviteCode.trim().toUpperCase();
      const space = await env.DB.prepare(`
        SELECT s.*, u.display_name as owner_name
        FROM spaces s
        JOIN users u ON s.user_id = u.id
        WHERE UPPER(s.invite_code) = ?
      `).bind(cleanCode).first();

      if (!space) return jsonResponse({ error: '找不到對應的空間' }, 404);

      if (space.user_id !== user.id) {
        await env.DB.prepare('INSERT OR IGNORE INTO space_members (space_id, user_id) VALUES (?, ?)').bind(space.id, user.id).run();
      }

      return jsonResponse({ message: `成功加入「${space.name}」！`, space: { ...space, is_owner: space.user_id === user.id ? 1 : 0 } });
    }

    // 8. 空間詳情與工具列表 /api/spaces/:id
    const spaceMatch = path.match(/^\/api\/spaces\/(\d+)$/);
    if (spaceMatch) {
      const spaceId = Number(spaceMatch[1]);

      if (method === 'GET') {
        const space = await env.DB.prepare(`
          SELECT s.id, s.user_id, s.name, s.description, s.layout, s.invite_code, s.created_at,
                 u.display_name as owner_name,
                 (CASE WHEN s.user_id = ? THEN 1 ELSE 0 END) as is_owner
          FROM spaces s
          JOIN users u ON s.user_id = u.id
          LEFT JOIN space_members sm ON s.id = sm.space_id AND sm.user_id = ?
          WHERE s.id = ? AND (s.user_id = ? OR sm.user_id = ?)
        `).bind(user.id, user.id, spaceId, user.id, user.id).first();

        if (!space) return jsonResponse({ error: '空間不存在或無權限' }, 404);

        const { results: tools } = await env.DB.prepare(`
          SELECT * FROM tools WHERE space_id = ? ORDER BY sort_order ASC, id ASC
        `).bind(spaceId).all();

        return jsonResponse({ space, tools: tools || [] });
      }

      if (method === 'PATCH') {
        const body = await request.json().catch(() => ({}));
        const { name, description, layout } = body;
        const check = await env.DB.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?').bind(spaceId, user.id).first();
        if (!check) return jsonResponse({ error: '無權限修改' }, 403);

        if (name !== undefined) {
          if (typeof name !== 'string' || !name.trim()) return jsonResponse({ error: '空間名稱不可為空' }, 400);
          const cleanName = name.trim();
          if (cleanName.length > 100) return jsonResponse({ error: '空間名稱不可超過 100 個字元' }, 400);
          await env.DB.prepare('UPDATE spaces SET name = ? WHERE id = ?').bind(cleanName, spaceId).run();
        }
        if (description !== undefined) {
          const cleanDesc = (typeof description === 'string' ? description.trim() : '').slice(0, 1000);
          await env.DB.prepare('UPDATE spaces SET description = ? WHERE id = ?').bind(cleanDesc, spaceId).run();
        }
        if (layout !== undefined) {
          const validLayouts = ['grid', 'shelf', 'wall', 'tabs', 'collapsed'];
          if (!validLayouts.includes(layout)) return jsonResponse({ error: '無效的排版格式' }, 400);
          await env.DB.prepare('UPDATE spaces SET layout = ? WHERE id = ?').bind(layout, spaceId).run();
        }

        const updated = await env.DB.prepare('SELECT * FROM spaces WHERE id = ?').bind(spaceId).first();
        return jsonResponse({ space: updated });
      }

      if (method === 'DELETE') {
        const res = await env.DB.prepare('DELETE FROM spaces WHERE id = ? AND user_id = ?').bind(spaceId, user.id).run();
        if (res.meta.changes === 0) return jsonResponse({ error: '無權限或不存在' }, 404);
        return jsonResponse({ message: '空間已刪除' });
      }
    }

    // 9. 重新產生邀請碼 /api/spaces/:id/regenerate-code
    const regenMatch = path.match(/^\/api\/spaces\/(\d+)\/regenerate-code$/);
    if (regenMatch && method === 'POST') {
      const spaceId = Number(regenMatch[1]);
      const check = await env.DB.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?').bind(spaceId, user.id).first();
      if (!check) return jsonResponse({ error: '無權限操作' }, 403);

      const newCode = generateInviteCode();
      await env.DB.prepare('UPDATE spaces SET invite_code = ? WHERE id = ?').bind(newCode, spaceId).run();
      return jsonResponse({ inviteCode: newCode });
    }

    // 10. 新增工具 /api/spaces/:id/tools
    const addToolMatch = path.match(/^\/api\/spaces\/(\d+)\/tools$/);
    if (addToolMatch && method === 'POST') {
      const spaceId = Number(addToolMatch[1]);
      const body = await request.json().catch(() => ({}));
      const { title, type = 'html', content, colSpan = 1 } = body;

      if (!title || typeof title !== 'string' || !title.trim()) return jsonResponse({ error: '工具名稱為必填' }, 400);
      const cleanTitle = title.trim();
      if (cleanTitle.length > 100) return jsonResponse({ error: '工具名稱不可超過 100 個字元' }, 400);

      if (!content || typeof content !== 'string' || !content.trim()) return jsonResponse({ error: '請貼入程式碼、iframe 或網址' }, 400);
      const cleanContent = content.trim();
      if (cleanContent.length > 1048576) return jsonResponse({ error: '工具內容大小不可超過 1MB' }, 400);

      const validTypes = ['html', 'iframe', 'url'];
      const safeType = validTypes.includes(type) ? type : 'html';
      const safeColSpan = Number(colSpan) === 2 ? 2 : 1;

      const check = await env.DB.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?').bind(spaceId, user.id).first();
      if (!check) return jsonResponse({ error: '只有建立者可新增工具' }, 403);

      const maxOrder = await env.DB.prepare('SELECT MAX(sort_order) as m FROM tools WHERE space_id = ?').bind(spaceId).first();
      const sortOrder = (maxOrder?.m ?? -1) + 1;

      const res = await env.DB.prepare(`
        INSERT INTO tools (space_id, title, type, content, sort_order, col_span)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(spaceId, cleanTitle, safeType, cleanContent, sortOrder, safeColSpan).run();

      const newTool = await env.DB.prepare('SELECT * FROM tools WHERE id = ?').bind(res.meta.last_row_id).first();
      return jsonResponse({ tool: newTool }, 201);
    }

    // 11. 拖曳重排工具 /api/spaces/:id/tools/reorder
    const reorderMatch = path.match(/^\/api\/spaces\/(\d+)\/tools\/reorder$/);
    if (reorderMatch && method === 'PATCH') {
      const spaceId = Number(reorderMatch[1]);
      const body = await request.json().catch(() => ({}));
      const { toolIds } = body;

      if (!Array.isArray(toolIds)) return jsonResponse({ error: 'toolIds 必須為陣列' }, 400);

      const check = await env.DB.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?').bind(spaceId, user.id).first();
      if (!check) return jsonResponse({ error: '只有建立者可排序' }, 403);

      for (let i = 0; i < toolIds.length; i++) {
        await env.DB.prepare('UPDATE tools SET sort_order = ? WHERE id = ? AND space_id = ?').bind(i, toolIds[i], spaceId).run();
      }

      return jsonResponse({ message: '排序已更新' });
    }

    // 12. 更新 / 刪除工具 /api/spaces/:id/tools/:toolId
    const toolOpMatch = path.match(/^\/api\/spaces\/(\d+)\/tools\/(\d+)$/);
    if (toolOpMatch) {
      const spaceId = Number(toolOpMatch[1]);
      const toolId = Number(toolOpMatch[2]);

      const check = await env.DB.prepare('SELECT id FROM spaces WHERE id = ? AND user_id = ?').bind(spaceId, user.id).first();
      if (!check) return jsonResponse({ error: '無權限操作' }, 403);

      if (method === 'PATCH') {
        const body = await request.json().catch(() => ({}));
        const updates = [];
        const bindings = [];
        if (body.colSpan !== undefined) {
          const parsedColSpan = Number(body.colSpan);
          updates.push('col_span = ?');
          bindings.push(parsedColSpan === 2 ? 2 : 1);
        }
        if (body.title !== undefined) {
          if (typeof body.title !== 'string' || !body.title.trim()) return jsonResponse({ error: '工具名稱不可為空' }, 400);
          const cleanTitle = body.title.trim();
          if (cleanTitle.length > 100) return jsonResponse({ error: '工具名稱不可超過 100 個字元' }, 400);
          updates.push('title = ?');
          bindings.push(cleanTitle);
        }
        if (body.content !== undefined) {
          if (typeof body.content !== 'string' || !body.content.trim()) return jsonResponse({ error: '工具內容不可為空' }, 400);
          const cleanContent = body.content.trim();
          if (cleanContent.length > 1048576) return jsonResponse({ error: '工具內容大小不可超過 1MB' }, 400);
          updates.push('content = ?');
          bindings.push(cleanContent);
        }
        if (body.type !== undefined) {
          const validTypes = ['html', 'iframe', 'url'];
          if (!validTypes.includes(body.type)) return jsonResponse({ error: '無效的工具類型' }, 400);
          updates.push('type = ?');
          bindings.push(body.type);
        }

        if (updates.length > 0) {
          bindings.push(toolId, spaceId);
          await env.DB.prepare(`UPDATE tools SET ${updates.join(', ')} WHERE id = ? AND space_id = ?`).bind(...bindings).run();
        }

        const updated = await env.DB.prepare('SELECT * FROM tools WHERE id = ?').bind(toolId).first();
        return jsonResponse({ tool: updated });
      }

      if (method === 'DELETE') {
        await env.DB.prepare('DELETE FROM tools WHERE id = ? AND space_id = ?').bind(toolId, spaceId).run();
        return jsonResponse({ message: '工具已刪除' });
      }
    }

      return jsonResponse({ error: 'Not Found' }, 404);
    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ error: err.message || '伺服器錯誤', stack: err.stack }, 500);
    }
  },
};
