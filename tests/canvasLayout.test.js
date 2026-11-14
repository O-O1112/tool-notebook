import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { initDB } from '../src/server/db.js';
import authRoutes from '../src/server/routes/auth.js';
import spacesRoutes from '../src/server/routes/spaces.js';
import {
  CANVAS_GRID_SIZE,
  DEFAULT_CARD_WIDTH,
  DEFAULT_CARD_HEIGHT,
  MIN_CARD_WIDTH,
  MAX_CARD_WIDTH,
  MIN_CARD_HEIGHT,
  MAX_CARD_HEIGHT,
  snapValue,
  clampCardRect,
  ensureCanvasMap,
  bringCardToFront,
  tidyCanvasLayout,
  computeCanvasBounds,
  loadCanvasMap,
  saveCanvasMap,
} from '../src/client/utils/canvasLayout.js';

test('canvasLayout: snapValue 應對齊 28px 方格或於關閉時回傳整數', () => {
  assert.equal(CANVAS_GRID_SIZE, 28);
  assert.equal(snapValue(41, true), 28);
  assert.equal(snapValue(43, true), 56);
  assert.equal(snapValue(41.6, false), 42);
});

test('canvasLayout: clampCardRect 應正確限制座標與卡片尺寸上下限', () => {
  const clamped = clampCardRect({ x: -30, y: -10, w: 120, h: 1500, z: 3 }, false);
  assert.equal(clamped.x, 0);
  assert.equal(clamped.y, 0);
  assert.equal(clamped.w, MIN_CARD_WIDTH);
  assert.equal(clamped.h, MAX_CARD_HEIGHT);
  assert.equal(clamped.z, 3);

  const oversized = clampCardRect({ x: 55, y: 85, w: 2000, h: 50 }, true);
  assert.equal(oversized.x, 56);
  assert.equal(oversized.y, 84);
  assert.equal(oversized.w, MAX_CARD_WIDTH);
  assert.equal(oversized.h, MIN_CARD_HEIGHT);
});

test('canvasLayout: ensureCanvasMap 應保留既有座標並為新工具自動尋找不重疊空位', () => {
  const tools = [
    { id: 101, title: 'A', col_span: 1 },
    { id: 102, title: 'B', col_span: 1 },
    { id: 103, title: 'C', col_span: 2 },
  ];
  const existing = {
    101: { x: 28, y: 28, w: DEFAULT_CARD_WIDTH, h: DEFAULT_CARD_HEIGHT, z: 5, collapsed: true },
  };

  const map = ensureCanvasMap(tools, existing, 1200);
  assert.equal(map[101].x, 28);
  assert.equal(map[101].y, 28);
  assert.equal(map[101].collapsed, true);

  assert.ok(map[102], '新卡片 B 應自動補位');
  assert.ok(map[103], '新卡片 C 應自動補位');
  assert.ok(map[102].z > map[101].z);
  assert.ok(map[103].z > map[102].z);

  const overlapB =
    map[102].x < map[101].x + map[101].w &&
    map[102].x + map[102].w > map[101].x &&
    map[102].y < map[101].y + 56 &&
    map[102].y + map[102].h > map[101].y;
  assert.equal(overlapB, false, '補位卡片不應覆蓋既有卡片');
});

test('canvasLayout: bringCardToFront 應將點擊卡片升至最前並在過高時正規化', () => {
  const initial = {
    1: { x: 28, y: 28, w: 420, h: 364, z: 2 },
    2: { x: 476, y: 28, w: 420, h: 364, z: 4005 },
  };
  const brought = bringCardToFront(initial, 1);
  assert.equal(brought[1].z, 2);
  assert.equal(brought[2].z, 1);
});

test('canvasLayout: tidyCanvasLayout 與 computeCanvasBounds 應維持尺吋與 28px 格線排列', () => {
  const tools = [
    { id: 1, title: 'First', col_span: 1 },
    { id: 2, title: 'Second', col_span: 1 },
    { id: 3, title: 'Third', col_span: 1 },
  ];
  const existing = {
    1: { x: 500, y: 300, w: 420, h: 364, z: 3, collapsed: false },
    2: { x: 40, y: 40, w: 420, h: 364, z: 1, collapsed: false },
  };
  const tidied = tidyCanvasLayout(tools, existing, 1000);
  assert.equal(tidied[1].x, 28);
  assert.equal(tidied[1].y, 28);
  assert.equal(tidied[2].x, 476);
  assert.equal(tidied[2].y, 28);
  assert.equal(tidied[3].x, 28, '超過列寬後應自動換下一列');
  assert.ok(tidied[3].y > tidied[1].y);

  const bounds = computeCanvasBounds(tools, tidied, 960, 644);
  assert.ok(bounds.width >= 960);
  assert.ok(bounds.height >= 644);
});

test('canvasLayout: localStorage 讀寫助手在安全沙盒中運作正確', () => {
  const backing = new Map();
  const mockStorage = {
    getItem: (k) => (backing.has(k) ? backing.get(k) : null),
    setItem: (k, v) => backing.set(k, String(v)),
  };

  const sample = { 10: { x: 56, y: 84, w: 420, h: 364, z: 2, collapsed: false } };
  assert.equal(saveCanvasMap(42, sample, mockStorage), true);
  assert.deepEqual(loadCanvasMap(42, mockStorage), sample);
});

test('canvasLayout API: POST 與 PATCH /api/spaces 應接受 canvas 版型並拒斥非法版型', async () => {
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
    const uid = Date.now() + Math.random().toString(36).slice(2, 6);
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `canvas_user_${uid}`,
        password: 'password123',
        displayName: '書桌測試者',
      }),
    });
    assert.equal(regRes.status, 201);
    const { token } = await regRes.json();

    const createRes = await fetch(`${baseUrl}/spaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: '我的自由書桌',
        description: '畫布版型驗證',
        layout: 'canvas',
      }),
    });
    assert.equal(createRes.status, 201);
    const createdData = await createRes.json();
    assert.equal(createdData.space.layout, 'canvas');

    const patchGrid = await fetch(`${baseUrl}/spaces/${createdData.space.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ layout: 'grid' }),
    });
    assert.equal(patchGrid.status, 200);

    const patchCanvas = await fetch(`${baseUrl}/spaces/${createdData.space.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ layout: 'canvas' }),
    });
    assert.equal(patchCanvas.status, 200);
    const updated = await patchCanvas.json();
    assert.equal(updated.space.layout, 'canvas');

    const patchInvalid = await fetch(`${baseUrl}/spaces/${createdData.space.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ layout: 'unknown_layout' }),
    });
    assert.equal(patchInvalid.status, 400);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
