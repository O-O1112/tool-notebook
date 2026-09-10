import { DatabaseSync } from 'node:sqlite';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const dbPath = process.env.DATABASE_PATH || './data/class_notebook.db';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA busy_timeout = 5000;');

// 生成 6 碼便於輸入的空間邀請碼 (如 SPC-7821)
export function generateInviteCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 排除易混淆字符 0, 1, I, O
  let code = '';
  for (let i = 0; i < 4; i++) {
    const r = crypto.randomInt(0, chars.length);
    code += chars[r];
  }
  return `SPC-${code}`;
}

// 初始化資料庫綱要與自動遷移
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS spaces (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      layout TEXT DEFAULT 'grid',
      invite_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      space_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      col_span INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS space_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      space_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(space_id, user_id),
      FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 資料表平滑升級遷移
  try {
    db.exec('ALTER TABLE spaces ADD COLUMN invite_code TEXT');
  } catch (e) {}

  try {
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_spaces_invite_code ON spaces(invite_code)');
  } catch (e) {}

  try {
    db.exec('ALTER TABLE tools ADD COLUMN col_span INTEGER DEFAULT 1');
  } catch (e) {}

  // 為尚無邀請碼的空間補齊邀請碼
  const emptyCodeSpaces = db.prepare("SELECT id FROM spaces WHERE invite_code IS NULL OR invite_code = ''").all();
  for (const sp of emptyCodeSpaces) {
    const newCode = generateInviteCode();
    try {
      db.prepare('UPDATE spaces SET invite_code = ? WHERE id = ?').run(newCode, sp.id);
    } catch (err) {
      db.prepare('UPDATE spaces SET invite_code = ? WHERE id = ?').run(generateInviteCode(), sp.id);
    }
  }

  seedDemoUsers();
}

// 密碼安全雜湊 (採用 node:crypto scrypt)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
}

// 建立示範帳號 (通用個人與團隊使用者)
function seedDemoUsers() {
  const checkUser = db.prepare('SELECT id FROM users WHERE username = ?');
  let userA = checkUser.get('user_demo');

  if (!userA) {
    const { hash: uHash, salt: uSalt } = hashPassword('demo123');
    const insert = db.prepare(`
      INSERT INTO users (username, password_hash, salt, display_name, role)
      VALUES (?, ?, ?, ?, 'user')
    `);
    const userAResult = insert.run('user_demo', uHash, uSalt, '王大明');
    const userAId = Number(userAResult.lastInsertRowid);
    
    // 為示範使用者建立預設空間
    const createSpace = db.prepare(`
      INSERT INTO spaces (user_id, name, description, layout, invite_code)
      VALUES (?, ?, ?, ?, ?)
    `);
    const spaceResult = createSpace.run(
      userAId,
      '個人日常工具看板',
      '常用日常計算、筆記與小工具空間',
      'grid',
      'SPC-2026'
    );
    const spaceId = Number(spaceResult.lastInsertRowid);

    // 建立通用工具
    const insertTool = db.prepare(`
      INSERT INTO tools (space_id, title, type, content, sort_order, col_span)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    insertTool.run(
      spaceId,
      '快速點擊計數器',
      'html',
      `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: -apple-system, sans-serif; text-align: center; padding: 20px; background: #fff9f6; color: #1f2a2e; }
  .score { font-size: 54px; font-weight: bold; color: #e17b62; margin: 10px 0; }
  .btn { background: #e17b62; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 16px; cursor: pointer; margin: 0 5px; }
  .btn:hover { background: #cf5e43; }
</style>
</head>
<body>
  <h3>📊 點擊計數統計</h3>
  <div class="score" id="num">0</div>
  <button class="btn" onclick="add(1)">+1 次</button>
  <button class="btn" onclick="add(-1)">-1 次</button>
  <button class="btn" style="background:#89959b" onclick="reset()">歸零</button>
  <script>
    let s = 0;
    function add(v) { s = Math.max(0, s + v); document.getElementById('num').innerText = s; }
    function reset() { s = 0; document.getElementById('num').innerText = 0; }
  </script>
</body>
</html>`,
      0,
      1
    );

    insertTool.run(
      spaceId,
      '快速便利貼筆記板',
      'html',
      `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 10px; font-family: sans-serif; background: #fafafa; display: flex; flex-direction: column; height: 100vh; box-sizing: border-box; }
  #canvas { flex: 1; border: 1px solid #e4e8e5; background: #fff; border-radius: 8px; cursor: crosshair; }
  .tools { margin-bottom: 8px; display: flex; gap: 8px; }
  button { padding: 6px 12px; border-radius: 6px; border: 1px solid #ccc; background: #fff; cursor: pointer; }
</style>
</head>
<body>
  <div class="tools">
    <button onclick="clearCanvas()">清空白板</button>
    <button onclick="setColor('#e17b62')">珊瑚筆</button>
    <button onclick="setColor('#1f2a2e')">墨水筆</button>
  </div>
  <canvas id="canvas"></canvas>
  <script>
    const cvs = document.getElementById('canvas');
    const ctx = cvs.getContext('2d');
    let drawing = false;
    let color = '#1f2a2e';

    function resize() {
      cvs.width = cvs.clientWidth;
      cvs.height = cvs.clientHeight;
    }
    window.onload = resize;
    window.onresize = resize;

    cvs.addEventListener('mousedown', () => drawing = true);
    window.addEventListener('mouseup', () => { drawing = false; ctx.beginPath(); });
    cvs.addEventListener('mousemove', (e) => {
      if (!drawing) return;
      const rect = cvs.getBoundingClientRect();
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    function clearCanvas() { ctx.clearRect(0, 0, cvs.width, cvs.height); }
    function setColor(c) { color = c; }
  </script>
</body>
</html>`,
      1,
      2
    );
  }

  const userB = checkUser.get('team_demo');
  if (!userB) {
    const { hash: bHash, salt: bSalt } = hashPassword('demo123');
    const insert = db.prepare(`
      INSERT INTO users (username, password_hash, salt, display_name, role)
      VALUES (?, ?, ?, ?, 'user')
    `);
    const userBResult = insert.run('team_demo', bHash, bSalt, '李小華');
    const userBId = Number(userBResult.lastInsertRowid);
    
    // 為示範使用者 B 建立空間
    const createSpace = db.prepare(`
      INSERT INTO spaces (user_id, name, description, layout, invite_code)
      VALUES (?, ?, ?, ?, ?)
    `);
    createSpace.run(
      userBId,
      '小華的工作儀表板',
      '專案工具空間',
      'grid',
      generateInviteCode()
    );

    // 預設將使用者 B 加入王大明的空間
    const getSpaceA = db.prepare('SELECT id FROM spaces WHERE invite_code = ?').get('SPC-2026');
    if (getSpaceA) {
      try {
        db.prepare('INSERT INTO space_members (space_id, user_id) VALUES (?, ?)').run(getSpaceA.id, userBId);
      } catch (e) {}
    }
  }
}
