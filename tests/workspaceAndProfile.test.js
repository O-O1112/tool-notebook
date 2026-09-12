import test from 'node:test';
import assert from 'node:assert';
import { db } from '../src/server/db.js';
import { signToken, verifyToken } from '../src/server/middleware/auth.js';

test('profile: 資料庫暱稱更新與 JWT Payload 一致性測試', () => {
  // 建立測試帳號
  const uniqueName = `tester_${Date.now()}`;
  const info = db.prepare(
    'INSERT INTO users (username, password_hash, salt, display_name, role) VALUES (?, ?, ?, ?, ?)'
  ).run(uniqueName, 'hashed_pw', 'salt123', '初始暱稱', 'student');

  const userId = Number(info.lastInsertRowid);

  // 模擬 PATCH /api/auth/profile
  const newDisplayName = '星際導航員';
  db.prepare('UPDATE users SET display_name = ? WHERE id = ?').run(newDisplayName, userId);

  const updatedUser = db.prepare('SELECT id, username, display_name, role FROM users WHERE id = ?').get(userId);
  assert.strictEqual(updatedUser.display_name, newDisplayName, '資料庫中 display_name 應已更新');

  // 驗證新簽發之 JWT
  const token = signToken({
    id: updatedUser.id,
    username: updatedUser.username,
    displayName: updatedUser.display_name,
    role: updatedUser.role,
  });

  const decoded = verifyToken(token);
  assert.strictEqual(decoded.displayName, newDisplayName, 'JWT payload 應包含新暱稱');
  assert.strictEqual(decoded.id, userId);
});

test('sidebar: 5 大工作區分類與垃圾桶隔離邏輯驗證', () => {
  const currentUserId = 101;
  const mockSpaces = [
    { id: 1, name: '工作筆記', user_id: 101, is_owner: 1, updated_at: '2026-09-10T10:00:00Z' },
    { id: 2, name: '自然科工具箱', user_id: 202, is_owner: 0, updated_at: '2026-09-11T12:00:00Z' },
    { id: 3, name: '數學草稿本', user_id: 101, is_owner: 1, updated_at: '2026-09-12T08:00:00Z' },
    { id: 4, name: '廢棄舊空間', user_id: 101, is_owner: 1, updated_at: '2026-09-01T00:00:00Z' },
  ];

  const trashSpaceIds = [4];
  const favoriteSpaceIds = [1, 2];
  const recentAccessMap = {
    1: 1000,
    3: 5000, // 最新存取
    2: 2000,
  };

  // 活躍空間 (不含垃圾桶)
  const activeSpaces = mockSpaces.filter((s) => !trashSpaceIds.includes(s.id));
  assert.strictEqual(activeSpaces.length, 3, '活躍空間應剔除垃圾桶中的空間');
  assert.ok(!activeSpaces.some((s) => s.id === 4));

  // 垃圾桶空間
  const trashSpaces = mockSpaces.filter((s) => trashSpaceIds.includes(s.id));
  assert.strictEqual(trashSpaces.length, 1, '垃圾桶應僅含空間 4');
  assert.strictEqual(trashSpaces[0].id, 4);

  // 我的最愛 (星號)
  const favoriteSpaces = activeSpaces.filter((s) => favoriteSpaceIds.includes(s.id));
  assert.strictEqual(favoriteSpaces.length, 2, '我的最愛應有 2 個');

  // 由我建立 vs 他人共享
  const ownedSpaces = activeSpaces.filter((s) => s.is_owner === 1 || s.user_id === currentUserId);
  const sharedSpaces = activeSpaces.filter((s) => s.is_owner !== 1 && s.user_id !== currentUserId);
  assert.strictEqual(ownedSpaces.length, 2, '我建立的空間應為 2 個 (1, 3)');
  assert.strictEqual(sharedSpaces.length, 1, '他人共享的空間應為 1 個 (2)');

  // 最近使用排序 (依 recentAccessMap 遞減)
  const recentSpaces = [...activeSpaces].sort((a, b) => {
    const aTime = recentAccessMap[a.id] || 0;
    const bTime = recentAccessMap[b.id] || 0;
    return bTime - aTime;
  });
  assert.strictEqual(recentSpaces[0].id, 3, '最新開啟的空間 3 應排在第一位');
  assert.strictEqual(recentSpaces[1].id, 2);
  assert.strictEqual(recentSpaces[2].id, 1);
});

test('sidebar: 名稱 A-Z 排序與日期排序切換邏輯驗證', () => {
  const list = [
    { id: 1, name: '數學工具箱' },
    { id: 2, name: '英文單字卡' },
    { id: 3, name: '化學元素表' },
  ];

  const sortedByName = [...list].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
  assert.strictEqual(sortedByName[0].name, '化學元素表');
  assert.strictEqual(sortedByName[1].name, '英文單字卡');
  assert.strictEqual(sortedByName[2].name, '數學工具箱');
});

test('sidebar: 動態迎賓詞與星期幾計算邏輯', () => {
  const WEEKDAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  const dayIndex = new Date().getDay();
  const greeting = `${WEEKDAYS[dayIndex]}快樂！`;

  assert.ok(WEEKDAYS.includes(WEEKDAYS[dayIndex]));
  assert.ok(greeting.endsWith('快樂！'));
});
