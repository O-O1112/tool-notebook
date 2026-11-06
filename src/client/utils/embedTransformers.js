/**
 * 萬用網址轉譯器 (Universal Embed Transformers)
 * 自動識別並將主流學習、教學與生產力平台網址轉換為最佳化之嵌入格式
 */

export function transformUrlToEmbed(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return null;
  }

  const urlStr = inputUrl.trim();
  let urlObj = null;
  try {
    urlObj = new URL(urlStr);
  } catch (e) {
    return null;
  }

  const hostname = urlObj.hostname.toLowerCase();
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // 1. YouTube
  if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
    let videoId = '';
    if (hostname.includes('youtu.be')) {
      videoId = pathname.slice(1).split('/')[0];
    } else if (pathname.includes('/watch')) {
      videoId = searchParams.get('v') || '';
    } else if (pathname.includes('/embed/')) {
      videoId = pathname.split('/embed/')[1]?.split('?')[0] || '';
    } else if (pathname.includes('/shorts/')) {
      videoId = pathname.split('/shorts/')[1]?.split('?')[0] || '';
    }

    if (videoId) {
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
      return {
        isKnownPlatform: true,
        platformName: 'YouTube 視訊',
        embedUrl,
        titleSuggestion: `YouTube 視訊 (${videoId})`,
        htmlContent: buildIframeContainer(embedUrl, 'YouTube 視訊', 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen'),
      };
    }
  }

  // 2. Bilibili
  if (hostname.includes('bilibili.com')) {
    const bvidMatch = pathname.match(/\/(BV[a-zA-Z0-9]+)/i);
    if (bvidMatch) {
      const bvid = bvidMatch[1];
      const embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1&danmaku=0`;
      return {
        isKnownPlatform: true,
        platformName: 'Bilibili 視訊',
        embedUrl,
        titleSuggestion: `Bilibili 視訊 (${bvid})`,
        htmlContent: buildIframeContainer(embedUrl, 'Bilibili 視訊', 'allowfullscreen="true"'),
      };
    }
  }

  // 3. Google Docs 套件 (Docs / Sheets / Slides / Forms)
  if (hostname.includes('docs.google.com')) {
    if (pathname.includes('/document/d/')) {
      const docId = pathname.split('/document/d/')[1]?.split('/')[0];
      if (docId) {
        const embedUrl = `https://docs.google.com/document/d/${docId}/preview`;
        return {
          isKnownPlatform: true,
          platformName: 'Google 文件',
          embedUrl,
          titleSuggestion: 'Google 協作文件',
          htmlContent: buildIframeContainer(embedUrl, 'Google 文件'),
        };
      }
    }

    if (pathname.includes('/spreadsheets/d/')) {
      const sheetId = pathname.split('/spreadsheets/d/')[1]?.split('/')[0];
      if (sheetId) {
        const embedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/preview?widget=true&headers=false`;
        return {
          isKnownPlatform: true,
          platformName: 'Google 試算表',
          embedUrl,
          titleSuggestion: 'Google 雲端試算表',
          htmlContent: buildIframeContainer(embedUrl, 'Google 試算表'),
        };
      }
    }

    if (pathname.includes('/presentation/d/')) {
      const presId = pathname.split('/presentation/d/')[1]?.split('/')[0];
      if (presId) {
        const embedUrl = `https://docs.google.com/presentation/d/${presId}/embed?start=false&loop=false&delayms=3000`;
        return {
          isKnownPlatform: true,
          platformName: 'Google 簡報',
          embedUrl,
          titleSuggestion: 'Google 雲端簡報',
          htmlContent: buildIframeContainer(embedUrl, 'Google 簡報', 'allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"'),
        };
      }
    }

    if (pathname.includes('/forms/d/')) {
      const formId = pathname.split('/forms/d/')[1]?.split('/')[0];
      if (formId) {
        const embedUrl = `https://docs.google.com/forms/d/${formId}/viewform?embedded=true`;
        return {
          isKnownPlatform: true,
          platformName: 'Google 表單',
          embedUrl,
          titleSuggestion: 'Google 問卷表單',
          htmlContent: buildIframeContainer(embedUrl, 'Google 表單'),
        };
      }
    }
  }

  // 4. Desmos 繪圖計算機
  if (hostname.includes('desmos.com')) {
    if (pathname.includes('/calculator/')) {
      const calcId = pathname.split('/calculator/')[1]?.split('/')[0];
      const embedUrl = calcId && !calcId.includes('?')
        ? `https://www.desmos.com/calculator/${calcId}?embed`
        : 'https://www.desmos.com/calculator?embed';
      return {
        isKnownPlatform: true,
        platformName: 'Desmos 繪圖計算機',
        embedUrl,
        titleSuggestion: 'Desmos 繪圖計算機',
        htmlContent: buildIframeContainer(embedUrl, 'Desmos 繪圖計算機'),
      };
    }
  }

  // 5. GeoGebra 數學實驗室
  if (hostname.includes('geogebra.org')) {
    let materialId = '';
    if (pathname.includes('/m/')) {
      materialId = pathname.split('/m/')[1]?.split('/')[0] || '';
    } else if (pathname.includes('/material/')) {
      materialId = searchParams.get('id') || pathname.split('/material/')[1]?.split('/')[0] || '';
    }
    if (materialId) {
      const embedUrl = `https://www.geogebra.org/material/iframe/id/${materialId}/width/800/height/600/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false`;
      return {
        isKnownPlatform: true,
        platformName: 'GeoGebra 數學模擬',
        embedUrl,
        titleSuggestion: `GeoGebra 模擬實驗 (${materialId})`,
        htmlContent: buildIframeContainer(embedUrl, 'GeoGebra 數學模擬', 'allowfullscreen'),
      };
    }
  }

  // 6. Figma 設計稿
  if (hostname.includes('figma.com')) {
    const encodedUrl = encodeURIComponent(urlStr);
    const embedUrl = `https://www.figma.com/embed?embed_host=share&url=${encodedUrl}`;
    return {
      isKnownPlatform: true,
      platformName: 'Figma 設計畫布',
      embedUrl,
      titleSuggestion: 'Figma 設計畫布',
      htmlContent: buildIframeContainer(embedUrl, 'Figma 設計畫布', 'allowfullscreen'),
    };
  }

  // 7. CodePen 程式碼展示
  if (hostname.includes('codepen.io')) {
    const penMatch = pathname.match(/\/([^/]+)\/pen\/([^/]+)/);
    if (penMatch) {
      const user = penMatch[1];
      const penId = penMatch[2];
      const embedUrl = `https://codepen.io/${user}/embed/${penId}?default-tab=result&theme-id=dark`;
      return {
        isKnownPlatform: true,
        platformName: 'CodePen 範例',
        embedUrl,
        titleSuggestion: `CodePen 程式範例 (${penId})`,
        htmlContent: buildIframeContainer(embedUrl, 'CodePen 程式範例', 'allowfullscreen'),
      };
    }
  }

  // 8. Canva 簡報與設計
  if (hostname.includes('canva.com')) {
    if (pathname.includes('/design/')) {
      const cleanPath = pathname.replace(/\/view.*$/, '');
      const embedUrl = `https://www.canva.com${cleanPath}/view?embed`;
      return {
        isKnownPlatform: true,
        platformName: 'Canva 設計與簡報',
        embedUrl,
        titleSuggestion: 'Canva 設計簡報',
        htmlContent: buildIframeContainer(embedUrl, 'Canva 設計簡報', 'allowfullscreen'),
      };
    }
  }

  // 9. 一般外部網站 (General Web Page)
  // 自動封裝安全 iframe，並配置 X-Frame-Options 阻擋 fallback 友善提示與一鍵彈窗
  return {
    isKnownPlatform: false,
    platformName: '外部網站',
    embedUrl: urlStr,
    titleSuggestion: `外部網站 (${hostname})`,
    htmlContent: buildGeneralWebContainer(urlStr, hostname),
  };
}

