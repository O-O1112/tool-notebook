# 系統安全深度防護與最佳化計畫

本計畫針對「工具小本本」系統進行全方位的安全防護升級，涵蓋後端 API 防禦、身分驗證防護、速率限制、輸入約束、安全標頭，以及前端沙盒隔離強化。全篇依循使用者規範，嚴格禁用任何表情符號。

---

## 使用者審查項目 (User Review Required)

> [!IMPORTANT]
> - **API 速率限制 (Rate Limiting)**：將於後端引入無第三方依賴的高效記憶體滑動窗口計數器。針對 `/api/auth/login` 與 `/api/auth/register` 設定每 15 分鐘最多 15 次嘗試，防止暴力破解與字典攻擊；針對 `/api/spaces/share/:code` 與 `/api/spaces/join` 設定每分鐘 30 次，防止空間邀請碼枚舉攻擊。
> - **獨立外開視窗 (Pop-out) 沙盒隔離修復**：目前小工具外開獨立浮動視窗時，是直接於同源視窗寫入使用者自訂代碼，惡意代碼可能透過 `window.opener` 存取主站 `localStorage` 竊取 Token。本次修復將切斷 `opener` 關聯並強制在外開視窗中以 `iframe sandbox` 包裹執行，達成完全同等於主站卡片的跨站防護。

---

## 預計異動項目

### 後端安全中介層與防護 (Backend Security Layer)

#### [NEW] `src/server/middleware/rateLimiter.js`
- 建立記憶體滑動窗口速率限制器：
  - `authLimiter`: 限制登入與註冊（每 15 分鐘 15 次，超量回傳 HTTP 429）。
  - `inviteLimiter`: 限制公開邀請碼解析與加入（每分鐘 30 次）。
  - `apiLimiter`: 全域一般 API 防護（每分鐘 300 次）。
  - 支援自動過期清理機制，不造成記憶體洩漏。

#### [NEW] `src/server/middleware/securityHeaders.js`
- 建立符合現代 Web 標準的安全 HTTP 標頭中介軟體：
  - `X-Content-Type-Options: nosniff`（防止 MIME 嗅探攻擊）
  - `X-Frame-Options: SAMEORIGIN`（防止主應用程式遭受外部 Clickjacking 點擊劫持）
  - `X-XSS-Protection: 0`（現代瀏覽器規範，避免舊式 XSS 稽核器被繞過）
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), camera=(), microphone=()`

#### [MODIFY] [auth.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/middleware/auth.js)
- 將 JWT 簽名比對改用 `crypto.timingSafeEqual` 常數時間比較，防止 HMAC 時序側信道攻擊（Timing Attack）。

#### [MODIFY] [db.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/db.js)
- 強化 `verifyPassword` 函式：在執行 `timingSafeEqual` 前進行 Buffer 長度校驗與 try-catch 保護，防止異常長度拋出未捕捉錯誤。

#### [MODIFY] [index.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/index.js)
- 掛載 `securityHeaders` 中介層。
- 限制 CORS 允許之 HTTP 方法（`GET, POST, PATCH, DELETE, OPTIONS`）與必要標頭。
- 掛載 `apiLimiter` 全域限流。

#### [MODIFY] [auth.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/routes/auth.js)
- 掛載 `authLimiter` 於 `/login` 與 `/register`。
- 加入嚴格長度限制：密碼上限 128 字元（防範 Scrypt 演算法遭巨大字串阻斷 DoS）、帳號限制 3-50 字元並過濾危險字元。

#### [MODIFY] [spaces.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/routes/spaces.js)
- 掛載 `inviteLimiter` 於 `/share/:code` 與 `/join`。
- 加入空間名稱（上限 100 字元）、空間描述（上限 1000 字元）、小工具名稱（上限 100 字元）、小工具內容（上限 1MB）與小工具寬度（限制為 1 或 2）的嚴格邊界驗證。

---

### 前端沙盒與隔離防護 (Frontend Sandbox & Isolation)

#### [MODIFY] [ToolCard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/ToolCard.jsx)
- 重構 `handlePopout`：
  - 開啟新視窗時設置 `w.opener = null`，切斷同源與 opener 關聯。
  - 外開視窗以安全 HTML 殼層封裝，內部使用具備 `sandbox="allow-scripts allow-forms allow-modals allow-popups"` 的 `iframe` 承載程式碼，完全杜絕未經授權存取主站 `localStorage` 或 Token 的風險。

#### [MODIFY] [SpaceLayout.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceLayout.jsx)
- 同步重構折起模式與專注模式中的外開彈窗邏輯，確保一致的安全沙盒隔離。

#### [MODIFY] [codeParser.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/utils/codeParser.js)
- 在包裹使用者自訂 HTML 片段時，預設注入 `<base href="about:blank">` 與基本防護 Meta，防止惡意注入變更基準 URL。

---

## 驗證計畫

### 自動化測試
- 新增 `tests/security.test.js`：
  1. 測試常數時間 JWT 簽名驗證（防篡改與時序防護）。
  2. 測試密碼長度上限與 Scrypt DoS 防護。
  3. 測試 Rate Limiting：連續請求觸發 HTTP 429 限制。
  4. 測試安全 HTTP 標頭是否存在（`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`）。
  5. 測試異常長度輸入與非法參數防護。
- 執行指令：
  ```bash
  pwd
  npm test
  npm run build
  ```

### 手動驗證
- 驗證外開彈窗中的自訂程式碼無法讀取父視窗之 `localStorage.getItem('class_notebook_token')`。
- 驗證頻繁連續登入失敗時觸發安全冷卻提示。
