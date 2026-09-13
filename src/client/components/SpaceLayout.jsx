import React, { useState, useMemo, useEffect } from 'react';
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
  ExternalLink,
  BookTemplate,
  CheckSquare,
  Square,
  Sun,
  Moon,
  Copy,
  Send,
  Kanban,
  Trash2,
  Palette,
} from 'lucide-react';
import ToolCard, { CARD_COLORS } from './ToolCard';
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
  onDuplicateTool,
  onCloneToolToSpace,
  onBatchUpdateTools,
  onBatchDeleteTools,
  onRenameSection,
  onDeleteSection,
  availableSpaces = [],
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
  const [editingSectionName, setEditingSectionName] = useState(null);
  const [tempSectionName, setTempSectionName] = useState('');

  // 搜尋與篩選狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'html' | 'iframe'
  const [selectedTag, setSelectedTag] = useState(null); // null 表示全部

  // 批次操作狀態 (Batch Selection)
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedToolIds, setSelectedToolIds] = useState([]);
  const [batchColorMenuOpen, setBatchColorMenuOpen] = useState(false);
  const [batchSectionMenuOpen, setBatchSectionMenuOpen] = useState(false);

  // 複製小工具彈窗狀態
  const [cloningTool, setCloningTool] = useState(null);

  // 專注全螢幕模式狀態
  const [focusBg, setFocusBg] = useState('paper'); // 'paper' | 'black'
  const [focusReloadKey, setFocusReloadKey] = useState(0);

  // 專注模式 Esc 鍵快速退出監聽
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && focusedTool) {
        setFocusedTool(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedTool]);

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

  // 儲存重新命名分欄
  const handleSaveSectionRename = (oldSec) => {
    const newName = tempSectionName.trim();
    if (newName && newName !== oldSec) {
      if (onRenameSection) {
        onRenameSection(oldSec, newName);
      }
      setCustomSections((prev) => prev.map((s) => (s === oldSec ? newName : s)));
    }
    setEditingSectionName(null);
  };

  // 刪除分欄並將其內小工具移至一般工具
  const handleDeleteSectionConfirm = (sec) => {
    if (window.confirm(`確定要刪除「${sec}」分欄嗎？此分欄內的所有小工具將會自動移至「一般工具」。`)) {
      if (onDeleteSection) {
        onDeleteSection(sec);
      }
      setCustomSections((prev) => prev.filter((s) => s !== sec));
    }
  };

  // 批次管理輔助函式
  const handleToggleSelectTool = (toolId) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedToolIds.length === sortedAndFilteredTools.length) {
      setSelectedToolIds([]);
    } else {
      setSelectedToolIds(sortedAndFilteredTools.map((t) => t.id));
    }
  };

  const handleBatchAddTag = () => {
    const tag = window.prompt('請輸入要批次加入的標籤名稱 (例如：專注、生活)：');
    if (!tag || !tag.trim()) return;
    const cleanTag = tag.trim().replace(/^#/, '');
    if (onBatchUpdateTools) {
      const selectedTools = tools.filter((t) => selectedToolIds.includes(t.id));
      selectedTools.forEach((t) => {
        const currentTags = Array.isArray(t.tags)
          ? t.tags
          : typeof t.tags === 'string'
          ? t.tags.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
        if (!currentTags.includes(cleanTag)) {
          const newTags = [...currentTags, cleanTag];
          onBatchUpdateTools([t.id], { tags: newTags });
        }
      });
    }
  };

  const handleBatchDelete = () => {
    if (onBatchDeleteTools) {
      onBatchDeleteTools(selectedToolIds);
      setSelectedToolIds([]);
      setIsBatchMode(false);
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

            <div className="h-4 w-px bg-[var(--line)] mx-0.5 hidden sm:block" />

            {/* 範本專區快捷按鈕 */}
            <button
              type="button"
              onClick={() => onOpenAddModal && onOpenAddModal('一般工具', 'templates')}
              className="notebook-btn-secondary py-1.5 px-3 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 text-[var(--coral)] hover:bg-[var(--coral-light)] shrink-0"
              title="瀏覽精選 15 款小工具範本並加入空間"
            >
              <BookTemplate size={13} />
              <span>範本專區</span>
            </button>

            {/* 批次操作模式切換按鈕 */}
            {isOwner && (
              <button
                type="button"
                onClick={() => {
                  const next = !isBatchMode;
                  setIsBatchMode(next);
                  if (!next) setSelectedToolIds([]);
                }}
                className={`py-1.5 px-3 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isBatchMode
                    ? 'bg-[var(--coral)] text-white font-bold shadow-xs'
                    : 'notebook-btn-secondary text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
                title="啟用多選批次管理"
              >
                <CheckSquare size={13} />
                <span>{isBatchMode ? '結束批次選取' : '批次選取'}</span>
              </button>
            )}
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
                      {/* 批次選取框 */}
                      {isBatchMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelectTool(tool.id);
                          }}
                          className="p-0.5 text-[var(--coral)] hover:scale-110 transition-transform shrink-0"
                          title={selectedToolIds.includes(tool.id) ? '取消選取' : '選取此工具'}
                        >
                          {selectedToolIds.includes(tool.id) ? (
                            <CheckSquare size={16} className="fill-[var(--coral-light)]" />
                          ) : (
                            <Square size={16} className="text-[var(--muted)]" />
                          )}
                        </button>
                      )}
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
                          {isOwner && onDuplicateTool && (
                            <button
                              onClick={() => onDuplicateTool(tool)}
                              className="text-xs text-[var(--muted)] hover:text-[var(--coral)] hover:bg-[var(--coral-light)] px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                              title="建立此工具副本"
                            >
                              <Copy size={13} />
                              <span>副本</span>
                            </button>
                          )}
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
                onDuplicate={onDuplicateTool}
                onCloneToSpace={(tool) => setCloningTool(tool)}
                isBatchMode={isBatchMode}
                isSelected={selectedToolIds.includes(currentTabTool.id)}
                onToggleSelect={handleToggleSelectTool}
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
              onDuplicate={onDuplicateTool}
              onCloneToSpace={(tool) => setCloningTool(tool)}
              isBatchMode={isBatchMode}
              isSelected={selectedToolIds.includes(tool.id)}
              onToggleSelect={handleToggleSelectTool}
              draggable={isOwner && !searchQuery.trim() && !selectedTag && !isBatchMode}
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
                {/* 欄位頂部標題與數量 (支援重新命名與刪除) */}
                <div className="flex items-center justify-between px-1 py-0.5 group">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)] shrink-0" />
                    {editingSectionName === sec ? (
                      <input
                        type="text"
                        autoFocus
                        value={tempSectionName}
                        onChange={(e) => setTempSectionName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveSectionRename(sec);
                          if (e.key === 'Escape') setEditingSectionName(null);
                        }}
                        onBlur={() => handleSaveSectionRename(sec)}
                        className="notebook-input text-xs py-0.5 px-1.5 w-32"
                      />
                    ) : (
                      <h4
                        className="text-xs font-bold text-[var(--ink)] truncate cursor-pointer hover:text-[var(--coral)]"
                        title={isOwner ? '點擊重新命名此分欄' : sec}
                        onClick={() => {
                          if (isOwner) {
                            setEditingSectionName(sec);
                            setTempSectionName(sec);
                          }
                        }}
                      >
                        {sec}
                      </h4>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="notebook-badge text-[10px] shrink-0">{secTools.length}</span>
                    {isOwner && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSectionName(sec);
                            setTempSectionName(sec);
                          }}
                          className="p-1 text-[var(--muted)] hover:text-[var(--ink)] opacity-0 group-hover:opacity-100 transition-opacity rounded"
                          title="重新命名此分欄"
                        >
                          <Pencil size={11} />
                        </button>
                        {sec !== '一般工具' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSectionConfirm(sec)}
                            className="p-1 text-[var(--muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                            title="刪除此分欄 (內含工具移至一般工具)"
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
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
                      onDuplicate={onDuplicateTool}
                      onCloneToSpace={(tool) => setCloningTool(tool)}
                      isBatchMode={isBatchMode}
                      isSelected={selectedToolIds.includes(tool.id)}
                      onToggleSelect={handleToggleSelectTool}
                      draggable={isOwner && !isBatchMode}
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
                onDuplicate={onDuplicateTool}
                onCloneToSpace={(tool) => setCloningTool(tool)}
                isBatchMode={isBatchMode}
                isSelected={selectedToolIds.includes(tool.id)}
                onToggleSelect={handleToggleSelectTool}
                draggable={isOwner && !searchQuery.trim() && !selectedTag && !isBatchMode}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isOwner={isOwner}
              />
            </div>
          ))}
        </div>
      )}

      {/* 批次操作浮動控制列 (Floating Batch Actions Bar) */}
      {isBatchMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--card-bg)] border border-[var(--line)] shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-2.5 animate-fadeIn flex-wrap max-w-[95vw]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)]">
            <CheckSquare size={15} className="text-[var(--coral)]" />
            <span>已選取 {selectedToolIds.length} 個工具</span>
          </div>

          <div className="h-4 w-px bg-[var(--line)] hidden sm:block" />

          {/* 全選 / 反選 */}
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="notebook-btn-secondary text-xs py-1 px-2"
          >
            {selectedToolIds.length === sortedAndFilteredTools.length && sortedAndFilteredTools.length > 0
              ? '取消全選'
              : '全選目前工具'}
          </button>

          {/* 批次換色 */}
          <div className="relative">
            <button
              type="button"
              disabled={selectedToolIds.length === 0}
              onClick={() => setBatchColorMenuOpen(!batchColorMenuOpen)}
              className="notebook-btn-secondary text-xs py-1 px-2 flex items-center gap-1 disabled:opacity-40"
            >
              <Palette size={13} />
              <span>變更便箋色</span>
            </button>
            {batchColorMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setBatchColorMenuOpen(false)} />
                <div className="absolute bottom-full mb-2 left-0 bg-[var(--card-bg)] border border-[var(--line)] rounded-xl shadow-xl p-2 grid grid-cols-3 gap-1.5 z-50">
                  {CARD_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onBatchUpdateTools && onBatchUpdateTools(selectedToolIds, { color: c.id });
                        setBatchColorMenuOpen(false);
                      }}
                      className="w-7 h-7 rounded-lg border hover:scale-110 transition-transform"
                      style={{ backgroundColor: c.bg, borderColor: c.border }}
                      title={c.label}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 批次移動分欄 */}
          <div className="relative">
            <button
              type="button"
              disabled={selectedToolIds.length === 0}
              onClick={() => setBatchSectionMenuOpen(!batchSectionMenuOpen)}
              className="notebook-btn-secondary text-xs py-1 px-2 flex items-center gap-1 disabled:opacity-40"
            >
              <Kanban size={13} />
              <span>移至分欄</span>
            </button>
            {batchSectionMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setBatchSectionMenuOpen(false)} />
                <div className="absolute bottom-full mb-2 left-0 bg-[var(--card-bg)] border border-[var(--line)] rounded-xl shadow-xl p-1.5 z-50 min-w-[130px] space-y-1">
                  {allSections.map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        onBatchUpdateTools && onBatchUpdateTools(selectedToolIds, { section: sec });
                        setBatchSectionMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1 text-xs hover:bg-[var(--paper)] rounded-lg text-[var(--ink)] truncate"
                    >
                      {sec}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 批次加入標籤 */}
          <button
            type="button"
            disabled={selectedToolIds.length === 0}
            onClick={handleBatchAddTag}
            className="notebook-btn-secondary text-xs py-1 px-2 flex items-center gap-1 disabled:opacity-40"
          >
            <Tag size={13} />
            <span>加入標籤…</span>
          </button>

          {/* 批次刪除 */}
          {isOwner && (
            <button
              type="button"
              disabled={selectedToolIds.length === 0}
              onClick={handleBatchDelete}
              className="px-2.5 py-1 text-xs rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold flex items-center gap-1 disabled:opacity-40 transition-colors"
            >
              <Trash2 size={13} />
              <span>刪除選取</span>
            </button>
          )}

          {/* 退出批次選取 */}
          <button
            type="button"
            onClick={() => {
              setIsBatchMode(false);
              setSelectedToolIds([]);
            }}
            className="notebook-btn-primary text-xs py-1 px-3"
          >
            完成
          </button>
        </div>
      )}

      {/* 複製小工具至指定空間對話框 */}
      {cloningTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#11151a]/60 backdrop-blur-sm animate-fadeIn">
          <div className="notebook-modal-box w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="notebook-modal-badge text-blue-500">
                  <Send size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)]">複製小工具至其他空間</h3>
                  <p className="text-[11px] text-[var(--muted)]">將「{cloningTool.title}」複製為其他空間中的獨立工具</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCloningTool(null)}
                className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {availableSpaces.length === 0 ? (
                <p className="text-xs text-[var(--muted)] text-center py-4">目前無其他可用的手帳空間</p>
              ) : (
                availableSpaces.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={async () => {
                      if (onCloneToolToSpace) {
                        await onCloneToolToSpace(cloningTool, sp.id);
                        setCloningTool(null);
                      }
                    }}
                    className="w-full p-3 rounded-xl border border-[var(--line)] bg-[var(--paper)]/50 hover:bg-blue-500/10 hover:border-blue-500/30 text-left flex items-center justify-between transition-all group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="text-xs font-bold text-[var(--ink)] group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">{sp.name}</div>
                      <div className="text-[10px] text-[var(--muted)] truncate">{sp.description || '無備註說明'}</div>
                    </div>
                    <span className="notebook-badge text-[10px] bg-[var(--card-bg)] text-[var(--muted)] shrink-0">複製此處</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 聚焦全螢幕展示視窗 (Zen / Focus Modal) */}
      {focusedTool && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#11151a]/70 backdrop-blur-sm p-4 md:p-8 animate-fadeIn">
          <div className={`notebook-card flex-1 flex flex-col w-full h-full max-w-7xl mx-auto overflow-hidden shadow-2xl border border-[var(--line)] ${focusBg === 'black' ? 'bg-[#0a0c10]' : ''}`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--card-bg)]">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--coral)]" />
                <h2 className="text-base font-bold text-[var(--ink)]">
                  {focusedTool.title}
                </h2>
                <span className="notebook-badge">全螢幕專注展示</span>
                <span className="text-[11px] text-[var(--muted)] hidden sm:inline">(按 Esc 退出)</span>
              </div>
              <div className="flex items-center gap-2">
                {/* 重新整理小工具 */}
                <button
                  type="button"
                  onClick={() => setFocusReloadKey((k) => k + 1)}
                  className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-xl transition-colors"
                  title="重新整理小工具視窗"
                >
                  <RotateCcw size={16} />
                </button>
                {/* 切換深黑 / 手帳紙底色 */}
                <button
                  type="button"
                  onClick={() => setFocusBg(focusBg === 'paper' ? 'black' : 'paper')}
                  className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-xl transition-colors"
                  title={focusBg === 'paper' ? '切換為極黑專注底色' : '切換回手帳紙質底色'}
                >
                  {focusBg === 'paper' ? <Moon size={16} /> : <Sun size={16} />}
                </button>
                {/* 獨立快顯外開 */}
                <button
                  type="button"
                  onClick={() => {
                    const parsed = parseToolInput(focusedTool.content);
                    const w = window.open('', '_blank', 'width=840,height=620,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
                    if (w) {
                      w.document.title = `${focusedTool.title} - 工具小本本`;
                      w.document.open();
                      w.document.write(parsed.htmlContent);
                      w.document.close();
                    }
                  }}
                  className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-xl transition-colors"
                  title="以獨立視窗快顯外開"
                >
                  <ExternalLink size={16} />
                </button>
                <div className="h-4 w-px bg-[var(--line)] mx-1" />
                <button
                  onClick={() => setFocusedTool(null)}
                  className="p-2 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--paper)] rounded-xl transition-colors"
                  title="關閉全螢幕專注模式"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className={`flex-1 w-full relative ${focusBg === 'black' ? 'bg-[#0a0c10]' : 'bg-[var(--card-bg)]'}`}>
              <SandboxedFrame
                htmlContent={parseToolInput(focusedTool.content).htmlContent}
                title={focusedTool.title}
                reloadKey={focusReloadKey}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
