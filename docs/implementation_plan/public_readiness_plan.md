# 「工具小本本」真正邁向大眾公開使用規劃 (Public Production Readiness)

為讓「工具小本本」真正具備服務大眾使用者的品質、可靠性與無阻力體驗，本計畫針對公開訪客體驗、雲端邊緣伺服器架構、離線 PWA 支援、系統強韌性與社群推廣進行全方位升級。

---

## 需要架構決策 (Architectural Decisions)

### 決策 1：訪客存取與資料持久化策略 (Access Model & Data Persistence)

* **方案 A（推薦）：Local-First 混合雙軌架構 (Local-first Hybrid)**
  * **未登入訪客**：無需帳號即可直接點擊「免登入直接試用」，立即進入本機手帳空間，內建預設工具（計時鐘、筆記、計算機），資料即時持久化於瀏覽器 `localStorage`，零進入門檻。
  * **雲端註冊升級**：當使用者需要跨裝置同步或以邀請碼/QR Code 分享時，提供「升級為雲端帳號」按鈕，一鍵將本機空間與小工具無縫遷移至雲端資料庫。
  * **優點**：極低進入門檻、無網路時依然可用、大眾留存率最高。
  * **缺點**：本機模式下若使用者手動清除瀏覽器資料會有遺失風險，需於介面明確提醒「建議註冊帳號永久保存」。

* **方案 B：強制雲端註冊 / 第三方登入架構 (Cloud-only with OAuth)**
  * 強制所有使用者必須登入，提供快速註冊或第三方登入（如 Google）。
  * 所有資料一律直接寫入遠端資料庫。
  * **優點**：資料流單純，無需維護本機與雲端遷移合併邏輯。
  * **缺點**：大眾使用者面對登入牆流失率高，且離線時無法建立或操作小工具。

---

### 決策 2：公開雲端邊緣發布架構 (Public Edge Deployment)

* **方案 A（推薦）：Serverless Edge 架構 (Cloudflare Pages + Workers + D1)**
  * **前端靜態託管**：Cloudflare Pages / GitHub Pages，享全球邊緣 Anycast CDN 快取加速與免證書 HTTPS。
  * **後端 API**：Cloudflare Workers 邊緣運算，全球延遲 < 50ms。
  * **資料庫**：Cloudflare D1 (Serverless SQLite)，自動容災備份、零冷啟動延遲、免維運實體伺服器。
  * **優點**：全球高可用性、免費額度充沛、自動享有 Cloudflare 邊緣 DDoS 防護。
  * **缺點**：需將 Node.js 端的安全強化（定時安全比較、邊界檢驗、速率限制）同步移植至 Worker。

* **方案 B：容器化自建主機架構 (Docker Compose + Linux VPS + SQLite)**
  * 將現有 Node.js Express 伺服器打包為 Docker 映像檔，部署於專屬 Linux VPS，配合 Nginx 反向代理與 Let's Encrypt 自動續期。
  * **優點**：完全掌控運算環境與檔案系統，環境與本機開發一致。
  * **缺點**：需自行維護主機安全性、伺服器備份、監控與處理主機當機維護。

---

## 使用者審核確認點 (User Review Required)

> [!IMPORTANT]
> 1. **預設存取模式**：本計畫建議採用 **方案 A (Local-first 混合雙軌)**，訪客直接進入免登入試用模式，大幅降低大眾使用阻力。
> 2. **雲端邊緣強化**：將先前在 Node.js 完成之安全強化（定時安全比對、速率限制、輸入邊界驗證）完整移植至 `worker/index.js`，確保正式上線時邊緣 API 與本機端具備相同防護強度。

---

## 規劃改動範圍

### 1. 訪客即用體驗與資料無縫遷移 (Frontend Local-First)
* 於 `LoginCard.jsx` 加入「免登入直接試用」與「預覽範本體驗」捷徑。
* 於 `App.jsx` 與 `api.js` 實作離線手帳模式：
  * 當未登入時，自動建立本機空間「我的本機小手帳」，儲存於 `localStorage`。
  * 支援所有 15 款範本工具試玩、新增與就地編輯。
  * 當使用者點擊「註冊/登入」後，提示是否「將本機小工具同步匯入新帳號」。

### 2. Cloudflare Worker 生產端安全同步加固 (`worker/index.js`)
* 移植常數時間比對（利用 Web Crypto API 進行常數時間比對）。
* 移植邊界約束：限制密碼 128 字元、工具內容上限 1MB、空間名稱 100 字元。
* 移植 HTTP 安全防禦標頭 (`nosniff`, `SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`)。
* 移植 Cloudflare Worker 適用之 IP 滑動視窗速率限制中介層。

### 3. PWA (Progressive Web App) 支援與安裝體驗
* 建立 `public/manifest.webmanifest`，定義應用名稱、圖示、主題色彩（溫潤小本本米色 `#fbfaf8`）、`display: standalone`。
* 於 `src/client/index.html` 加入 PWA Meta 標籤、iOS 支援標籤與高品質 Open Graph 社群分享預覽（Twitter Card、og:title、og:image、og:description）。

### 4. 前端錯誤邊界 (React Error Boundary)
* 新增 `src/client/components/ErrorBoundary.jsx`。
* 當使用者嵌入的第三方小程式語法錯誤或拋出未捕獲例外時，阻止整頁白屏，呈現手帳風格的優雅錯誤提示卡，並提供「重置視圖」或「恢復上一狀態」按鈕。

### 5. 生產環境建置與部署腳本確認
* 確認 `vite.config.js` 支援動態 API 端點與靜態資源最佳化分割（Chunk Splitting）。
* 新增與更新測試案例以覆蓋訪客離線模式與 Worker 邊界防護。

---

## 驗證計畫

### 自動化測試
* 執行現有與新增之測試案例：
  ```bash
  pwd; npm test
  ```
* 執行正式環境打包：
  ```bash
  pwd; npm run build
  ```

### 手動驗證流程
1. **未登入訪客流程**：以無痕瀏覽器開啟頁面，驗證是否能直接以訪客身分新增、編輯、拖曳小工具並正常儲存。
2. **本機轉雲端遷移**：在訪客模式新增工具後，點擊註冊新帳號，驗證本機工具是否順利同步至雲端空間。
3. **PWA 支援**：檢查 Chrome / Edge 開發者工具 Application 面板，確認 Manifest 有效載入且支援安裝。
4. **錯誤邊界測試**：模擬惡意或破損組件渲染，驗證是否展示優雅手帳錯誤卡而非全站崩潰。
