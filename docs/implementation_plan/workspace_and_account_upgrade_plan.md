# 工作區側邊欄大廳與帳號設定中心升級實作計畫

本計畫針對使用者提供的經典工作區版面截圖，並結合「完善設定、帳號等項目，大幅增加完整性」的需求，規劃全方位的產品級重構升級：
1. **工作區側邊欄主頁大廳 (Sidebar Dashboard)**：動態問候（含當日星期）、側邊搜尋、五大分類導覽（最近使用、由我建立、他人共享、我的最愛 ⭐、已移至垃圾桶 🗑️）、多維度排序與手帳天際線飾底。
2. **完整帳號與個人檔案管理 (Account Profile & Settings)**：支援顯示名稱（Display Name）就地修改、角色身分檢視、全域名稱即時連動，杜絕回退預設稱謂。
3. **多分頁系統設定中心 (Comprehensive Settings Center)**：整合帳號管理、外觀紙質、空間偏好、資料備份與還原、系統關於資訊。

---

## 使用者確認事項 (User Review Required)

> [!IMPORTANT]
> **核心架構升級一覽**：
> 1. **主頁大廳重構為側邊欄工作區**：
>    - **左側側邊欄**：
>      - 個人動態問候：「您好，{使用者姓名}」+「{週幾}快樂！」（如：週六快樂！）
>      - 側邊即時搜尋輸入框
>      - 五大分類導覽：最近使用 (🕒)、由我建立 (🧩)、他人共享 (👥)、我的最愛 (⭐)、垃圾桶 (🗑️)
>      - 快捷操作（建立空間、加入空間）與手帳配額統計
>    - **主內容區**：
>      - 分類大標題與排序切換器（依名稱 A-Z / 依最後更新時間）
>      - 空間卡片加入「⭐ 一鍵最愛」與「移至垃圾桶 / 還原空間」
>      - 各分類專屬空狀態手繪風插畫與提示
>      - 頁面底部淡雅手帳風天際線浮水印
> 2. **帳號管理與更名能力**：
>    - 提供 `PATCH /api/auth/profile` API，使用者可在設定中心自由修改顯示姓名，修改後即時同步更新伺服端資料庫、JWT Token、本地快取與畫面所有迎賓標題。
> 3. **完整系統設定中心 (6 大分頁)**：
>    - 👤 **個人帳號**：顯示名稱修改、使用者帳號、角色、建立時間、快捷登出
>    - 🎨 **外觀與風格**：深色模式切換（🌞/🌙）、3 款紙質底色（米紙、牛皮、素白）、空間排版偏好
>    - 📋 **空間資訊**（在空間內時）：名稱、描述、邀請碼與重產
>    - 💾 **資料備份**：JSON 備份匯出與匯入、暫存快取清理
>    - ℹ️ **關於系統**：版本號、純前端沙盒安全聲明、快捷鍵指南
>    - ⚠️ **危險操作**（在空間內時）：刪除空間

---

## 預計變更檔案清單

### 1. 後端與 Worker 帳號更名 API
#### [MODIFY] [auth.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/server/routes/auth.js)
- 新增 `PATCH /api/auth/profile`：支援修改 `display_name` 並簽發新 Token。
#### [MODIFY] [index.js (worker)](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/worker/index.js)
- 新增 Cloudflare Worker `PATCH /api/auth/profile` 端點支援。

### 2. 客戶端 API 與 AuthContext
#### [MODIFY] [api.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/utils/api.js)
- 新增 `api.updateProfile({ displayName })` 介面。
#### [MODIFY] [AuthContext.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/context/AuthContext.jsx)
- 新增 `updateProfile` 函式，更名後同步更新狀態與 localStorage。

### 3. 工作區側邊欄主頁大廳重構
#### [MODIFY] [SpaceDashboard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceDashboard.jsx)
- 改寫為雙欄版面（左側側邊欄 + 右側寬闊主空間網格）。
- 加入星期動態運算（「週X快樂！」）。
- 支援「我的最愛 (⭐)」與「垃圾桶 (🗑️)」分類與即時過濾。
- 支援「名稱排序」與「修改時間排序」。
- 加入卡片星星收藏切換與移至垃圾桶/還原操作。
- 引入專屬空狀態插畫與底部手帳天際線飾條。

### 4. 系統設定中心全新重構
#### [MODIFY] [SpaceSettingsModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceSettingsModal.jsx)
- 擴充為具備 6 大分頁之旗艦級設定對話框（個人帳號、外觀風格、空間資訊、資料備份、關於系統、危險操作）。
- 帳號分頁提供修改姓名輸入表單與「儲存修改」按鈕。

### 5. 頂部導覽列與 App 核心狀態
#### [MODIFY] [Navbar.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx)
- 點擊使用者頭像或名稱即可快速呼叫設定中心的「個人帳號」分頁。
#### [MODIFY] [App.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/App.jsx)
- 管理 `favoriteSpaceIds` 與 `trashSpaceIds` 本地持久化清單。
- 支援收藏切換、移至垃圾桶、從垃圾桶還原、永久清空垃圾桶。
- 允許指定設定中心預設開啟之頁籤（如點頭像開帳號、點齒輪開偏好）。

### 6. 樣式與視覺層
#### [MODIFY] [notebook.css](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/notebook.css)
- 側邊欄項目樣式（高亮指標、Hover 動效）。
- 天際線裝飾樣式（SVG 遮罩、自適應暗黑與手帳紙質微光）。
- 空狀態與星星收藏按鈕樣式。

### 7. 自動化測試
#### [NEW] [tests/workspaceAndProfile.test.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/tests/workspaceAndProfile.test.js)
- 測試個人檔案修改 API (PATCH /auth/profile)
- 測試側邊欄五大分類過濾（最近、我的、共享、最愛、垃圾桶）
- 測試名稱與時間排序運算邏輯

---

## 驗證計畫

### 1. 自動化測試
執行全量測試套件：
```bash
npm test
```
預期全部 24+ 項測試案例 100% 通過。

### 2. 前端打包編譯
```bash
npm run build
```
確保 Vite 編譯成功無異常。

### 3. 人工視覺與功能驗證
- **側邊欄工作區切換**：點擊「最近使用」、「由我建立」、「他人共享」、「我的最愛」、「已移至垃圾桶」，主工作區即時流暢切換對應空間與計數。
- **動態問候**：驗證左側顯示正確的使用者姓名與當前星期（如「您好 李奕辰，週六快樂！」）。
- **收藏與垃圾桶**：點擊空間卡片星星即可收藏/取消收藏；點擊丟入垃圾桶可於垃圾桶分頁一鍵還原或徹底銷毀。
- **帳號更名**：在設定中心修改顯示名稱，點擊儲存後，導覽列與側邊欄問候語即時連動變更，重新整理依然保持正確。
- **深淺色美感**：在方眼米紙、深邃夜墨等不同主題下，側邊欄與底部天際線均完美呈現手帳藝術美感。
