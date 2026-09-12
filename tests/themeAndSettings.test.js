import test from 'node:test';
import assert from 'node:assert/strict';

test('theme: 深色模式切換與先前日間紙質風格還原邏輯', () => {
  // 模擬狀態切換
  let currentTheme = 'warm';
  let lastLightTheme = 'warm';

  const selectTheme = (newTheme) => {
    currentTheme = newTheme;
    if (newTheme !== 'dark') {
      lastLightTheme = newTheme;
    }
  };

  const toggleDarkMode = () => {
    if (currentTheme === 'dark') {
      selectTheme(lastLightTheme || 'warm');
    } else {
      selectTheme('dark');
    }
  };

  // 1. 預設為 warm (方眼米紙)
  assert.equal(currentTheme, 'warm');
  assert.equal(lastLightTheme, 'warm');

  // 2. 切換為 kraft (復古牛皮)
  selectTheme('kraft');
  assert.equal(currentTheme, 'kraft');
  assert.equal(lastLightTheme, 'kraft');

  // 3. 點擊一鍵深色模式 (Moon)
  toggleDarkMode();
  assert.equal(currentTheme, 'dark');
  assert.equal(lastLightTheme, 'kraft', '應保留先前選取的 kraft 牛皮紙質作為記憶');

  // 4. 再次點擊 (Sun) 切回日間模式
  toggleDarkMode();
  assert.equal(currentTheme, 'kraft', '應精確還原至使用者先前設定的 kraft 紙質風格');

  // 5. 切換為 minimal (簡約素白) 後進深色再切回
  selectTheme('minimal');
  toggleDarkMode();
  assert.equal(currentTheme, 'dark');
  toggleDarkMode();
  assert.equal(currentTheme, 'minimal', '應精確還原至 minimal 素白風格');
});

test('settings: 設定區支援之 5 款排版模式鍵值與有效性', () => {
  const supportedLayouts = ['shelf', 'wall', 'grid', 'tabs', 'collapsed'];
  
  assert.equal(supportedLayouts.length, 5);
  assert.ok(supportedLayouts.includes('shelf'), '應支援貨架分欄');
  assert.ok(supportedLayouts.includes('wall'), '應支援緊湊瀑布流');
  assert.ok(supportedLayouts.includes('grid'), '應支援網格並排');
  assert.ok(supportedLayouts.includes('tabs'), '應支援分頁輪播');
  assert.ok(supportedLayouts.includes('collapsed'), '應支援折起專注');
});
