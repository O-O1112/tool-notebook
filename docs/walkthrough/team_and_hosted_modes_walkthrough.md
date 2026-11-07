# 成果與變更記錄 (Walkthrough)

## 任務摘要

本階段針對使用者提出的「功能太定性，只能在特定場合使用」、「支援團隊合作功能、復原對話」、「小工具代管網站（點開連結即直接運行創建者指定的小工具，支援三種模式：單一小工具、多小工具客製切換分頁、外部嵌入網站）」需求，進行了全面的系統架構擴充與端到端實作。

---

## 核心交付項目

### 1. 三種發布模式：獨立代管網站發布引擎 (Hosted Portal Engine)
- **模式 1：單一小工具獨立代管運行 (Single Mode)**
  - 創建者可挑選任一工具一鍵發布為獨立微應用網站。
  - 系統自動產生專屬代碼 `HOST-XXXX`，使用者點開連結即可全螢幕獨立運行該工具。
  - 包含浮動微型作者資訊標章、一鍵複製分享連結、一鍵開啟主站以及 QR Code。
- **模式 2：指定多種小工具客製切換門戶 (Multi Tabs / Split Mode)**
  - 支援勾選多個小工具打包發布。
  - 允許高度客製化分頁標籤名稱（Tabs），或切換為雙欄分屏（Split）對照模式。
  - 適合建構多步驟教學站、雙工具比對台或專案儀表板。
- **模式 3：外部網站無縫自適應嵌入 (Embed Mode)**
  - 提供針對模式 1 與模式 2 的標準 `<iframe>` 嵌入語法與相容參數 `?embed=true`。
  - 原生移除外圍邊框與額外頂部工具列，讓微應用能無縫融和於 Notion、個人部落格、教學 LMS 或學校官網。

### 2. 團隊協作與細緻 RBAC 權限管理 (Team Collaboration)
- **三級權限分工**：
  - **擁有者 (Owner)**：具備空間全權，包含刪除空間、重新產生邀請碼、調整成員角色、踢除成員。
  - **協作者 (Editor)**：解除單人限制，允許多名協作者共同新增小工具、修改代碼、調整排列順序、切換便箋色彩與置頂釘選。
  - **檢視者 (Viewer)**：僅能瀏覽並操作工具，無法修改工具代碼、排序或刪除。
- **協作成員管理介面 (Team Modal)**：
  - 即時列出空間所有成員、身分徽章與加入時間。
  - 擁有者可切換夥伴為協作者或檢視者，亦可將人員移出空間；成員亦可自主安全退出空間。

### 3. 工具軟刪除 (Soft-Delete) 與即時復原 (Undo Recovery)
- **軟刪除安全機制**：小工具刪除時不會永久滅失，後端標記 `deleted_at` 時間戳並寫入操作日誌。
- **8 秒浮動復原 Toast (Undo)**：刪除小工具時，畫面右下角即時呈現「小工具已移至回收庫，[復原 (Undo)]」提示，點擊立即還原。
- **空間回收庫 (Trash)**：在團隊管理對話框中設有「回收庫」分頁，可隨時檢視歷史刪除工具並一鍵復原回空間。

### 4. 團隊討論室與即時協作動態 (Team Chat & Activity Stream)
- **滑出式即時討論抽屜 (TeamChatDrawer)**：
  - 支援空間成員即時傳送文字訊息，標記發送者名稱與角色。
  - 鍵盤快速鍵支援（Enter 發送，Shift+Enter 換行）。
- **協作事件日誌串流**：
  - 自動捕捉工具新增、編輯、刪除、復原、成員權限變更等所有活動。
  - 針對刪除事件提供直接「復原」捷徑。
- **智慧協作探測**：前端每 12 秒輕量輪詢同步探測 (`sync-status`)，偵測異動並自動靜默更新畫面。

---

## 程式碼與架構變更清單

| 模組 / 檔案 | 變更性質 | 說明 |
|---|---|---|
| `src/server/db.js` | 擴充 | 新增 `hosted_shares`、`space_messages`、`space_activities` 資料表，新增 `deleted_at` 軟刪除與 `updated_by_user_id` 欄位 |
| `worker/schema.sql` | 擴充 | 同步更新 Cloudflare D1 邊緣資料庫 Schema 結構 |
| `src/server/routes/spaces.js` | 擴充 | 實作 RBAC 鑑權、代管微應用端點、團隊成員管理、軟刪除與復原、團隊訊息與協作探測端點 |
| `src/server/index.js` | 修改 | 掛載 `/api/hosted` 轉發中介層，支援免登入微應用公開訪問 |
| `worker/index.js` | 擴充 | 同步 Cloudflare Worker 邊緣端點相容邏輯 |
| `src/client/utils/api.js` | 擴充 | 新增代管發布、成員管理、軟刪除復原、團隊對話之 API 客戶端函式 |
| `src/client/components/HostedPortalView.jsx` | 新增 | 三模式獨立代管入口組件，支援單工具全螢幕、多工具 Tabs/Split、外部嵌入適配 |
| `src/client/components/PublishModal.jsx` | 新增 | 三模式代管網站發布精靈，支援客製化分頁、代碼生成與預覽 |
| `src/client/components/TeamModal.jsx` | 新增 | 團隊成員名單管理、RBAC 權限切換、協作邀請碼、回收庫清單與一鍵復原 |
| `src/client/components/TeamChatDrawer.jsx` | 新增 | 滑出式團隊討論室與協作操作動態串流抽屜 |
| `src/client/components/QRCodeView.jsx` | 新增 | 向量 SVG QR Code 輕量渲染組件 |
| `src/client/components/ToolCard.jsx` | 修改 | 增加「發布為獨立代管網站」選單項、最後編輯者標記、RBAC 權限檢視防護 |
| `src/client/components/SpaceLayout.jsx` | 修改 | 加入發布代管、團隊成員、團隊對話快捷按鈕與權限連動 |
| `src/client/components/Navbar.jsx` | 修改 | 頂部導覽列整合身分徽章與協作/發布快捷入口 |
| `src/client/App.jsx` | 修改 | 支援 `?host=HOST-XXXX` 獨立直達、掛載所有新組件、實作 8 秒 Undo Toast 與背景探測 |
| `tests/hostedToolAndTeam.test.js` | 新增 | 全面驗證三模式代管、RBAC 權限、軟刪除復原、團隊討論與協作探測 |
| `README.md` | 更新 | 補齊代管微應用發布引擎、團隊協作與復原機制規格說明 |

---

## 驗證結果

1. **單元與整合測試**：
   - 執行指令：`node --test --test-concurrency=1 tests/*.test.js`
   - 結果：全數 44 個測試項目均全數通過 (44 pass, 0 fail)。
2. **生產環境打包驗證**：
   - 執行指令：`npm run build`
   - 結果：Vite 成功建置生產產物，無任何語法錯誤或遺漏依賴。
3. **規範檢查**：
   - 全程嚴格恪守零表情符號 (Zero Emojis) 規範。
   - 所有介面與提示均採用繁體中文 (台灣)。
