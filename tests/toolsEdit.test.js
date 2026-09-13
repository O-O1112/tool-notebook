import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { initDB } from '../src/server/db.js';
import authRoutes from '../src/server/routes/auth.js';
import spacesRoutes from '../src/server/routes/spaces.js';
import { TOOL_TEMPLATES } from '../src/client/utils/toolTemplates.js';

test('templates: 應內建 20 款實用高質感小工具範本', () => {
  assert.strictEqual(TOOL_TEMPLATES.length, 20);
  const ids = TOOL_TEMPLATES.map(t => t.id);
  assert.ok(ids.includes('pomodoro'));
  assert.ok(ids.includes('decision_wheel'));
  assert.ok(ids.includes('sticky_notes'));
  assert.ok(ids.includes('sketch_pad'));
  assert.ok(ids.includes('calculator'));
  assert.ok(ids.includes('markdown_editor'));
  assert.ok(ids.includes('password_generator'));
  assert.ok(ids.includes('json_formatter'));
  assert.ok(ids.includes('world_clock'));
  assert.ok(ids.includes('text_tools'));
  assert.ok(ids.includes('white_noise'));
  assert.ok(ids.includes('habit_tracker'));
  assert.ok(ids.includes('unit_converter'));
  assert.ok(ids.includes('lucky_picker'));
  assert.ok(ids.includes('countdown_board'));

  TOOL_TEMPLATES.forEach(t => {
    assert.ok(t.title, '範本應有標題');
    assert.ok(t.content.includes('<!DOCTYPE html>'), '範本應為合法 HTML 文件');
    assert.ok(t.category, '範本應有分類');
  });
});

test('toolEdit: 支援就地修改工具之標題與代碼內容 (PATCH)', async () => {
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
      body: JSON.stringify({ username: `user_edit_${uid}`, password: 'password123', displayName: '編輯測試員' }),
    });
    const { token } = await regRes.json();

    // 1. 建立空間
    const spRes = await fetch(`${baseUrl}/spaces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: '測試空間' }),
    });
    const { space } = await spRes.json();

    // 2. 新增工具
    const addRes = await fetch(`${baseUrl}/spaces/${space.id}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: '原始工具', type: 'html', content: '<div>v1</div>' }),
    });
    const { tool } = await addRes.json();

    // 3. 修改工具代碼與標題
    const patchRes = await fetch(`${baseUrl}/spaces/${space.id}/tools/${tool.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        title: '更新後的工具',
        content: '<div>v2 updated</div>',
        colSpan: 2,
      }),
    });
    assert.strictEqual(patchRes.status, 200);
    const { tool: updatedTool } = await patchRes.json();
    assert.strictEqual(updatedTool.title, '更新後的工具');
    assert.strictEqual(updatedTool.content, '<div>v2 updated</div>');
    assert.strictEqual(updatedTool.col_span, 2);

    // 4. 修改空間名稱與描述
    const updateSpaceRes = await fetch(`${baseUrl}/spaces/${space.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: '更新後的空間名稱',
        description: '全新的備忘說明',
      }),
    });
    assert.strictEqual(updateSpaceRes.status, 200);
    const { space: updatedSpace } = await updateSpaceRes.json();
    assert.strictEqual(updatedSpace.name, '更新後的空間名稱');
    assert.strictEqual(updatedSpace.description, '全新的備忘說明');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
