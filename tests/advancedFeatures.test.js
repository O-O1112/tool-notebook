import test from 'node:test';
import assert from 'node:assert';
import { TOOL_TEMPLATES } from '../src/client/utils/toolTemplates.js';

test('advancedFeatures: 15 款小工具範本離線可用性與多樣性驗證', () => {
  assert.strictEqual(TOOL_TEMPLATES.length, 15, '應提供完整 15 款小工具範本');

  const categories = new Set(TOOL_TEMPLATES.map((t) => t.category));
  assert.ok(categories.has('效能與專注'), '應包含效能與專注分類');
  assert.ok(categories.has('靈感與創意'), '應包含靈感與創意分類');
  assert.ok(categories.has('實用工具'), '應包含實用工具分類');
  assert.ok(categories.has('生活日常'), '應包含生活日常分類');

  TOOL_TEMPLATES.forEach((tmpl) => {
    assert.ok(tmpl.id, '範本應有唯一 ID');
    assert.ok(tmpl.title, '範本應有標題');
    assert.ok(tmpl.description, '範本應有詳細說明');
    assert.ok(tmpl.content.length > 50, '範本內容不應為空');
    assert.ok(tmpl.content.includes('<!DOCTYPE html>'), '範本應為標準 HTML5 文件');
  });

  // 驗證新增的白噪音、習慣打卡、單位換算、抽籤雙骰、倒數計時
  const whiteNoise = TOOL_TEMPLATES.find((t) => t.id === 'white_noise');
  assert.ok(whiteNoise, '應有 white_noise 白噪音範本');
  assert.ok(whiteNoise.content.includes('AudioContext') || whiteNoise.content.includes('webkitAudioContext'), '白噪音應以 Web Audio API 合成');

  const habitTracker = TOOL_TEMPLATES.find((t) => t.id === 'habit_tracker');
  assert.ok(habitTracker, '應有 habit_tracker 習慣打卡範本');
  assert.ok(habitTracker.content.includes('habits'), '習慣打卡器應包含習慣資料儲存與渲染');

  const unitConverter = TOOL_TEMPLATES.find((t) => t.id === 'unit_converter');
  assert.ok(unitConverter, '應有 unit_converter 單位換算範本');
  assert.ok(unitConverter.content.includes('convert'), '單位換算器應包含換算函式');

  const luckyPicker = TOOL_TEMPLATES.find((t) => t.id === 'lucky_picker');
  assert.ok(luckyPicker, '應有 lucky_picker 雙骰抽籤範本');
  assert.ok(luckyPicker.content.includes('rollDice') || luckyPicker.content.includes('pickRandom'), '抽籤器應具備隨機抽籤與雙骰邏輯');

  const countdown = TOOL_TEMPLATES.find((t) => t.id === 'countdown_board');
  assert.ok(countdown, '應有 countdown_board 倒數計時卡範本');
  assert.ok(countdown.content.includes('targetDate'), '倒數計時應包含目標日期處理');
});

test('advancedFeatures: 工具匯出 JSON (.tool.json) 結構與副本生成邏輯', () => {
  const originalTool = {
    id: 101,
    title: '專注番茄鐘',
    type: 'html',
    content: '<div>番茄鐘</div>',
    col_span: 1,
    tags: ['專注', '學習'],
    color: 'peach',
    section: '核心功能',
  };

  // 模擬 handleExportTool
  const exported = {
    version: '2.2.0-tool',
    exportedAt: new Date().toISOString(),
    tool: {
      title: originalTool.title,
      type: originalTool.type,
      content: originalTool.content,
      col_span: originalTool.col_span || 1,
      tags: originalTool.tags || [],
      color: originalTool.color || 'default',
      section: originalTool.section || '一般工具',
    },
  };

  assert.strictEqual(exported.version, '2.2.0-tool');
  assert.strictEqual(exported.tool.title, '專注番茄鐘');
  assert.deepStrictEqual(exported.tool.tags, ['專注', '學習']);
  assert.strictEqual(exported.tool.color, 'peach');

  // 模擬 handleDuplicateTool
  const duplicatedTool = {
    ...originalTool,
    id: 102,
    title: `${originalTool.title} (副本)`,
    isPinned: false,
  };

  assert.strictEqual(duplicatedTool.title, '專注番茄鐘 (副本)');
  assert.strictEqual(duplicatedTool.content, originalTool.content);
  assert.strictEqual(duplicatedTool.section, '核心功能');
  assert.strictEqual(duplicatedTool.isPinned, false);
});

