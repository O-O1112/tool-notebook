import test from 'node:test';
import assert from 'node:assert';
import { parseToolInput } from '../src/client/utils/codeParser.js';

test('codeParser: 應正確識別並處理純網址 (URL)', () => {
  const url = 'https://www.geogebra.org/calculator';
  const result = parseToolInput(url);

  assert.strictEqual(result.type, 'url');
  assert.strictEqual(result.titleSuggestion, '嵌入網頁 (www.geogebra.org)');
  assert.match(result.htmlContent, /<iframe src="https:\/\/www\.geogebra\.org\/calculator"/);
});

test('codeParser: 應正確識別並標準化 <iframe> 標籤', () => {
  const iframeSnippet = '<iframe src="https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html" width="600" height="400"></iframe>';
  const result = parseToolInput(iframeSnippet);

  assert.strictEqual(result.type, 'iframe');
  assert.strictEqual(result.titleSuggestion, '嵌入視窗 (phet.colorado.edu)');
  assert.match(result.htmlContent, /style="width:100%;height:100%;border:none;"/);
});

test('codeParser: 應正確將自訂 HTML/JS 片段包裹為獨立沙盒文件', () => {
  const rawCode = '<h1>課堂倒數</h1><button onclick="alert(1)">開始</button>';
  const result = parseToolInput(rawCode);

  assert.strictEqual(result.type, 'html');
  assert.strictEqual(result.titleSuggestion, '課堂倒數');
  assert.match(result.htmlContent, /<!DOCTYPE html>/);
  assert.match(result.htmlContent, /<h1>課堂倒數<\/h1>/);
});

test('codeParser: 處理空字串與無效輸入應有安全防護', () => {
  const result = parseToolInput('');
  assert.strictEqual(result.type, 'html');
  assert.strictEqual(result.htmlContent, '');
});
