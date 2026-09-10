import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { initDB, db } from '../src/server/db.js';
import authRoutes from '../src/server/routes/auth.js';
import spacesRoutes from '../src/server/routes/spaces.js';

test('E2E: 伺服器整合 API 流程驗證 (註冊 -> 登入 -> 建立空間 -> 新增工具)', async (t) => {
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
    // 1. 示範帳號登入
    const demoRes = await fetch(`${baseUrl}/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account: 'user_demo' }),
    });
    assert.strictEqual(demoRes.status, 200);
    const demoData = await demoRes.json();
    assert.ok(demoData.token, 'Demo 登入應取得 Token');

    const teacherToken = demoData.token;

    // 2. 取得空間列表
    const spacesRes = await fetch(`${baseUrl}/spaces`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert.strictEqual(spacesRes.status, 200);
    const spacesData = await spacesRes.json();
    assert.ok(Array.isArray(spacesData.spaces));
    assert.ok(spacesData.spaces.length >= 1, '應有預設示範空間');

    const defaultSpace = spacesData.spaces[0];

    // 3. 在空間中新增一個小工具 (貼上程式碼)
    const addToolRes = await fetch(`${baseUrl}/spaces/${defaultSpace.id}/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({
        title: '幾何圓形演示',
        type: 'html',
        content: '<canvas id="c"></canvas><script>console.log("ready");</script>',
      }),
    });
    assert.strictEqual(addToolRes.status, 201);
    const newToolData = await addToolRes.json();
    assert.strictEqual(newToolData.tool.title, '幾何圓形演示');

    // 4. 讀取空間詳情確認工具已正確寫入 SQLite
    const spaceDetailRes = await fetch(`${baseUrl}/spaces/${defaultSpace.id}`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert.strictEqual(spaceDetailRes.status, 200);
    const detailData = await spaceDetailRes.json();
    const foundTool = detailData.tools.find((t) => t.id === newToolData.tool.id);
    assert.ok(foundTool, '空間詳情中應包含新增的工具');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
