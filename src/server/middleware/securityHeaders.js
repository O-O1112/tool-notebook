/**
 * 現代 Web 安全 HTTP 標頭中介軟體
 * 強化點擊劫持 (Clickjacking)、MIME 嗅探與跨站隔離防護
 */

export function securityHeaders(req, res, next) {
  // 防止瀏覽器進行 MIME 類型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 防止主站被非同源第三方以 iframe 嵌入 (防點擊劫持)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // 停用過時且可能引入漏洞的舊版 XSS 稽核器 (現代標準規範)
  res.setHeader('X-XSS-Protection', '0');

  // 跨來源參照政策：僅傳送來源網址，保護內部路徑不外洩
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 限制敏感硬體功能呼叫權限
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // 跨來源開啟者政策：保護視窗物件參照
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

  // 移除 Express 預設版本資訊以隱匿伺服器指紋
  if (typeof res.removeHeader === 'function') {
    res.removeHeader('X-Powered-By');
  }

  next();
}
