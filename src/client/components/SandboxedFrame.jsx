import React, { useState, useMemo, useEffect, useRef } from 'react';
import { parseToolInput } from '../utils/codeParser';

export default function SandboxedFrame({ htmlContent, code, title, reloadKey, className = '' }) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);

  // 若傳入 code 則自動轉譯，若傳入 htmlContent 則直接使用
  const resolvedHtml = useMemo(() => {
    if (htmlContent) return htmlContent;
    if (code) {
      const parsed = parseToolInput(code);
      return parsed.htmlContent;
    }
    return '';
  }, [htmlContent, code]);

  // 安全防護機制：
  // 1. 監聽 resolvedHtml 與 reloadKey
  // 2. 由於 Chromium / Safari 在渲染 srcDoc 時，可能於 React 綁定 onLoad 前即完成解析或無法可靠觸發合成事件，
  //    在此設置安全逾時定時器 (600ms)，確保即便 onLoad 事件未捕獲，載入遮罩也必定平滑退場，杜絕無限轉圈窘境。
  useEffect(() => {
    setLoading(true);

    // 檢查 iframe DOM 狀態是否已備妥
    if (iframeRef.current?.contentDocument?.readyState === 'complete') {
      const quickTimer = setTimeout(() => setLoading(false), 80);
      return () => clearTimeout(quickTimer);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [resolvedHtml, reloadKey]);

  return (
    <div className={`relative w-full h-full min-h-[300px] bg-white rounded-b-notebook overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--card-bg)]/85 backdrop-blur-xs z-10 transition-opacity duration-200">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)] bg-[var(--card-bg)] px-3 py-1.5 rounded-xl shadow-xs border border-[var(--line)]">
            <div className="w-3.5 h-3.5 border-2 border-[var(--coral)] border-t-transparent rounded-full animate-spin"></div>
            <span>載入小工具中…</span>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        key={reloadKey}
        title={title || '嵌入小工具'}
        srcDoc={resolvedHtml}
        sandbox="allow-scripts allow-forms allow-modals allow-popups"
        className="w-full h-full border-0 block"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
