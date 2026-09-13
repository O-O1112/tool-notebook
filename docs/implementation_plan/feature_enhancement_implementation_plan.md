# 工具小本本全功能深度強化與「範本專區」工程計畫

本計畫遵循使用者之明確指示：全站介面、小工具名稱、範本庫、提示訊息與文件記錄全面禁用 Emoji（表情符號），統一採用專業乾淨的文字與 Lucide SVG 向量線條圖示呈現。

---

## 核心功能強化規格

### 1. 獨立「範本小工具專區」(Templates Hub & Space Section)
- 大廳側邊欄一級分區「範本專區」：
  - 於大廳側邊欄導航加入「範本專區」，點擊後主畫面展示完整的「手帳範本小工具工坊」。
  - 分類檢索：支援按分類切換（全部、效能專注、靈感創意、實用工具、日常生活）與關鍵字即時搜尋。
  - 即時試玩預覽 (Live Sandbox Preview)：可直接在預覽窗格內試用番茄鐘、白噪音、轉盤、計算機等，無須先建立。
  - 一鍵加入指定空間 (Add to Any Space)：提供空間下拉選單，選擇後一鍵將該範本工具新增至指定空間的「範本區」貨架。
  - 以此範本建立新空間 (Create Space from Template)：一鍵以該範本為核心自動初始化全新手帳工作空間並直達。
- 空間畫布「範本區」整合：
  - 頂部導覽工具列增設「範本區」按鈕，快速開啟範本抽屜庫。
  - 範本新增時，預設自動歸入空間的「範本區」貨架欄位，清晰與自訂工具區隔。

### 2. 擴充精選範本庫至 15 款 (Expanded Premium Templates)
在 `src/client/utils/toolTemplates.js` 中新增 5 款高質感手帳小工具（全數去除表情符號，文字簡約專業）：
1. 白噪音專注放鬆器 (White Noise Sound Generator)：雨聲、森林、咖啡館、海浪環境音效合成播放。
2. 手帳習慣打卡與目標追蹤器 (Daily Habit & Goal Tracker)：每日待辦習慣打卡與每週完成率動態進度條。
3. 多功能通用單位換算器 (Unit Converter)：長度、重量、溫度、面積與常用數據單位即時互轉。
4. 幸運雙骰與隨機名單抽籤器 (Lucky Dice & Picker)：隨機抽籤與搖骰點數動畫，教學與會議破冰利器。
5. 重大紀念日倒數計時卡 (Event Countdown Board)：考試、專案截止日天數動態倒數與比例尺。

### 3. 小工具深度操作與管理 (Tool Power Actions)
- 一鍵建立副本 (Duplicate Tool)：卡片操作選單支援快速複製，產生帶有「(副本)」之完整小工具。
- 跨空間克隆 (Clone to Space)：支援將任一小工具複製至使用者擁有的其他手帳空間。
- 單一工具 JSON 匯出 (Export Single Tool)：可將特定工具獨立儲存為 `.tool.json` 規格檔。
- 全螢幕專注模式進階功能 (Enhanced Focus/Zen Mode)：
  - 工具重新載入（Reload Frame）
  - 手帳紙質 / 純黑無干擾底色切換
  - 鍵盤 Esc 快速退出
  - 一鍵切換為獨立快顯小視窗（Pop-out）

### 4. 空間貨架組織與批次操作 (Shelf & Batch Management)
- 自訂貨架欄位管理 (Shelf Column Management)：
  - 支援貨架分欄「新增自訂欄位」、「重新命名欄位 (Rename Section)」與「刪除欄位（自動將欄內工具移至一般工具）」。
  - 欄位架構本地持久化儲存。
- 小工具批次管理模式 (Batch Operations)：
  - 提供批次選取開關與浮動動作列：支援「批次貼標籤」、「批次切換便箋色彩」、「批次搬移欄位」與「批次刪除」。
- 空間封存與唯讀鎖定 (Archive Space)：
  - 空間設定中提供封存開關，封存後處於唯讀防護狀態，避免誤修改。

---

## 預計修改與新增檔案

### 前端代碼
- [MODIFY] `src/client/utils/toolTemplates.js`：清理所有既有範本中之 Emoji，擴充 5 款新範本（總數增至 15 款）。
- [MODIFY] `src/client/components/SpaceDashboard.jsx`：側邊欄新增「範本專區」頁籤（使用 Lucide 向量圖示，無 Emoji）、範本展示卡片牆、分類篩選、即時沙盒預覽彈窗、一鍵加入空間與以此範本新建空間功能。
- [MODIFY] `src/client/components/SpaceLayout.jsx`：新增頂部「範本區」快速按鈕、貨架欄位改名/刪除、批次工具管理列、全螢幕專注升級（重載、黑夜/紙質背景、Esc 監聽）。
- [MODIFY] `src/client/components/ToolCard.jsx`：新增建立副本、跨空間克隆、單一工具匯出操作項，適配批次選取 Checkbox。
- [MODIFY] `src/client/components/AddToolModal.jsx`：優化範本區與自訂代碼區切換體驗。
- [MODIFY] `src/client/components/SpaceSettingsModal.jsx`：新增空間封存唯讀開關。
- [MODIFY] `src/client/App.jsx`：串接大廳範本區「加入空間」與「以此範本新建空間」、工具複製、跨空間搬移、批次操作狀態。

### 測試套件
- [MODIFY] `tests/toolsEdit.test.js`：更新範本數至 15 款。
- [NEW] `tests/advancedFeatures.test.js`：驗證範本區資料流、小工具複製、跨空間克隆、批次操作與欄位改名邏輯。

---

## 驗證計畫

1. 單元測試：執行 `node --test --test-concurrency=1 tests/*.test.js`，確保全部測試通過。
2. 編譯驗證：執行 `npm run build`，確保 Vite 0 錯誤、0 警告完成打包。
3. 雙軌文件：產出 `walkthrough.md` 並同步複製至 `docs/walkthrough/feature_enhancement_walkthrough.md`。
