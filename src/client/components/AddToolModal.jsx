import React, { useState, useEffect } from 'react';
import { X, Code, Frame, Play, Check, AlertTriangle, ArrowRightLeft, Sparkles, Plus, Eye } from 'lucide-react';
import { parseToolInput } from '../utils/codeParser';
import { TOOL_TEMPLATES } from '../utils/toolTemplates';
import SandboxedFrame from './SandboxedFrame';

export default function AddToolModal({ isOpen, onClose, onAddTool }) {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'custom'
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [previewActive, setPreviewActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [templatePreview, setTemplatePreview] = useState(null);

  // 當使用者貼入內容時，智慧推薦標題與解析類型
  const parsed = parseToolInput(content);

  useEffect(() => {
    if (content.trim() && (!title || title === '未命名工具') && !parsed.isRawUrl) {
      setTitle(parsed.titleSuggestion);
    }
  }, [content]);

  if (!isOpen) return null;

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
      await onAddTool({
        title: title.trim() || parsed.titleSuggestion || '自訂小工具',
        type: parsed.type,
        content: content.trim(),
        colSpan: 1,
        tags: parseTags(tagsInput),
      });
      handleClose();
    } catch (err) {
      alert(err.message || '新增失敗');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyTemplate = async (tmpl) => {
    setSubmitting(true);
    try {
      await onAddTool({
        title: tmpl.title,
        type: 'html',
        content: tmpl.content,
        colSpan: tmpl.defaultColSpan || 1,
        tags: tmpl.category ? [tmpl.category] : [],
      });
      handleClose();
    } catch (err) {
      alert(err.message || '範本套用失敗');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomizeTemplate = (tmpl) => {
    setTitle(tmpl.title);
    setContent(tmpl.content);
    setTagsInput(tmpl.category || '');
    setActiveTab('custom');
    setPreviewActive(true);
  };

  const handleConvertToIframe = () => {
    const raw = content.trim();
    if (raw) {
      setContent(`<iframe src="${raw}" width="100%" height="100%" frameborder="0"></iframe>`);
    }
  };

  const handleClose = () => {
    setContent('');
    setTitle('');
    setTagsInput('');
    setPreviewActive(false);
    setTemplatePreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2a2e]/50 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-card w-full max-w-2xl bg-white overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal 標題列與頁籤 */}
        <div className="px-6 pt-4 border-b border-[#e4e8e5] bg-[#fafaf8]">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e17b62]" />
              <h2 className="text-base font-bold text-[#1f2a2e]">新增小工具</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* 分頁切換 */}
          <div className="flex gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'border-[#e17b62] text-[#e17b62]'
                  : 'border-transparent text-[#89959b] hover:text-[#1f2a2e]'
              }`}
            >
              <Sparkles size={14} />
              <span>精選工具範本庫</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'border-[#e17b62] text-[#e17b62]'
                  : 'border-transparent text-[#89959b] hover:text-[#1f2a2e]'
              }`}
            >
              <Code size={14} />
              <span>自訂代碼 / iframe</span>
            </button>
          </div>
        </div>

        {/* 分頁內容 1：精選範本庫 */}
        {activeTab === 'templates' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1f2a2e]">開箱即用精選工具 ({TOOL_TEMPLATES.length})</span>
              <span className="text-[11px] text-[#89959b]">點擊一鍵加入看板或自訂修改</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TOOL_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="notebook-card p-4 border border-[#e4e8e5] hover:border-[#e1ac9e] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#1f2a2e]">{tmpl.title}</span>
                      <span className="notebook-badge text-[10px]">{tmpl.category}</span>
                    </div>
                    <p className="text-[11px] text-[#89959b] leading-relaxed mb-3">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#f0f2f1]">
                    <button
                      type="button"
                      onClick={() => setTemplatePreview(tmpl)}
                      className="notebook-btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 text-[#69787f]"
                    >
                      <Eye size={12} />
                      <span>預覽</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCustomizeTemplate(tmpl)}
                      className="notebook-btn-secondary text-[11px] py-1 px-2.5 flex items-center gap-1 text-[#69787f]"
                    >
                      <Code size={12} />
                      <span>微調代碼</span>
                    </button>
                    <div className="flex-1" />
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="notebook-btn-primary text-[11px] py-1 px-3 flex items-center gap-1"
                    >
                      <Plus size={12} />
                      <span>加入</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 範本即時預覽彈窗 */}
            {templatePreview && (
              <div className="mt-4 pt-4 border-t border-[#e4e8e5]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1f2a2e]">
                    正在預覽：{templatePreview.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTemplatePreview(null)}
                    className="text-xs text-[#89959b] hover:text-[#1f2a2e]"
                  >
                    關閉預覽
                  </button>
                </div>
                <div className="h-60 border border-[#e4e8e5] rounded-notebook-sm overflow-hidden bg-white shadow-inner">
                  <SandboxedFrame
                    htmlContent={templatePreview.content}
                    title={templatePreview.title}
                    reloadKey={0}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 分頁內容 2：自訂程式碼表單 */}
        {activeTab === 'custom' && (
          <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-4">
            {/* 工具名稱與標籤 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                onClick={handleClose}
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
        )}
      </div>
    </div>
  );
}