/**
 * 建立標準平台 iframe 容器
 */
function buildIframeContainer(embedUrl, title, extraAttrs = '') {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="about:blank">
  <meta name="referrer" content="no-referrer">
  <style>
    html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #ffffff; }
    iframe { width: 100%; height: 100%; border: none; display: block; }
  </style>
</head>
<body>
  <iframe
    src="${escapeHtmlAttr(embedUrl)}"
    title="${escapeHtmlAttr(title)}"
    ${extraAttrs}
  ></iframe>
</body>
</html>`;
}

/**
 * 建立具備防護與優雅退回機制的通用網頁容器
 */
function buildGeneralWebContainer(webUrl, hostname) {
  const safeUrl = escapeHtmlAttr(webUrl);
  const safeHost = escapeHtmlAttr(hostname);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="about:blank">
  <meta name="referrer" content="no-referrer">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      background: #fbf9f4;
    }
    .wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-col: column;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      flex: 1;
      display: block;
      background: #ffffff;
    }
    .fallback-bar {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(31, 42, 46, 0.88);
      color: #ffffff;
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10;
      opacity: 0.92;
      transition: opacity 0.2s ease;
      white-space: nowrap;
    }
    .fallback-bar:hover {
      opacity: 1;
    }
    .fallback-btn {
      background: #e17b62;
      color: #ffffff;
      border: none;
      padding: 3px 9px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .fallback-btn:hover {
      background: #cf664d;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <iframe
      src="${safeUrl}"
      title="${safeHost}"
      id="main-frame"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <div class="fallback-bar" id="fallback-bar">
      <span>若目標網站禁止內嵌或呈現空白：</span>
      <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="fallback-btn">
        獨立新視窗開啟
      </a>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtmlAttr(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
