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
  Pin,
  Tag,
  ExternalLink
} from 'lucide-react';
import ToolCard from './ToolCard';
import SandboxedFrame from './SandboxedFrame';
import { parseToolInput } from '../utils/codeParser';
import { ToolsEmptyIllustration, SearchEmptyIllustration, EmptyShelfBasketDoodle, SpaceStationeryBannerDoodle } from './Illustrations';

export default function SpaceLayout({
  tools = [],
  layout,
  onDeleteTool,
  onEditTool,
  onOpenAddModal,
  onToggleColSpan,
  onTogglePin,
  onChangeColor,
  onUpdateToolSection,
  onReorderTools,
  isOwner = true,
}) {
  const [activeTabId, setActiveTabId] = useState(tools[0]?.id || null);
  const [focusedTool, setFocusedTool] = useState(null);
  const [expandedToolId, setExpandedToolId] = useState(tools[0]?.id || null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // 貨架分欄 (Shelf) 狀態
  const [newSectionName, setNewSectionName] = useState('');
  const [showAddSectionInput, setShowAddSectionInput] = useState(false);
  const [customSections, setCustomSections] = useState([]);
  const [shelfDragOverSection, setShelfDragOverSection] = useState(null);

  // 搜尋與篩選狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'html' | 'iframe'
  const [selectedTag, setSelectedTag] = useState(null); // null 表示全部

  // 彙整空間內所有欄位名稱清單
  const allSections = useMemo(() => {
    const list = new Set(['一般工具', ...customSections]);
    tools.forEach((t) => {
      if (t.section) list.add(t.section);
    });
    return Array.from(list);
  }, [tools, customSections]);

  // 彙整空間中所有工具的標籤清單
  const availableTags = useMemo(() => {
    const set = new Set();
    tools.forEach((t) => {
      if (Array.isArray(t.tags)) {
        t.tags.forEach((tag) => tag && set.add(tag.trim()));
      } else if (typeof t.tags === 'string') {
        t.tags.split(',').forEach((tag) => tag.trim() && set.add(tag.trim()));
      }
    });
    return Array.from(set);
  }, [tools]);

  // 過濾後且依置頂順序排序之工具清單
  const sortedAndFilteredTools = useMemo(() => {
    const filtered = tools.filter((tool) => {
      const matchQuery =
        !searchQuery.trim() ||
        tool.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        (Array.isArray(tool.tags) && tool.tags.some((t) => t.toLowerCase().includes(searchQuery.trim().toLowerCase())));
      const matchType = filterType === 'all' || tool.type === filterType;
      const matchTag =
        !selectedTag ||
        (Array.isArray(tool.tags)
          ? tool.tags.includes(selectedTag)
          : typeof tool.tags === 'string'
          ? tool.tags.split(',').map((s) => s.trim()).includes(selectedTag)
          : false);
      return matchQuery && matchType && matchTag;
    });

    // 置頂釘選的工具排在最前面
    return [...filtered].sort((a, b) => {
      const pinA = a.isPinned ? 1 : 0;
      const pinB = b.isPinned ? 1 : 0;
      return pinB - pinA;
    });
  }, [tools, searchQuery, filterType, selectedTag]);

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

  // 貨架跨欄位拖曳放置 (Cross-shelf Drop)
  const handleShelfDrop = (e, targetSection) => {
    e.preventDefault();
    setShelfDragOverSection(null);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data && data.toolId && onUpdateToolSection) {
          onUpdateToolSection(data.toolId, targetSection);
        }
      }
    } catch (err) {
      console.warn('Shelf drop error:', err);
    }
  };

  // 新增貨架欄位
  const handleAddSectionSubmit = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    setCustomSections((prev) => [...new Set([...prev, newSectionName.trim()])]);
    setNewSectionName('');
    setShowAddSectionInput(false);
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
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center animate-fadeIn">
        <div className="notebook-card p-8 sm:p-12 max-w-lg w-full flex flex-col items-center shadow-lg space-y-4">
          <ToolsEmptyIllustration className="w-72 sm:w-80 h-48 sm:h-52 mb-1" />
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-[var(--ink,#1f2a2e)]">
              這個手帳空間還沒有任何小工具
            </h3>
            <p className="text-xs text-[var(--muted,#89959b)] leading-relaxed max-w-sm mx-auto">
              點擊下方按鈕，挑選現成高質感範本或貼上代碼，立即開啟專屬手帳儀表板！
            </p>
          </div>
          {isOwner && (
            <button
              onClick={() => onOpenAddModal && onOpenAddModal('一般工具')}
              className="notebook-btn-primary w-full py-2.5 justify-center shadow-xs hover:scale-[1.02] transition-transform"
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
  const currentTabTool = sortedAndFilteredTools.find((t) => t.id === activeTabId) || sortedAndFilteredTools[0] || tools[0];

  return (
    <div className="w-full flex-1 flex flex-col space-y-4 animate-fadeIn">
      {/* 頂部搜尋、標籤與過濾篩選工具列 */}
      <div className="flex flex-col gap-2.5 bg-[var(--card-bg)] px-4 py-3 rounded-2xl border border-[var(--line)] shadow-xs relative overflow-hidden">
        {/* 背景文具橫幅微型飾紋 */}
        <div className="absolute right-4 top-1 pointer-events-none opacity-25 dark:opacity-15 hidden lg:block">
          <SpaceStationeryBannerDoodle className="w-36 h-9 text-[var(--muted)]" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 z-10">
          {/* 搜尋框 */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋工具名稱或 #標籤…"
              className="notebook-input notebook-input-search w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* 類型篩選標籤 */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                filterType === 'all'
                  ? 'bg-[var(--coral)] text-white font-semibold shadow-xs'
                  : 'text-[var(--muted)] hover:bg-[var(--paper)]'
              }`}
            >
              全部 ({tools.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('html')}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                filterType === 'html'
                  ? 'bg-[var(--coral)] text-white font-semibold shadow-xs'
                  : 'text-[var(--muted)] hover:bg-[var(--paper)]'
              }`}
            >
              自訂程式
            </button>
            <button
              type="button"
              onClick={() => setFilterType('iframe')}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap shrink-0 ${
                filterType === 'iframe'
                  ? 'bg-[var(--coral)] text-white font-semibold shadow-xs'
                  : 'text-[var(--muted)] hover:bg-[var(--paper)]'
              }`}
            >
              Iframe 視窗
            </button>
          </div>
        </div>

        {/* 標籤過濾清單 (若有任何標籤) */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--line)] overflow-x-auto pb-0.5">
            <span className="text-[11px] text-[var(--muted)] font-medium flex items-center gap-1 shrink-0 whitespace-nowrap">
              <Tag size={12} className="shrink-0" />
              <span>標籤：</span>
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] transition-all shrink-0 ${
                !selectedTag
                  ? 'bg-[var(--ink)] text-[var(--paper)] font-semibold shadow-xs'
                  : 'notebook-tag hover:text-[var(--ink)]'
              }`}
            >
              全部
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] transition-all shrink-0 ${
                  selectedTag === tag
                    ? 'notebook-tag-active font-semibold shadow-xs'
                    : 'notebook-tag hover:text-[var(--ink)]'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 搜尋無結果提示插畫 */}
      {sortedAndFilteredTools.length === 0 && (
        <div className="notebook-card p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 animate-fadeIn">
          <SearchEmptyIllustration className="w-64 sm:w-72 h-40 sm:h-44 mb-1" />
          <h3 className="text-sm font-bold text-[var(--ink,#1f2a2e)]">找不到相符的小工具</h3>
          <p className="text-xs text-[var(--muted,#89959b)] max-w-sm leading-relaxed">
            找不到符合「{searchQuery || selectedTag}」的小工具，請嘗試其他關鍵字或清除篩選。
          </p>
          {(searchQuery || selectedTag) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTag(null);
                setFilterType('all');
              }}
              className="notebook-btn-secondary text-xs py-1.5 px-3 mt-1"
            >
              清除所有搜尋與篩選
            </button>
          )}
        </div>
      )}

      {/* 模式 1：折起專注模式 (Collapsed / Focus Accordion Mode) */}
      {layout === 'collapsed' && sortedAndFilteredTools.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
              折起清單
            </span>
            <span className="notebook-badge text-[11px]">共 {sortedAndFilteredTools.length} 個小工具</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {sortedAndFilteredTools.map((tool, index) => {
              const isExpanded = expandedToolId === tool.id;
              const parsed = parseToolInput(tool.content);

              const handlePopout = (e) => {
                e.stopPropagation();
                const w = window.open('', '_blank', 'width=840,height=620,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
                if (w) {
                  w.document.title = `${tool.title} - 工具小本本`;
                  w.document.open();
                  w.document.write(parsed.htmlContent);
                  w.document.close();
                }
              };

              return (
                <div
                  key={tool.id}
                  className={`notebook-card overflow-hidden transition-all ${
                    isExpanded ? 'shadow-md border-[var(--coral-border)]' : 'hover:border-[var(--line)]'
                  } ${tool.isPinned ? 'ring-1 ring-[var(--coral)]/40' : ''}`}
                >
                  {/* 折起條頂部按鈕 */}
                  <div
                    onClick={() => setExpandedToolId(isExpanded ? null : tool.id)}
                    className="flex items-center justify-between px-4 py-3 bg-[var(--card-bg)] cursor-pointer select-none transition-colors hover:bg-[var(--paper)]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-medium text-[var(--faint)] w-4">
                        #{index + 1}
                      </span>
                      <div className="w-2.5 h-2.5 rounded-full bg-[var(--coral)] shrink-0" />
                      <span className="text-sm font-bold text-[var(--ink)] truncate">
                        {tool.title}
                      </span>
                      {tool.isPinned && (
                        <span className="notebook-pin-badge shrink-0" title="已置頂釘選">
                          <Pin size={9} className="fill-current" />
                          <span>置頂</span>
                        </span>
                      )}
                      <span className="notebook-badge">
                        {getTypeIcon(tool.type)}
                        <span>{getTypeName(tool.type)}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {onTogglePin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePin(tool.id);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            tool.isPinned
                              ? 'bg-[var(--coral-light)] text-[var(--coral)]'
                              : 'text-[var(--muted)] hover:text-[var(--ink)]'
                          }`}
                          title={tool.isPinned ? '取消置頂' : '置頂釘選'}
                        >
                          <Pin size={14} className={tool.isPinned ? 'fill-current' : ''} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handlePopout}
                        className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] rounded-lg transition-colors"
                        title="獨立浮動視窗"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <span className="text-xs text-[var(--muted)] font-medium hidden sm:inline">
                        {isExpanded ? '收起視窗' : '展開使用'}
                      </span>
                      <div className="p-1 rounded text-[var(--muted)]">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* 展開之大尺寸沙盒工作區 */}
                  {isExpanded && (
                    <div className="border-t border-[var(--line)] flex flex-col h-[560px] bg-[var(--card-bg)] animate-fadeIn">
                      <div className="flex items-center justify-between px-4 py-2 bg-[var(--paper)] border-b border-[var(--line)] text-xs">
                        <span className="text-[var(--muted)]">正在專注使用中</span>
                        <div className="flex items-center gap-1.5">
                          {isOwner && onEditTool && (
                            <button
                              onClick={() => onEditTool(tool)}
                              className="text-xs text-[var(--muted)] hover:text-[var(--coral)] hover:bg-[var(--coral-light)] px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                              title="編輯此工具"
                            >
                              <Pencil size={13} />
                              <span>編輯</span>
                            </button>
                          )}
                          <button
                            onClick={() => setFocusedTool(tool)}
                            className="text-xs text-[var(--coral)] hover:underline flex items-center gap-1 font-medium px-2 py-1 rounded-lg hover:bg-[var(--coral-light)] transition-colors"
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
                              className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1 rounded-lg transition-colors"
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
      {layout === 'tabs' && sortedAndFilteredTools.length > 0 && (
        <div className="flex-1 flex flex-col gap-4 min-h-[calc(100vh-230px)]">
          {/* 分頁標籤切換列 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {sortedAndFilteredTools.map((t) => {
              const isActive = currentTabTool?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTabId(t.id)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl transition-all whitespace-nowrap flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[var(--coral-light)] text-[var(--coral)] border-[var(--coral-border)] shadow-xs font-semibold'
                      : 'bg-[var(--card-bg)] text-[var(--muted)] border-[var(--line)] hover:border-[var(--coral-border)] hover:text-[var(--ink)]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[var(--coral)]' : 'bg-[var(--faint)]'}`} />
                  {t.isPinned && <Pin size={10} className="text-[var(--coral)] fill-current" />}
                  <span>{t.title}</span>
                </button>
              );
            })}
          </div>

          {/* 當前分頁內容卡片 */}
          {currentTabTool && (
            <div className="w-full flex-1 flex flex-col">
              <ToolCard
                tool={currentTabTool}
                layout="tabs"
                onDelete={onDeleteTool}
                onEdit={onEditTool}
                onFocus={setFocusedTool}
                onToggleColSpan={onToggleColSpan}
                onTogglePin={onTogglePin}
                onChangeColor={onChangeColor}
                isOwner={isOwner}
              />
            </div>
          )}
        </div>
      )}

      {/* 模式 3：靈活網格模式 (Grid Mode) */}
      {layout === 'grid' && sortedAndFilteredTools.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
          {sortedAndFilteredTools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              index={index}
              tool={tool}
              layout="grid"
              onDelete={onDeleteTool}
              onEdit={onEditTool}
              onFocus={setFocusedTool}
              onToggleColSpan={onToggleColSpan}
              onTogglePin={onTogglePin}
              onChangeColor={onChangeColor}
              draggable={isOwner && !searchQuery.trim() && !selectedTag} // 搜尋或標籤過濾時暫時禁用拖曳重排
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isOwner={isOwner}
            />
          ))}
        </div>
      )}

      {/* 模式 4：貨架分欄模式 (Shelf / Columns Kanban) */}
      {layout === 'shelf' && (
        <div className="shelf-scroll-area">
          {allSections.map((sec) => {
            const secTools = sortedAndFilteredTools.filter(
              (t) => (t.section || '一般工具') === sec
            );
            const isDragActive = shelfDragOverSection === sec;

            return (
              <div
                key={sec}
                className="shelf-column-card"
                onDragOver={(e) => {
                  e.preventDefault();
                  setShelfDragOverSection(sec);
                }}
                onDragLeave={() => setShelfDragOverSection(null)}
                onDrop={(e) => handleShelfDrop(e, sec)}
              >
                {/* 欄位頂部標題與數量 */}
                <div className="flex items-center justify-between px-1 py-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)] shrink-0" />
                    <h4 className="text-xs font-bold text-[var(--ink)] truncate">{sec}</h4>
                  </div>
                  <span className="notebook-badge text-[10px] shrink-0">{secTools.length}</span>
                </div>

                {/* 欄位內卡片列表 */}
                <div
                  className={`flex flex-col gap-3.5 shelf-drop-zone ${
                    isDragActive ? 'drag-active' : ''
                  }`}
                >
                  {secTools.map((tool, index) => (
                    <ToolCard
                      key={tool.id}
                      index={index}
                      tool={tool}
                      layout="shelf"
                      onDelete={onDeleteTool}
                      onEdit={onEditTool}
                      onFocus={setFocusedTool}
                      onToggleColSpan={onToggleColSpan}
                      onTogglePin={onTogglePin}
                      onChangeColor={onChangeColor}
                      draggable={isOwner}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      isOwner={isOwner}
                    />
                  ))}

                  {secTools.length === 0 && (
                    <div className="py-8 px-4 border-2 border-dashed border-[var(--line)] rounded-2xl text-center flex flex-col items-center justify-center gap-1.5 text-xs text-[var(--muted)]">
                      <EmptyShelfBasketDoodle className="w-14 h-11 text-[var(--muted)] opacity-60 dark:opacity-40" />
                      <span>可將工具拖曳至此欄</span>
                    </div>
                  )}
                </div>

                {/* 欄位底部快速新增按鈕 */}
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => onOpenAddModal && onOpenAddModal(sec)}
                    className="notebook-btn-secondary text-xs py-2 justify-center border-dashed border-[var(--line)] hover:border-[var(--coral)] hover:text-[var(--coral)] rounded-xl"
                  >
                    <Plus size={13} />
                    <span>在此欄新增小工具</span>
                  </button>
                )}
              </div>
            );
          })}

          {/* 新增分欄按鈕 / 表單 */}
          {isOwner && (
            <div className="flex-shrink-0 w-64">
              {showAddSectionInput ? (
                <form
                  onSubmit={handleAddSectionSubmit}
                  className="p-3 bg-[var(--card-bg)] border border-[var(--line)] rounded-2xl shadow-md space-y-2"
                >
                  <input
                    type="text"
                    autoFocus
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="輸入新分欄名稱…"
                    className="notebook-input w-full text-xs py-1.5"
                    required
                  />
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAddSectionInput(false)}
                      className="notebook-btn-secondary text-xs py-1 px-2.5"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="notebook-btn-primary text-xs py-1 px-3"
                    >
                      新增欄位
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddSectionInput(true)}
                  className="w-full notebook-btn-secondary py-3 text-xs border-dashed border-[var(--line)] hover:border-[var(--coral)] hover:text-[var(--coral)] justify-center rounded-2xl"
                >
                  <Plus size={14} />
                  <span>新增分欄 (Section)…</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 模式 5：緊湊瀑布流模式 (Masonry Wall Mode) */}
      {layout === 'wall' && sortedAndFilteredTools.length > 0 && (
        <div className="masonry-wall-container">
          {sortedAndFilteredTools.map((tool, index) => (
            <div key={tool.id} className="masonry-wall-item">
              <ToolCard
                index={index}
                tool={tool}
                layout="wall"
                onDelete={onDeleteTool}
                onEdit={onEditTool}
                onFocus={setFocusedTool}
                onToggleColSpan={onToggleColSpan}
                onTogglePin={onTogglePin}
                onChangeColor={onChangeColor}
                draggable={isOwner && !searchQuery.trim() && !selectedTag}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isOwner={isOwner}
              />
            </div>
          ))}
        </div>
      )}

      {/* 聚焦全螢幕展示視窗 (Zen / Focus Modal) */}
      {focusedTool && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#11151a]/60 backdrop-blur-sm p-4 md:p-8 animate-fadeIn">
          <div className="notebook-card flex-1 flex flex-col w-full h-full max-w-7xl mx-auto overflow-hidden shadow-2xl border border-[var(--line)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--card-bg)]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)]" />
                <h2 className="text-base font-bold text-[var(--ink)]">
                  {focusedTool.title}
                </h2>
                <span className="notebook-badge">全螢幕專注展示</span>
              </div>
              <button
                onClick={() => setFocusedTool(null)}
                className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-xl transition-colors"
                title="關閉全螢幕"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 w-full relative bg-[var(--card-bg)]">
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
