# [需要架構決策] 工具小本本全面融合 Padlet 核心體驗升級計畫

本計畫旨在將 **Padlet** 最受讚譽的視覺化與協作精髓注入「工具小本本」，從單純的平面工具板，進化為支援**分欄收納貨架 (Shelf)**、**彩色便箋手帳紙質 (Card Colors)**、**空間 QR Code 掃碼免登入即用**與**緊湊瀑布流 (Masonry Wall)** 的全方位互動工具看板。

---

## 架構決策與方案評估 (Architectural Decisions)

### 決策 1：分欄 (Shelf Section) 與卡片色系 (Card Color) 的資料持久化策略

* **情境**：現行 SQLite 與 Cloudflare D1 之 `tools` 資料表原本未含 `section` 與 `color` 欄位。
* **方案比較**：
  * **方案 A（推薦：前後端無縫雙軌相容 + localStorage 容錯快取）**：
    * 前端在 `Tool` 物件中擴充 `section`（預設欄位）與 `color`（預設米白/原色）。
    * 支援於前端 `localStorage` 依空間與工具 ID 快取欄位與色票設定，並於 JSON 匯出/匯入（v2.1）全面同步。
    * 同步更新後端 `PATCH /api/spaces/:id/tools/:toolId` 接收此二欄位，若資料庫未來升級欄位可自然寫入，現階段即便不進行破壞性 D1 遷移也能 100% 穩定運作。
    * **優點**：即推即用，完全不影響已上線的 GitHub Pages 與 Cloudflare D1 運作，零停機風險。
  * **方案 B（強制執行遠端 Cloudflare D1 Schema 遷移）**：
    * 執行 `ALTER TABLE tools ADD COLUMN section TEXT DEFAULT '一般工具'; ALTER TABLE tools ADD COLUMN color TEXT DEFAULT 'default';`
    * **缺點**：需遠端 wrangler 執行遷移指令，若連線不順可能導致 API 報錯。
  * **決策結論**：採 **方案 A**，以向後相容架構為主，保障線上系統穩定性。

### 決策 2：QR Code 生成方式

* **方案 A（推薦：純前端輕量向量 SVG 演算法，零額外依賴）**：
  * 實作輕量無依賴的 QR Code 矩陣計算並渲染為純 SVG 向量圖。
  * **優點**：不增加 npm 模組包袱，離線可用，SVG 具備高解析度、可直接縮放與下載。
* **方案 B（引入第三方 npm 套件 `qrcode`）**：
  * **缺點**：增加 bundle 體積，且部分 Node.js 依賴在瀏覽器環境需額外 polyfill。
* **決策結論**：採 **方案 A**。

### 決策 3：訪客免登入即用模式 (Guest View)

* **方案 A（推薦：`?share=SPC-XXXX` URL 深度連結）**：
  * 當使用者或手機掃描 QR Code 開啟網址 `https://o-o1112.github.io/tool-notebook/?share=SPC-XXXX` 時，系統自動偵測並切換為「訪客瀏覽模式 (Guest View)」。
  * 訪客免註冊、免登入即可在該空間內自由操作沙盒中的所有小工具（如直接用計算機、轉盤、時鐘、筆記）。
  * 自動隱藏刪除、編輯、置頂、重排等管理權限按鈕，確保空間擁有者的工具設定不被竄改。
* **決策結論**：採 **方案 A**，達成 Padlet 最具殺手級的「手機一掃立刻玩」體驗。

---

## 預計實作之四大模組

```
┌─────────────────────────────────────────────────────────────┐
│                      工具小本本 (Tool Notebook)              │
├───────────────────────────────┬─────────────────────────────┤
│ 1. 🗂️ 分欄收納貨架 (Shelf)    │ 2. 🎨 彩色便箋色系 (Card Colors) │
│   - 自訂多欄位分組歸納         │   - 6 款粉嫩手帳紙質底色    │
│   - 跨欄拖曳工具移動           │   - 色調與全局主題完美協調   │
├───────────────────────────────┼─────────────────────────────┤
│ 3. 📱 空間 QR Code 一鍵分享   │ 4. 🧱 緊湊瀑布流 (Masonry Wall) │
│   - 免登入訪客模式 (Guest)    │   - 高度自適應無縫拼接      │
│   - 手機掃碼 / 課堂投影即用   │   - 消除網格多餘落差白邊     │
└───────────────────────────────┴─────────────────────────────┘
```

### 模組 1：🗂️ 分欄收納貨架 (Shelf / Columns 模式)
- 在導覽列版型切換加入 **貨架分欄模式 (Shelf)**。
- 空間支援多個自訂直欄（如：`專注與時間`、`筆記與文字`、`開發輔助`、`娛樂放鬆`）。
- 每個欄位頂部顯示欄位名稱與工具數量，底部有「+ 在此欄新增小工具」快速按鈕。
- 支援在直欄之間跨欄拖曳搬移工具。

