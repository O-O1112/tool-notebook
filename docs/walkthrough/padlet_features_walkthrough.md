# 工具小本本：Padlet 四大靈魂特性全面升級完成報告

> 參考 Padlet 核心視覺體驗與協同優勢，將「工具小本本」由原本平面網格工作區，全面進化為具備**模組化分欄貨架**、**手帳便箋色紙**、**免登入一鍵 QR Code 掃碼分享**與**緊湊自適應瀑布流**的專業多功能微工具工作台。

---

## 🚀 實作功能概覽

### 1. 🗂️ 分欄收納貨架 (Shelf / Kanban 模式)
- **多欄分組歸納**：使用者可自由新增分欄（如「常用工具」、「數學計算」、「文字處理」、「隨手繪記」）。
- **跨欄自由拖曳**：支援卡片跨欄拖放，拖曳時目標欄位高亮提示（`shelf-drop-zone.drag-active`），放開立即自動更新歸屬並本地與雲端持久化。
- **欄位專屬新增按鈕**：每個欄位底部設有「+ 在此欄新增小工具」，點擊後自動代入該分欄名稱，無需手動重選。

### 2. 🎨 手帳便箋彩色卡片底色 (Card Accent Colors)
- **6 款手帳便箋粉彩配色**：
  - 🤍 **原色米白** (`#ffffff`, border: `#e4e8e5`)
  - 🍑 **蜜桃粉** (`#fff5f2`, border: `#f7d2c8`)
  - 🌿 **薄荷綠** (`#f1f9f6`, border: `#c7eadc`)
  - 🍋 **晨曦黃** (`#fefde8`, border: `#fae99f`)
  - 🌊 **天峰藍** (`#f0f7ff`, border: `#cce1ff`)
  - 🍇 **薰衣紫** (`#f7f2fd`, border: `#e5d3f8`)
- **即時調色盤選色**：卡片右上方設有調色盤按鈕，點擊彈出色票快速切換，支援自訂與範本工具。

### 3. 📱 空間 QR Code 一鍵分享與免登入訪客模式 (Guest View)
- **高清向量 SVG QR Code**：整合 `qrcode` 函式庫，自動針對空間公開網址產生向量 SVG，清晰不失真。
- **免登入即開即用 (`?share=SPC-XXXX`)**：
  - 手機掃描或開啟直達連結時，無須登入或註冊即可直達該空間。
  - 後端 Express 與 Cloudflare Worker 新增公開唯讀端點 `GET /api/spaces/share/:code`。
  - 前端以唯讀模式保護空間：鎖定編輯、刪除、設定與排序權限，但保留所有純前端沙盒小工具的完整互動能力。
  - 頂部導覽列顯示「訪客唯讀模式」徽章與「登入 / 註冊」捷徑。

### 4. 🧱 緊湊瀑布流排版 (Masonry / Wall 模式)
- **多欄自適應拼接**：採用 CSS 多欄佈局 (`columns: 1 / 2 / 3`) 與 `break-inside: avoid`，各卡片依據實際內容高矮緊密拼貼，消除底部尷尬白邊。
- **導覽列快速切換**：頂部導覽列支援 5 種佈局即時切換（貨架分欄、瀑布流、網格並列、分頁輪播、折起專注）。

---

## 🧪 驗證與測試結果

### 1. 自動化測試 (`npm test`)
全量 16 項測試皆順利通過：
- `auth`: 密碼雜湊與比對、JWT 簽發與驗證、竄改拒絕。
- `codeParser`: 純網址防護、iframe 解析、HTML 沙盒封裝。
- `E2E`: 完整使用者流程（註冊 $\rightarrow$ 登入 $\rightarrow$ 建立空間 $\rightarrow$ 新增工具）。
- `inviteCode`: 格式檢驗 (`SPC-XXXX`)、成員加入。
- `padlet`: 
  - QR Code 向量 SVG 與 DataURL 產出驗證。
  - 6 款手帳便箋粉彩配色定義與樣式檢驗。
  - 免登入訪客模式 API (`GET /spaces/share/:code`) 無授權存取驗證。
- `reorder`, `templates`, `toolEdit`: 拖曳重排、10 款內建範本、就地編輯驗證。

### 2. 生產環境打包 (`npm run build`)
- Vite 6.4.3 生產編譯無任何警告或報錯，成功產出於 `dist/`。

