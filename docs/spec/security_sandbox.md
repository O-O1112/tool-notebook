# 安全沙盒規範 (Security Sandbox Specification)

## 威脅模型分析 (Threat Modeling)
在「班級工具本」中，教師與學生會直接貼入外部第三方的 JavaScript、HTML 原始碼或 iframe。可能遭遇的資安風險包含：
1. **DOM 存取與點擊劫持 (Clickjacking & Parent DOM Manipulation)**：惡意腳本竄改宿主頁面介面。
2. **認證資訊竊取 (Credential/Token Theft)**：腳本讀取宿主網站的 `localStorage`、`sessionStorage` 或 `cookies`（包含 JWT Token）。
3. **未預期的重新導向 (Top-level Navigation Hijack)**：腳本強制將整頁轉址至釣魚網站。

---

## 防護機制設計 (Defense in Depth)

### 1. 嚴格 HTML5 Sandbox 屬性
在渲染使用者提供的自訂代碼或外部 URL 時，一律使用 `<iframe sandbox="..." />`：

```html
<iframe
  sandbox="allow-scripts allow-forms allow-modals allow-popups"
  srcdoc="..."
/>
```

- **關鍵設定：明確排除 `allow-same-origin`**：
  - 當沒有 `allow-same-origin` 時，該 iframe 的 origin 會被瀏覽器強制設為 `opaque origin` (`null`)。
  - 此 origin **無法存取父頁面的 localStorage、sessionStorage、cookies**。
  - 同時阻斷 `window.parent.document` 之存取，瀏覽器將強制拋出 `DOMException: Blocked a frame with origin "null" from accessing a cross-origin frame.`。
- **排除 `allow-top-navigation`**：
  - 避免子工具透過 `window.top.location` 強制轉跳父頁面。

### 2. 獨立封裝包裹器 (HTML Wrapper Isolation)
針對使用者貼入的片段程式碼（純 JS 或無 HTML head/body 的標籤），前端 `codeParser` 會將其安全包裹成合法的 HTML5 結構，並加入標準重設樣式與錯誤邊界監聽，確保工具視窗內部的未捕獲例外不影響主畫面。
