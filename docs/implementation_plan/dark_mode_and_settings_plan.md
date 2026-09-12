# 加入深色模式並整合設定區實作計畫

本計畫旨在實現使用者要求之兩大核心體驗升級：
1. **加入原生深色模式 (Dark Mode)**：提供頂部導覽列一鍵切換（太陽 / 月亮圖標），並全面適配暗色模式下之卡片、表單、模態視窗與便箋調色盤，杜絕刺眼白底破版。
2. **將調節設定整合至「設定區」 (Settings Center)**：將原先分散在導覽列的色盤下拉選單，與空間管理、排版偏好、資料備份收攏至統一且結構化的「設定」面板中，保持工作列簡潔專注。

---

## 使用者確認事項 (User Review Required)

> [!IMPORTANT]
> **深色模式與手帳紙質主題之整合邏輯**：
> - **頂部導覽列**：保留單一「深色 / 淺色切換」按鈕（🌞 / 🌙），提供最直接的一鍵切換。
> - **手帳紙質主題（方眼米紙、復古牛皮、簡約素白）**：收納至「設定」面板的「外觀與偏好」分頁中，當處於淺色模式時可自由選用不同手帳紙質。切換為深色模式時自動進入專屬暗色調（深邃夜墨），切回淺色模式時自動記憶先前的紙質選擇。
> - **設定按鈕位置**：主頁大廳（Dashboard）與空間內部（Space View）均常駐「設定」按鈕，點擊即可開啟設定面板。

---

## 預計變更檔案清單

### 1. 樣式層與暗色適配 (`notebook.css`)
#### [MODIFY] [notebook.css](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/notebook.css)
- **暗色模式便箋調色盤**：針對 `.theme-dark` 加入深色柔和色階（暗蜜桃、暗薄荷、暗檸檬、暗天藍、暗薰衣），防止深色背景下淺色便箋刺眼。
- **暗色模式元件樣式**：
  - `.notebook-card`、`.dashboard-space-card` 於暗色模式之色彩與邊框。
  - `.dashboard-banner`、分頁頁籤、按鈕在深色模式下的對比度與背景。
  - 模態視窗背景與字級暗色適配（移除純白 hardcoded 依賴）。

### 2. 核心狀態與主題控制器 (`App.jsx`)
#### [MODIFY] [App.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/App.jsx)
- 管理 `isDarkMode` 與 `theme` 的聯動邏輯：
  - 記錄使用者最後選取的淺色紙質（如 `warm` 或 `kraft`），當切換深色時切換至 `dark`，切回淺色時精確還原至該紙質。
  - 同步於 `<html>` 加上 `theme-dark` 與 `dark` 樣式類別。
- 提供全域「設定區」開啟狀態，無論在大廳或空間內皆可隨時呼叫設定面板。

### 3. 頂部導覽列 (`Navbar.jsx`)
#### [MODIFY] [Navbar.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx)
- **新增一鍵深色模式按鈕**：
  - 顯示 `Sun`（日間模式）或 `Moon`（夜間模式）圖示，附帶平滑旋轉微動效與 Tooltip 提示。
- **統一設定按鈕**：
  - 將原先的 Palette 色盤下拉按鈕移除，替換為統整的 `Settings` 按鈕，點擊開啟設定對話框。
  - 大廳模式與空間模式皆可使用「深色模式」與「設定」按鈕。
- 暗色適配：導覽列底色自適應 `var(--card-bg)` 或暗色玻璃擬態，不再寫死 `bg-white/90`。

### 4. 整合式設定面板 (`SettingsModal.jsx` / `SpaceSettingsModal.jsx`)
#### [MODIFY] [SpaceSettingsModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceSettingsModal.jsx)
- 重構為分頁籤/分區塊的設定中心（Settings Dialog）：
  1. 🎨 **外觀與偏好調節 (Appearance)**：
     - 深色模式開關（即時切換日間 / 夜間模式）。
     - 手帳紙質風格選擇（方眼米紙、復古牛皮、簡約素白），附色塊預覽與手帳紋理說明。
     - 預設排版模式偏好（貨架分欄、緊湊瀑布流、網格、分頁、折起專注）。
  2. 📋 **空間管理 (Space Info)**（僅在開啟空間時顯示）：
     - 空間名稱、說明備註修改。
     - 邀請碼檢視與重新產生。
  3. 💾 **資料備份與匯入 (Data & Backup)**：
     - JSON 工具備份匯出、工具還原匯入。
  4. ⚠️ **危險操作 (Danger Zone)**（僅空間擁有者顯示）：
     - 刪除空間確認。

### 5. 全域彈窗背景暗色修正
#### [MODIFY] [AddToolModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/AddToolModal.jsx)
#### [MODIFY] [CreateSpaceModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/CreateSpaceModal.jsx)
#### [MODIFY] [EditToolModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/EditToolModal.jsx)
#### [MODIFY] [JoinSpaceModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/JoinSpaceModal.jsx)
#### [MODIFY] [QRCodeModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/QRCodeModal.jsx)
- 將彈窗容器上的 `bg-white` 移除或改為使用 `bg-[var(--card-bg)]`，確保開啟任何對話框在深色模式下均為舒適暗色背景。

### 6. 單元測試
#### [NEW] [tests/themeAndSettings.test.js](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/tests/themeAndSettings.test.js)
- 驗證深色模式開關切換邏輯與 localStorage 狀態記憶。
- 驗證紙質主題切換與暗色模式還原。

---

## 驗證計畫

### 1. 自動化測試
執行所有測試案例：
```bash
npm test
```
預期全部 20+ 項測試通過（含既有 19 項與新增主題測試）。

### 2. 前端打包編譯
```bash
npm run build
```
確保 Vite 編譯無警告與語法錯誤。

### 3. 人工視覺驗證
- 點擊導覽列「深色模式切換（太陽/月亮）」：驗證全域主頁、大廳、空間工作區、卡片、模態彈窗瞬間切換為沉浸式深黑紙質。
- 點擊「設定」：驗證設定面板包含外觀紙質、排版偏好、空間資料與備份分頁，且在暗色模式下視覺和諧。
- 切換紙質主題後開啟深色模式再關閉：驗證自動復原先前的淺色紙質風格。
