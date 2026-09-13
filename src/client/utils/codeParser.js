/**
 * 智慧解析貼入的代碼、iframe 或網址
 */

export function parseToolInput(input) {
  if (!input || typeof input !== 'string') {
    return {
      type: 'html',
      titleSuggestion: '未命名工具',
      htmlContent: '',
    };
  }

  const trimmed = input.trim();

  // 1. 若為純網址 (URL)，標註為不支援並提示改用 iframe 或 HTML
  const isUrl = /^https?:\/\/[^\s]+$/i.test(trimmed);
  if (isUrl) {
    return {
      type: 'invalid',
      isRawUrl: true,
      titleSuggestion: '未支援的純網址',
      error: '目前不支援直接貼上純網址。請使用 <iframe> 嵌入標籤（例如 <iframe src="..."></iframe>）或自訂 HTML 程式碼。',
      htmlContent: '',
    };
  }

  // 2. 判斷是否為 <iframe> 標籤
  const iframeMatch = trimmed.match(/<iframe\b[^>]*>([\s\S]*?)<\/iframe>/i) || trimmed.match(/<iframe\b[^>]*\/>/i);
  if (iframeMatch) {
    // 提取 src 作為名稱建議
    const srcMatch = trimmed.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    const srcUrl = srcMatch ? srcMatch[1] : '';
    const domain = srcUrl ? (tryParseUrl(srcUrl)?.hostname || '嵌入模組') : '外部 iframe 工具';

    return {
      type: 'iframe',
      titleSuggestion: `嵌入視窗 (${domain})`,
      htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base href="about:blank">
  <meta name="referrer" content="no-referrer">
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  ${normalizeIframeTag(trimmed)}
</body>
</html>`,
    };
  }

  // 3. 判斷為自訂 HTML / JS / CSS 片段
  // 嘗試提取 title
  const titleMatch = trimmed.match(/<title[^>]*>([^<]+)<\/title>/i) || trimmed.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/i);
  const titleSuggestion = titleMatch ? titleMatch[1].trim() : '自訂教學程式';

  // 若已是完整 HTML 文件
  if (/<!DOCTYPE\s+html/i.test(trimmed) || /<html\b/i.test(trimmed)) {
    return {
      type: 'html',
      titleSuggestion,
      htmlContent: trimmed,
    };
  }

  // 若為 HTML/JS 片段，為其包裹標準 HTML5 容器與防跳錯防護
  return {
    type: 'html',
    titleSuggestion,
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="about:blank">
  <meta name="referrer" content="no-referrer">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: "Noto Sans TC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft JhengHei", "微軟正黑體", Arial, sans-serif;
      color: #1f2a2e;
      background: #ffffff;
    }
  </style>
</head>
<body>
  ${trimmed}
</body>
</html>`,
  };
}

function tryParseUrl(str) {
  try {
    return new URL(str);
  } catch (e) {
    return null;
  }
}

function escapeHtmlAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeIframeTag(iframeHtml) {
  // 將 iframe 的 style 強制設為 100% 寬高填滿容器
  let normalized = iframeHtml;
  if (/style\s*=\s*["']/i.test(normalized)) {
    normalized = normalized.replace(/style\s*=\s*["']([^"']*)["']/i, 'style="width:100%;height:100%;border:none;$1"');
  } else {
    normalized = normalized.replace(/<iframe\b/i, '<iframe style="width:100%;height:100%;border:none;" ');
  }
  return normalized;
}

/**
 * 安全彈出獨立視窗
 * 1. 斷開 window.opener 連線 (防止反向存取主應用權杖與 localStorage)
 * 2. 以沙盒 iframe 包裹目標內容，禁止 allow-same-origin，確保執行緒與資料庫隔離
 */
export function openSandboxedPopout(title, htmlContent) {
  const w = window.open('', '_blank', 'width=840,height=620,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
  if (!w) {
    alert('請允許瀏覽器彈出式視窗以使用獨立浮動工具視窗');
    return null;
  }
  try {
    w.opener = null;
  } catch (e) {
    console.error('Failed to clear window.opener:', e);
  }

  const safeTitle = (title || '工具小本本').replace(/[<>&"]/g, '');
  const encodedContent = JSON.stringify(htmlContent || '');

  const sandboxedDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${safeTitle} - 工具小本本</title>
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe sandbox="allow-scripts allow-forms allow-modals allow-popups" id="sandbox-frame"></iframe>
  <script>
    const frame = document.getElementById('sandbox-frame');
    frame.srcdoc = ${encodedContent};
  <\/script>
</body>
</html>`;

  w.document.open();
  w.document.write(sandboxedDoc);
  w.document.close();
  return w;
}

