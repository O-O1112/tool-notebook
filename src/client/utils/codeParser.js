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

  // 1. 判斷是否為純網址 (URL)
  const isUrl = /^https?:\/\/[^\s]+$/i.test(trimmed);
  if (isUrl) {
    const urlObj = tryParseUrl(trimmed);
    const domain = urlObj ? urlObj.hostname : '外部工具';
    return {
      type: 'url',
      titleSuggestion: `嵌入網頁 (${domain})`,
      url: trimmed,
      htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #fff; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <iframe src="${escapeHtmlAttr(trimmed)}" allow="fullscreen; clipboard-read; clipboard-write; camera; microphone"></iframe>
</body>
</html>`,
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
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", Arial, sans-serif;
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
