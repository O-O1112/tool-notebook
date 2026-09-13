# 工具小本本：大眾公開可用性架構升級報告

本階段針對「真正可對大眾使用」的目標，落實了全方位的大眾體驗升級與雲端邊緣伺服器加固。

---

## 核心升級項目

### 1. 一鍵體驗帳號與零門檻試用 (Quick Demo Access)
* **大眾無阻力登入**：在登入畫面提供「一鍵以體驗帳號快速進入」按鈕，訪客無須填寫帳號密碼，1 秒內即可自動登入體驗帳號 (`demo`)。
* **資料庫預載示範手帳**：本地 SQLite 與 Cloudflare D1 均具備自動 Seed 機制，為示範帳號預載包含「番茄鐘專注計時器」、「靈感隨手筆記便箋」與「極簡計算機」的實用手帳空間，並生成邀請碼 `SPC-DEMO`，供大眾即時互動試用。

### 2. Cloudflare Worker 邊緣雲端安全加固 (`worker/index.js`)
* **現代 HTTP 安全防護標頭**：在邊緣回應注入 `X-Content-Type-Options: nosniff`、`X-Frame-Options: SAMEORIGIN`、`Referrer-Policy: strict-origin-when-cross-origin`、`Cross-Origin-Opener-Policy: same-origin-allow-popups` 與 `Permissions-Policy`。
* **邊緣滑動視窗速率限制 (Edge Sliding Window Rate Limiter)**：於 Worker 實作基於客戶端 IP (`CF-Connecting-IP` / `X-Forwarded-For`) 的速率限制，防護認證端點 (15 次 / 15 分鐘) 與邀請碼查詢 (30 次 / 1 分鐘)。
* **全面邊界校驗移植**：同步強化註冊與空間/工具 API，限制帳號 (3-50 字元)、密碼 (4-128 字元)、空間名稱 (1-100 字元)、備註 (1000 字元) 與工具內容 (1MB 上限)，防範惡意負載與 CPU 耗竭攻擊。

### 3. PWA (Progressive Web App) 與行動端支援
* **標準設定檔 (`public/manifest.webmanifest`)**：設定應用名稱、主題色彩（溫潤小本本米紙色 `#fbfaf8` 與手帳珊瑚橘 `#e17b62`）、`display: standalone`。
* **高解析度向量圖示 (`public/icon.svg`)**：建立手帳風格之可縮放向量 App Icon，支援各大作業系統遮罩圖示（Maskable Icon）。
* **iOS 與行動瀏覽器加固 (`src/client/index.html`)**：加入 `apple-mobile-web-app-capable`、`apple-mobile-web-app-status-bar-style` 與 `theme-color`。使用者在手機或桌面瀏覽器可一鍵「安裝至主畫面」，享受宛如原生 App 的全螢幕體驗。

### 4. 全域 React 錯誤邊界 (React Error Boundary)
* **優雅錯誤攔截 (`src/client/components/ErrorBoundary.jsx`)**：全域包裹核心應用組件。當任何第三方自訂小程式語法錯誤或執行期例外拋出時，自動攔截並呈現溫暖手帳風格的「小本本遇到了一點狀況」提示卡，並提供「重新整理」與「返回大廳」按鈕，杜絕全站白屏崩潰。

### 5. SEO 與 Open Graph 社群分享預覽
* 在 `src/client/index.html` 補齊 Open Graph 與 Twitter Card 標籤（`og:title`、`og:description`、`og:image`、`twitter:card`），當網址分享至 LINE、Facebook、Discord 或 Slack 時，自動產生精美卡片預覽。

---

## 驗證成果

### 1. 單元與整合測試
執行指令：
```bash
pwd; npm test
```
結果：
* **38 項測試全數通過 (38 passed, 0 failed)**。
* 新增之 `tests/publicReadiness.test.js` 驗證：
  1. 示範帳號 `demo` 密碼雜湊驗證與預載手帳空間存在性通過。
  2. PWA Manifest、向量圖示與 Open Graph 標籤結構通過。

### 2. 生產環境打包建置
執行指令：
```bash
pwd; npm run build
```
結果：
* Vite 6.4.3 正式環境建置完成，成功生成 `dist/` 靜態部署目錄，PWA 設定與圖示全數打包到位。
