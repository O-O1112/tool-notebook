# 實用性跨越升級計畫：萬用嵌入引擎、AI 代寫小工具與高深度專業工具

根據使用者反饋「實用性太低，希望能嵌入大部分工具並支援 AI 代寫，且強化工具本體深度（實質檔案讀寫、本地持久化與專業計算能力）」，本計畫將工具小本本從「靜態卡片展示板」升級為「動態生產力工作站與 AI 創客平台」。

---

## 核心架構決策：AI 代寫小工具整合方案比較

引入 AI 自動生成小工具代碼為核心擴充，需進行架構決策：

| 維度 | 方案 A：純客戶端直連 (Client-side Direct BYOK) | 方案 B：純伺服器端代理 (Server-side Centralized Proxy) | 方案 C：雙軌混合架構 (Hybrid Architecture - 推薦) |
| :--- | :--- | :--- | :--- |
| **架構原理** | 前端設定面板存儲 Gemini / OpenAI API Key（存於本機 `localStorage`），由瀏覽器端直接向 AI 提供商發送請求。 | 前端僅發送需求提示詞至後端 `/api/ai/generate`，由後端讀取伺服器 `.env` 金鑰呼叫 AI。 | **後端提供代理端點（若環境變數配置金鑰則優先使用），前端同時提供個人 API 金鑰設定覆蓋機制。** |
| **隱私與安全** | API Key 僅留存使用者本地瀏覽器，伺服器不經手，零資料外洩風險。 | 金鑰集中於伺服器端，便於統一套用安全防護與速率限制。 | 兼顧伺服器集中託管與個人自備金鑰（BYOK），使用者亦可隨時切換個人免費 Gemini API Key。 |
| **部屬相容性** | 完美支援純靜態（GitHub Pages / Cloudflare Pages）無伺服器環境。 | 必須依賴具備 Node.js / Worker 後端執行環境。 | **雙模通用**：在全靜態環境（如 Pages）退回客戶端直連，在全端伺服器環境走伺服器代理。 |
| **成本與維護** | 伺服器零 Token 費用支出，無被惡意刷量風險。 | 伺服器維護者需承擔所有大眾使用者的 Token 帳單。 | 伺服器可限制配額或關閉公開 proxy，個人填入免費金鑰即可無限使用。 |
| **結論評估** | 適用於開源專案與免伺服器靜態部署。 | 適用於封閉式內部系統。 | **強烈推薦方案 C**：確保本機 Docker、雲端全端與 GitHub Pages 純靜態三端皆具備 100% 可用性。 |

---

## 核心實作階段與模組劃分

### 第一階段：萬用嵌入引擎 (Universal Embedding Engine)
**目標**：徹底消除「目前不支援直接貼上純網址」的限制，支援大部分網頁工具一鍵嵌入與主流平台格式自動轉譯。

1. **主流平台智慧解析與自動轉譯器 (`src/client/utils/embedTransformers.js`)**：
   - **YouTube / Bilibili**：自動將一般影片網址轉換為乾淨無廣告干擾之 `embed` 視訊連結。
   - **Google 協作套件**：自動將 Google Docs、Google Sheets、Google Slides、Google Forms 轉換為 `/preview`、`/pubhtml` 或 `/embeddedform`。
   - **學術與教育工具**：支援 Desmos 繪圖計算機、GeoGebra、Canva、Padlet、Slido 等分享連結轉譯。
   - **開發與設計工具**：支援 Figma、CodePen、JSFiddle、GitHub Gist、Excalidraw 共享畫布一鍵轉譯。
2. **一般網頁智能嵌入與 X-Frame-Options 阻擋防護**：
   - 貼入任意一般網址時，預設自動封裝為具備乾淨全螢幕樣式之安全 `<iframe>`。
   - 建立 `iframe` 載入逾時與錯誤偵測機制：若目標站點因 `X-Frame-Options` 或 CSP 策略禁止嵌入，卡片自動呈現手帳風格 fallback 導引介面（標示禁止內嵌原因，並提供「一鍵獨立彈出視窗（Popout）」與「直接外開連結」按鈕），絕不白屏或破版。

### 第二階段：AI 代寫小工具工作室 (AI Tool Studio)
**目標**：使用者只需用繁體中文描述想要的小工具，AI 即時編寫產出高質感、可互動、具備本地儲存的獨立 HTML5 應用程式。

1. **AI 生成核心引擎與專屬 System Prompt (`src/client/utils/aiGenerator.js`)**：
   - 設計專為手帳小工具最佳化的系統提示詞（規範：單一獨立 HTML5 文件、內建 TailwindCSS/原生 CSS 現代樣式、支援 localStorage 狀態自動記憶、支援實質檔案讀寫、禁用任何外鏈未授權資源、嚴格無表情符號）。
   - 支援 Google Gemini 2.0 / 1.5 API（呼叫介面乾淨、響應極速且免費額度充裕），相容 OpenAI Chat Completion 格式端點。
2. **AI 代寫小工具對話框 (`src/client/components/AIToolModal.jsx`)**：
   - 提供直覺的自然語言輸入框與即時微調功能。
   - 提供 6 款熱門提示詞範本（例如：複利投資計算器、成績統計分佈圖、多段式番茄工作鐘、CSV 格式轉換器等）。
   - 支援即時代碼串流/生成預覽、代碼查看與一鍵修改調整（例如：「請幫我改成深色風格」、「請加入匯出 CSV 按鈕」）。
   - 滿意後「一鍵加入當前空間」。
3. **AI 設定管理（支援自訂 API Key）**：
   - 在空間設定或 AI 生成器中提供 API Key 快速配置（存於本機 `localStorage`，保障隱私）。
   - 後端若有 `.env` 之 `GEMINI_API_KEY`，則無縫提供後端代理轉發。

### 第三階段：高深度專業實用工具升級 (Deep Professional Tools)
**目標**：新增具備「實質檔案讀寫、本地持久化與專業計算能力」的重磅工具範本。

1. **CSV 數據分析與多圖表試算表 (`csv-analyst`)**：
   - 支援本機讀取上傳 CSV / Excel 格式文字。
   - 即時計算欄位平均值、中位數、標準差、最大值與最小值。
   - 動態繪製直方圖、圓餅圖、趨勢線，並支援計算後數據重新匯出 CSV。
2. **Excalidraw 風格手帳現代畫布白板 (`drawing-canvas-pro`)**：
   - 支援多種幾何圖形（矩形、圓形、箭頭、流程線、手繪筆跡、便利貼文字）。
   - 支援畫布狀態本機記憶保存（重新整理不遺失），並支援高解析度 PNG / SVG 匯出下載。
3. **Markdown / LaTeX 專業學術雙欄筆記器 (`academic-notes`)**：
   - 支援 KaTeX 數學公式語法即時排版解析。
   - 支援本機檔案直接載入與 Markdown / HTML 檔案匯出。

---

## 驗證計畫

1. **單元測試驗證 (`tests/embedAndAi.test.js`)**：
   - 測試 YouTube、Google Docs、Desmos、Figma 等主流平台連結轉譯準確性。
   - 測試純網址貼上之自動包裝與容錯回退。
   - 測試 AI 工具代碼驗證器（確保產出之 HTML 符合沙盒安全標準且無表情符號）。
2. **整合測試與建置檢驗**：
   - 執行 `pwd; npm test` 確保所有測試案例 100% 通過。
   - 執行 `pwd; npm run build` 確保客戶端生產環境打包無誤。
3. **雙軌文件交付**：
   - 完成後同步更新 `README.md`、`walkthrough.md` 及 `docs/` 對應目錄。
