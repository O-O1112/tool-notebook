import React, { useState, useEffect } from 'react';
import { X, Code, Frame, Play, Check, AlertTriangle, ArrowRightLeft, MoveHorizontal, Folder, Palette } from 'lucide-react';
import { parseToolInput } from '../utils/codeParser';
import SandboxedFrame from './SandboxedFrame';
import { CARD_COLORS } from './ToolCard';

export default function EditToolModal({ isOpen, tool, onClose, onSaveTool }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [colSpan, setColSpan] = useState(1);
  const [tagsInput, setTagsInput] = useState('');
  const [color, setColor] = useState('default');
  const [section, setSection] = useState('一般工具');
  const [previewActive, setPreviewActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tool) {
      setTitle(tool.title || '');
      setContent(tool.content || '');
      setColSpan(tool.col_span || 1);
      setColor(tool.color || 'default');
      setSection(tool.section || '一般工具');
      const initialTags = Array.isArray(tool.tags) ? tool.tags.join(', ') : (tool.tags || '');
      setTagsInput(initialTags);
      setPreviewActive(false);
    }
  }, [tool, isOpen]);

  const parsed = parseToolInput(content);

  if (!isOpen || !tool) return null;

  const parseTags = (str) => {
    if (!str) return [];
    return str
      .split(/[,，\s]+/)
      .map((s) => s.replace(/^#/, '').trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || parsed.isRawUrl) return;

    setSubmitting(true);
    try {
      await onSaveTool(tool.id, {
        title: title.trim() || '未命名小工具',
        type: parsed.type,
        content: content.trim(),
        colSpan: Number(colSpan),
        tags: parseTags(tagsInput),
        color,
        section: section.trim() || '一般工具',
      });
      onClose();
    } catch (err) {
      alert(err.message || '更新失敗');
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
            <h2 className="text-base font-bold text-[#1f2a2e]">編輯小工具</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 工具名稱 */}
            <div className="sm:col-span-2">
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

            {/* 卡片寬度 */}
            <div>
              <label className="block text-xs font-semibold text-[#1f2a2e] mb-1.5">
                卡片寬度
              </label>
              <select
                value={colSpan}
                onChange={(e) => setColSpan(Number(e.target.value))}
                className="notebook-input w-full cursor-pointer"
              >
                <option value={1}>1x 標準寬度</option>
                <option value={2}>2x 加寬展示</option>
              </select>
            </div>
          </div>

          {/* 工具標籤 */}
          <div>
            <label className="block text-xs font-semibold text-[#1f2a2e] mb-1.5">
              自訂標籤 (以逗號或空格分隔)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="例如：筆記, 生產力, 常用"
              className="notebook-input w-full"
            />
          </div>

          {/* 所屬貨架分欄與便箋底色 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1f2a2e] mb-1.5 flex items-center gap-1">
                <Folder size={12} className="text-[#e17b62]" />
                <span>所屬貨架分欄 (Shelf)</span>
              </label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="例如：一般工具、開發輔助、文字靈感"
                className="notebook-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1f2a2e] mb-1.5 flex items-center gap-1">
                <Palette size={12} className="text-[#e17b62]" />
                <span>便箋底色 (Card Color)</span>
              </label>
              <div className="flex items-center gap-2 pt-1">
                {CARD_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`w-7 h-7 rounded-lg border transition-all ${
                      color === c.id
                        ? 'ring-2 ring-[#e17b62] scale-110 shadow-sm'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.bg, borderColor: c.border }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 程式碼 / iframe 輸入區 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#1f2a2e]">
                HTML/JS 原始碼或 &lt;iframe&gt; 標籤
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
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="請在此貼入 HTML/JS 原始碼或 <iframe src=&quot;...&quot;></iframe>"
              className="notebook-input w-full font-mono text-xs leading-relaxed resize-none"
              required
            />

            {/* 純網址防呆提示 */}
            {parsed.isRawUrl && (
              <div className="mt-2.5 p-3 bg-[#fff9f6] border border-[#e1ac9e] rounded-notebook-sm text-xs space-y-2">
                <div className="flex items-start gap-2 text-[#b8533b]">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">不支援直接貼上純網址</span>
                    <p className="text-[#89959b] text-[11px] mt-0.5">
                      請改用 <strong>&lt;iframe&gt;</strong> 嵌入標籤或 HTML 原始碼。
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

          {/* 即時預覽切換 */}
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
              <span>{submitting ? '儲存中…' : '儲存變更'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
