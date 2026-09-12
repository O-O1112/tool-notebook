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
  ExternalLink
} from 'lucide-react';
import SandboxedFrame from './SandboxedFrame';
import { parseToolInput } from '../utils/codeParser';

export default function ToolCard({
  tool,
  onDelete,
  onEdit,
  onFocus,
  onToggleColSpan,
  onTogglePin,
  draggable = true,
  onDragStart,
  onDragOver,
  onDrop,
  index,
  isOwner = true,
}) {
  const [reloadKey, setReloadKey] = useState(0);

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
    const w = window.open('', '_blank', 'width=840,height=620,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
    if (!w) {
      alert('請允許瀏覽器彈出式視窗以使用獨立浮動工具視窗');
      return;
    }
    w.document.title = `${tool.title} - 工具小本本`;
    w.document.open();
    w.document.write(parsed.htmlContent);
    w.document.close();
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

  return (
    <div
      draggable={draggable && isOwner}
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDrop={(e) => onDrop && onDrop(e, index)}
      className={`notebook-card notebook-card-hover flex flex-col h-[510px] overflow-hidden transition-all ${
        colSpan >= 2 ? 'md:col-span-2' : 'col-span-1'
      } ${tool.isPinned ? 'ring-2 ring-[#e17b62]/40 shadow-md' : ''}`}
    >
      {/* 工具卡片頂部控制列 */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#e4e8e5] bg-[var(--card-bg,#ffffff)] select-none">
        <div className="flex items-center gap-2 min-w-0">
          {/* 拖曳把手 */}
          {isOwner && (
            <div
              className="cursor-grab active:cursor-grabbing p-1 text-[#a2aaad] hover:text-[#1f2a2e] rounded transition-colors"
              title="拖曳以重新排列工具順序"
            >
              <GripVertical size={16} />
            </div>
          )}

          <div className="w-2 h-2 rounded-full bg-[#e17b62] shrink-0" />
          <h3 className="text-sm font-semibold text-[var(--ink,#1f2a2e)] truncate" title={tool.title}>
            {tool.title}
          </h3>

          {/* 置頂標記 */}
          {tool.isPinned && (
            <span className="notebook-pin-badge shrink-0" title="已置頂釘選">
              <Pin size={10} className="fill-current" />
              <span>置頂</span>
            </span>
          )}

          <span className="notebook-badge shrink-0">
            {getTypeIcon(tool.type)}
            <span>{getTypeName(tool.type)}</span>
          </span>
        </div>

        {/* 控制按鈕組 */}
        <div className="flex items-center gap-1 shrink-0">
          {/* 置頂釘選按鈕 */}
          {onTogglePin && (
            <button
              onClick={() => onTogglePin(tool.id)}
              className={`p-1.5 rounded-md transition-colors ${
                tool.isPinned
                  ? 'bg-[#fff0eb] text-[#e17b62] font-semibold'
                  : 'text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6]'
              }`}
              title={tool.isPinned ? '取消置頂釘選' : '置頂釘選至最前'}
            >
              <Pin size={14} className={tool.isPinned ? 'fill-current' : ''} />
            </button>
          )}

          {/* 獨立快顯浮動視窗 (Pop-out) */}
          <button
            onClick={handlePopout}
            className="p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors"
            title="以獨立浮動視窗彈出 (便於多螢幕/側邊小工具)"
          >
            <ExternalLink size={14} />
          </button>

          {/* 寬度尺寸切換 (1x / 2x) */}
          {isOwner && onToggleColSpan && (
            <button
              onClick={() => onToggleColSpan(tool.id, colSpan === 1 ? 2 : 1)}
              className={`p-1.5 rounded-md transition-colors text-xs flex items-center gap-1 ${
                colSpan >= 2
                  ? 'bg-[#fff0eb] text-[#e17b62] font-semibold'
                  : 'text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6]'
              }`}
              title={colSpan === 1 ? '切換為加寬展示 (2x)' : '還原為標準寬度 (1x)'}
            >
              <MoveHorizontal size={14} />
              <span className="text-[10px] hidden sm:inline">{colSpan === 1 ? '1x' : '2x'}</span>
            </button>
          )}

          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors"
            title="重新整理此小工具"
          >
            <RotateCcw size={14} />
          </button>
          {isOwner && onEdit && (
            <button
              onClick={() => onEdit(tool)}
              className="p-1.5 text-[#89959b] hover:text-[#e17b62] hover:bg-[#fff0eb] rounded-md transition-colors"
              title="編輯小工具代碼與設定"
            >
              <Pencil size={14} />
            </button>
          )}
          <button
            onClick={() => onFocus(tool)}
            className="p-1.5 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-md transition-colors"
            title="聚焦全螢幕展示"
          >
            <Maximize2 size={14} />
          </button>
          {isOwner && (
            <button
              onClick={() => onDelete(tool.id)}
              className="p-1.5 text-[#89959b] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="刪除此小工具"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 標籤列 (若有標籤) */}
      {tagsList.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1 bg-[var(--paper,#fbfbf9)]/70 border-b border-[#e4e8e5]/60">
          {tagsList.map((tag) => (
            <span key={tag} className="notebook-tag text-[10px]">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 沙盒內容執行區 */}
      <div className="flex-1 w-full relative bg-white">
        <SandboxedFrame
          htmlContent={parsed.htmlContent}
          title={tool.title}
          reloadKey={reloadKey}
        />
      </div>
    </div>
  );
}
