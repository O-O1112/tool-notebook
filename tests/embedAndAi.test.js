import test from 'node:test';
import assert from 'node:assert';
import { transformUrlToEmbed } from '../src/client/utils/embedTransformers.js';
import { cleanGeneratedHtml, AI_PROVIDERS, PRESET_AI_PROMPTS } from '../src/client/utils/aiGenerator.js';
import { TOOL_TEMPLATES } from '../src/client/utils/toolTemplates.js';

test('embedTransformers: 主流學習與生產力平台網址轉譯驗證', () => {
  // 1. YouTube
  const ytWatch = transformUrlToEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.ok(ytWatch.isKnownPlatform);
  assert.ok(ytWatch.embedUrl.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'));

  const ytShort = transformUrlToEmbed('https://youtu.be/dQw4w9WgXcQ');
  assert.ok(ytShort.embedUrl.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'));

  // 2. Google 文件與試算表
  const gDoc = transformUrlToEmbed('https://docs.google.com/document/d/123456789/edit');
  assert.ok(gDoc.embedUrl.includes('document/d/123456789/preview'));

  const gSheet = transformUrlToEmbed('https://docs.google.com/spreadsheets/d/987654321/edit#gid=0');
  assert.ok(gSheet.embedUrl.includes('spreadsheets/d/987654321/preview'));

  // 3. Desmos 與 GeoGebra
  const desmos = transformUrlToEmbed('https://www.desmos.com/calculator/ptugv2qj7x');
  assert.ok(desmos.embedUrl.includes('desmos.com/calculator/ptugv2qj7x?embed'));

  const geogebra = transformUrlToEmbed('https://www.geogebra.org/m/m8yhy2qu');
  assert.ok(geogebra.embedUrl.includes('material/iframe/id/m8yhy2qu'));

  // 4. Figma 與 CodePen
  const figma = transformUrlToEmbed('https://www.figma.com/file/LKQ4FJ/Sample');
  assert.ok(figma.embedUrl.includes('figma.com/embed?embed_host=share'));

  const codepen = transformUrlToEmbed('https://codepen.io/geoffgraham/pen/bGwvgq');
  assert.ok(codepen.embedUrl.includes('codepen.io/geoffgraham/embed/bGwvgq'));

  // 5. 一般外部網站
  const general = transformUrlToEmbed('https://developer.mozilla.org/zh-TW/');
  assert.strictEqual(general.isKnownPlatform, false);
  assert.ok(general.htmlContent.includes('iframe'));
  assert.ok(general.htmlContent.includes('獨立新視窗開啟'));
});

test('aiGenerator: 代碼清洗器與預設提示庫完整性', () => {
  const rawWithMarkdown = '```html\n<!DOCTYPE html><html><body><h1>測試小工具</h1></body></html>\n```';
  const cleaned = cleanGeneratedHtml(rawWithMarkdown);
  assert.strictEqual(cleaned.startsWith('<!DOCTYPE html>'), true);
  assert.strictEqual(cleaned.includes('```'), false);

  assert.ok(AI_PROVIDERS.length >= 3, '應提供至少 3 種 AI 供應商');
  assert.ok(PRESET_AI_PROMPTS.length >= 6, '應提供至少 6 款常用小工具提示範本');

  // 校驗提示範本嚴格無表情符號
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  PRESET_AI_PROMPTS.forEach((p) => {
    assert.strictEqual(emojiRegex.test(p.title), false, `AI 提示標題不得包含表情符號: ${p.title}`);
    assert.strictEqual(emojiRegex.test(p.description), false, `AI 提示描述不得包含表情符號: ${p.description}`);
  });
});

test('professionalTools: 3 款高深度專業實用工具結構與功能驗證', () => {
  // 1. CSV 數據分析試算表
  const csvTool = TOOL_TEMPLATES.find((t) => t.id === 'csv-analyst');
  assert.ok(csvTool, '應提供 csv-analyst 工具');
  assert.ok(csvTool.content.includes('FileReader'), 'CSV 工具應支援本地檔案讀取');
  assert.ok(csvTool.content.includes('data_export.csv'), 'CSV 工具應具備 CSV 匯出');
  assert.ok(csvTool.content.includes('dataCanvas'), 'CSV 工具應具備 Canvas 圖表繪製');
  assert.ok(csvTool.content.includes('notebook_csv_analyst_data'), 'CSV 工具應具備 localStorage 本地持久化');

  // 2. 手帳現代畫布白板
  const canvasTool = TOOL_TEMPLATES.find((t) => t.id === 'drawing-canvas-pro');
  assert.ok(canvasTool, '應提供 drawing-canvas-pro 工具');
  assert.ok(canvasTool.content.includes('paintCanvas'), '畫布工具應具備 Canvas');
  assert.ok(canvasTool.content.includes('toDataURL'), '畫布工具應支援 PNG 匯出');
  assert.ok(canvasTool.content.includes('notebook_drawing_board_data'), '畫布工具應具備畫布記憶持久化');

  // 3. Markdown / LaTeX 專業學術雙欄筆記器
  const notesTool = TOOL_TEMPLATES.find((t) => t.id === 'academic-notes');
  assert.ok(notesTool, '應提供 academic-notes 工具');
  assert.ok(notesTool.content.includes('math-block'), '筆記工具應支援數學公式排版');
  assert.ok(notesTool.content.includes('exportMarkdown'), '筆記工具應支援 Markdown 匯出');
  assert.ok(notesTool.content.includes('exportHTML'), '筆記工具應支援 HTML 匯出');
  assert.ok(notesTool.content.includes('notebook_academic_notes'), '筆記工具應具備即時自動儲存');

  // 全量範本校驗
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  TOOL_TEMPLATES.forEach((t) => {
    assert.strictEqual(emojiRegex.test(t.title), false, `範本標題不得有表情符號: ${t.title}`);
  });
});
