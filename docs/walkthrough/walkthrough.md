# 工具小本本 (Tool Notebook) - GitHub Pages 與 Cloudflare D1 整合成果報告

本專案已完成針對 **GitHub Pages** 靜態頁面託管與 **Cloudflare D1 (Serverless SQLite)** 邊緣資料庫之架構對接與配置。

---

## 一、完成成果清單

### 1. GitHub Pages 相容性配置
- **相對路徑適配 (`vite.config.js`)**：
  - 設定 `base: './'`，編譯產出的 `dist/index.html` 資源引用均為 `./assets/...` 相對路徑，解決 GitHub Pages 任何子目錄部署下的資源 404 問題。
- **動態 API 端點 (`src/client/utils/api.js`)**：
  - 支援讀取 `VITE_API_BASE` 環境變數。本地開發指向 `/api`，正式環境指向 Cloudflare Worker 網址。
- **自動化發布工作流 (`.github/workflows/deploy.yml`)**：
  - 配置標準 GitHub Actions 官方 Pages 部署流程，支援自動抓取 `secrets.VITE_API_BASE` 進行編譯與上傳發布。

### 2. Cloudflare D1 與 Worker 邊緣架構 (`worker/`)
- **D1 資料庫綱要 (`worker/schema.sql`)**：
  - 完整支援 `users`, `spaces`, `tools`, `space_members` 與 `invite_code` 索引，專為 Cloudflare D1 邊緣 SQLite 設計。
- **Worker API 閘道 (`worker/index.js`)**：
  - 採用無伺服器架構，使用原生 Web Crypto API (`crypto.subtle`) 實現 PBKDF2 密碼加密與 HMAC-SHA256 JWT Token 簽發。
  - 直接綁定 `env.DB`，完整提供註冊、登入、示範帳號、空間管理、`SPC-` 邀請碼加入、工具拖曳重排與刪除等完整 API。
  - 完整支援 CORS 跨網域請求處理。
- **Wrangler 部署配置 (`worker/wrangler.toml`)**：
  - 配置 D1 綁定參數與 Worker 部署腳本（`npm run deploy:worker`）。

---

## 二、檔案異動清單

| 模組 | 檔案路徑 | 說明 |
| :--- | :--- | :--- |
| **工作流** | `.github/workflows/deploy.yml` | GitHub Actions 自動編譯與發布至 GitHub Pages |
| **Worker 配置** | `worker/wrangler.toml` | Cloudflare Worker 與 D1 綁定宣告 |
| **D1 綱要** | `worker/schema.sql` | Cloudflare D1 建表與索引腳本 |
| **Worker 核心** | `worker/index.js` | Cloudflare D1 API 邊緣處理器 (支援 Web Crypto) |
| **前端配置** | `vite.config.js` | 加入 `base: './'` 支援相對路徑資產 |
| **前端 API** | `src/client/utils/api.js` | 支援 `VITE_API_BASE` 環境變數動態端點 |
| **專案腳本** | `package.json` | 新增 `deploy:worker` 腳本 |
| **操作手冊** | `README.md` | 撰寫 GitHub Pages 與 Cloudflare D1 完整步驟指南 |

---

## 三、驗證結果

### 1. 單元與整合測試 (`npm test`)
- 11 項測試全數通過（含密碼雜湊、JWT 驗證、格式智慧解析、`SPC-` 空間邀請碼、工具拖曳排序與 E2E 端到端流程）。

### 2. 生產環境打包驗證 (`npm run build`)
- 產出 `dist/index.html` 檢查通過：
  - `<script src="./assets/index-D2eKbwz3.js">`
  - `<link rel="stylesheet" href="./assets/index-DjqSWiXy.css">`
- 驗證完全支援 GitHub Pages 任意倉庫路徑。
