import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { initDB, db, generateInviteCode } from '../src/server/db.js';
import authRoutes from '../src/server/routes/auth.js';
import spacesRoutes from '../src/server/routes/spaces.js';

test('inviteCode: 空間邀請碼格式應符合 SPC-XXXX 規範', () => {
  const code = generateInviteCode();
  assert.match(code, /^SPC-[2-9A-HJ-NP-Z]{4}$/);
});

test('inviteCode: 成員應能透過邀請碼加入空間', async () => {
  initDB();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/spaces', spacesRoutes);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  try {
    // 1. 註冊使用者 A，建立一個帶有邀請碼的新空間
    const userAReg = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user_a_invite', password: 'password123', displayName: '成員A' }),
    });
    const { token: tokenA } = await userAReg.json();

    const createSpaceRes = await fetch(`${baseUrl}/spaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ name: '團隊共享測試空間', layout: 'grid' }),
    });
    const { space: spaceA } = await createSpaceRes.json();
    assert.ok(spaceA.invite_code, '建立之空間應具備邀請碼');
    assert.match(spaceA.invite_code, /^SPC-/);

    // 2. 註冊使用者 B
    const userBReg = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user_b_invite', password: 'password123', displayName: '成員B' }),
    });
    const { token: tokenB } = await userBReg.json();

    // 3. 成員 B 輸入該邀請碼加入空間
    const joinRes = await fetch(`${baseUrl}/spaces/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({ inviteCode: spaceA.invite_code }),
    });
    assert.strictEqual(joinRes.status, 200);
    const joinData = await joinRes.json();
    assert.strictEqual(joinData.space.id, spaceA.id);

    // 4. 成員 B 讀取自己的空間列表，確認該空間已列入
    const memberSpacesRes = await fetch(`${baseUrl}/spaces`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const { spaces: memberSpaces } = await memberSpacesRes.json();
    const hasJoinedSpace = memberSpaces.some((s) => s.id === spaceA.id);
    assert.strictEqual(hasJoinedSpace, true, '空間列表中應包含該加入之空間');

    // 5. 測試無效邀請碼應返回 404
    const invalidJoinRes = await fetch(`${baseUrl}/spaces/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenB}`,
      },
      body: JSON.stringify({ inviteCode: 'NOT-EXIST-CODE' }),
    });
    assert.strictEqual(invalidJoinRes.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
