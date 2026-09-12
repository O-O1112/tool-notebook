# 工具小本本 (Tool Notebook) - 第二階段進階功能擴充成果報告

專案已順利完成「第二階段進階實用功能擴充」，通過 13 項端對端與單元自動化測試，完成生產環境前端構建，並更新相關文檔。

---

## 🌐 線上服務資訊

| 服務項目 | 連結 / 識別碼 | 狀態 | 說明 |
| :--- | :--- | :--- | :--- |
| **GitHub 頁面 (Pages)** | [https://o-o1112.github.io/tool-notebook/](https://o-o1112.github.io/tool-notebook/) | 🟢 正常上線 (HTTP 200) | 具備 4 款紙質主題、獨立浮動視窗、標籤篩選與置頂釘選 |
| **GitHub 專案倉庫** | [https://github.com/O-O1112/tool-notebook](https://github.com/O-O1112/tool-notebook) | 🟢 程式碼已同步 (main) | 包含完整工作流、設定檔與規範文檔 |
| **Cloudflare Worker API** | [https://tool-notebook-api.blockengine.workers.dev](https://tool-notebook-api.blockengine.workers.dev) | 🟢 正常運行 (已驗證) | 提供無伺服器邊緣 API 與 JWT 驗證 |
| **Cloudflare D1 資料庫** | `tool-notebook-db` (`c3d89f73-e03b-4ebf-ad16-366f8579eaef`) | 🟢 邊緣 SQLite 存儲 | 儲存使用者帳號、空間、成員與工具資訊 |

---

## 一、新增與擴充之五大進階功能

### 1. 🧰 擴充至 10 款高品質實用純前端工具範本 (`toolTemplates.js`)
除了原本的 5 款工具外，新增 5 款專為日常生產力與開發輔助設計的高頻工具：
- 🍅 **番茄工作法計時鐘**：25/5 分鐘工作小憩循環，計數與鈴聲提醒。
- 🎡 **幸運命運決策轉盤**：自訂轉盤項目，生動指針動態抽籤。
- 📌 **便利貼靈感看板**：多色便箋打字即時儲存於 `localStorage`。
- 🎨 **隨手繪圖小白板**：四色畫筆、筆刷粗細調整與畫布清除。
- 🧮 **經典簡潔計算機**：標準加減乘除連續算式運算與歷史記錄。
- 📑 **Markdown 即時筆記**（*新增*）：即時雙欄預覽，支援標題、粗斜體、引用、清單、表格與代碼區塊，附一鍵複製 HTML。
- 🔐 **高強度隨機密碼產生器**（*新增*）：自訂 6~32 字元長度、大小寫/數字/特殊符號勾選、排除混淆字元、密碼強度實時指示器與一鍵複製。
- ⚙️ **JSON 格式化與檢驗器**（*新增*）：JSON 語法驗證、2格/4格縮排美化排版、單行壓縮（Minify）、語法錯誤精確定位。
- 🌐 **世界時區時鐘**（*新增*）：台北/香港 (UTC+8)、東京 (UTC+9)、倫敦 (UTC+0/1)、紐約 (UTC-5/4) 動態時間走動、時差與日期展示。
- 🔤 **文字統計與編解碼**（*新增*）：字數/總字元/不含空格字元/行數即時統計，提供 Base64 編解碼、URL 編解碼、大小寫一鍵轉換。

### 2. 🪟 獨立浮動快顯視窗 (Pop-out Detached Window)
- 在每張卡片頂部控制列及折起模式中新增 **`ExternalLink` (獨立視窗)** 按鈕。
- 點擊後透過乾淨的瀏覽器原生彈出視窗（`840x620`）獨立展示工具，去除所有邊框干擾。
- 極適合擺放在第二螢幕、桌面邊緣作為常駐輔助工具（例如：世界時鐘、番茄鐘、計算機）。

### 3. 🌓 四款手帳紙質主題切換 (Paper Themes)
- 於頂部導覽列新增調色盤圖示按鈕，提供 4 款精心設計的風格主題：
  1. 🌾 **方眼米紙 (Warm Grid)**：預設手帳風格，溫潤米白與 28px 方眼格。
  2. 🌌 **深邃夜墨 (Night Ink)**：暗色護眼模式，低藍光深藍墨底搭配柔和線條。
  3. 📜 **復古牛皮 (Vintage Kraft)**：文青手作紙質風格，溫厚大地色調。
  4. ⚪ **簡約素白 (Clean Minimal)**：極簡純淨模式，純白紙張搭配俐落線條。
- 主題切換透過 CSS 變數全域作用至背景、卡片、按鈕、輸入框與彈窗，並持久化保存於 `localStorage`。

### 4. 📌 工具置頂釘選 (Pin to Top)
- 每張工具卡片及折起項目均提供圖釘（`Pin`）按鈕。
- 釘選後卡片會加上珊瑚橘置頂徽章與精緻外光暈。
- 無論在「網格模式」、「分頁模式」還是「折起專注模式」，置頂的小工具都會自動排列在最前面。

### 5. 🏷️ 工具自訂標籤與標籤分類即時篩選 (Tags & Tag Filter)
- **自訂標籤輸入**：在新增工具與就地編輯工具對話框中，可為工具設定標籤（如：`筆記, 生產力, 常用`）。
- **範本自動標籤化**：挑選內建範本時自動賦予對應分類標籤（如 `#文字與筆記`、`#開發輔助`、`#效能與專注`）。
- **標籤快速過濾**：搜尋列下方自動彙整空間所有標籤晶片（Tag Chips），一鍵點擊即可切換過濾該分類工具。
- **搜尋擴充**：文字搜尋框同時支援搜尋工具標題以及 `#標籤`。
- **備份整合 (JSON v2.0)**：空間匯出與匯入功能全面支援保存 `tags` 陣列與 `isPinned` 狀態，完整還原工作環境。

---

## 二、檔案修改彙整

| 檔案路徑 | 變更性質 | 核心改動內容 |
| :--- | :--- | :--- |
| `src/client/notebook.css` | 樣式更新 | 定義 `.theme-warm`, `.theme-dark`, `.theme-kraft`, `.theme-minimal` 變數與標籤/置頂樣式 |
| `src/client/utils/toolTemplates.js` | 範本擴充 | 新增 Markdown、密碼產生器、JSON 格式化、世界時鐘、文字統計 5 款範本，總計 10 款 |
| `src/client/components/ToolCard.jsx` | 功能強化 | 新增置頂釘選按鈕、獨立視窗彈出按鈕、置頂徽章、標籤 Chips 渲染 |
| `src/client/components/SpaceLayout.jsx` | 佈局強化 | 彙整 `availableTags`、標籤晶片過濾、置頂排序 (`sortedAndFilteredTools`)、傳遞 `onTogglePin` |
| `src/client/components/Navbar.jsx` | UI 強化 | 新增手帳紙質主題下拉切換選單（米紙、夜墨、牛皮、素白） |
| `src/client/components/AddToolModal.jsx` | 功能強化 | 新增標籤輸入欄位，套用範本時自動設定類別標籤 |
| `src/client/components/EditToolModal.jsx` | 功能強化 | 新增標籤編輯與儲存欄位 |
| `src/client/components/SpaceSettingsModal.jsx` | 功能強化 | 升級 JSON 匯出格式為 v2.0，支援匯出與還原 `tags` 與 `isPinned` |
| `src/client/App.jsx` | 狀態整合 | 集中管理主題與 DOM 同步、置頂與標籤本地持久化 (`localStorage`)、連接所有元件回呼 |
| `tests/toolsEdit.test.js` | 測試更新 | 擴充範本測試斷言，驗證 10 款範本齊備與資料結構合法性 |
| `README.md` | 文檔更新 | 同步更新專案亮點與新功能介紹 |

---

## 三、自動化驗證與構建結果

```bash
> node --test --test-concurrency=1 tests/*.test.js

✔ auth: 密碼雜湊與比對應正確運作
✔ auth: JWT 簽發與驗證應正確傳遞 payload
✔ auth: 竄改或無效 Token 應被拒絕
✔ codeParser: 輸入純網址應被標記為不支援並提示使用 iframe 或 HTML
✔ codeParser: 應正確識別並標準化 <iframe> 標籤
✔ codeParser: 應正確將自訂 HTML/JS 片段包裹為獨立沙盒文件
✔ codeParser: 處理空字串與無效輸入應有安全防護
✔ E2E: 伺服器整合 API 流程驗證 (註冊 -> 登入 -> 建立空間 -> 新增工具)
✔ inviteCode: 空間邀請碼格式應符合 SPC-XXXX 規範
✔ inviteCode: 成員應能透過邀請碼加入空間
✔ reorder: 拖曳順序重排與持久化測試
✔ templates: 應內建 10 款實用高質感小工具範本
✔ toolEdit: 支援就地修改工具之標題與代碼內容 (PATCH)

ℹ tests 13 | pass 13 | fail 0
```

* **Vite 生產建置 (`npm run build`)**：通過，產出於 `dist/`，相容 GitHub Pages 與邊緣靜態託管。
