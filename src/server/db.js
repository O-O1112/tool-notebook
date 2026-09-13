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
