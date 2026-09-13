/**
 * 記憶體滑動窗口速率限制中介軟體 (Rate Limiter)
 * 無外部依賴，支援自動清理過期紀錄，防止記憶體洩漏與暴力破解 / DoS 攻擊
 */

export function createRateLimiter({
  windowMs = 60 * 1000,
  max = 60,
  maxLimit,
  message = '請求過於頻繁，請稍後再試',
  keyGenerator = (req) => req.headers?.['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket?.remoteAddress || 'unknown',
}) {
  const limit = maxLimit !== undefined ? maxLimit : max;
  const hits = new Map();

  // 每 2 分鐘定期清除過期窗口紀錄
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now - record.startTime > windowMs) {
        hits.delete(key);
      }
    }
  }, 2 * 60 * 1000);

  // 避免計時器阻止進程退出
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }

  return function rateLimiterMiddleware(req, res, next) {
    const key = keyGenerator(req);
    const now = Date.now();

    let record = hits.get(key);
    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
      hits.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, limit - record.count);
    const resetTimeSeconds = Math.ceil((record.startTime + windowMs - now) / 1000);

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetTimeSeconds);

    if (record.count > limit) {
      res.setHeader('Retry-After', resetTimeSeconds);
      return res.status(429).json({
        error: message,
        retryAfter: resetTimeSeconds,
      });
    }

    next();
  };
}

// 認證專用限制器：15 分鐘最多 15 次，防範暴力破解與帳號撞庫
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: '登入或註冊嘗試次數過多，為保障安全，請於 15 分鐘後再試',
});

// 空間邀請碼解析與加入限制器：1 分鐘最多 30 次，防範邀請碼枚舉探測
export const inviteLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: '邀請碼驗證嘗試過於頻繁，請於 1 分鐘後再試',
});

// 全域一般 API 限制器：1 分鐘最多 300 次
export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 300,
  message: 'API 存取頻率超出限制，請稍候再試',
});
