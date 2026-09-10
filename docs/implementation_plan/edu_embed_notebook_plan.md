# 部署至 GitHub Pages 與串接 Cloudflare D1 架構實作計畫

本階段目標是將前端靜態頁面部署至 **GitHub Pages**，並將資料庫與 API 遷移至 **Cloudflare D1 (Serverless Edge SQLite)**，實現全球 CDN 加速、零伺服器運維與免費高可用架構。

---

## [需要架構決策]

### 1. GitHub Pages 與 Cloudflare D1 整合架構選型

| 評估維度 | 方案 A：GitHub Pages + Cloudflare Worker API 閘道 (推薦) | 方案 B：Cloudflare Pages 全端架構 (對比方案) |
| :--- | :--- | :--- |
| **架構模型** | **前端部署於 GitHub Pages**，後端 API 部署於 **Cloudflare Worker** 並綁定 D1 | 前後端整併於 Cloudflare Pages（Functions + D1） |
| **符合需求** | **100% 完全符合** 使用者要求「上到 GitHub Pages」之指定 | 需將靜態託管轉移至 Cloudflare Pages，不符合 GitHub Pages 要求 |
| **安全性** | **極高**。D1 資料庫存取與 JWT 密鑰封裝在 Worker 邊緣運算中，前端只透過安全 REST API 溝通 | 極高 |
| **部署流程** | 1. GitHub Actions 自動建置前端發布至 GitHub Pages。<br>2. 本機透過 `wrangler d1` 建立資料庫並一鍵部署 Worker。 | 需授權 Cloudflare 存取 GitHub Repo 進行 Pages 建置 |
| **架構建議** | **推薦方案 A**：最精準實現「GitHub Pages 前端 + Cloudflare D1 邊緣資料庫」的解法。 | 若未來希望前端後端統一在同一個 Cloudflare 儀表板，可無痛過渡至方案 B。 |

---

### 2. 邊緣運算框架選型 (Cloudflare Worker API)

- **選型**：採用輕量標準的 **Cloudflare Worker 原生 Fetch 處理器**。
- **密碼與 Token 加密**：
  - Cloudflare Edge 執行環境支援標準 **Web Crypto API** (`crypto.subtle`)。
  - 使用 PBKDF2 / SHA-256 進行密碼加鹽雜湊，並簽發標準 HMAC-SHA256 JWT Token。
- **資料庫綁定 (D1 Binding)**：
  - 在 `wrangler.toml` 中配置 `[[d1_databases]] binding = "DB"`。
  - 透過 `env.DB.prepare(...).bind(...).all()` 進行非同步 SQL 存取。
