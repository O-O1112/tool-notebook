import express from 'express';
import { db, hashPassword, verifyPassword } from '../db.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 註冊帳號 (統一使用者模型)
router.post('/register', (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '帳號與密碼為必填' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: '帳號長度至少需 3 個字元' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: '密碼長度至少需 4 個字元' });
    }

    const checkUser = db.prepare('SELECT id FROM users WHERE username = ?');
    if (checkUser.get(username)) {
      return res.status(409).json({ error: '此帳號已存在，請直接登入或使用其他帳號' });
    }

    const { hash, salt } = hashPassword(password);
    const finalDisplayName = displayName?.trim() || username;

    const insertUser = db.prepare(`
      INSERT INTO users (username, password_hash, salt, display_name, role)
      VALUES (?, ?, ?, ?, 'user')
    `);
    const result = insertUser.run(username, hash, salt, finalDisplayName);
    const userId = Number(result.lastInsertRowid);

    // 自動為新使用者建立一個預設個人空間
    const insertSpace = db.prepare(`
      INSERT INTO spaces (user_id, name, description, layout)
      VALUES (?, ?, ?, ?)
    `);
    insertSpace.run(userId, `${finalDisplayName} 的工具本`, '個人工具工作空間', 'grid');

    const userPayload = {
      id: userId,
      username,
      displayName: finalDisplayName,
    };

    const token = signToken(userPayload);
    res.status(201).json({ token, user: userPayload });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: '伺服器錯誤，請稍後再試' });
  }
});

// 帳號登入
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '請輸入有效的帳號與密碼' });
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

// 一鍵示範帳號登入 (快速體驗)
router.post('/demo', (req, res) => {
  try {
    const { account = 'user_demo' } = req.body;
    const targetUsername = account === 'team_demo' ? 'team_demo' : 'user_demo';

    const getUser = db.prepare(`
      SELECT id, username, display_name
      FROM users WHERE username = ?
    `);
    const user = getUser.get(targetUsername);

    if (!user) {
      return res.status(404).json({ error: '示範帳號尚未建立' });
    }

    const userPayload = {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
    };

    const token = signToken(userPayload);
    res.json({ token, user: userPayload });
  } catch (err) {
    console.error('Demo login error:', err);
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
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

export default router;
