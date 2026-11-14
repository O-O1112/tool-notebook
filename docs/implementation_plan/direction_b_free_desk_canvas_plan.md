# 方向 B：自由書桌拼貼畫布（Free-Desk Canvas）實作計畫

## 目標摘要
將 **工具小本本 (`edu-embed-space`)** 從傳統死板的欄框與管理後台工具列，升級為具備實體文具桌觸感的 **「自由書桌拼貼畫布 (`canvas`)」** 版型：
- 卡片可直接於 `28px` 格紋方格紙上自由拖曳擺放與調寬高。
- 拖曳與縮放過程啟用 `iframe` 指標遮罩（Pointer Shield），避免內嵌網頁吞掉滑鼠事件。
- 維持 **Zero Breaking Changes** 與既有 Cloudflare D1 / SQLite 資料表相容性：`spaces.layout` 擴充支援 `'canvas'`；卡片座標 `{ x, y, w, h, z, collapsed }` 採與既有的 `notebook_colors_*`、`notebook_pinned_*` 一致之 `localStorage` (`notebook_canvas_<spaceId>`) 儲存策略，達成 60fps 零延遲拖拉儲存。
- `canvas` 模式下精簡頂部冗餘管理按鈕，改為書桌底部浮動停靠列（Desk Dock：`+ 新增工具`、`28px 格線吸附`、`一鍵整齊排列`、`縮放切換`、`顯示篩選`）。

## 變更檔案清單

### 1. 後端與 Cloudflare Worker 排版白名單
- [src/server/routes/spaces.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/routes/spaces.js)：`POST /api/spaces` 與 `PATCH /api/spaces/:id` 之 `validLayouts` 納入 `'canvas'`。
- [worker/index.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/worker/index.js)：Edge Worker 同步納入 `'canvas'`。

### 2. 純函式幾何引擎與儲存層
- `src/client/utils/canvasLayout.js`：
  - `snapValue`（`28px` 方格對齊）
  - `clampCardRect`（尺寸上下限：寬 `280–1176px`、高 `224–896px`）
  - `ensureCanvasMap`（已存在座標保留、新增工具自動尋找不重疊空位）
  - `bringCardToFront`（點擊／拖曳置頂與 `z` 索引正規化）
  - `tidyCanvasLayout`（一鍵整齊排列）
  - `computeCanvasBounds`（動態畫布延伸範圍）
  - `loadCanvasMap` / `saveCanvasMap`（依 `spaceId` 讀寫 `localStorage`）

### 3. 前端書桌畫布元件與系統整合
- `src/client/components/FreeCanvasBoard.jsx`：
  - 桌機版（`>= 768px`）：Pointer Events 拖曳標題列移動、右／下／右下角三向自由調整大小並顯示即時尺寸徽章、雙擊標題列捲起／展開卡片、點擊卡片浮至最前、紙膠帶飾條與便箋粉彩色票、拖曳中啟用全局 `iframe` 透明遮罩層防止搶焦點。
  - 書桌浮動停靠列（Desk Dock）：`+ 新增工具`、`格線吸附`開關、`一鍵整齊排列`、`縮放 100% / 75%`、`篩選列收合`。
  - 行動版（`< 768px`）：自動降級為直向舒適堆疊小卡，保留展開/捲起與全部功能。
- [src/client/components/SpaceLayout.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceLayout.jsx)：整合 `layout === 'canvas'` 渲染 `FreeCanvasBoard`，並在 `canvas` 模式下預設折疊次要搜尋篩選條以維持安靜書桌視覺。
- [src/client/components/Navbar.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx)、[CreateSpaceModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/CreateSpaceModal.jsx)、[SpaceSettingsModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceSettingsModal.jsx)、[CommandPalette.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/CommandPalette.jsx)、[SpaceDashboard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceDashboard.jsx)：補充 `'canvas'`（自由書桌）切換選項與中文標籤。
- [src/client/App.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/App.jsx)：傳遞 `spaceId` 給 `SpaceLayout`。
- [src/client/notebook.css](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/notebook.css)：補充自由畫布浮動停靠列、縮放把手與捲起狀態輔助樣式。

### 4. 測試與文件同步
- [tests/themeAndSettings.test.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/tests/themeAndSettings.test.js)：更新 `supportedLayouts` 包含 `'canvas'`（共 6 種版型）。
- `tests/canvasLayout.test.js`：測試格線吸附、邊界夾緊、不重疊自動補位、Z 軸置頂正規化、一鍵整齊排列與 `/spaces` `'canvas'` 版型驗證。
- 更新 [README.md](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/README.md) 與 Walkthrough 雙軌歸檔。

## 驗證標準
1. `npm test` 全數通過，無錯誤或略過。
2. `npm run build` 建置成功無警告或錯誤。
3. 程式碼與介面維持 100% 繁體中文（台灣），無 emoji 混入。
