import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  LayoutGrid,
  Kanban,
  Layers,
  FoldVertical,
  Columns,
  Sun,
  Moon,
  Plus,
  Tv,
  FolderPlus,
  Download,
  Upload,
  ArrowRight,
  Sparkles,
  Command,
  X,
  Code,
  Globe,
  Frame
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  spaces = [],
  currentSpace,
  tools = [],
  onSelectSpace,
  onSelectTool,
  onOpenAddTool,
  onOpenCreateSpace,
  onSetLayout,
  onSetTheme,
  onTogglePresentation,
  onExportSpace,
  onOpenSettings,
  currentTheme = 'warm',
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // 打開時聚焦搜尋框並重置
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // 全域快捷鍵監聽 Esc 退出
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 系統預設操作指令庫
  const systemActions = useMemo(() => [
    {
      id: 'action-add-tool',
      group: '常用指令',
      title: '新增小工具至當前空間',
      hint: '貼入代碼、iframe 或挑選範本',
      icon: <Plus size={16} className="text-[var(--coral)]" />,
      perform: () => onOpenAddTool?.(),
    },
    {
      id: 'action-toggle-presentation',
      group: '常用指令',
      title: '切換大螢幕投影簡報模式',
      hint: '快捷鍵 Shift + P，隱藏導覽列沉浸展示',
      icon: <Tv size={16} className="text-purple-500" />,
      perform: () => onTogglePresentation?.(),
    },
    {
      id: 'action-create-space',
      group: '空間操作',
      title: '建立新的手帳空間',
      hint: '開闢獨立工具工作區',
      icon: <FolderPlus size={16} className="text-emerald-500" />,
      perform: () => onOpenCreateSpace?.(),
    },
    {
      id: 'action-export-space',
      group: '空間操作',
      title: '匯出當前空間備份 (JSON)',
      hint: '完整備份空間內所有工具設定',
      icon: <Download size={16} className="text-blue-500" />,
      perform: () => onExportSpace?.(),
    },
    {
      id: 'action-layout-shelf',
      group: '版型切換',
      title: '切換為 貨架分欄 (Shelf / Kanban)',
      hint: '支援跨欄自由拖曳與分類收納',
      icon: <Kanban size={16} className="text-amber-500" />,
      perform: () => onSetLayout?.('shelf'),
    },
    {
      id: 'action-layout-wall',
      group: '版型切換',
      title: '切換為 瀑布流 (Masonry / Wall)',
      hint: '無縫拼接長短卡片消除留白',
      icon: <Columns size={16} className="text-indigo-500" />,
      perform: () => onSetLayout?.('wall'),
    },
    {
      id: 'action-layout-grid',
      group: '版型切換',
      title: '切換為 網格並列 (Grid)',
      hint: '經典手帳卡片並排視圖',
      icon: <LayoutGrid size={16} className="text-teal-500" />,
      perform: () => onSetLayout?.('grid'),
    },
    {
      id: 'action-layout-tabs',
      group: '版型切換',
      title: '切換為 分頁輪播 (Tabs)',
      hint: '上方標籤列切換單一工具',
      icon: <Layers size={16} className="text-sky-500" />,
      perform: () => onSetLayout?.('tabs'),
    },
    {
      id: 'action-layout-collapsed',
      group: '版型切換',
      title: '切換為 折起專注 (Collapsed)',
      hint: '手風琴折疊卡片專注展開單項',
      icon: <FoldVertical size={16} className="text-rose-500" />,
      perform: () => onSetLayout?.('collapsed'),
    },
    {
      id: 'action-theme-dark',
      group: '外觀風格',
      title: currentTheme === 'dark' ? '切換為 日間溫潤紙質風格' : '切換為 深邃夜墨深色模式',
      hint: '切換全站色彩基調',
      icon: currentTheme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-400" />,
      perform: () => onSetTheme?.(currentTheme === 'dark' ? 'warm' : 'dark'),
    },
  ], [onOpenAddTool, onTogglePresentation, onOpenCreateSpace, onExportSpace, onSetLayout, onSetTheme, currentTheme]);

  // 過濾與比對
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. 空間項目
    const spaceItems = spaces
      .filter((s) => !q || s.name.toLowerCase().includes(q) || (s.description && s.description.toLowerCase().includes(q)))
      .map((s) => ({
        id: `space-${s.id}`,
        group: '切換空間',
        title: s.name,
        hint: s.id === currentSpace?.id ? '當前所在空間' : `${s.tool_count || 0} 款工具`,
        icon: <FolderPlus size={16} className="text-teal-600" />,
        perform: () => onSelectSpace?.(s.id),
      }));

    // 2. 當前小工具項目
    const toolItems = tools
      .filter((t) => !q || t.title.toLowerCase().includes(q) || (t.tags && String(t.tags).toLowerCase().includes(q)))
      .map((t) => ({
        id: `tool-${t.id}`,
        group: '空間小工具',
        title: t.title,
        hint: t.type === 'iframe' ? 'Iframe 嵌入' : t.type === 'url' ? '網頁嵌入' : '自訂程式碼',
        icon: t.type === 'iframe' ? <Frame size={16} className="text-emerald-500" /> : t.type === 'url' ? <Globe size={16} className="text-blue-500" /> : <Code size={16} className="text-amber-500" />,
        perform: () => onSelectTool?.(t.id),
      }));

    // 3. 系統指令
    const actionItems = systemActions.filter(
      (a) => !q || a.title.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)
    );

    return [...actionItems, ...spaceItems, ...toolItems];
  }, [query, spaces, currentSpace, tools, systemActions, onSelectSpace, onSelectTool]);

  // 鍵盤移動與選取
  const handleKeyDown = (e) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredItems[selectedIndex];
      if (target) {
        target.perform();
        onClose();
      }
    }
  };

  // 自動滾動使選取項目可見
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div
        className="notebook-card w-full max-w-xl shadow-2xl overflow-hidden border border-[var(--line)] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 搜尋頂欄 */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--line)] gap-3 bg-[var(--paper)]">
          <Search size={18} className="text-[var(--muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="搜尋空間、小工具，或輸入指令（例如：投影、貨架、深色）..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--ink)] placeholder:text-[var(--muted)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[var(--muted)] hover:text-[var(--ink)] p-1 rounded"
              title="清除搜尋"
            >
              <X size={14} />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-[var(--muted)] bg-[var(--card-bg)] px-1.5 py-0.5 rounded border border-[var(--line)]">
            ESC 關閉
          </div>
        </div>

        {/* 結果清單 */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 scrollbar-none">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-[var(--muted)]">
              找不到與「{query}」相符的指令、空間或小工具
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const prevItem = filteredItems[idx - 1];
                const showGroupHeader = !prevItem || prevItem.group !== item.group;

                return (
                  <React.Fragment key={item.id}>
                    {showGroupHeader && (
                      <div className="px-3 pt-2.5 pb-1 text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                        {item.group}
                      </div>
                    )}
                    <div
                      data-index={idx}
                      onClick={() => {
                        item.perform();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3 py-2 rounded-notebook-sm cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[var(--coral)]/10 text-[var(--ink)] ring-1 ring-[var(--coral)]/30'
                          : 'hover:bg-[var(--paper)] text-[var(--ink)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded bg-[var(--paper)] border border-[var(--line)] flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">{item.title}</div>
                          {item.hint && <div className="text-[10px] text-[var(--muted)] truncate">{item.hint}</div>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[var(--muted)] opacity-70">
                        <span>跳轉</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部導覽快捷提示 */}
        <div className="px-4 py-2 bg-[var(--paper)] border-t border-[var(--line)] flex items-center justify-between text-[11px] text-[var(--muted)]">
          <div className="flex items-center gap-3">
            <span>↑ ↓ 移動選取</span>
            <span>↵ 執行</span>
          </div>
          <div className="text-[10px]">
            快捷指令面板 (Ctrl + K)
          </div>
        </div>
      </div>
    </div>
  );
}
