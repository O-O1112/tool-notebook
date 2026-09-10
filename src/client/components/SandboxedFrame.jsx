import React, { useState } from 'react';

export default function SandboxedFrame({ htmlContent, title, reloadKey }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[300px] bg-white rounded-b-notebook overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#fbfbf9]/80 z-10">
          <div className="flex items-center gap-2 text-sm text-[#89959b]">
            <div className="w-4 h-4 border-2 border-[#e17b62] border-t-transparent rounded-full animate-spin"></div>
            <span>載入小工具…</span>
          </div>
        </div>
      )}

      <iframe
        key={reloadKey}
        title={title || '嵌入小工具'}
        srcDoc={htmlContent}
        sandbox="allow-scripts allow-forms allow-modals allow-popups"
        className="w-full h-full border-0 block"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
