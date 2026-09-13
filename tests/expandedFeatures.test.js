import test from 'node:test';
import assert from 'node:assert';
import { TOOL_TEMPLATES } from '../src/client/utils/toolTemplates.js';

test('expandedFeatures: 完整提供 20 款高質感離線小工具範本', () => {
  assert.strictEqual(TOOL_TEMPLATES.length, 20, '應提供完整 20 款開箱即用小工具範本');

  TOOL_TEMPLATES.forEach((tmpl) => {
    assert.ok(tmpl.id, `範本應有唯一 ID: ${tmpl.id}`);
    assert.ok(tmpl.title, `範本應有標題: ${tmpl.id}`);
    assert.ok(tmpl.description, `範本應有描述: ${tmpl.id}`);
    assert.ok(tmpl.category, `範本應有分類: ${tmpl.id}`);
    assert.ok(tmpl.content && tmpl.content.length > 50, `範本代碼不應為空: ${tmpl.id}`);
    assert.ok(tmpl.content.includes('<!DOCTYPE html>'), `範本應為標準獨立 HTML5 文件: ${tmpl.id}`);

    // 嚴格校驗：標題與說明均不得含有表情符號
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    assert.strictEqual(emojiRegex.test(tmpl.title), false, `範本標題不得包含表情符號: ${tmpl.title}`);
    assert.strictEqual(emojiRegex.test(tmpl.description), false, `範本說明不得包含表情符號: ${tmpl.description}`);
  });
});

test('expandedFeatures: 5 款新增小工具範本之專業度與離線邏輯檢驗', () => {
  // 1. 色彩調色盤與對比檢查器
  const palette = TOOL_TEMPLATES.find((t) => t.id === 'color-palette');
  assert.ok(palette, '應包含 color-palette 色彩調色盤小工具');
  assert.ok(palette.content.includes('WCAG') || palette.content.includes('對比度') || palette.content.includes('luminance'), '色彩工具應提供對比度計算');
  assert.strictEqual(palette.category, '靈感與創意');

  // 2. 艾森豪四象限時間管理
  const eisenhower = TOOL_TEMPLATES.find((t) => t.id === 'eisenhower-matrix');
  assert.ok(eisenhower, '應包含 eisenhower-matrix 艾森豪四象限小工具');
  assert.ok(eisenhower.content.includes('重要') && eisenhower.content.includes('緊急'), '艾森豪工具應劃分重要與緊急四象限');
  assert.strictEqual(eisenhower.category, '效能與專注');

  // 3. Web Audio 專注節拍器與標準音調音笛
  const metronome = TOOL_TEMPLATES.find((t) => t.id === 'metronome');
  assert.ok(metronome, '應包含 metronome 節拍器小工具');
  assert.ok(metronome.content.includes('AudioContext') || metronome.content.includes('webkitAudioContext'), '節拍器應使用 Web Audio API');
  assert.ok(metronome.content.includes('BPM') || metronome.content.includes('bpm'), '節拍器應支援 BPM 調節');
  assert.strictEqual(metronome.category, '生活日常');

  // 4. 離線客製 QR Code 產生器
  const qrcode = TOOL_TEMPLATES.find((t) => t.id === 'custom-qrcode');
  assert.ok(qrcode, '應包含 custom-qrcode 離線 QR Code 小工具');
  assert.ok(qrcode.content.includes('canvas') || qrcode.content.includes('QRCode'), 'QR Code 工具應支援畫布渲染');
  assert.strictEqual(qrcode.category, '實用工具');

  // 5. 現代字體排版視覺對比器
  const typography = TOOL_TEMPLATES.find((t) => t.id === 'typography-tester');
  assert.ok(typography, '應包含 typography-tester 字體排版小工具');
  assert.ok(typography.content.includes('fontSize') || typography.content.includes('lineHeight'), '字體排版工具應支援字級與行距預覽');
  assert.strictEqual(typography.category, '靈感與創意');
});
