# [架構升級] 空間大廳儀表板 (Dashboard) 與內容頁切換

依據使用者要求：「主頁可選空間，進入才是內容」，將目前登入後直接載入單一空間的模式，升級為**標準雙層空間架構**：
1. **主頁 / 空間大廳 (Space Dashboard)**：展示使用者擁有的所有空間卡片牆、搜尋過濾、快速建立與加入、空間狀態中繼資訊與快捷操作。
2. **空間內容頁 (Space Workspace / Board)**：點擊任一空間卡片後無縫進入該空間，提供麵包屑返回導覽、專屬佈局切換與沙盒工具操作。

---

## User Review Required

> [!IMPORTANT]
> **瀏覽導航與 URL 同步機制**
> - **預設進入點**：使用者登入後預設停留在「主頁空間大廳 (Dashboard)」，可一覽所有空間與小工具統計。
> - **直達特定空間**：若網址帶有參數（如 `?space=ID` 或訪客分享 `?share=SPC-XXXX`），系統將自動直達該空間內容頁。
> - **返回大廳**：空間內容頁左上方導覽列提供「← 空間大廳」按鈕與麵包屑導航，點擊即可回到主頁。

---

## Proposed Changes

### 1. 前端新元件：空間大廳儀表板 (Space Dashboard)

#### [NEW] [`src/client/components/SpaceDashboard.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceDashboard.jsx)
- **大廳頂部迎賓區**：
  - 展示用戶稱呼與手帳風格迎賓問候語。
  - 空間搜尋列（即時搜尋空間名稱與描述）。
  - 空間分類過濾標籤：「全部空間」、「我建立的」、「他人共享」。
  - 「+ 建立新空間」與「輸入邀請碼加入」快捷按鈕。
- **空間卡片牆 (Board Cards Grid)**：
  - **新建空間導引卡片**：帶有手帳虛線框的大型 `+` 卡片，點擊立即彈出建立空間對話框。
  - **空間卡片實體 (Card)**：
    - **彩色封頂 (Cover Banner)**：依主題配置淡雅手帳粉彩底色與封面專屬圖示。
    - **名稱與描述**：空間標題、描述文字。
    - **中繼徽章**：包含「工具數量標籤 (`N 個工具`)」、「目前佈局標籤 (`貨架` / `瀑布流` / `網格`)」、「權限標籤 (`我建立的` / `他人共享`)」。
    - **快捷功能選單 (⋯)**：快速開啟 QR Code 分享、複製邀請碼、設定與備份、刪除空間。
    - **點擊進入**：點擊卡片本體觸發 `onEnterSpace(spaceId)`，平滑進入內容頁。

---

### 2. 導覽列與麵包屑架構 (Navbar)

#### [MODIFY] [`src/client/components/Navbar.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx)
- **支援雙層檢視模式 (`currentView: 'dashboard' | 'space'`)**：
  - **大廳模式 (`dashboard`)**：
    - 左側顯示品牌 Logo「工具小本本」+「主頁大廳」。
    - 右側呈現手帳紙質切換、加入空間、建立空間、使用者稱呼與登出。
    - 隱藏特定空間的工具佈局切換與新增工具按鈕。
  - **空間內容模式 (`space`)**：
    - 左側新增「← 空間大廳」返回按鈕與麵包屑。
    - 保留空間切換下拉選單、邀請碼徽章。
    - 右側保留 5 款佈局切換器、QR Code 分享、設定與備份、新增小工具按鈕。

---

### 3. 主應用程式路由與狀態中樞 (App.jsx)

#### [MODIFY] [`src/client/App.jsx`](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/App.jsx)
- **狀態擴充**：
  - 新增 `view` 狀態（`'dashboard'` 或 `'space'`，預設為 `'dashboard'`）。
  - 當網址有 `?space=ID` 或 `?share=SPC-XXXX` 時自動設定為 `'space'`。
  - 透過 `history.pushState` 與 `popstate` 監聽瀏覽器上一頁/下一頁切換。
