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

  // 初始化示範體驗帳號 (供大眾公開一鍵登入試用)
  const demoUser = db.prepare("SELECT id FROM users WHERE username = 'demo'").get();
  if (!demoUser) {
    const { hash, salt } = hashPassword('demo1234');
    const userRes = db.prepare(`
      INSERT INTO users (username, password_hash, salt, display_name, role)
      VALUES (?, ?, ?, ?, 'demo')
    `).run('demo', hash, salt, '體驗訪客');
    const demoUserId = Number(userRes.lastInsertRowid);

    // 建立預設手帳空間
    const spaceRes = db.prepare(`
      INSERT INTO spaces (user_id, name, description, layout, invite_code)
      VALUES (?, ?, ?, 'grid', ?)
    `).run(demoUserId, '體驗訪客的手帳空間', '預載實用小工具範本，自由探索與使用', 'SPC-DEMO');
    const demoSpaceId = Number(spaceRes.lastInsertRowid);

    // 建立 3 個預載示範工具
    const insertTool = db.prepare(`
      INSERT INTO tools (space_id, title, type, content, sort_order, col_span)
      VALUES (?, ?, 'html', ?, ?, ?)
    `);

    insertTool.run(demoSpaceId, '番茄鐘專注計時器', '<div style="text-align:center;padding:24px;font-family:sans-serif;"><h3>番茄工作法計時器</h3><p style="font-size:40px;font-weight:bold;margin:16px 0;color:#e17b62;" id="time">25:00</p><button style="background:#e17b62;color:#fff;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:bold;" onclick="toggleTimer()" id="btn">開始專注</button><script>let t=1500,run=false,iv=null;function toggleTimer(){if(run){clearInterval(iv);run=false;document.getElementById(\'btn\').innerText=\'開始專注\';}else{run=true;document.getElementById(\'btn\').innerText=\'暫停\';iv=setInterval(()=>{if(t>0){t--;let m=String(Math.floor(t/60)).padStart(2,\'0\'),s=String(t%60).padStart(2,\'0\');document.getElementById(\'time\').innerText=m+\':\'+s;}else{clearInterval(iv);alert(\'專注時間結束！休息一下吧！\');}},1000);}}<\/script></div>', 0, 1);

    insertTool.run(demoSpaceId, '靈感隨手筆記便箋', '<div style="padding:16px;font-family:sans-serif;height:100%;box-sizing:border-box;"><textarea style="width:100%;height:140px;padding:12px;border:1px solid #e2ddd3;border-radius:8px;font-size:14px;resize:none;box-sizing:border-box;background:#fffdfa;" placeholder="隨手記下今日的待辦事項、突發靈感或重要備忘..."></textarea><p style="font-size:12px;color:#8c938d;margin-top:8px;">提示：本便箋為即時筆記，輸入內容隨心編輯。</p></div>', 1, 1);

    insertTool.run(demoSpaceId, '極簡計算機', '<div style="padding:16px;font-family:sans-serif;text-align:center;"><input id="calc-disp" readonly style="width:100%;font-size:24px;text-align:right;padding:8px;margin-bottom:12px;border:1px solid #ddd;border-radius:6px;box-sizing:border-box;" value="0"/><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;"><button onclick="calcClear()" style="padding:10px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;">C</button><button onclick="calc(\'/\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;">÷</button><button onclick="calc(\'*\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;">×</button><button onclick="calc(\'-\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;">-</button><button onclick="calc(\'7\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">7</button><button onclick="calc(\'8\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">8</button><button onclick="calc(\'9\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">9</button><button onclick="calc(\'+\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;">+</button><button onclick="calc(\'4\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">4</button><button onclick="calc(\'5\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">5</button><button onclick="calc(\'6\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">6</button><button onclick="calcEval()" style="grid-row:span 2;padding:10px;background:#e17b62;color:#fff;border:none;border-radius:6px;font-weight:bold;">=</button><button onclick="calc(\'1\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">1</button><button onclick="calc(\'2\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">2</button><button onclick="calc(\'3\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">3</button><button onclick="calc(\'0\')" style="grid-column:span 2;padding:10px;border:1px solid #ddd;border-radius:6px;">0</button><button onclick="calc(\'.\')" style="padding:10px;border:1px solid #ddd;border-radius:6px;">.</button></div><script>let exp=\'\';function calc(v){if(exp===\'0\')exp=\'\';exp+=v;document.getElementById(\'calc-disp\').value=exp;}function calcClear(){exp=\'\';document.getElementById(\'calc-disp\').value=\'0\';}function calcEval(){try{exp=String(Function(\'return \'+exp)());document.getElementById(\'calc-disp\').value=exp;}catch(e){document.getElementById(\'calc-disp\').value=\'Error\';exp=\'\';}}<\/script></div>', 2, 1);
  }
}

// 密碼安全雜湊 (採用 node:crypto scrypt)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  try {
    if (!password || !hash || !salt) return false;
    const checkHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const hashBuf = Buffer.from(hash, 'hex');
    const checkBuf = Buffer.from(checkHash, 'hex');
    if (hashBuf.length !== checkBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, checkBuf);
  } catch (err) {
    return false;
  }
}
