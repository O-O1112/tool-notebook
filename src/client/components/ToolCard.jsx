import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Maximize2,
  Trash2,
  Code,
  Globe,
  Frame,
  GripVertical,
  Minimize2,
  MoveHorizontal,
  Pencil,
  Pin,
  ExternalLink,
  Palette,
  Copy,
  Download,
  Send,
  MoreVertical,
  CheckSquare,
  Square,
  Share2,
} from 'lucide-react';
import SandboxedFrame from './SandboxedFrame';
import { parseToolInput, openSandboxedPopout } from '../utils/codeParser';
import { CARD_COLORS } from '../utils/cardColors';
import { WashiTapePinDoodle } from './Illustrations';
export { CARD_COLORS };

export default function ToolCard({
  tool,
  onDelete,
  onEdit,
  onFocus,
  onToggleColSpan,
  onTogglePin,
  onChangeColor,
  onDuplicate,
  onCloneToSpace,
  isBatchMode = false,
  isSelected = false,
  onToggleSelect,
  layout = 'grid',
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop,
  index,
  isOwner = true,
  userRole = 'owner',
  canEdit = null,
  isPresentationMode = false,
  onPublishHosted,
}) {
  const effectiveCanEdit = canEdit !== null ? canEdit : (isOwner || userRole === 'editor');
  const [reloadKey, setReloadKey] = useState(0);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleExportTool = (e) => {
    e.stopPropagation();
    const exportData = {
      version: '2.2.0-tool',
      exportedAt: new Date().toISOString(),
      tool: {
        title: tool.title,
        type: tool.type,
        content: tool.content,
        col_span: tool.col_span || 1,
        tags: tool.tags || [],
        color: tool.color || 'default',
        section: tool.section || '一般工具',
      }
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `小工具_${tool.title.replace(/[\\/:*?"<>|]/g, '_')}.tool.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMoreMenuOpen(false);
  };

  const parsed = parseToolInput(tool.content);
  const colSpan = tool.col_span || 1;

  const tagsList = useMemo(() => {
    if (!tool.tags) return [];
    if (Array.isArray(tool.tags)) return tool.tags;
    if (typeof tool.tags === 'string') {
      return tool.tags.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [tool.tags]);

  const handlePopout = () => {
    openSandboxedPopout(tool.title, parsed.htmlContent);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'url':
        return <Globe size={13} className="text-blue-500" />;
      case 'iframe':
        return <Frame size={13} className="text-emerald-500" />;
      default:
        return <Code size={13} className="text-amber-500" />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'url': return '網頁嵌入';
      case 'iframe': return 'Iframe';
      default: return '自訂程式';
    }
  };

  const handleDragStartInternal = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ toolId: tool.id, fromIndex: index }));
    if (onDragStart) onDragStart(e, index);
  };

  const cardHeightClass = layout === 'wall'
    ? 'h-[440px]'
    : layout === 'shelf'
    ? 'h-[480px]'
    : 'h-[510px]';

  return (
    <div
      id={`tool-card-${tool.id}`}
      data-tool-id={tool.id}
      draggable={draggable && effectiveCanEdit && !isPresentationMode}
      onDragStart={handleDragStartInternal}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDrop={(e) => onDrop && onDrop(e, index)}
      className={`notebook-card notebook-card-hover relative flex flex-col ${cardHeightClass} overflow-hidden transition-all card-color-${
        tool.color || 'default'
      } ${
        layout !== 'shelf' && layout !== 'wall' && colSpan >= 2 ? 'md:col-span-2' : 'col-span-1'
      } ${tool.isPinned ? 'ring-2 ring-[var(--coral)]/40 shadow-md' : ''}`}
    >
      {/* 置頂和紙膠帶飾紋 */}
      {tool.isPinned && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <WashiTapePinDoodle className="w-20 h-5" />
        </div>
      )}

      {/* 工具卡片頂部控制列 */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--line)] bg-inherit select-none gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {/* 批次選取框 */}
          {isBatchMode && !isPresentationMode && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect && onToggleSelect(tool.id);
              }}
              className="p-0.5 text-[var(--coral)] hover:scale-110 transition-transform shrink-0"
              title={isSelected ? '取消選取' : '選取此工具'}
            >
              {isSelected ? <CheckSquare size={16} className="fill-[var(--coral-light)]" /> : <Square size={16} className="text-[var(--muted)]" />}
            </button>
          )}

          {/* 拖曳把手 */}
          {effectiveCanEdit && !isBatchMode && !isPresentationMode && (
            <div
              className="cursor-grab active:cursor-grabbing p-1 text-[var(--faint)] hover:text-[var(--ink)] rounded-lg transition-colors shrink-0"
              title="拖曳以重新排列工具順序"
            >
              <GripVertical size={16} className="shrink-0" />
            </div>
          )}

          <div className="w-2 h-2 rounded-full bg-[var(--coral)] shrink-0" />
          <h3
            className="text-sm font-semibold text-[var(--ink)] truncate max-w-[130px] sm:max-w-[200px]"
            title={`${tool.title}${tool.updated_by_name ? ` (最後由 ${tool.updated_by_name} 編輯)` : ''}`}
          >
            {tool.title}
          </h3>

          {/* 置頂標記 */}
          {tool.isPinned && (
            <span className="notebook-pin-badge shrink-0" title="已置頂釘選">
              <Pin size={10} className="fill-current shrink-0" />
              <span className="hidden sm:inline">置頂</span>
            </span>
          )}

          <span className="notebook-badge shrink-0 text-[10px] inline-flex items-center gap-1" title={getTypeName(tool.type)}>
            <span className="shrink-0">{getTypeIcon(tool.type)}</span>
            <span className="hidden sm:inline">{getTypeName(tool.type)}</span>
          </span>
        </div>

        {/* 控制按鈕組 (簡潔 4 鍵，其餘整合至更多選單防擠壓折行) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
            title="重新整理此小工具"
          >
            <RotateCcw size={14} />
          </button>

          {effectiveCanEdit && !isPresentationMode && onEdit && (
            <button
              onClick={() => onEdit(tool)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--coral)] hover:bg-[var(--coral-light)] rounded-lg transition-colors"
              title="編輯小工具代碼與設定"
            >
              <Pencil size={14} />
            </button>
          )}

          <button
            onClick={() => onFocus(tool)}
            className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
            title="聚焦全螢幕展示"
          >
            <Maximize2 size={14} />
          </button>

          {/* 更多操作選單 (置頂、色票、加寬、獨立彈出、代管發布、副本、匯出、刪除) */}
          {!isPresentationMode && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`p-1.5 rounded-lg transition-colors ${
                  moreMenuOpen ? 'bg-[var(--coral-light)] text-[var(--coral)]' : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)]'
                }`}
                title="更多小工具動作"
              >
                <MoreVertical size={14} />
              </button>

              {moreMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => { setMoreMenuOpen(false); setColorMenuOpen(false); }} />
                  <div
                    className="absolute right-0 mt-1 w-52 bg-[var(--card-bg)] border border-[var(--line)] rounded-xl shadow-xl z-50 p-1.5 animate-fadeIn text-xs divide-y divide-[var(--line)]/60"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="pb-1 space-y-0.5">
                      {/* 置頂釘選 */}
                      {effectiveCanEdit && onTogglePin && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onTogglePin(tool.id);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)] transition-colors"
                        >
                          <Pin size={13} className={tool.isPinned ? 'text-[var(--coral)] fill-current' : 'text-[var(--muted)]'} />
                          <span>{tool.isPinned ? '取消置頂釘選' : '置頂釘選至最前'}</span>
                        </button>
                      )}

                      {/* 寬度切換 (1x / 2x) */}
                      {effectiveCanEdit && onToggleColSpan && layout !== 'shelf' && layout !== 'wall' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onToggleColSpan(tool.id, colSpan === 1 ? 2 : 1);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)] transition-colors"
                        >
                          <MoveHorizontal size={13} className="text-[var(--muted)]" />
                          <span>{colSpan === 1 ? '切換為加寬展示 (2x)' : '還原為標準寬度 (1x)'}</span>
                        </button>
                      )}

                      {/* 獨立外開視窗 */}
                      <button
                        type="button"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          handlePopout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)] transition-colors"
                      >
                        <ExternalLink size={13} className="text-[var(--muted)]" />
                        <span>獨立浮動視窗彈出</span>
                      </button>

                      {/* 便箋色彩選擇器 */}
                      {effectiveCanEdit && onChangeColor && (
                        <div className="px-2.5 py-1.5">
                          <div className="flex items-center justify-between text-[11px] text-[var(--muted)] font-medium mb-1.5">
                            <span className="flex items-center gap-1.5">
                              <Palette size={12} />
                              <span>便箋色彩</span>
                            </span>
                          </div>
                          <div className="grid grid-cols-6 gap-1">
                            {CARD_COLORS.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  onChangeColor(tool.id, c.id);
                                  setMoreMenuOpen(false);
                                }}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-transform hover:scale-110 ${
                                  (tool.color || 'default') === c.id ? 'ring-2 ring-[var(--coral)]' : ''
                                }`}
                                style={{ backgroundColor: c.bg, borderColor: c.border }}
                                title={c.label}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="py-1 space-y-0.5">
                      {/* 獨立代管發布 */}
                      {onPublishHosted && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onPublishHosted(tool);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium transition-colors"
                        >
                          <Share2 size={13} className="shrink-0" />
                          <span>發布為獨立代管網站...</span>
                        </button>
                      )}

                      {/* 建立副本 */}
                      {effectiveCanEdit && onDuplicate && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onDuplicate(tool);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)] transition-colors"
                        >
                          <Copy size={13} className="text-[var(--coral)]" />
                          <span>建立副本</span>
                        </button>
                      )}

                      {/* 複製到其他空間 */}
                      {onCloneToSpace && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onCloneToSpace(tool);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)] transition-colors"
                        >
                          <Send size={13} className="text-blue-500" />
                          <span>複製到其他空間...</span>
                        </button>
                      )}

                      {/* 匯出小工具 JSON */}
                      <button
                        type="button"
                        onClick={handleExportTool}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)] transition-colors"
                      >
                        <Download size={13} className="text-emerald-500" />
                        <span>匯出小工具 (.json)</span>
                      </button>
                    </div>

                    {/* 刪除小工具 */}
                    {effectiveCanEdit && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onDelete(tool.id);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 font-medium transition-colors"
                        >
                          <Trash2 size={13} />
                          <span>刪除此小工具</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 標籤列 (若有標籤) */}
      {tagsList.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1 bg-[var(--paper)]/70 border-b border-[var(--line)]/60">
          {tagsList.map((tag) => (
            <span key={tag} className="notebook-tag text-[10px]">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 沙盒內容執行區 */}
      <div className="flex-1 w-full relative bg-[var(--card-bg)]">
        <SandboxedFrame
          htmlContent={parsed.htmlContent}
          title={tool.title}
          reloadKey={reloadKey}
        />
      </div>
    </div>
  );
}
