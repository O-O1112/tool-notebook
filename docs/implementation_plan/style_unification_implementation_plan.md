# 全站視覺風格與設計系統一致化工程實作計畫

本計畫旨在針對全站（導覽列、大廳總覽、空間工作看板、卡片系統、六大彈窗視窗、登入歡迎頁）進行**全域視覺語彙一致化（Design System Consistency Overhaul）**。消除零散硬編碼色彩、標準化各元件圓角與陰影層級、統一對話框版型，並確保在所有主題（方眼米紙、復古牛皮、簡約素白、深邃夜墨）下皆呈現統一、雅緻、舒適的手帳手作美學風格。

---

## 🎯 核心重構目標與痛點分析

1. **色彩 Token 化（Tokens & Variables Standardization）**：
   - **現狀**：大量元件直接硬編碼 `#1f2a2e`、`#57767f`、`#89959b`、`#e4e8e5`、`bg-white`，導致切換至牛皮紙、素白或深色模式時，局部元件邊框或背景呈現不協調白塊或對比度不一致。
   - **改進**：全面替換為語意化 CSS 變數：
     - 文字：`text-[var(--ink)]`（主要文字）、`text-[var(--muted)]`（次要文字）、`text-[var(--faint)]`（輔助/預設字）、`text-[var(--coral)]`（品牌強調整體色）。
     - 容器背景：`bg-[var(--card-bg)]`（卡片、彈窗、選單）、`bg-[var(--paper)]`（畫布底色、次級容器）、`bg-[var(--coral-light)]`（品牌淡彩強調色塊）。
     - 線條：`border-[var(--line)]`（全域格線/分隔線）、`border-[var(--coral-border)]`（品牌輔助邊框）。

2. **六大彈窗對話框規格統整（Modal Windows Standard Layout）**：
   - 包含：`CreateSpaceModal`、`JoinSpaceModal`、`QRCodeModal`、`AddToolModal`、`EditToolModal`、`SpaceSettingsModal`。
   - **統一結構**：
     - **遮罩（Backdrop）**：統一為 `bg-[#11151a]/60 backdrop-blur-sm`。
     - **外框（Container）**：統一為 `notebook-card bg-[var(--card-bg)] text-[var(--ink)] border border-[var(--line)] rounded-2xl shadow-2xl`。
     - **標題列（Header）**：左側統一採用圖標徽章（`w-9 h-9 rounded-xl bg-[var(--coral-light)] text-[var(--coral)] border border-[var(--coral-border)]`）+ 主標題（`text-base font-bold text-[var(--ink)]`）+ 副標題（`text-xs text-[var(--muted)]`）；右上角統一標準關閉鈕（`rounded-lg text-[var(--muted)] hover:bg-[var(--paper)]`）與手繪草稿飾紋（`opacity-25 dark:opacity-15`）。
     - **表單欄位（Form Fields）**：統一標籤樣式（`text-xs font-semibold text-[var(--ink)]`）與輸入框（`.notebook-input w-full text-xs`）。
     - **底部操作列（Footer Actions）**：統一於底部 `border-t border-[var(--line)] pt-4 mt-4 flex items-center justify-end gap-2.5`，取消按鈕統一使用 `.notebook-btn-secondary`，確認/送出按鈕統一使用 `.notebook-btn-primary`。

3. **卡片與畫布元件規格化（Card System & Interactive Elements）**：
   - **空間卡片（Space Cards）與工具卡片（Tool Cards）**：
     - 統一邊框厚度與顏色 `border border-[var(--line)]`。
     - 頂部控制列統一 `border-b border-[var(--line)] bg-inherit`，標題長度截斷防破版，操作圖示群 hover 與 padding 統一。
     - 拖曳手柄、置頂膠帶飾紋、色票切換器視覺統整。
   - **控制列與按鈕（Buttons & Pills）**：
     - 統一所有主要操作按鈕的圓角（`rounded-xl`）與高度規格。
     - 統一空狀態插圖（Empty States）、搜尋空狀態與各篩選膠囊（Pills/Chips）樣式。

4. **登入與歡迎頁面（Login / Welcome Screen）**：
   - `LoginCard` 全面替換硬編碼顏色，對齊手帳小本本全域卡片與背景紋理。

---

## 🛠️ 預計修改元件清單 (Proposed Changes)

