# 實用功能強化規劃：全域快捷指令面板、投影簡報模式與範本庫擴充

為進一步提升「工具小本本」在大眾日常工作、課堂教學與團隊協作中的實用價值，本階段規劃加入三大深度生產力功能。

---

## 使用者審核確認點 (User Review Required)

> [!IMPORTANT]
> 1. **全域快捷指令面板 (Command Palette, `Ctrl+K` / `Cmd+K`)**：任何視圖下按下快捷鍵即可秒開搜尋，支援模糊搜尋小工具、切換空間、切換主題與執行快捷指令。
> 2. **大螢幕投影簡報模式 (Presentation Mode)**：專為課堂投影與會議大螢幕設計，一鍵隱藏全站導覽列與管理按鈕，自適應最大化呈現工具內容。
> 3. **精選實用範本擴充至 20 款**：新增色彩調色盤、艾森豪四象限、Web Audio 節拍器、客製 QR Code 產生器、字型排版視覺對比器。

---

## 規劃改動範圍

### 1. 全域快捷指令面板 (`src/client/components/CommandPalette.jsx` [NEW])
* **快捷鍵監聽**：全域監聽 `Ctrl + K` 與 `Cmd + K`，或點擊頂部搜尋按鈕喚起。
* **分組即時搜尋**：
  * **快速跳轉空間**：搜尋個人建立、他人共享或收藏的空間並一鍵切換。
  * **當前小工具檢索**：即時搜尋當前空間中的小工具名稱與標籤，點擊直接聚焦滾動至該工具或開啟全螢幕。
  * **系統快速操作**：一鍵切換深淺模式、切換排版模式（貨架、瀑布流、網格、分頁）、開啟新增工具彈窗、匯出空間備份。
* **鍵盤導覽體驗**：完整支援方向鍵 `↑` `↓` 移動選取、`Enter` 觸發、`Esc` 退出。

### 2. 大螢幕投影簡報模式 (`src/client/components/SpaceLayout.jsx`, `src/client/App.jsx`)
* **沉浸式全螢幕簡報體驗**：
  * 於頂部工具列新增「投影簡報模式」切換鈕（或快捷鍵 `Shift + P`）。
  * 隱藏頂部導覽列、側邊選單、卡片操作把手與編輯按鈕，僅保留純粹卡片展示。
  * 自動適配大螢幕視距，提供懸浮式微型控制按鈕（退出投影、切換暗色背景、重新整理）。

### 3. 精選純前端小工具範本擴充至 20 款 (`src/client/utils/toolTemplates.js`)
新增 5 款純前端、完全離線可用的高品質實用範本：
1. **色彩調色盤與 WCAG 對比檢查器**
   * HEX、RGB、HSL 數值即時換算與一鍵複製。
   * 背景與文字 WCAG 2.1 對比度即時評級（AAA / AA / Fail）。
2. **艾森豪四象限時間管理矩陣 (Eisenhower Matrix)**
   * 「重要且緊急」、「重要不緊急」、「緊急不重要」、「不重要不緊急」四象限分類。
   * 支援即時新增、刪除待辦與勾選完成。
3. **Web Audio 專注節拍器與標準調音笛**
   * Web Audio API 實現微秒級精準 BPM 節拍音響（40 至 240 BPM）。
   * 支援拍號切換（2/4, 3/4, 4/4, 6/8）與標準 440Hz A 調音笛。
4. **離線客製 QR Code 產生器**
   * 即時將任意文字或連結轉換為高清 QR Code。
   * 支援前景/背景色彩挑選與一鍵下載 SVG/PNG。
5. **現代字體排版與層次視覺對比器**
   * 支援中英文大標、副標、內文之字級比例尺（Major Third, Golden Ratio）。
   * 即時調整行高（line-height）、字距（letter-spacing）與各字重效果對比。

---

## 受影響檔案清單

### [NEW]
* `src/client/components/CommandPalette.jsx`
* `tests/expandedFeatures.test.js`

### [MODIFY]
* `src/client/utils/toolTemplates.js`
* `src/client/components/SpaceLayout.jsx`
* `src/client/components/Navbar.jsx`
* `src/client/App.jsx`
* `README.md`

---

## 驗證計畫

### 自動化測試
```bash
pwd; npm test
```
* 驗證新增之 5 款範本結構、離線可用性與資料模型。
* 驗證 Command Palette 資料檢索過濾邏輯與指令索引。

### 生產環境建置
```bash
pwd; npm run build
```
* 確保 Vite 正常打包無錯誤。

### 手動驗證流程
1. 按下 `Ctrl + K` 確認指令面板流暢彈出，鍵盤方向鍵與 Enter 正確執行跳轉。
2. 點擊「投影簡報模式」，確認全站沉浸式放大並隱藏編輯介面，按 Esc 或退出鈕能無縫復原。
3. 依序將 5 款新範本加入空間，確認功能（節拍器發聲、調色盤計算、四象限勾選）離線運作正常。