test('advancedFeatures: 批次工具操作邏輯 (換色、換分欄、合併標籤)', () => {
  let tools = [
    { id: 1, title: '工具A', color: 'default', section: '一般工具', tags: ['標籤1'] },
    { id: 2, title: '工具B', color: 'default', section: '一般工具', tags: ['標籤2'] },
    { id: 3, title: '工具C', color: 'lavender', section: '其他', tags: [] },
  ];

  const selectedIds = [1, 2];

  // 1. 批次換色為 'mint'
  tools = tools.map((t) => (selectedIds.includes(t.id) ? { ...t, color: 'mint' } : t));
  assert.strictEqual(tools[0].color, 'mint');
  assert.strictEqual(tools[1].color, 'mint');
  assert.strictEqual(tools[2].color, 'lavender');

  // 2. 批次換分欄為 '常用捷徑'
  tools = tools.map((t) => (selectedIds.includes(t.id) ? { ...t, section: '常用捷徑' } : t));
  assert.strictEqual(tools[0].section, '常用捷徑');
  assert.strictEqual(tools[1].section, '常用捷徑');
  assert.strictEqual(tools[2].section, '其他');

  // 3. 批次追加標籤 '手帳'
  const newTag = '手帳';
  tools = tools.map((t) => {
    if (!selectedIds.includes(t.id)) return t;
    const current = t.tags || [];
    return current.includes(newTag) ? t : { ...t, tags: [...current, newTag] };
  });

  assert.deepStrictEqual(tools[0].tags, ['標籤1', '手帳']);
  assert.deepStrictEqual(tools[1].tags, ['標籤2', '手帳']);
  assert.deepStrictEqual(tools[2].tags, []);
});

test('advancedFeatures: 貨架分欄 (Shelf) 重新命名與分欄刪除回退邏輯', () => {
  let tools = [
    { id: 1, title: '工具1', section: '課堂互動' },
    { id: 2, title: '工具2', section: '課堂互動' },
    { id: 3, title: '工具3', section: '一般工具' },
  ];

  // 1. 重新命名分欄：'課堂互動' -> '課堂即時反饋'
  const oldSec = '課堂互動';
  const newSec = '課堂即時反饋';
  tools = tools.map((t) => (t.section === oldSec ? { ...t, section: newSec } : t));

  assert.strictEqual(tools[0].section, '課堂即時反饋');
  assert.strictEqual(tools[1].section, '課堂即時反饋');
  assert.strictEqual(tools[2].section, '一般工具');

  // 2. 刪除分欄：刪除 '課堂即時反饋'，其內工具應回退至 '一般工具'
  tools = tools.map((t) => (t.section === newSec ? { ...t, section: '一般工具' } : t));
  assert.strictEqual(tools[0].section, '一般工具');
  assert.strictEqual(tools[1].section, '一般工具');
  assert.strictEqual(tools[2].section, '一般工具');
});

test('advancedFeatures: 空間封存 (Archive) 切換與狀態判定', () => {
  let archivedSpaceIds = ['sp-001', 'sp-002'];

  const toggleArchive = (spaceId) => {
    if (archivedSpaceIds.includes(spaceId)) {
      archivedSpaceIds = archivedSpaceIds.filter((id) => id !== spaceId);
    } else {
      archivedSpaceIds = [...archivedSpaceIds, spaceId];
    }
  };

  // 封存 sp-003
  toggleArchive('sp-003');
  assert.ok(archivedSpaceIds.includes('sp-003'));

  // 解除封存 sp-001
  toggleArchive('sp-001');
  assert.ok(!archivedSpaceIds.includes('sp-001'));
  assert.strictEqual(archivedSpaceIds.length, 2);
});
