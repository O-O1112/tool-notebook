# 側邊欄工作區主頁大廳 (Sidebar Dashboard) 升級實作計畫

參考使用者提供之經典工作區版面架構，將「工具小本本」現有的單欄大廳重構為「**左側個人化側邊欄 + 頂部導覽列 + 右側寬闊空間工作區**」的現代化空間儀表板。

---

## 使用者確認事項 (User Review Required)

> [!IMPORTANT]
> **版面重構核心方向**：
> 1. **左側側邊欄 (Sidebar)**：
>    - **動態問候**：展示「您好，{使用者名稱}」與根據當前日期動態生成的「{週幾}快樂！」（如：週六快樂！）。
>    - **側邊搜尋欄**：即時搜尋空間名稱、說明或邀請碼。
>    - **多維度分類導覽**：
>      - 🕒 **最近使用**（Recent）：依最後存取或編輯時間排序
>      - 🧩 **由我建立**（Owned）：我所管理的空間
>      - 👥 **他人共享**（Shared）：加入之團隊/課堂空間
>      - ⭐ **我的最愛**（Favorites）：加星標記的常用空間
>      - 🗑️ **已封存/垃圾桶**（Trash）：已移至回收區的空間（可隨時還原或永久刪除）
> 2. **主工作區頂部資訊與排序**：
>    - 顯示當前分類名稱（如「由我建立」、「我的最愛」）與數量統計。
>    - 右側支援「名稱排序」與「修改日期排序」一鍵切換。
> 3. **底部手帳風天際線浮水印 (Skyline / Notebook Silhouette)**：
>    - 頁面底部加入輕量優雅的城市與手帳塗鴉天際線線條，在暗色與淺色手帳紙質下皆自適應透明度，營造溫厚的生活手帳感。

---

## 預計變更檔案清單

### 1. 空間主頁大廳重構 (`SpaceDashboard.jsx`)
#### [MODIFY] [SpaceDashboard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceDashboard.jsx)
- **改為雙欄式版面**：
  - 左側固定寬度側邊欄（響應式支援行動端收合選單）：
    - 頂部使用者問候語（含星期動態計算）
    - 側邊搜尋欄位
    - 分類導覽群組（最近使用、由我建立、他人共享、我的最愛、已移至垃圾桶）
    - 空間數量配額與快速建立按鈕
  - 右側主空間卡片牆：
    - 類別大標題 + 右上角排序選擇器（依名稱 / 依時間）
    - 空間卡片加入「⭐ 星號收藏/取消最愛」與「🗑️ 移至垃圾桶/還原」操作
    - 空狀態呈現（專屬手繪風提示插圖與說明文字）
  - 底部城市天際線手帳底圖飾條

### 2. 核心狀態與最愛/封存持久化 (`App.jsx`)
#### [MODIFY] [App.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/App.jsx)
- 管理空間的輔助狀態：
  - `favoriteSpaceIds`：使用者標記最愛的空間 ID 清單（儲存於 localStorage）
  - `archivedSpaceIds`：移至垃圾桶的空間 ID 清單（儲存於 localStorage）
  - `recentAccessMap`：空間最後開啟時間戳記
- 提供收藏切換 (`toggleFavoriteSpace`) 與封存/還原空間函式

### 3. 頂部導覽列協同適配 (`Navbar.jsx`)
#### [MODIFY] [Navbar.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx)
- 頂部導覽列維持精準簡潔：
  - 左側：小本本標章與當前空間/大廳狀態
  - 右側：深色模式切換（🌞/🌙）、偏好設定（⚙️）、使用者帳號

### 4. 樣式層與天際線插圖樣式 (`notebook.css`)
#### [MODIFY] [notebook.css](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/notebook.css)
- 新增側邊欄項目樣式（`.sidebar-nav-item`、活躍態高亮底色）
- 新增底部天際線 SVG 遮罩與半透明線條樣式（支援深淺色自適應）
- 優化行動端響應式排版

### 5. 單元測試
#### [MODIFY] [tests/dashboard.test.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/tests/dashboard.test.js)
- 驗證側邊欄分類過濾（最近使用、由我建立、他人共享、我的最愛、已移至垃圾桶）
- 驗證名稱與日期排序邏輯

---

## 驗證計畫

### 1. 自動化測試
執行所有測試案例：
```bash
npm test
```
確保既有 22 項測試與新增的大廳多維度分類/排序測試 100% PASS。

### 2. 前端打包編譯
```bash
npm run build
```
確認 Vite 打包無任何語法錯誤。

### 3. 人工視覺驗證
- **側邊欄互動**：點擊「最近使用」、「由我建立」、「他人共享」、「我的最愛」、「已移至垃圾桶」，主工作區即時流暢過濾對應空間。
- **星號收藏**：點擊空間卡片上的星號按鈕，即時加入「我的最愛」分頁並持久化記憶。
- **垃圾桶與還原**：將空間移至垃圾桶後，可在「已移至垃圾桶」分頁中一鍵還原或徹底刪除。
- **排序切換**：點擊「名稱排序」與「修改日期」，卡片順序正確即時變更。
- **深淺色適配**：在日間手帳與深邃夜墨模式下，側邊欄與底部天際線均完美呈現手帳藝術美感。
