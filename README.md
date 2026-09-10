# 工具小本本 (Tool Notebook)

> 專為個人與團隊打造的輕量多功能工具嵌入空間，風格源自 [小本本 (class-little-notebook.pages.dev)](https://class-little-notebook.pages.dev/)。

---

## 專案亮點

- **溫潤小本本風格**：米白紙質方眼格紋背景（28px grid）、深墨水沉著字體、溫暖珊瑚橘重點色與 17px 圓角卡片。
- **即貼即用 (Zero-Friction)**：只須將 HTML/JS 原始碼、`<iframe>` 標籤或外部工具網址貼上，即可在同一個空間中並行操作。
- **統一帳號體系**：純粹的帳號密碼登入，無身分限制，支援一鍵示範登入體驗。
- **多空間與邀請碼共享**：可建立多個專案空間，並透過「空間邀請碼 (`SPC-XXXX`)」邀請團隊成員加入共享。
- **折起專注模式**：支援「網格並列」、「分頁切換」與「折起專注模式（全部只顯示名稱，點開就放大）」。
- **靈活操作**：支援卡片拖曳排序與寬度自訂（1x 標準、2x 加寬跨欄）。
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
