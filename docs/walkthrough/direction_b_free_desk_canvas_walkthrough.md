# 方向 B：自由書桌拼貼畫布（Free-Desk Canvas）變更紀錄

## 實作內容摘要

1. **純函式幾何與持久化引擎**
   - [src/client/utils/canvasLayout.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/utils/canvasLayout.js)
     - 實作 `snapValue`（28px 方格吸附，對應 `.notebook-grid-bg`）、`clampCardRect`（限制寬度 `280–1176px`、高度 `224–896px`）、`ensureCanvasMap`（保留既有座標並為新增小工具自動搜尋不重疊空位）、`bringCardToFront`（點擊或拖曳帶到最上層，並在 Z 軸過高時正規化）、`tidyCanvasLayout`（一鍵整齊排列）、`computeCanvasBounds` 及 `loadCanvasMap` / `saveCanvasMap`（透過 `localStorage` 鍵 `notebook_canvas_<spaceId>` 儲存，不破壞既有 SQLite / Cloudflare D1 資料表）。

2. **自由書桌畫布元件與互動防護**
   - [src/client/components/FreeCanvasBoard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/FreeCanvasBoard.jsx) & [src/client/notebook.css](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/notebook.css)
     - 支援按住標題列自由拖曳卡片、`right` / `bottom` / `bottom-right` 三向縮放並顯示即時 `W × H` 尺寸提示。
     - 拖曳與縮放期間在所有小工具 `SandboxedFrame` 上層覆蓋全局透明防護罩（Pointer Shield），避免內嵌 iframe 攔截滑鼠指標事件。
     - 雙擊標題列或點擊捲起按鈕可將卡片收合為 `56px` 精簡條（保留原尺寸與座標），點擊任一卡片自動浮至最前。
     - 書桌底部浮動停靠列（Desk Dock）集中提供 `+ 新增工具`、`格線吸附` 開關、`一鍵整齊`、畫布縮放（`100% / 75%`）與 `篩選` 列展開控制；`< 768px` 行動裝置自動降級為直向堆疊小卡。

3. **工作區、導覽與前後端整合**
   - 後端與 Edge Worker：`validLayouts` 納入 `'canvas'`（[src/server/routes/spaces.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/routes/spaces.js)、[worker/index.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/worker/index.js)）。
   - 前端介面整合：[SpaceLayout.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceLayout.jsx)（在 `canvas` 模式預設隱藏次要頂部篩選列）、[Navbar.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx)、[CreateSpaceModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/CreateSpaceModal.jsx)、[SpaceSettingsModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceSettingsModal.jsx)、[CommandPalette.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/CommandPalette.jsx)、[SpaceDashboard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceDashboard.jsx)、[App.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/App.jsx) 及 [README.md](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/README.md)。

4. **自動化測試**
   - 新增 [tests/canvasLayout.test.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/tests/canvasLayout.test.js) 並更新 [tests/themeAndSettings.test.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/tests/themeAndSettings.test.js)。

## 驗證結果
- `npm test`：共 **51** 項測試全數通過（`51 pass, 0 fail, 0 skipped`），涵蓋 6 個 `canvasLayout` 單元測試與 `POST/PATCH /api/spaces` `'canvas'` 版型驗證測試。
- `npm run build`：`vite build` 建置成功（`1944 modules transformed`，產出 `dist/index.html`、`dist/assets/index-PYJltqU9.css` 與 `dist/assets/index-C751qxIZ.js`）。
- 未執行雲端 `wrangler deploy`，本地 Node/Express API 與前端打包已完成驗證。
