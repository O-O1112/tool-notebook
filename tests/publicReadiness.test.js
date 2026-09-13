import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { db, verifyPassword } from '../src/server/db.js';

test('public: 示範帳號 (demo) 預載與體驗空間健全性', () => {
  const user = db.prepare("SELECT id, username, display_name, role FROM users WHERE username = 'demo'").get();
  assert.ok(user, '系統初始化後應具備 demo 體驗帳號');
  assert.strictEqual(user.username, 'demo');
  assert.strictEqual(user.display_name, '體驗訪客');

  // 檢查密碼可通過驗證
  const row = db.prepare("SELECT password_hash, salt FROM users WHERE username = 'demo'").get();
  const isMatch = verifyPassword('demo1234', row.password_hash, row.salt);
  assert.strictEqual(isMatch, true, '示範帳號密碼比對應為 true');

  // 檢查預設空間是否存在
  const space = db.prepare("SELECT id, name, invite_code FROM spaces WHERE user_id = ?").get(user.id);
  assert.ok(space, '示範帳號應具備預載手帳空間');
  assert.strictEqual(space.invite_code, 'SPC-DEMO');

  // 檢查預設工具是否已載入
  const tools = db.prepare("SELECT id, title FROM tools WHERE space_id = ?").all(space.id);
  assert.ok(tools.length >= 3, '示範空間應預載至少 3 款實用工具');
});

test('public: PWA Manifest 與 Open Graph 標籤結構驗證', () => {
  const manifestPath = path.resolve(process.cwd(), 'public/manifest.webmanifest');
  assert.ok(fs.existsSync(manifestPath), 'manifest.webmanifest 檔案必須存在');

  const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  assert.strictEqual(content.short_name, '工具小本本');
  assert.strictEqual(content.display, 'standalone');
  assert.ok(content.icons.length > 0, '需包含應用圖示');

  // 檢查 icon.svg
  const iconPath = path.resolve(process.cwd(), 'public/icon.svg');
  assert.ok(fs.existsSync(iconPath), 'icon.svg 必須存在');

  // 檢查 index.html 中的標籤
  const htmlPath = path.resolve(process.cwd(), 'src/client/index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(htmlContent.includes('manifest.webmanifest'), 'index.html 需引用 manifest');
  assert.ok(htmlContent.includes('og:title'), '需具備 Open Graph 標題');
  assert.ok(htmlContent.includes('apple-mobile-web-app-capable'), '需具備 iOS Web App 支援標籤');
});
