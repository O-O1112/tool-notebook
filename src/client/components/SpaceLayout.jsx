import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Layers,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Code,
  Globe,
  Frame,
  Maximize2,
  RotateCcw,
  GripVertical,
  Search,
  Pencil,
  Filter,
} from 'lucide-react';
import ToolCard from './ToolCard';
import SandboxedFrame from './SandboxedFrame';
import { parseToolInput } from '../utils/codeParser';

export default function SpaceLayout({
  tools = [],
  layout,
  onDeleteTool,
  onEditTool,
  onOpenAddModal,
  onToggleColSpan,
  onReorderTools,
  isOwner = true,
}) {
  const [activeTabId, setActiveTabId] = useState(tools[0]?.id || null);
  const [focusedTool, setFocusedTool] = useState(null);
  const [expandedToolId, setExpandedToolId] = useState(tools[0]?.id || null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // 搜尋與篩選狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'html' | 'iframe'

  // 過濾後工具清單
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchQuery = !searchQuery.trim() || tool.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchType = filterType === 'all' || tool.type === filterType;
      return matchQuery && matchType;
    });
  }, [tools, searchQuery, filterType]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newTools = [...tools];
    const [moved] = newTools.splice(draggedIndex, 1);
    newTools.splice(targetIndex, 0, moved);

    setDraggedIndex(null);
    if (onReorderTools) {
      onReorderTools(newTools);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'iframe': return <Frame size={13} className="text-emerald-500" />;
      default: return <Code size={13} className="text-amber-500" />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'iframe': return 'Iframe';
      default: return '自訂程式';
    }
  };

  if (!tools || tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="notebook-card p-8 max-w-md w-full flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#fff0eb] text-[#e17b62] flex items-center justify-center mb-4 border border-[#e1ac9e]">
            <Plus size={28} />
          </div>
          <h3 className="text-lg font-semibold text-[#1f2a2e] mb-1">
            這個空間還沒有任何小工具
          </h3>
          <p className="text-xs text-[#89959b] mb-6 leading-relaxed">
            點擊下方按鈕，直接挑選實用範本或貼上代碼，即可在空間中開始使用！
          </p>
          {isOwner && (
            <button
              onClick={onOpenAddModal}
              className="notebook-btn-primary w-full py-2.5 justify-center"
            >
              <Plus size={16} />
              <span>挑選範本或貼上工具代碼</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 當前分頁選定工具
  const currentTabTool = filteredTools.find((t) => t.id === activeTabId) || filteredTools[0] || tools[0];

  return (
    <div className="space-y-4">
      {/* 頂部搜尋與過濾篩選工具列 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-notebook border border-[#e4e8e5] shadow-sm">
        {/* 搜尋框 */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89959b]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋工具名稱…"
            className="notebook-input w-full pl-8 py-1.5 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#89959b] hover:text-[#1f2a2e] text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* 類型篩選標籤 */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-[#1f2a2e] text-white font-semibold'
                : 'text-[#69787f] hover:bg-[#f5f7f6]'
            }`}
          >
            全部 ({tools.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('html')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'html'
                ? 'bg-[#1f2a2e] text-white font-semibold'
                : 'text-[#69787f] hover:bg-[#f5f7f6]'
            }`}
          >
            自訂程式
          </button>
          <button
            type="button"
            onClick={() => setFilterType('iframe')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterType === 'iframe'
                ? 'bg-[#1f2a2e] text-white font-semibold'
                : 'text-[#69787f] hover:bg-[#f5f7f6]'
            }`}
          >
            Iframe 視窗
          </button>
        </div>
      </div>

      {/* 搜尋無結果提示 */}
      {filteredTools.length === 0 && (
        <div className="notebook-card p-8 text-center text-[#89959b] text-xs">
          找不到符合「{searchQuery}」的小工具，請嘗試其他關鍵字或清除篩選。
        </div>
      )}

      {/* 模式 1：折起專注模式 (Collapsed / Focus Accordion Mode) */}
      {layout === 'collapsed' && filteredTools.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-semibold text-[#89959b] uppercase tracking-wider">
              折起清單
            </span>
            <span className="notebook-badge text-[11px]">共 {filteredTools.length} 個小工具</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredTools.map((tool, index) => {
              const isExpanded = expandedToolId === tool.id;
              const parsed = parseToolInput(tool.content);

              return (
                <div
                  key={tool.id}
                  className={`notebook-card overflow-hidden transition-all ${
                    isExpanded ? 'shadow-notebook-hover border-[#d8dedb]' : 'hover:border-[#cbd4d0]'
                  }`}
                >
                  {/* 折起條頂部按鈕 */}
                  <div
                    onClick={() => setExpandedToolId(isExpanded ? null : tool.id)}
                    className="flex items-center justify-between px-4 py-3 bg-white cursor-pointer select-none transition-colors hover:bg-[#fafbfa]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-medium text-[#a2aaad] w-4">
                        #{index + 1}
                      </span>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e17b62] shrink-0" />
                      <span className="text-sm font-bold text-[#1f2a2e] truncate">
                        {tool.title}
                      </span>
                      <span className="notebook-badge">
                        {getTypeIcon(tool.type)}
                        <span>{getTypeName(tool.type)}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#89959b] font-medium hidden sm:inline">
                        {isExpanded ? '收起視窗' : '展開使用'}
                      </span>
                      <div className="p-1 rounded text-[#89959b]">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* 展開之大尺寸沙盒工作區 */}
                  {isExpanded && (
                    <div className="border-t border-[#e4e8e5] flex flex-col h-[560px] bg-white animate-fadeIn">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#fdfdfc] border-b border-[#e4e8e5] text-xs">
                        <span className="text-[#89959b]">正在專注使用中</span>
                        <div className="flex items-center gap-1.5">
                          {isOwner && onEditTool && (
                            <button
                              onClick={() => onEditTool(tool)}
                              className="text-xs text-[#89959b] hover:text-[#e17b62] hover:bg-[#fff0eb] px-2 py-1 rounded flex items-center gap-1"
                              title="編輯此工具"
                            >
                              <Pencil size={13} />
                              <span>編輯</span>
                            </button>
                          )}
                          <button
                            onClick={() => setFocusedTool(tool)}
                            className="text-xs text-[#e17b62] hover:underline flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-[#fff0eb]"
                          >
                            <Maximize2 size={13} />
                            <span>全螢幕投影</span>
                          </button>
                          {isOwner && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTool(tool.id);
                              }}
                              className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                            >
                              刪除
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 w-full relative">
                        <SandboxedFrame
                          htmlContent={parsed.htmlContent}
                          title={tool.title}
                          reloadKey={0}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 模式 2：分頁切換模式 (Tabs Mode) */}
      {layout === 'tabs' && filteredTools.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* 分頁標籤切換列 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filteredTools.map((t) => {
              const isActive = (currentTabTool?.id === t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTabId(t.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-notebook-sm transition-all whitespace-nowrap flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#fff9f6] text-[#e17b62] border-[#e1ac9e] shadow-sm font-semibold'
                      : 'bg-white text-[#89959b] border-[#e4e8e5] hover:border-[#cbd4d0] hover:text-[#1f2a2e]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#e17b62]' : 'bg-[#a2aaad]'}`} />
                  <span>{t.title}</span>
                </button>
              );
            })}
          </div>

          {/* 當前分頁內容卡片 */}
          {currentTabTool && (
            <div className="w-full">
              <ToolCard
                tool={currentTabTool}
                onDelete={onDeleteTool}
                onEdit={onEditTool}
                onFocus={setFocusedTool}
                onToggleColSpan={onToggleColSpan}
                isOwner={isOwner}
              />
            </div>
          )}
        </div>
      )}

      {/* 模式 3：靈活網格模式 (Grid Mode) */}
      {layout === 'grid' && filteredTools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              index={index}
              tool={tool}
              onDelete={onDeleteTool}
              onEdit={onEditTool}
              onFocus={setFocusedTool}
              onToggleColSpan={onToggleColSpan}
              draggable={isOwner && !searchQuery.trim()} // 搜尋時暫時禁用拖曳重排
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isOwner={isOwner}
            />
          ))}
        </div>
      )}

      {/* 聚焦全螢幕展示視窗 (Zen / Focus Modal) */}
      {focusedTool && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#1f2a2e]/60 backdrop-blur-sm p-4 md:p-8 animate-fadeIn">
          <div className="notebook-card flex-1 flex flex-col w-full h-full max-w-7xl mx-auto overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e8e5] bg-white">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e17b62]" />
                <h2 className="text-base font-bold text-[#1f2a2e]">
                  {focusedTool.title}
                </h2>
                <span className="notebook-badge">全螢幕專注展示</span>
              </div>
              <button
                onClick={() => setFocusedTool(null)}
                className="p-2 text-[#89959b] hover:text-[#1f2a2e] hover:bg-[#f5f7f6] rounded-lg transition-colors"
                title="關閉全螢幕"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 w-full relative bg-white">
              <SandboxedFrame
                htmlContent={parseToolInput(focusedTool.content).htmlContent}
                title={focusedTool.title}
                reloadKey={0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
