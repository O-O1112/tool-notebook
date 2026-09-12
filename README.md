# 工具小本本 (Tool Notebook)

> 專為個人與團隊打造的輕量多功能工具嵌入空間，風格源自 [小本本 (class-little-notebook.pages.dev)](https://class-little-notebook.pages.dev/)。

---

## 專案亮點

- **溫潤小本本風格**：支援 4 款精心調配的紙質主題（方眼米紙、深邃夜墨、復古牛皮、簡約素白），28px 方眼格背景與 17px 圓角卡片。
- **✨ 空間維度全面進化**：
  1. 🏛️ **主頁空間大廳 (Space Dashboard)**：主頁展示空間卡片牆，支援關鍵字搜尋、分類過濾（全部/我建立的/他人共享）與一鍵進入；工作區提供「← 返回大廳」與流暢瀏覽器前進/後退。
  2. 🗂️ **分欄收納貨架 (Shelf / Kanban 模式)**：自訂多欄位分組歸納工具，支援跨欄自由拖曳搬移，各欄底部具備專屬「+ 在此欄新增」按鈕。
  3. 🎨 **手帳便箋彩色卡片底色 (Card Pastel Colors)**：每張卡片皆可自選 6 款淡雅便箋色（原色米白、蜜桃粉、薄荷綠、晨曦黃、天峰藍、薰衣紫），隨心打造專屬手帳視覺。
  4. 📱 **一鍵向量 QR Code 與免登入訪客模式 (Guest View)**：支援一鍵產生高清向量 SVG QR Code，手機掃碼免登入即開即用，以安全唯讀沙盒保護空間，課堂投影與會議演示零阻力。
  5. 🧱 **緊湊瀑布流排版 (Masonry / Wall 模式)**：卡片高矮無縫緊湊拼接，自適應消除多餘底部白邊。
- **精選 10 款實用純前端工具範本**：
  1. 🍅 **番茄工作法計時鐘**（25/5分鐘模式與提醒）
  2. 🎡 **幸運命運決策轉盤**（自訂選項與生動指針旋轉）
  3. 📝 **便利貼靈感看板**（多色便箋即時新增與拖動紀錄）
  4. 🎨 **隨手繪圖小白板**（多色畫筆、筆刷粗細、橡皮擦與PNG下載）
  5. 🧮 **經典簡潔計算機**（加減乘除連續運算與歷史紀錄）
  6. 📑 **Markdown 即時筆記**（即時雙欄預覽、粗體、清單、引用與代碼塊）
  7. 🔐 **高強度隨機密碼產生器**（長度調整、大小寫/符號排除混淆與強度評估）
  8. ⚙️ **JSON 格式化與檢驗器**（2格/4格縮排、單行壓縮與語法定位）
  9. 🌐 **世界時區時鐘**（台北、東京、倫敦、紐約即時動態時間走動）
  10. 🔤 **文字統計與編解碼**（字數/字元/行數統計、Base64與URL編解碼）
- **🪟 獨立浮動視窗 (Pop-out)**：任意工具可一鍵彈出至乾淨無干擾的獨立瀏覽器快顯視窗，適合多螢幕或桌面小工具模式。
- **📌 置頂釘選 (Pin to Top)**：支援將常用或關鍵工具一鍵釘選至最上方，在各檢視模式下均優先呈現。
- **🏷️ 自訂標籤與分類篩選 (Tags & Filter)**：支援工具自訂標籤，於搜尋列提供一鍵點擊標籤晶片即時過濾。
- **即貼即用 (Zero-Friction)**：只須將 HTML/JS 原始碼或 `<iframe>` 標籤貼上，即可在同一個空間中並行操作。
- **就地編輯代碼與尺寸**：卡片支援就地更新名稱、標籤、便箋色彩、所屬分欄、尺寸寬度（1x/2x）與代碼內容，並提供即時預覽。
- **空間備份與移轉 (JSON v2.1)**：支援將整套空間工具（含標籤、置頂、色彩與分欄狀態）一鍵匯出為 JSON 備份檔，並可上傳匯入復原。
- **多空間與邀請碼共享**：可建立多個專案空間，並透過「空間邀請碼 (`SPC-XXXX`)」邀請團隊成員加入共享。
- **多元閱讀佈局**：支援「貨架分欄 (Shelf)」、「瀑布流 (Wall)」、「網格並列 (Grid)」、「分頁輪播 (Tabs)」與「折起專注模式 (Collapsed)」。
- **安全沙盒隔離**：嚴格配置 `iframe sandbox`（排除 `allow-same-origin`），防止跨站與 Token 竊取。
- **雲端與邊緣整合**：支援 **GitHub Pages** 靜態託管 + **Cloudflare D1 (Serverless SQLite)** 邊緣資料庫。

---

## 技術棧

- **前端**：React 19 + Vite + TailwindCSS + Lucide Icons
- **後端 (本地)**：Node.js Express + SQLite (Node 22+ 內建 `node:sqlite`)
- **後端 (雲端)**：Cloudflare Workers (Edge Functions) + Cloudflare D1
- **驗證**：Web Crypto HMAC-SHA256 JWT Token + PBKDF2 密碼加密
- **自動化發布**：GitHub Actions (.github/workflows/deploy.yml)

---

## 雲端部署指引 (GitHub Pages + Cloudflare D1)

### 第一步：建立 Cloudflare D1 資料庫並部署 Worker API

1. **登入 Cloudflare**：
   ```bash
   npx wrangler login
   ```

2. **建立 D1 資料庫**：
   ```bash
   npx wrangler d1 create tool-notebook-db
   ```
   終端機將輸出資料庫資訊，例如：
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "tool-notebook-db"
   database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

3. **更新 Worker 設定檔**：
   將上述輸出的 `database_id` 填入 [`worker/wrangler.toml`](./worker/wrangler.toml) 中的 `database_id` 欄位。

4. **初始化 D1 資料庫結構綱要**：
   ```bash
   # 本機測試環境
   npx wrangler d1 execute tool-notebook-db --local --file=./worker/schema.sql

   # 雲端正式環境
   npx wrangler d1 execute tool-notebook-db --remote --file=./worker/schema.sql
   ```

5. **發布 Cloudflare Worker**：
   ```bash
   npm run deploy:worker
   ```
   部署完成後會獲得 Worker API 網址，例如：`https://tool-notebook-api.<your-name>.workers.dev`。

---

### 第二步：發布前端至 GitHub Pages

1. **推動專案代碼至 GitHub 倉庫**：
   ```bash
   git init
   git add .
   git commit -m "feat: init tool notebook with cloudflare d1 and gh-pages"
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. **設定 GitHub Repository Secret (API 網址)**：
   * 前往 GitHub 倉庫的 **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions**。
   * 點擊 **New repository secret**：
     * Name: `VITE_API_BASE`
     * Value: `https://tool-notebook-api.<your-name>.workers.dev/api`（即第一步部署之 Worker 網址）

3. **啟用 GitHub Pages**：
   * 前往倉庫的 **Settings** $\rightarrow$ **Pages**。
   * 在 **Build and deployment** 下方將 **Source** 選為 **GitHub Actions**。
   * 當 Push 代碼至 `main` 分支時，GitHub Actions 會自動建置並發布頁面！

---

## 本地開發

### 1. 安裝套件
```bash
npm install
```

### 2. 本地啟動
```bash
npm run dev
```
瀏覽器開啟 `http://localhost:5173`。

### 3. 執行單元測試
```bash
npm test
```
