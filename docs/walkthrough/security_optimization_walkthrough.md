# 系統安全深度防護優化報告

本次針對全系統的後端認證機制、API 邊界防護、中介層安全標頭、速率限制以及前端自訂程式碼沙盒隔離進行全面性的安全強化。

---

## 核心安全改動清單

### 1. 認證與防側信道攻擊強化
- **常數時間 JWT 簽名比對 (`src/server/middleware/auth.js`)**：
  - 改造 `verifyToken()`，將原有字串直接比對升級為 `crypto.timingSafeEqual`。
  - 對長度不符合或格式異常之簽名進行常數時間比對或安全退出，阻斷以微秒時間差探測簽名有效性的計時側信道攻擊 (Timing Attack)。
- **密碼雜湊防護與例外隔離 (`src/server/db.js`)**：
  - 加固 `verifyPassword()`，在執行 `timingSafeEqual` 之前嚴格驗證緩衝區長度，防範 Buffer 越界拋錯。
  - 加入 try-catch 例外隔離，防止畸形雜湊值引發未捕獲例外使程序崩潰。
- **Scrypt CPU 耗竭防護 (`src/server/routes/auth.js`)**：
  - 嚴格限制密碼長度為 4 至 128 字元，防止惡意用戶提交超長字串（如數十 MB）耗盡 Node.js 事件循環 CPU 資源 (Scrypt ReDoS)。
  - 嚴格校驗帳號名稱長度 (3 至 50 字元) 與字元格式 (`^[a-zA-Z0-9_\u4e00-\u9fa5-]+$`)，防範畸形字串注入。

### 2. 滑動視窗速率限制中介層 (`src/server/middleware/rateLimiter.js`)
- 自主實作高效能、零外部依賴之滑動視窗 (Sliding-Window) 速率限制器。
- 具備記憶體過期清理計時器（每 2 分鐘自動釋放過期客戶端視窗紀錄，避免內存洩漏），計時器啟用 `.unref()` 不干擾行程生命週期。
- 精準支援反向代理 IP 解析 (`X-Forwarded-For`)，並於回應注入標準 HTTP 標頭：
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - 觸發限額時返回 `HTTP 429 Too Many Requests` 與 `Retry-After` 標頭。
- 依業務特性設定分級限制：
  - **認證限制器 (`authLimiter`)**：`/api/auth/register`、`/api/auth/login` 每 15 分鐘限制 15 次請求，防範撞庫與暴力破解。
  - **邀請碼探索限制器 (`inviteLimiter`)**：`/api/spaces/share/:code`、`/api/spaces/join` 每 1 分鐘限制 30 次，阻斷空間代碼掃描探測。
  - **通用 API 限制器 (`apiLimiter`)**：全域 `/api` 每 1 分鐘限制 300 次，防禦惡意爬蟲或濫用。

### 3. HTTP 現代安全防禦標頭 (`src/server/middleware/securityHeaders.js`)
- 在全域中介層鏈頂層掛載安全標頭：
  - `X-Content-Type-Options: nosniff`：禁止瀏覽器推斷 MIME 類型，防範惡意腳本偽裝。
  - `X-Frame-Options: SAMEORIGIN`：限制主站介面僅允許同源嵌入，防禦點擊劫持 (Clickjacking)。
  - `X-XSS-Protection: 0`：遵循現代 Web 標準，停用不安全的舊版反射型 XSS 稽核器。
  - `Referrer-Policy: strict-origin-when-cross-origin`：跨來源請求時僅傳送源網址，保護內部路徑。
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`：禁用不必要的敏感硬體呼叫權限。
  - `Cross-Origin-Opener-Policy: same-origin-allow-popups`：防範跨來源視窗物件洩漏。
  - 移除 `X-Powered-By` 標頭以隱匿 Express 伺服器指紋。

### 4. 空間與小工具 API 邊界驗證 (`src/server/routes/spaces.js`)
- 針對 `POST /api/spaces`、`PATCH /api/spaces/:id`、`POST /api/spaces/:id/tools`、`PATCH /api/spaces/:id/tools/:toolId` 實施嚴格約束：
  - 空間名稱：1 至 100 字元。
  - 空間備註描述：上限 1000 字元。
  - 排版版型：白名單限制 (`grid`, `shelf`, `wall`, `tabs`, `collapsed`)。
  - 工具名稱：1 至 100 字元。
  - 工具內容：限制 1MB 上限，防範超大文字內容造成資料庫與記憶體負擔。
  - 工具類型：白名單限制 (`html`, `iframe`, `url`)。
  - 卡片跨欄寬度：限制僅允許 1 或 2。

### 5. 前端獨立快顯視窗雙層沙盒與防護 (`ToolCard.jsx`, `SpaceLayout.jsx`, `codeParser.js`)
- **斷開 Opener 鏈結**：快顯外開視窗呼叫 `w.opener = null`，阻斷惡意程式碼透過 `window.opener` 逆向存取主應用頁面物件。
- **無同源沙盒隔離 (Double-Sandbox)**：
  - 獨立快顯視窗內透過中介 HTML 容器渲染獨立 `iframe`，並設定 `sandbox="allow-scripts allow-forms allow-modals allow-popups"`（排除 `allow-same-origin`）。
  - 使用者自訂或嵌入的腳本執行於完全不透明源 (`null`)，無法讀取主站之 `localStorage`、`sessionStorage`、Cookie 或認證 Token。
- **防禦 Base 標籤劫持**：
  - 在包裹之 HTML 文件中自動注入 `<base href="about:blank">` 與 `<meta name="referrer" content="no-referrer">`，防止外部代碼藉由相對路徑污染或洩漏參照。

---

## 驗證結果

### 1. 單元與整合測試
執行測試指令：
```bash
pwd; npm test
```
結果：
- **36 項測試全數通過 (36 passed, 0 failed)**。
- 新增之 `tests/security.test.js` 驗證項目：
  1. JWT 定時安全驗證與防竄改機制通過。
  2. 密碼安全性、異常長度阻斷與邊界保護通過。
  3. 滑動視窗速率限制中介層限額與 HTTP 429 Retry-After 機制通過。
  4. HTTP 安全防禦標頭正確注入通過。
  5. 程式碼解析器注入基礎防護標籤通過。

### 2. 生產環境建置
執行建置指令：
```bash
pwd; npm run build
```
結果：
- Vite 6.4.3 正式環境建置成功，無編譯錯誤與相依性警告。
