import React, { useState } from 'react';
import { LayoutGrid, Layers, X, Plus, ChevronDown, ChevronUp, Code, Globe, Frame, Maximize2, RotateCcw, GripVertical } from 'lucide-react';
import ToolCard from './ToolCard';
import SandboxedFrame from './SandboxedFrame';
import { parseToolInput } from '../utils/codeParser';

export default function SpaceLayout({
  tools,
  layout,
  onDeleteTool,
  onOpenAddModal,
  onToggleColSpan,
  onReorderTools,
  isOwner = true,
}) {
  const [activeTabId, setActiveTabId] = useState(tools[0]?.id || null);
  const [focusedTool, setFocusedTool] = useState(null);

  // 折起模式下的當前展開工具 ID (預設展開第一個，或 null)
  const [expandedToolId, setExpandedToolId] = useState(tools[0]?.id || null);

  // 拖曳狀態管理
  const [draggedIndex, setDraggedIndex] = useState(null);

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
      case 'url': return <Globe size={13} className="text-blue-500" />;
      case 'iframe': return <Frame size={13} className="text-emerald-500" />;
      default: return <Code size={13} className="text-amber-500" />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'url': return '網頁';
      case 'iframe': return 'Iframe';
      default: return '程式';
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
            點擊下方按鈕，直接貼上 HTML/JS 代碼、iframe 嵌入標籤或網址，即可在空間中開始使用！
          </p>
          {isOwner && (
            <button
              onClick={onOpenAddModal}
              className="notebook-btn-primary w-full py-2.5"
            >
              <Plus size={16} />
              <span>立即貼上工具代碼</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 當前分頁選定工具
  const currentTabTool = tools.find((t) => t.id === activeTabId) || tools[0];

  return (
    <div>
      {/* 模式 1：折起專注模式 (Collapsed / Focus Accordion Mode) */}
      {layout === 'collapsed' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-semibold text-[#89959b] uppercase tracking-wider">
              折起清單
            </span>
            <span className="notebook-badge text-[11px]">共 {tools.length} 個小工具</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {tools.map((tool, index) => {
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

                  {/* 展開之大尺寸沙盒工作區 (高度 560px 專注教學展示) */}
                  {isExpanded && (
                    <div className="border-t border-[#e4e8e5] flex flex-col h-[560px] bg-white animate-fadeIn">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#fdfdfc] border-b border-[#e4e8e5] text-xs">
                        <span className="text-[#89959b]">正在專注使用中</span>
                        <div className="flex items-center gap-1.5">
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
      {layout === 'tabs' && (
        <div className="flex flex-col gap-4">
          {/* 分頁標籤切換列 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {tools.map((t) => {
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
                onFocus={setFocusedTool}
                onToggleColSpan={onToggleColSpan}
                isOwner={isOwner}
              />
            </div>
          )}
        </div>
      )}

      {/* 模式 3：靈活網格模式 (Grid Mode - 支援拖曳交換與跨欄尺寸) */}
      {layout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              index={index}
              tool={tool}
              onDelete={onDeleteTool}
              onFocus={setFocusedTool}
              onToggleColSpan={onToggleColSpan}
              draggable={isOwner}
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
