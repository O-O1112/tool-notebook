import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { initDB, db } from '../src/server/db.js';
import authRoutes from '../src/server/routes/auth.js';
import spacesRoutes from '../src/server/routes/spaces.js';

test('reorder: 拖曳順序重排與持久化測試', async () => {
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
    // 1. 註冊使用者
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user_reorder_test', password: 'password123', displayName: '排序測試' }),
    });
    const { token } = await regRes.json();

    // 2. 建立新空間
    const spaceRes = await fetch(`${baseUrl}/spaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: '排序測試空間' }),
    });
    const { space } = await spaceRes.json();

    // 3. 新增三個小工具 A, B, C
    const addTool = async (title) => {
      const res = await fetch(`${baseUrl}/spaces/${space.id}/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, type: 'html', content: `<div>${title}</div>` }),
      });
      const data = await res.json();
      return data.tool;
    };

    const toolA = await addTool('工具 A');
    const toolB = await addTool('工具 B');
    const toolC = await addTool('工具 C');

    // 4. 發送拖曳重排請求：將順序改為 C, A, B
    const newOrder = [toolC.id, toolA.id, toolB.id];
    const reorderRes = await fetch(`${baseUrl}/spaces/${space.id}/tools/reorder`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toolIds: newOrder }),
    });
    assert.strictEqual(reorderRes.status, 200);

    // 5. 重新讀取空間確認工具陣列順序
    const detailRes = await fetch(`${baseUrl}/spaces/${space.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const detailData = await detailRes.json();
    const fetchedToolIds = detailData.tools.map((t) => t.id);

    assert.deepStrictEqual(fetchedToolIds, newOrder, '工具順序應與拖曳重排後的順序完全一致');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
