import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { generateQRCodeSVG, generateQRCodeDataURL } from '../src/client/utils/qrcode.js';
import { CARD_COLORS } from '../src/client/utils/cardColors.js';
import { initDB } from '../src/server/db.js';
import authRoutes from '../src/server/routes/auth.js';
import spacesRoutes from '../src/server/routes/spaces.js';

test('padlet: QR Code 向量 SVG 與 DataURL 應正確產出', async () => {
  const testUrl = 'https://o-o1112.github.io/tool-notebook/?share=SPC-9999';
  const svg = await generateQRCodeSVG(testUrl);
  assert.ok(typeof svg === 'string', 'SVG 應為字串');
  assert.ok(svg.includes('<svg'), '輸出應包含 <svg 標籤');
  assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'), '應具備有效 SVG 命名空間');

  const dataUrl = await generateQRCodeDataURL(testUrl);
  assert.ok(typeof dataUrl === 'string', 'DataURL 應為字串');
  assert.ok(dataUrl.startsWith('data:image/png;base64,'), '應為標準 base64 png 格式');
});

test('padlet: 便箋粉彩調色盤應包含 6 種手帳紙質配色', () => {
  assert.ok(Array.isArray(CARD_COLORS), 'CARD_COLORS 應為陣列');
  assert.strictEqual(CARD_COLORS.length, 6, '應定義 6 款色票');

  const ids = CARD_COLORS.map((c) => c.id);
  assert.deepStrictEqual(ids, ['default', 'peach', 'mint', 'lemon', 'sky', 'lavender']);

  for (const c of CARD_COLORS) {
    assert.ok(c.label, '每款顏色應有標籤名稱');
    assert.ok(c.bg, '每款顏色應有代表背景色');
    assert.ok(c.border, '每款顏色應有邊框色');
  }
});

test('padlet: 免登入訪客模式 API (GET /spaces/share/:code) 應無授權存取', async () => {
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
    // 1. 先註冊擁有人並建立帶工具的空間
    const uid = Date.now() + Math.random().toString(36).slice(2, 6);
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: `padlet_host_${uid}`, password: 'password123', displayName: '工作坊主講人' }),
    });
    const { token } = await regRes.json();

    const createSpaceRes = await fetch(`${baseUrl}/spaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: '研習工作坊展示本', layout: 'shelf' }),
    });
    const { space } = await createSpaceRes.json();
    assert.ok(space.invite_code, '空間應有邀請碼');

    // 新增測試小工具
    await fetch(`${baseUrl}/spaces/${space.id}/tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: '分組計時器',
        type: 'html',
        content: '<p>計時器</p>',
        colSpan: 1,
      }),
    });

    // 2. 訪客「無 Bearer Token」請求公開分享端點
    const guestRes = await fetch(`${baseUrl}/spaces/share/${space.invite_code}`);
    assert.strictEqual(guestRes.status, 200, '訪客應能成功讀取公開空間');

    const guestData = await guestRes.json();
    assert.strictEqual(guestData.isGuest, true, 'isGuest 標記應為 true');
    assert.strictEqual(guestData.space.id, space.id);
    assert.strictEqual(guestData.space.name, '研習工作坊展示本');
    assert.strictEqual(guestData.space.is_owner, 0, '訪客不可獲得 owner 權限');
    assert.strictEqual(guestData.tools.length, 1, '訪客應能讀取小工具清單');
    assert.strictEqual(guestData.tools[0].title, '分組計時器');

    // 3. 不存在的代碼應回傳 404
    const notFoundRes = await fetch(`${baseUrl}/spaces/share/SPC-FAKE`);
    assert.strictEqual(notFoundRes.status, 404, '不存在之代碼應回傳 404');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
