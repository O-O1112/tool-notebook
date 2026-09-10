import React, { useState, useEffect } from 'react';
import { X, Code, Frame, Play, Check, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { parseToolInput } from '../utils/codeParser';
import SandboxedFrame from './SandboxedFrame';

export default function AddToolModal({ isOpen, onClose, onAddTool }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 當使用者貼入內容時，智慧推薦標題與解析類型
  const parsed = parseToolInput(content);

  useEffect(() => {
    if (content.trim() && (!title || title === '未命名工具') && !parsed.isRawUrl) {
      setTitle(parsed.titleSuggestion);
    }
  }, [content]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || parsed.isRawUrl) return;

    setSubmitting(true);
    try {
      await onAddTool({
        title: title.trim() || parsed.titleSuggestion || '自訂小工具',
        type: parsed.type,
        content: content.trim(),
      });
      // 清空狀態並關閉
      setContent('');
      setTitle('');
      setPreviewActive(false);
      onClose();
    } catch (err) {
      alert(err.message || '新增失敗');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertToIframe = () => {
    const raw = content.trim();
    if (raw) {
      setContent(`<iframe src="${raw}" width="100%" height="100%" frameborder="0"></iframe>`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2a2e]/50 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-card w-full max-w-2xl bg-white overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal 標題列 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e8e5]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e17b62]" />
            <h2 className="text-base font-bold text-[#1f2a2e]">貼上工具程式碼</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 表單內容 */}
        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* 工具名稱 */}
          <div>
            <label className="block text-xs font-semibold text-[#1f2a2e] mb-1.5">
              工具名稱
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="請輸入工具名稱"
              className="notebook-input w-full"
              required
            />
          </div>

          {/* 程式碼 / iframe 輸入區 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#1f2a2e]">
                HTML/JS 原始碼或 &lt;iframe&gt; 嵌入標籤
              </label>
              {content.trim() && !parsed.isRawUrl && (
                <span className="notebook-badge">
                  {parsed.type === 'iframe' && <Frame size={12} className="text-emerald-500" />}
                  {parsed.type === 'html' && <Code size={12} className="text-amber-500" />}
                  <span>格式：{parsed.type.toUpperCase()}</span>
                </span>
              )}
            </div>

            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="請在此貼入 HTML/JS 原始碼或 <iframe src=&quot;...&quot;></iframe> 嵌入標籤"
              className="notebook-input w-full font-mono text-xs leading-relaxed resize-none"
              required
            />

            {/* 純網址防呆提示與一鍵轉換 */}
            {parsed.isRawUrl && (
              <div className="mt-2.5 p-3 bg-[#fff9f6] border border-[#e1ac9e] rounded-notebook-sm text-xs space-y-2">
                <div className="flex items-start gap-2 text-[#b8533b]">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">不支援直接貼上純網址</span>
                    <p className="text-[#89959b] text-[11px] mt-0.5">
                      大部分外部網站會拒絕被純網址直接內嵌。請改用 <strong>&lt;iframe&gt;</strong> 嵌入標籤或 HTML 程式碼。
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleConvertToIframe}
                    className="notebook-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-[#e17b62] border-[#e1ac9e]"
                  >
                    <ArrowRightLeft size={13} />
                    <span>轉為 &lt;iframe&gt; 標籤嘗試</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 即時預覽切換 (限合法 HTML/iframe) */}
          {content.trim() && !parsed.isRawUrl && (
            <div className="pt-2 border-t border-[#e4e8e5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1f2a2e]">即時預覽確認</span>
                <button
                  type="button"
                  onClick={() => setPreviewActive(!previewActive)}
                  className="text-xs text-[#e17b62] hover:underline flex items-center gap-1 font-medium"
                >
                  <Play size={12} />
                  <span>{previewActive ? '收起預覽' : '展開預覽效果'}</span>
                </button>
              </div>

              {previewActive && (
                <div className="h-48 border border-[#e4e8e5] rounded-notebook-sm overflow-hidden bg-white">
                  <SandboxedFrame
                    htmlContent={parsed.htmlContent}
                    title="即時預覽"
                    reloadKey={0}
                  />
                </div>
              )}
            </div>
          )}

          {/* 按鈕操作區 */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e4e8e5]">
            <button
              type="button"
              onClick={onClose}
              className="notebook-btn-secondary"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting || !content.trim() || parsed.isRawUrl}
              className="notebook-btn-primary"
            >
              <Check size={16} />
              <span>{submitting ? '新增中…' : '確認加入空間'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
