# 工具小本本 (Tool Notebook)

> 專為個人與團隊打造的輕量多功能工具嵌入空間，風格源自 [小本本 (class-little-notebook.pages.dev)](https://class-little-notebook.pages.dev/)。

---

## 專案亮點

- **溫潤小本本風格與設計 Token 系統**：支援 4 款精心調配的紙質主題（方眼米紙、深邃夜墨、復古牛皮、簡約素白），全站採用標準化 CSS 變數體系（`--paper`、`--card-bg`、`--ink`、`--muted`、`--coral`、`--line`），六大對話框（彈窗）與卡片組件全面規範化，在深淺主題下保持高雅清晰。
- **空間維度與導覽全面進化**：
  1. **主頁空間大廳 (Space Dashboard)**：展示空間卡片牆，支援關鍵字搜尋、分類過濾（最近使用、由我建立、他人共享、我的最愛、資源回收桶）、空間封存標記與一鍵進入；工作區提供「返回大廳」與流暢瀏覽器歷程導航。
  2. **獨立範本專區 (Template Hub)**：大廳與工作區均設有專屬「範本專區」，支援分類過濾、即時搜尋、獨立沙盒即時試玩預覽、分派至指定空間以及以此範本一鍵新建空間。
  3. **分欄收納貨架 (Shelf / Kanban 模式)**：自訂多欄位分組歸納工具，支援跨欄自由拖曳搬移，各分欄標題支援就地重新命名與分欄刪除保護（內含工具自動歸入一般工具）。
  4. **手帳便箋彩色卡片底色 (Card Pastel Colors)**：每張卡片皆可自選 6 款淡雅便箋色（原色米白、蜜桃粉、薄荷綠、晨曦黃、天峰藍、薰衣紫），隨心打造專屬手帳視覺。
  5. **一鍵向量 QR Code 與免登入訪客模式 (Guest View)**：支援一鍵產生高清向量 SVG QR Code，手機掃碼免登入即開即用，以安全唯讀沙盒保護空間，課堂投影與會議演示零阻力。
  6. **緊湊瀑布流排版 (Masonry / Wall 模式)**：卡片高矮無縫緊湊拼接，自適應消除多餘底部白邊。
  7. **空間封存功能 (Archive Space)**：支援在空間設定中標記封存狀態，卡片展示專屬「已封存」徽章，避免已完成專案或過往學期看板被誤改。
- **精選 15 款純前端小工具範本庫 (完全離線可用)**：
  1. **番茄工作法計時鐘**（25/5分鐘模式與提醒）
  2. **幸運命運決策轉盤**（自訂選項與生動指針旋轉）
  3. **便利貼靈感看板**（多色便箋即時新增與拖動紀錄）
  4. **隨手繪圖小白板**（多色畫筆、筆刷粗細、橡皮擦與PNG下載）
  5. **經典簡潔計算機**（加減乘除連續運算與歷史紀錄）
  6. **Markdown 即時筆記**（即時雙欄預覽、粗體、清單、引用與代碼塊）
  7. **高強度隨機密碼產生器**（長度調整、大小寫/符號排除混淆與強度評估）
  8. **JSON 格式化與檢驗器**（2格/4格縮排、單行壓縮與語法定位）
  9. **世界時區時鐘**（台北、東京、倫敦、紐約即時動態時間走動）
  10. **文字統計與編解碼**（字數/字元/行數統計、Base64與URL編解碼）
  11. **白噪音專注放鬆器**（Web Audio API 即時合成雨聲、海浪、風聲、咖啡廳環境音）
  12. **手帳習慣打卡追蹤器**（週進度圓環與每日連續打卡簽到）
  13. **多功能通用單位換算器**（長度、重量、溫度、面積即時精確互換）
  14. **幸運雙骰與名單抽籤器**（自訂名單隨機抽選與雙骰 3D 動畫擲骰）
  15. **重大紀念日倒數計時卡**（自訂目標日期與天/時/分/秒動態倒數）
- **小工具強大擴充功能**：
  - **建立副本 (Duplicate)**：一鍵複製小工具至當前空間，快速以現有工具為基底微調。
  - **跨空間複製 (Clone to Space)**：支援選擇帳號下任一手帳空間並複製為獨立工具。
  - **單卡匯出 (.tool.json)**：支援將單一小工具及其設定獨立匯出為 JSON 格式。
  - **批次多選管理 (Batch Mode)**：一鍵啟用多選模式，支援批次更換便箋底色、批次移動分欄、批次添加標籤與批次刪除。
  - **增強型專注模式 (Zen Focus Modal)**：支援獨立重新整理、極黑專注底色切換、Esc 快速退出與獨立快顯彈出。
- **獨立浮動視窗 (Pop-out)**：任意工具可一鍵彈出至乾淨無干擾的獨立瀏覽器快顯視窗，適合多螢幕或桌面小工具模式。
- **置頂釘選 (Pin to Top)**：支援將常用或關鍵工具一鍵釘選至最上方，在各檢視模式下均優先呈現。
- **自訂標籤與分類篩選 (Tags & Filter)**：支援工具自訂標籤，於搜尋列提供一鍵點擊標籤晶片即時過濾。
- **即貼即用 (Zero-Friction)**：只須將 HTML/JS 原始碼或 `<iframe>` 標籤貼上，即可在同一個空間中並行操作。
- **就地編輯代碼與尺寸**：卡片支援就地更新名稱、標籤、便箋色彩、所屬分欄、尺寸寬度（1x/2x）與代碼內容，並提供即時預覽。
- **空間備份與移轉 (JSON v2.2)**：支援將整套空間工具（含標籤、置頂、色彩與分欄狀態）一鍵匯出為 JSON 備份檔，並可上傳匯入復原。
- **多空間與邀請碼共享**：可建立多個專案空間，並透過「空間邀請碼 (`SPC-XXXX`)」邀請團隊成員加入共享。
- **多元閱讀佈局**：支援「貨架分欄 (Shelf)」、「瀑布流 (Wall)」、「網格並列 (Grid)」、「分頁輪播 (Tabs)」與「折起專注模式 (Collapsed)」。
- **安全沙盒隔離與快顯防護**：全站卡片嚴格配置 `iframe sandbox`（排除 `allow-same-origin`），獨立快顯外開視窗自動斷開 `window.opener` 並以無同源沙盒包裹，防止惡意指令碼竊取主應用權杖或 localStorage。
- **系統安全深度防護架構**：
  - **定時安全驗證 (Constant-time verification)**：JWT 簽名比對與密碼驗證全面採用 `crypto.timingSafeEqual`，阻斷計時側信道攻擊 (Timing Attacks)。
  - **滑動視窗速率限制 (Sliding-window Rate Limiting)**：自主實作無外部依賴之記憶體速率限制中介層，針對認證登入 (15次/15分)、邀請碼探索 (30次/分) 與全域 API (300次/分) 提供細緻防護。
  - **全方位 HTTP 安全防護標頭 (Security Headers)**：主動注入 `X-Content-Type-Options: nosniff`、`X-Frame-Options: SAMEORIGIN`、`Referrer-Policy`、`Cross-Origin-Opener-Policy` 與 `Permissions-Policy`。
  - **邊界驗證與防 DoS**：限制密碼最大長度 (128 字元) 防範 Scrypt 演算法 CPU 耗竭攻擊，並限制名稱、代碼長度與內容上限。
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
