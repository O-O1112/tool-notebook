import React, { useState, useEffect } from 'react';
import { X, Code, Frame, Play, Check, AlertTriangle, ArrowRightLeft, Sparkles, Plus, Eye, Palette, Folder } from 'lucide-react';
import { parseToolInput } from '../utils/codeParser';
import { TOOL_TEMPLATES } from '../utils/toolTemplates';
import SandboxedFrame from './SandboxedFrame';
import { CARD_COLORS } from './ToolCard';
import { CraftStudioDoodle } from './Illustrations';

const sanitizeSection = (val) => (typeof val === 'string' && val.trim() ? val.trim() : '一般工具');

export default function AddToolModal({ isOpen, onClose, onAddTool, initialSection = '一般工具', initialTab = 'templates' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'templates' | 'custom'
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [color, setColor] = useState('default');
  const [section, setSection] = useState(() => sanitizeSection(initialSection));
  const [previewActive, setPreviewActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [templatePreview, setTemplatePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSection(sanitizeSection(initialSection));
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialSection, initialTab]);

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
        color,
        section: sanitizeSection(section),
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
        color,
        section: sanitizeSection(section),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
      <div className="notebook-modal-box w-full max-w-3xl lg:max-w-4xl flex flex-col max-h-[90vh]">
        {/* Modal 標題列與頁籤 */}
        <div className="px-6 pt-4 border-b border-[var(--line)] bg-[var(--paper)]/50">
          <div className="flex items-center justify-between pb-3 relative">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)]" />
              <h2 className="text-base font-bold text-[var(--ink)]">新增小工具</h2>
            </div>
            {/* 創客工具台背景飾紋 */}
            <div className="absolute right-12 top-0 pointer-events-none opacity-25 dark:opacity-15 hidden sm:block">
              <CraftStudioDoodle className="w-18 h-10 text-[#3b827e]" />
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors z-10"
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
                  ? 'border-[var(--coral)] text-[var(--coral)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
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
                  ? 'border-[var(--coral)] text-[var(--coral)]'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
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
              <span className="text-xs font-bold text-[var(--ink)]">開箱即用精選工具 ({TOOL_TEMPLATES.length})</span>
              <span className="text-[11px] text-[var(--muted)]">點擊一鍵加入看板或自訂修改</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOOL_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="notebook-card p-4 border border-[var(--line)] hover:border-[var(--coral-border)] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-xs font-bold text-[var(--ink)] truncate">{tmpl.title}</span>
                      <span className="notebook-badge text-[10px] shrink-0">{tmpl.category}</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted)] leading-relaxed mb-3">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[var(--line)]/60 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap">
                      <button
                        type="button"
                        onClick={() => setTemplatePreview(tmpl)}
                        className="notebook-btn-secondary notebook-btn-xs whitespace-nowrap shrink-0 flex items-center gap-1 text-[var(--muted)] hover:text-[var(--ink)]"
                      >
                        <Eye size={12} className="shrink-0" />
                        <span>預覽</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCustomizeTemplate(tmpl)}
                        className="notebook-btn-secondary notebook-btn-xs whitespace-nowrap shrink-0 flex items-center gap-1 text-[var(--muted)] hover:text-[var(--ink)]"
                      >
                        <Code size={12} className="shrink-0" />
                        <span>微調代碼</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="notebook-btn-primary notebook-btn-xs whitespace-nowrap shrink-0 flex items-center gap-1 ml-auto"
                    >
                      <Plus size={12} className="shrink-0" />
                      <span>加入</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 範本即時預覽彈窗 */}
            {templatePreview && (
              <div className="mt-4 pt-4 border-t border-[var(--line)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[var(--ink)]">
                    正在預覽：{templatePreview.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTemplatePreview(null)}
                    className="text-xs text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    關閉預覽
                  </button>
                </div>
                <div className="h-60 border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-inner">
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
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5">
                  工具名稱
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="請輸入工具名稱"
                  className="notebook-input w-full text-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5">
                  自訂標籤 (以逗號或空格分隔)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="例如：筆記, 生產力, 常用"
                  className="notebook-input w-full text-xs"
                />
              </div>
            </div>

            {/* 所屬貨架欄位與便箋底色 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5 flex items-center gap-1">
                  <Folder size={12} className="text-[var(--coral)]" />
                  <span>所屬貨架分欄 (Shelf)</span>
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="例如：一般工具、開發輔助、文字靈感"
                  className="notebook-input w-full text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1.5 flex items-center gap-1">
                  <Palette size={12} className="text-[var(--coral)]" />
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
                          ? 'ring-2 ring-[var(--coral)] scale-110 shadow-xs'
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
                <label className="text-xs font-semibold text-[var(--ink)]">
                  HTML/JS 原始碼或 &lt;iframe&gt; 嵌入標籤
                </label>
                {content.trim() && !parsed.isRawUrl && (
                  <span className="notebook-badge text-[10px]">
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
                <div className="mt-2.5 p-3 bg-[var(--coral-light)] border border-[var(--coral-border)] rounded-xl text-xs space-y-2">
                  <div className="flex items-start gap-2 text-[var(--coral)]">
                    <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">不支援直接貼上純網址</span>
                      <p className="text-[var(--muted)] text-[11px] mt-0.5">
                        大部分外部網站會拒絕被純網址直接內嵌。請改用 <strong>&lt;iframe&gt;</strong> 嵌入標籤或 HTML 程式碼。
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleConvertToIframe}
                      className="notebook-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-[var(--coral)] border-[var(--coral-border)]"
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
              <div className="pt-2 border-t border-[var(--line)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[var(--ink)]">即時預覽確認</span>
                  <button
                    type="button"
                    onClick={() => setPreviewActive(!previewActive)}
                    className="text-xs text-[var(--coral)] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Play size={12} />
                    <span>{previewActive ? '收起預覽' : '展開預覽效果'}</span>
                  </button>
                </div>

                {previewActive && (
                  <div className="h-48 border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--card-bg)] shadow-xs">
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
            <div className="flex items-center justify-end gap-2.5 pt-4 mt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={handleClose}
                className="notebook-btn-secondary text-xs py-2 px-4"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim() || parsed.isRawUrl}
                className="notebook-btn-primary text-xs py-2 px-4"
              >
                <Check size={15} />
                <span>{submitting ? '新增中…' : '確認加入空間'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