### 3. 問題修復：`V.trim is not a function` 根因定位與防護
- **問題現象**：在空白空間中點擊「挑選範本或貼上工具代碼」開啟對話框，挑選任何內建範本並點擊「加入」時，瀏覽器彈出 `V.trim is not a function` 報錯。
- **根本原因**：`SpaceLayout.jsx` 中的空白引導按鈕使用 `onClick={onOpenAddModal}`，導致 React 的合成點擊事件物件（`PointerEvent`）被作為第一個參數傳入 `App.jsx` 的 `onOpenAddModal(section)`，進而被當成 `initialSection` 傳遞至 `AddToolModal`。在執行 `section.trim()` 時因事件物件無 `.trim` 方法而拋出例外（生產環境壓縮後為 `V.trim`）。
- **修復方案**：
  1. `SpaceLayout.jsx`：改為 `onClick={() => onOpenAddModal && onOpenAddModal('一般工具')}`，避免事件物件外洩。
  2. `App.jsx`：加強型別防禦：`typeof section === 'string' && section.trim() ? section.trim() : '一般工具'`。
  3. `AddToolModal.jsx` & `EditToolModal.jsx`：建立 `sanitizeSection` 輔助函式，針對初始狀態與提交 payload 實施全面字串安全防護。

### 4. 文字字型與按鈕斷行修復（「有些字會跑掉」排版優化）
- **問題現象**：
  1. **按鈕文字直立折行**：範本卡片中的「預覽」變成「預」與「覽」上下兩行；「微調代碼」變成「微調代」與「碼」；「加入」變成「加」與「入」。
  2. **中文字型回退鋸齒**：在 Windows 環境下未引入 Google Fonts 且未宣告「微軟正黑體」，繁體中文回退至細明體（PMingLiU），文字發虛且間距不均。
- **根本原因**：
  1. 對話框寬度（`max-w-2xl`，僅 672px）在雙欄網格下單欄卡片寬度僅約 300px，卡片底部的 3 顆按鈕因寬度受限且未設定 `white-space: nowrap`，導致中文字元被強制斷行。
  2. 全域 CSS 與元件按鈕未加入 `white-space: nowrap` 與 `shrink-0`。
  3. `index.html` 未預載 `Noto Sans TC` 網路字型，且 CSS `font-family` 缺漏 Windows 正黑體。
- **修復方案**：
  1. **字型補全**：在 `index.html` 引入 Google Fonts `Noto Sans TC`，並於 `notebook.css` 與 `codeParser.js` 補上 `"Noto Sans TC", "Microsoft JhengHei", "微軟正黑體"`，確保各作業系統均呈現現代平滑黑體。
  2. **擴大對話框視野**：將 `AddToolModal` 寬度升級為 `max-w-3xl lg:max-w-4xl`，提供充足按鈕排版間距。
  3. **防折行樣式**：全域按鈕（`.notebook-btn-primary`, `.notebook-btn-secondary`, `.notebook-badge`, `.notebook-tag`）與各元件按鈕均加上 `white-space: nowrap` 與 `shrink-0`，杜絕任何中文字詞被迫折行。

---

## 📁 異動檔案彙整

| 檔案路徑 | 異動摘要 |
|---|---|
| [`src/client/utils/qrcode.js`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/utils/qrcode.js) | 新增向量 SVG 與 DataURL QR Code 產出模組 |
| [`src/client/utils/cardColors.js`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/utils/cardColors.js) | 抽離並定義 6 款手帳便箋調色盤色票 |
| [`src/client/components/QRCodeModal.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/QRCodeModal.jsx) | 新增 Padlet 一鍵 QR Code 與訪客分享對話框 |
| [`src/client/components/ToolCard.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/ToolCard.jsx) | 整合調色盤選色按鈕、手帳底色類別、拖曳中繼資料 |
| [`src/client/components/SpaceLayout.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceLayout.jsx) | 實作 Padlet Shelf 貨架模式（跨欄拖曳、欄位新增）與 Wall 瀑布流 |
| [`src/client/components/Navbar.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx) | 佈局切換器加入貨架與瀑布流按鈕、QR Code 按鈕、訪客唯讀狀態展示 |
| [`src/client/components/AddToolModal.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/AddToolModal.jsx) | 新增分欄歸屬與便箋色彩選擇欄位 |
| [`src/client/components/EditToolModal.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/EditToolModal.jsx) | 支援現有工具分欄歸屬與便箋色彩調整 |
| [`src/client/notebook.css`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/notebook.css) | 增加 6 款卡片便箋樣式、瀑布流佈局樣式與貨架橫向滾動樣式 |
| [`src/client/App.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/App.jsx) | 整合訪客免登入直達、色彩/分欄狀態管理、QR Code 開啟邏輯 |
| [`src/client/utils/api.js`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/utils/api.js) | 新增 `getSpaceByShareCode` 公開訪客 API |
| [`src/server/routes/spaces.js`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/routes/spaces.js) | 新增本地伺服器公開訪客端點 `GET /api/spaces/share/:code` |
| [`worker/index.js`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/worker/index.js) | Cloudflare Worker 新增公開訪客端點 `GET /api/spaces/share/:code` |
| [`tests/padletFeatures.test.js`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/tests/padletFeatures.test.js) | 新增 Padlet 特性單元與整合測試 |
| [`README.md`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/README.md) | 同步更新專案亮點與使用功能說明 |
