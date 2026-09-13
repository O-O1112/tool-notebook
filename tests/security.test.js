import test from 'node:test';
import assert from 'node:assert';
import { verifyPassword, hashPassword } from '../src/server/db.js';
import { signToken, verifyToken } from '../src/server/middleware/auth.js';
import { createRateLimiter } from '../src/server/middleware/rateLimiter.js';
import { securityHeaders } from '../src/server/middleware/securityHeaders.js';
import { parseToolInput } from '../src/client/utils/codeParser.js';

test('security: JWT 定時安全驗證與防竄改機制', () => {
  const payload = { id: 123, username: 'test_user', displayName: '測試員' };
  const token = signToken(payload, 3600);
  assert.ok(token, '應成功簽發權杖');

  // 正確權杖驗證
  const verified = verifyToken(token);
  assert.ok(verified, '有效權杖應驗證通過');
  assert.strictEqual(verified.id, 123);

  // 竄改簽名測試
  const parts = token.split('.');
  const tamperedSig = parts[2].slice(0, -2) + (parts[2].endsWith('a') ? 'b' : 'a');
  const tamperedToken = `${parts[0]}.${parts[1]}.${tamperedSig}`;
  assert.strictEqual(verifyToken(tamperedToken), null, '被竄改簽名的權杖必須拒絕');

  // 竄改酬載 (Payload) 測試
  const fakePayload = Buffer.from(JSON.stringify({ id: 999, username: 'admin' })).toString('base64url');
  const forgedToken = `${parts[0]}.${fakePayload}.${parts[2]}`;
  assert.strictEqual(verifyToken(forgedToken), null, '被竄改酬載的權杖必須拒絕');

  // 空值與畸形權杖測試
  assert.strictEqual(verifyToken(''), null, '空權杖應返回 null');
  assert.strictEqual(verifyToken('a.b'), null, '格式不合之權杖應返回 null');
  assert.strictEqual(verifyToken(null), null, 'null 權杖應返回 null');
});

test('security: 密碼安全性與異常長度阻斷', () => {
  const pwd = 'StrongPassword!@#123';
  const { hash, salt } = hashPassword(pwd);

  // 正確比對
  assert.strictEqual(verifyPassword(pwd, hash, salt), true, '正確密碼應比對成功');

  // 錯誤密碼
  assert.strictEqual(verifyPassword('WrongPassword', hash, salt), false, '錯誤密碼應比對失敗');

  // 防範長度不合或惡意輸入拋出未捕獲例外
  assert.strictEqual(verifyPassword(null, hash, salt), false, 'null 密碼不應拋出例外');
  assert.strictEqual(verifyPassword(pwd, null, salt), false, 'null 雜湊不應拋出例外');
  assert.strictEqual(verifyPassword(pwd, 'short', salt), false, '長度錯誤之雜湊不應拋出例外');
  assert.strictEqual(verifyPassword(pwd, hash, null), false, 'null 鹽值不應拋出例外');
});

test('security: 滑動視窗速率限制中介層 (Rate Limiter)', () => {
  const limiter = createRateLimiter({
    windowMs: 1000,
    maxLimit: 3,
    message: '已達上限',
  });

  const mockReq = {
    ip: '192.168.1.50',
    headers: {},
  };

  let statusCode = null;
  let responseData = null;
  let responseHeaders = {};

  const mockRes = {
    setHeader(name, val) {
      responseHeaders[name] = val;
    },
    status(code) {
      statusCode = code;
      return {
        json(data) {
          responseData = data;
        },
      };
    },
  };

  let nextCalled = 0;
  const next = () => { nextCalled++; };

  // 前 3 次請求正常放行
  for (let i = 0; i < 3; i++) {
    limiter(mockReq, mockRes, next);
  }
  assert.strictEqual(nextCalled, 3, '前 3 次請求必須全數放行');

  // 第 4 次請求應被攔截為 HTTP 429
  limiter(mockReq, mockRes, next);
  assert.strictEqual(statusCode, 429, '超過限額之請求必須返回 HTTP 429');
  assert.ok(responseData && responseData.error, '應包含錯誤訊息');
  assert.ok(responseHeaders['Retry-After'], '必須提供 Retry-After 標頭');
  assert.strictEqual(nextCalled, 3, '被攔截之請求不可執行 next()');
});

test('security: HTTP 安全防禦標頭 (Security Headers)', () => {
  const headers = {};
  const mockReq = {};
  const mockRes = {
    setHeader(key, value) {
      headers[key] = value;
    },
    removeHeader(key) {
      delete headers[key];
    },
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  securityHeaders(mockReq, mockRes, next);

  assert.strictEqual(nextCalled, true, '中介層必須調用 next()');
  assert.strictEqual(headers['X-Content-Type-Options'], 'nosniff', '需包含 nosniff');
  assert.strictEqual(headers['X-Frame-Options'], 'SAMEORIGIN', '需防範 Clickjacking');
  assert.strictEqual(headers['Referrer-Policy'], 'strict-origin-when-cross-origin', '需限制 Referrer');
  assert.ok(headers['Permissions-Policy'], '需包含 Permissions-Policy');
});

test('security: 程式碼解析器注入基礎防護標籤', () => {
  const rawHtmlSnippet = '<p>簡易測驗題</p>';
  const parsedSnippet = parseToolInput(rawHtmlSnippet);
  assert.strictEqual(parsedSnippet.type, 'html');
  assert.ok(parsedSnippet.htmlContent.includes('<base href="about:blank">'), '自訂程式碼容器需包含 about:blank 基底標籤');
  assert.ok(parsedSnippet.htmlContent.includes('content="no-referrer"'), '需包含 no-referrer 標籤');

  const rawIframeSnippet = '<iframe src="https://example.com/embed"></iframe>';
  const parsedIframe = parseToolInput(rawIframeSnippet);
  assert.strictEqual(parsedIframe.type, 'iframe');
  assert.ok(parsedIframe.htmlContent.includes('<base href="about:blank">'), 'iframe 容器需包含 about:blank 基底標籤');
});
