# 工具小本本 (Tool Notebook) - 調整成果報告：移除純網址貼入支援

專案已全自動完成建置、測試與發布更新，依指示完全移除「直接貼上純網址」的功能，避免因外部網站安全防護機制（`X-Frame-Options` / CSP）導致常態性「拒絕連線」的問題，專注於 HTML/JS 代碼與 `<iframe>` 嵌入標籤。

---

## 🌐 線上服務資訊

| 服務項目 | 連結 / 識別碼 | 狀態 | 說明 |
| :--- | :--- | :--- | :--- |
| **GitHub 頁面 (Pages)** | [https://o-o1112.github.io/tool-notebook/](https://o-o1112.github.io/tool-notebook/) | 🟢 正常上線 (HTTP 200) | 小本本前端靜態應用，支援折起專注、拖曳與縮放 |
| **GitHub 專案倉庫** | [https://github.com/O-O1112/tool-notebook](https://github.com/O-O1112/tool-notebook) | 🟢 程式碼已同步 (main) | 包含完整工作流、設定檔與文檔 |
| **Cloudflare Worker API** | [https://tool-notebook-api.blockengine.workers.dev](https://tool-notebook-api.blockengine.workers.dev) | 🟢 正常運行 (已驗證) | 提供無伺服器邊緣 API 與 JWT 驗證 |
| **Cloudflare D1 資料庫** | `tool-notebook-db` (`c3d89f73-e03b-4ebf-ad16-366f8579eaef`) | 🟢 邊緣 SQLite 存儲 | 儲存使用者帳號、空間、成員與工具資訊 |

---

## 一、純網址貼上移除與防呆摘要

1. **核心解析模組 (`codeParser.js`)**：
   - 移除原先對 `https?://` 純網址自動包裝為全屏 iframe 的邏輯。
   - 純網址一律標記為 `type: 'invalid'`, `isRawUrl: true`，並提供友善錯誤說明。
2. **新增工具視窗 (`AddToolModal.jsx`)**：
   - 輸入標籤與佔位符提示改為「HTML/JS 原始碼或 `<iframe>` 嵌入標籤」。
   - 若使用者誤貼純網址，跳出防呆警示提示該網址可能被外部網站阻擋，並提供「**轉為 &lt;iframe&gt; 標籤嘗試**」輔助按鈕。
   - 純網址狀態下自動停用送出按鈕，防止無效工具加入空間。
3. **介面提示清理 (`SpaceLayout.jsx`, `README.md`)**：
   - 空間空狀態說明與專案簡介均移除「或網址」字樣。
4. **自動化測試強化 (`tests/`)**：
   - 更新單元測試 `tests/codeParser.test.js`，驗證純網址被正確攔截防呆。
   - 優化各測試之使用者唯一性，11 項測試全數順利通過。

---

## 二、驗證結果

- **單元與整合測試 (`npm test`)**：11/11 通過。
- **前端編譯 (`npm run build`)**：打包通過，無任何編譯錯誤。
