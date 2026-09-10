import test from 'node:test';
import assert from 'node:assert';
import { hashPassword, verifyPassword } from '../src/server/db.js';
import { signToken, verifyToken } from '../src/server/middleware/auth.js';

test('auth: 密碼雜湊與比對應正確運作', () => {
  const password = 'mypassword123';
  const { hash, salt } = hashPassword(password);

  assert.ok(hash, '雜湊值不可為空');
  assert.ok(salt, '鹽值不可為空');

  const isMatch = verifyPassword(password, hash, salt);
  assert.strictEqual(isMatch, true, '正確密碼比對應為 true');

  const isWrong = verifyPassword('wrongpassword', hash, salt);
  assert.strictEqual(isWrong, false, '錯誤密碼比對應為 false');
});

test('auth: JWT 簽發與驗證應正確傳遞 payload', () => {
  const userPayload = {
    id: 99,
    username: 'user_test',
    displayName: '測試者',
  };

  const token = signToken(userPayload, 3600);
  assert.ok(token, 'Token 不得為空');

  const verified = verifyToken(token);
  assert.ok(verified, '驗證後 payload 應存在');
  assert.strictEqual(verified.id, 99);
  assert.strictEqual(verified.username, 'user_test');
  assert.strictEqual(verified.displayName, '測試者');
});

test('auth: 竄改或無效 Token 應被拒絕', () => {
  const fakeToken = 'invalid.token.string';
  assert.strictEqual(verifyToken(fakeToken), null);

  const emptyToken = '';
  assert.strictEqual(verifyToken(emptyToken), null);
});
