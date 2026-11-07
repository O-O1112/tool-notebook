import React, { useState, useMemo } from 'react';
import { parseToolInput } from '../utils/codeParser';

export default function SandboxedFrame({ htmlContent, code, title, reloadKey, className = '' }) {
  const [loading, setLoading] = useState(true);

  // 若傳入 code 則自動轉譯，若傳入 htmlContent 則直接使用
  const resolvedHtml = useMemo(() => {
    if (htmlContent) return htmlContent;
    if (code) {
      const parsed = parseToolInput(code);
      return parsed.htmlContent;
    }
    return '';
  }, [htmlContent, code]);

  return (
    <div className={`relative w-full h-full min-h-[300px] bg-white rounded-b-notebook overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--card-bg)]/80 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <div className="w-4 h-4 border-2 border-[var(--coral)] border-t-transparent rounded-full animate-spin"></div>
            <span>載入小工具…</span>
          </div>
        </div>
      )}

      <iframe
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