### 1. 全域樣式與變數核心 (Global Styles & Design Tokens)
#### [MODIFY] [notebook.css](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/notebook.css)
- 強化與補充 `:root`, `.theme-warm`, `.theme-dark`, `.theme-kraft`, `.theme-minimal` 的 CSS 變數定義。
- 統一全域 `.notebook-card`, `.notebook-btn-primary`, `.notebook-btn-secondary`, `.notebook-input`, `.notebook-badge` 的陰影、圓角與過渡動畫。
- 補齊通用的遮罩、按鈕尺寸變體與標籤輔助類。

### 2. 導覽列與大廳 (Navigation & Dashboard)
#### [MODIFY] [Navbar.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/Navbar.jsx)
- 將硬編碼顏色全面換成 `var(--ink)`, `var(--muted)`, `var(--line)`, `var(--coral)` 等語意變數。
- 統一下拉選單、佈局切換器、邀請碼膠囊與使用者資訊按鈕的視覺風格。

#### [MODIFY] [SpaceDashboard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceDashboard.jsx)
- 統一側邊欄導覽項目的 active / hover 色彩，消除硬編碼色彩。
- 統一空間卡片（`.dashboard-space-card`）封面圖樣、選單下拉、標籤徽章與搜尋輸入列。
- 統一空狀態（Empty States）排版與文字色彩層次。

### 3. 工作空間畫布與卡片 (Workspace Canvas & Tool Cards)
#### [MODIFY] [SpaceLayout.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceLayout.jsx)
- 統一分欄貨架（Shelf）、緊湊瀑布流（Wall）、網格（Grid）、分頁（Tabs）與折起（Collapsed）在各主題下的容器背景、分隔線與拖曳區塊外觀。
- 統一搜尋過濾列、標籤篩選列與新增分欄輸入框。

#### [MODIFY] [ToolCard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/ToolCard.jsx)
- 統一切換色票選單、標籤列表、卡片邊框、卡片頂部控制列操作圖示大小與間距。

### 4. 六大對話框標準化 (Standardized Modals)
#### [MODIFY] [CreateSpaceModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/CreateSpaceModal.jsx)
- 套用標準化標題列、圖標徽章、佈局選項卡片、底部操作按鈕，替換硬編碼色彩。

#### [MODIFY] [JoinSpaceModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/JoinSpaceModal.jsx)
- 套用標準化標題列、邀請碼輸入框居中對齊與底部操作按鈕。

#### [MODIFY] [QRCodeModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/QRCodeModal.jsx)
- 統一標題列與關閉按鈕，標準化 QR Code 預覽外框、分享網址複製欄位與操作按鈕。

#### [MODIFY] [AddToolModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/AddToolModal.jsx)
- 統一範本卡片列表、自訂輸入 Tab 切換器、標籤輸入、色票選取器與底部操作按鈕。

#### [MODIFY] [EditToolModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/EditToolModal.jsx)
- 統一對話框頂部標題、表單欄位、色票切換與儲存按鈕。

#### [MODIFY] [SpaceSettingsModal.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/SpaceSettingsModal.jsx)
- 統一個別設定分頁（外觀風格、空間資訊、匯入匯出、帳號管理）的側邊/頂部分頁切換按鈕、卡片選項與表單輸入。

### 5. 認證登入 (Auth)
#### [MODIFY] [LoginCard.jsx](file:///C:/Users/liguo/.gemini/antigravity/scratch/edu-embed-space/src/client/components/LoginCard.jsx)
- 全面統一為語意化變數，消除與主站樣式微幅偏差問題。

---

## 🧪 驗證與測試計畫

### 1. 自動化測試驗證
- 執行 `pwd; npm test`：確認後端與前端工具邏輯 26 項單元測試 100% 通過。
- 執行 `pwd; npm run build`：確認 Vite 6.4.3 生產打包 0 錯誤、0 警告。

### 2. 人工視覺驗證（包含四套主題適配）
- **主題切換測試**：分別在 `warm`（方眼米紙）、`kraft`（復古牛皮）、`minimal`（簡約素白）以及 `dark`（深邃夜墨）下檢查：
  1. 頂部導覽列（Navbar）與大廳卡片（SpaceDashboard）。
  2. 空間看板（SpaceLayout）五種排版模式（貨架、瀑布流、網格、分頁、折起）。
  3. 六個彈窗視窗（新增空間、加入空間、QR 分享、新增工具、編輯工具、設定）的一致性。
  4. 登入畫面（LoginCard）的層次與文字對比度。
