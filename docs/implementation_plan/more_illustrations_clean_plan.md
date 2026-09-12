# 手帳風全站手繪飾紋精緻擴充計畫（高質感、不雜亂）

依據使用者需求「**還要更多，但是不會亂**」，在維持現有版面清爽俐落、排版層次分明與零互動干擾的最高原則下，針對系統各關鍵接觸點進行深度「手帳文具微型飾紋（Micro-Doodles & Embellishments）」擴充。

---

## 🎯 設計準則：如何做到「圖更多」卻「絕對不雜亂」？

1. **背景化與浮水印低對比度（Atmospheric Contrast）**：
   - 擴充的飾紋皆採純向量 SVG 細線稿（`strokeWidth: 1.2~1.4`），預設透明度維持在 `opacity-20` 至 `opacity-40`（深色模式 `opacity-15` 至 `opacity-30`）。
   - 與主內容呈現明確的前後視覺景深，扮演「紙質底紋、頁緣圖章、邊角封蠟」的角色，完全不搶奪核心操作注意力。
2. **零版面位移與零點擊干擾（Zero Layout Shift & Non-blocking）**：
   - 所有裝飾元件一律採用 `absolute` 搭配 `pointer-events-none` 佈局於現有的留白區域（負空間），既不擠壓輸入框與按鈕，也不會阻礙點擊選取。
3. **語意呼應的手帳文具隱喻（Stationery Metaphor）**：
   - **釘選卡片**：加入「和紙膠帶封條飾紋（Washi Tape）」，真實重現手帳貼牢便箋的質感。
   - **QR Code 分享**：加入「航空郵票信箋波浪郵戳（Airmail Postmark）」，如同寄出邀請明信片。
   - **邀請碼加入空間**：加入「復古黃銅鑰匙與鎖孔圖章（Vintage Key & Lock）」。
   - **建立空間彈窗**：加入「設計繪圖圓規與方格藍圖稿（Drafting Notebook）」。
   - **新增小工具彈窗**：加入「手作創客文具台（Crafting Studio Desk）」。
   - **空間內工具區頂部**：加入「頁首文具小物浮水印（Desk Stationery Vignette）」。
   - **大廳側邊欄使用者名片**：加入「手帳專屬封蠟印章（Wax Seal Stamp）」。

---

## 📋 預計變更元件與檔案清單

### 1. [`src/client/components/Illustrations.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Illustrations.jsx) [MODIFY]
新增專屬精巧飾紋組件：
- `WashiTapePinDoodle`：置頂卡片專屬手繪和紙膠帶（帶有微撕裂鋸齒邊緣與溫暖半透明斜紋/小圓點）。
- `AirmailStampDoodle`：波浪郵戳、航空郵票外框與郵件愛心信章。
- `VintageKeyDoodle`：復古金屬鑰匙、齒痕紋路與星塵火花。
- `DraftingNotebookDoodle`：方格藍圖紙、繪圖直尺與鉛筆。
- `CraftStudioDoodle`：創客工具台、刻刀、量尺與代碼標籤紙。
- `SpaceStationeryBannerDoodle`：橫向排列的回紋針、紙膠帶、沾水筆尖與墨水瓶。
- `WaxSealDoodle`：經典手帳歐風封蠟火漆印章。

### 2. [`src/client/components/ToolCard.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/ToolCard.jsx) [MODIFY]
- 當卡片為置頂狀態（`tool.isPinned`）時，在卡片頂部中線微凸處渲染 `<WashiTapePinDoodle />`，讓置頂便箋呈現和紙膠帶黏貼於手帳上的立體觸感。

### 3. [`src/client/components/QRCodeModal.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/QRCodeModal.jsx) [MODIFY]
- 在 QR Code 預覽卡片的右上角落置入 `<AirmailStampDoodle />`，將單純的黑白條碼轉化為帶有手寫明信片溫度的航空信件。

### 4. [`src/client/components/JoinSpaceModal.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/JoinSpaceModal.jsx) [MODIFY]
- 在輸入空間邀請碼彈窗的右上角負空間置入 `<VintageKeyDoodle />`，呼應通關密碼的意象。

### 5. [`src/client/components/CreateSpaceModal.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/CreateSpaceModal.jsx) [MODIFY]
- 在建立空間彈窗頂部邊角置入 `<DraftingNotebookDoodle />`，象徵規劃新主題看板的藍圖草稿。

### 6. [`src/client/components/AddToolModal.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/AddToolModal.jsx) [MODIFY]
- 在新增工具彈窗的頂部標題列旁置入 `<CraftStudioDoodle />`，增添工具創作工作室的精緻感。

### 7. [`src/client/components/SpaceLayout.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceLayout.jsx) [MODIFY]
- 在空間內部頂部搜尋/標籤篩選列右側邊緣，置入低彩度透明度 `<SpaceStationeryBannerDoodle />`，營造沉浸式書桌氛圍。

### 8. [`src/client/components/SpaceDashboard.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceDashboard.jsx) [MODIFY]
- 在側邊欄使用者名片（`您好，{displayName}`）右側角落置入精緻的 `<WaxSealDoodle />`，營造個人專屬手帳日誌印章。

---

## 🧪 驗證計畫

1. **視覺層次驗證**：
   - 確保所有文字、輸入框、按鈕皆不受任何插圖遮擋或影響對比度。
   - 確保深色模式（Dark mode）下飾紋依然呈現雅緻低彩度暗墨灰調，不刺眼。
   - 確保行動裝置（RWD）螢幕縮小時飾紋自動隱藏或等比縮放，不引發橫向捲軸。
2. **自動化單元測試**：
   - 執行 `npm test`，確保既有 26 項單元測試 100% 通過。
3. **生產環境建置**：
   - 執行 `npm run build`，驗證 Vite 模組打包與 SVG 語法 0 錯誤。
4. **雙軌文件同步與 Git 推送**：
   - 同步更新 `docs/walkthrough/` 與系統 Artifacts。
   - 提交並推送至 GitHub `main` 分支。
