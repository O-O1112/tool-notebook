import express from 'express';
import { db, hashPassword, verifyPassword } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// 註冊帳號 (統一使用者模型與輸入約束)
router.post('/register', authLimiter, (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({ error: '帳號與密碼為必填' });
    }

    const cleanUsername = username.trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      return res.status(400).json({ error: '帳號長度需介於 3 至 50 個字元' });
    }

    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5-]+$/.test(cleanUsername)) {
      return res.status(400).json({ error: '帳號僅支援中英文字母、數字、底線與連字號' });
    }

    if (password.length < 4 || password.length > 128) {
      return res.status(400).json({ error: '密碼長度需介於 4 至 128 個字元' });
    }

    const checkUser = db.prepare('SELECT id FROM users WHERE username = ?');
    if (checkUser.get(cleanUsername)) {
      return res.status(409).json({ error: '此帳號已存在，請直接登入或使用其他帳號' });
    }

    const { hash, salt } = hashPassword(password);
    const finalDisplayName = (typeof displayName === 'string' ? displayName.trim().slice(0, 50) : '') || cleanUsername;

    const insertUser = db.prepare(`
      INSERT INTO users (username, password_hash, salt, display_name, role)
      VALUES (?, ?, ?, ?, 'user')
    `);
    const result = insertUser.run(cleanUsername, hash, salt, finalDisplayName);
    const userId = Number(result.lastInsertRowid);

    // 自動為新使用者建立一個預設個人空間
    const insertSpace = db.prepare(`
      INSERT INTO spaces (user_id, name, description, layout)
      VALUES (?, ?, ?, ?)
    `);
    insertSpace.run(userId, `${finalDisplayName} 的工具本`, '個人工具工作空間', 'grid');

    const userPayload = {
      id: userId,
      username: cleanUsername,
      displayName: finalDisplayName,
    };

    const token = signToken(userPayload);
    res.status(201).json({ token, user: userPayload });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: '伺服器錯誤，請稍後再試' });
  }
});

// 帳號登入 (具備速率限制與長度約束)
router.post('/login', authLimiter, (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({ error: '請輸入有效的帳號與密碼' });
    }

    if (username.length > 50 || password.length > 128) {
      return res.status(400).json({ error: '帳號或密碼格式不符規範' });
    }

    const getUser = db.prepare(`
      SELECT id, username, password_hash, salt, display_name
      FROM users WHERE username = ?
    `);
    const user = getUser.get(username);

    if (!user) {
      return res.status(401).json({ error: '帳號或密碼不正確' });
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: '帳號或密碼不正確' });
    }

    const userPayload = {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
    };

    const token = signToken(userPayload);
    res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '伺服器錯誤，請稍後再試' });
  }
});

// 取得當前登入者資訊
router.get('/me', requireAuth, (req, res) => {
  try {
    const getUser = db.prepare(`
      SELECT id, username, display_name, created_at
      FROM users WHERE id = ?
    `);
    const user = getUser.get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: '找不到該使用者' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        display_name: user.display_name,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 更新個人資料 (顯示名稱)
router.patch('/profile', requireAuth, (req, res) => {
  try {
    const { displayName } = req.body;
    if (!displayName || typeof displayName !== 'string' || !displayName.trim()) {
      return res.status(400).json({ error: '請輸入有效的顯示名稱' });
    }

    const finalName = displayName.trim();
    if (finalName.length > 50) {
      return res.status(400).json({ error: '顯示名稱不可超過 50 個字元' });
    }

    const update = db.prepare('UPDATE users SET display_name = ? WHERE id = ?');
    update.run(finalName, req.user.id);

    const userPayload = {
      id: req.user.id,
      username: req.user.username,
      displayName: finalName,
      display_name: finalName,
    };
    const token = signToken(userPayload);
    res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: '更新個人資料失敗' });
  }
});

export default router;