### 模組 2：🎨 手帳便箋彩色卡片底色 (Card Accent Colors)
- 每張工具卡片支援自選便箋底色：
  1. `default`: 經典米白原紙色
  2. `peach`: 蜜桃粉 (`#fff4f0`)
  3. `mint`: 薄荷綠 (`#f0f9f6`)
  4. `lemon`: 晨曦黃 (`#fefde8`)
  5. `sky`: 天峰藍 (`#f0f7ff`)
  6. `lavender`: 薰衣紫 (`#f7f2fd`)
- 點擊卡片色票或在編輯對話框即可一鍵變更，增添豐富的手帳拼貼感。

### 3. 📱 空間 QR Code 快速分享與訪客免登入即用
- 導覽列新增「📱 QR Code 分享」按鈕。
- 點擊彈出分享視窗，即時產生指向當前空間的專屬 QR Code 與一鍵複製公開分享連結。
- 支援 `?share=SPC-XXXX` 網址參數，掃碼後免登入直接進入空間工作區，可互動操作小工具，同時自動鎖定管理功能（唯讀）。

### 4. 🧱 緊湊瀑布流排版 (Masonry / Wall 模式)
- 在版型切換加入 **瀑布流模式 (Wall)**。
- 卡片高度不再硬性固定為 510px，小工具（如時鐘、計算機）保持小巧，大工具（Markdown、繪圖板）自然伸展，自動緊湊拼接不留空白間隙。

---

## 檔案異動清單

### 樣式與工具演算法
- `[NEW]` [qrcode.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/utils/qrcode.js)：輕量純前端向量 QR Code 矩陣計算與 SVG 產生器。
- `[MODIFY]` [notebook.css](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/notebook.css)：新增 6 種便箋色系變數、瀑布流 CSS columns 排版樣式、貨架 Shelf 橫向分欄捲軸樣式。

### 前端核心元件
- `[NEW]` [QRCodeModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/QRCodeModal.jsx)：展示 QR Code、分享網址、免登入訪客說明。
- `[MODIFY]` [ToolCard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/ToolCard.jsx)：支援便箋色票切換與色調底色渲染、適應瀑布流高度。
- `[MODIFY]` [SpaceLayout.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceLayout.jsx)：實作 Shelf 分欄模式（支援分組渲染與跨欄移動）、實作 Wall 瀑布流模式。
- `[MODIFY]` [Navbar.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx)：新增 QR Code 按鈕、新增 Shelf 貨架與 Wall 瀑布流切換選項、訪客模式指示。
- `[MODIFY]` [AddToolModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/AddToolModal.jsx) & [EditToolModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/EditToolModal.jsx)：新增色系選擇與所屬欄位選擇。
- `[MODIFY]` [App.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/App.jsx)：支援 URL query `?share=SPC-XXXX` 訪客模式解析、QR Code 彈窗開關、色票與分欄資料管理。

### 測試與文件
- `[NEW]` [padletFeatures.test.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/tests/padletFeatures.test.js)：驗證 QR Code 產出、分欄分組演算法、便箋色系解析。
- `[MODIFY]` [README.md](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/README.md)：更新 Padlet 特色功能介紹。
- `[NEW]` [docs/implementation_plan/padlet_features_plan.md](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/docs/implementation_plan/padlet_features_plan.md)：雙軌歸檔實作計畫。

---

## 驗證計畫

### 自動化測試
```bash
npm test
```
- 新增 `tests/padletFeatures.test.js`，包含：
  1. 向量 QR Code 生成測試（驗證正確產出 SVG 標籤與模組點陣）
  2. 貨架分欄分組與跨欄過濾演算法測試
  3. 卡片色系合法性與預設值回退測試

### 建置與手動功能驗證
1. 執行 `npm run build` 確認 Vite 打包無警告與錯誤。
2. 啟動本機預覽，測試：
   - 切換至 **Shelf 貨架模式**：新增分欄、工具跨欄移動。
   - 切換至 **Wall 瀑布流模式**：卡片緊湊自適應高度堆疊。
   - 切換卡片色彩：套用蜜桃粉、薄荷綠、晨曦黃、天峰藍、薰衣紫。
   - 點擊導覽列「QR Code」：顯示專屬 QR Code，複製連結後以無痕視窗開啟（驗證免登入訪客模式正常操作沙盒工具）。
3. 推送至 GitHub `main`，觸發 GitHub Actions 發布至 GitHub Pages。
