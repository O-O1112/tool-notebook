# 工具小本本 (Tool Notebook) - 實用功能擴充計畫

為提升「工具小本本」在個人日常與團隊協作中的實用性與靈活性，規劃擴充五大核心功能模組。

---

## 提案功能清單

### 1. 📦 精選實用工具範本庫 (Preset Templates)
在「新增工具」視窗中增加範本選擇分頁，提供 5 款符合小本本視覺風格（紙質米白、深墨水、珊瑚橘重點色）的純前端高質感小工具，無須自行準備代碼即可一鍵套用：
- ⏱️ **番茄工作法計時器**：25 分鐘專注、5 分鐘短休、計時音效與狀態切換。
- 🎯 **隨機抽籤轉盤**：支援自訂候選清單、平滑旋轉動畫與隨機抽籤。
- 📝 **隨手便箋與待辦板**：支援多色便利貼、打字即時暫存、待辦勾選。
- 🎨 **輕量塗鴉白板**：墨水黑 / 珊瑚橘筆刷、筆觸粗細調整與一鍵清除。
- 🧮 **簡約標準計算機**：支援鍵盤輸入與即時四則運算。

### 2. ✏️ 工具卡片就地編輯 (In-place Tool Editor)
- 目前加入工具後若想修改代碼或標題只能刪除重貼。
- 於 `ToolCard` 頂部增加「編輯」按鈕，彈出編輯視窗，可直接調整工具標題、1x/2x 寬度及 HTML/iframe 代碼，並提供即時預覽後儲存。

### 3. 🔍 空間工具即時搜尋與篩選 (Search & Filter)
- 當空間內有 5 個以上小工具時，可透過頂部搜尋框快速依工具名稱關鍵字進行模糊搜尋。
- 支援標籤過濾（全部 / 自訂程式 / 嵌入視窗）。

### 4. 💾 空間 JSON 備份匯出與匯入 (Backup & Export/Import)
- **一鍵匯出**：將目前空間所有工具的名稱、類型、寬度與代碼打包為 `.json` 下載至本機。
- **一鍵匯入**：上傳 JSON 檔即可瞬間建立新空間或將工具批次載入，方便團隊共享整套看板工具。

### 5. ⚙️ 空間名稱與設定修改 (Edit Space Settings)
- 空間擁有者可隨時修改空間名稱與備註說明。

---

## 異動檔案規劃

### 前端模組 (Frontend)
- `[NEW]` `src/client/utils/toolTemplates.js`：定義 5 款高質感小工具之 HTML/JS 原始碼與中繼資訊。
- `[NEW]` `src/client/components/EditToolModal.jsx`：工具就地編輯彈窗組件。
- `[NEW]` `src/client/components/SpaceSettingsModal.jsx`：空間更名與匯出/匯入彈窗。
- `[MODIFY]` `src/client/components/AddToolModal.jsx`：整合「自訂代碼」與「精選範本」切換分頁。
- `[MODIFY]` `src/client/components/ToolCard.jsx`：加入編輯工具按鈕。
- `[MODIFY]` `src/client/components/SpaceLayout.jsx`：整合搜尋欄與篩選標籤。
- `[MODIFY]` `src/client/components/Navbar.jsx`：加入空間設定與匯出/匯入操作入口。
- `[MODIFY]` `src/client/App.jsx`：處理編輯工具、更新空間與匯入工具之資料流。

### 後端與邊緣 API (Backend & Edge Worker)
- `[MODIFY]` `worker/index.js`：擴充 `PATCH /api/spaces/:id/tools/:toolId` 支援更新 `title`、`content` 與 `type`。
- `[MODIFY]` `src/server/routes/spaces.js`：同步本地 Express 伺服器之工具修改端點。
