import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Plus,
  Grid,
  LayoutGrid,
  ZoomIn,
  ZoomOut,
  Search,
  ChevronUp,
  ChevronDown,
  Pin,
  RotateCcw,
  Pencil,
  Maximize2,
  MoreVertical,
  Palette,
  Copy,
  Send,
  Download,
  Trash2,
  ExternalLink,
  Share2,
  CheckSquare,
  Square,
  GripHorizontal,
} from 'lucide-react';
import SandboxedFrame from './SandboxedFrame';
import { WashiTapePinDoodle } from './Illustrations';
import { CARD_COLORS } from '../utils/cardColors';
import { parseToolInput, openSandboxedPopout } from '../utils/codeParser';
import {
  COLLAPSED_CARD_HEIGHT,
  clampCardRect,
  ensureCanvasMap,
  bringCardToFront,
  tidyCanvasLayout,
  computeCanvasBounds,
  loadCanvasMap,
  saveCanvasMap,
} from '../utils/canvasLayout';

function CanvasToolCard({
  tool,
  rect,
  isActiveInteraction,
  anyDragging,
  effectiveCanEdit,
  isPresentationMode,
  isBatchMode,
  isSelected,
  onToggleSelect,
  onBringToFront,
  onStartDrag,
  onStartResize,
  onToggleCollapse,
  onFocus,
  onEdit,
  onDelete,
  onTogglePin,
  onChangeColor,
  onDuplicate,
  onCloneToSpace,
  onPublishHosted,
  isMobile,
}) {
  const [reloadKey, setReloadKey] = useState(0);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const parsed = useMemo(() => parseToolInput(tool.content), [tool.content]);
  const colorId = tool.color || 'default';
  const colorClass = colorId && colorId !== 'default' ? `card-color-${colorId}` : '';
  const isCollapsed = Boolean(rect?.collapsed);
  const canDragMove = !isMobile && !isPresentationMode;

  const handlePopout = () => {
    openSandboxedPopout(tool.title, parsed.htmlContent);
  };

  const handleExportTool = () => {
    setMoreMenuOpen(false);
    const payload = {
      version: '1.0',
      type: 'edu-embed-tool',
      tool: {
        title: tool.title,
        content: tool.content,
        type: tool.type,
        section: tool.section || '一般工具',
        color: tool.color || 'default',
        tags: tool.tags || '',
        col_span: tool.col_span || 1,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(tool.title || 'tool').replace(/[\\/:*?"<>|]/g, '_')}.tool.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const visualHeight = isCollapsed
    ? COLLAPSED_CARD_HEIGHT
    : isMobile
    ? Math.max(320, Math.min(rect?.h || 364, 520))
    : rect?.h || 364;

  const desktopStyle = isMobile
    ? { height: `${visualHeight}px` }
    : {
        position: 'absolute',
        left: `${rect.x}px`,
        top: `${rect.y}px`,
        width: `${rect.w}px`,
        height: `${visualHeight}px`,
        zIndex: isActiveInteraction ? (rect.z || 1) + 50 : rect.z || 1,
      };

  return (
    <div
      data-canvas-card={tool.id}
      style={desktopStyle}
      onPointerDown={() => {
        if (!isMobile && onBringToFront) {
          onBringToFront(tool.id);
        }
      }}
      className={`notebook-card relative flex flex-col overflow-visible transition-shadow duration-150 ${colorClass} ${
        isActiveInteraction
          ? 'ring-2 ring-[var(--coral)] shadow-2xl select-none'
          : isSelected
          ? 'ring-2 ring-[var(--coral)]'
          : 'hover:shadow-lg'
      }`}
    >
      {/* 紙膠帶裝飾 */}
      {!isCollapsed && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 pointer-events-none select-none z-20 opacity-85"
          aria-hidden="true"
        >
          <WashiTapePinDoodle className="w-20 h-6" />
        </div>
      )}

      {/* 卡片頂部拖曳標題列 (雙擊捲起 / 展開) */}
      <div
        onPointerDown={(e) => {
          if (!canDragMove) return;
          if (e.target.closest('button, input, a')) return;
          e.preventDefault();
          onStartDrag(e, tool.id);
        }}
        onDoubleClick={(e) => {
          if (e.target.closest('button, input, a')) return;
          onToggleCollapse(tool.id);
        }}
        title={canDragMove ? '按住拖曳移動位置，雙擊標題列可捲起或展開' : '雙擊標題列可捲起或展開'}
        className={`flex items-center justify-between gap-2 px-3 py-2 border-b ${
          isCollapsed ? 'border-transparent rounded-xl' : 'border-[var(--line)] rounded-t-xl'
        } bg-[var(--paper)]/65 ${canDragMove ? 'cursor-grab active:cursor-grabbing' : ''} select-none shrink-0`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isBatchMode && effectiveCanEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect && onToggleSelect(tool.id);
              }}
              className="p-0.5 text-[var(--coral)] hover:scale-110 transition-transform shrink-0"
              title={isSelected ? '取消選取' : '選取此工具'}
            >
              {isSelected ? (
                <CheckSquare size={15} className="fill-[var(--coral-light)]" />
              ) : (
                <Square size={15} className="text-[var(--muted)]" />
              )}
            </button>
          )}

          {canDragMove && (
            <GripHorizontal size={15} className="text-[var(--faint)] shrink-0" />
          )}

          <span className="w-2 h-2 rounded-full bg-[var(--coral)] shrink-0" />
          <h3 className="text-xs sm:text-sm font-semibold text-[var(--ink)] truncate" title={tool.title}>
            {tool.title}
          </h3>

          {tool.isPinned && (
            <span className="notebook-pin-badge shrink-0" title="已置頂釘選">
              <Pin size={10} className="fill-current" />
            </span>
          )}
        </div>

        {/* 簡潔卡片控制鍵 */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onToggleCollapse(tool.id)}
            className="p-1 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--card-bg)] rounded-lg transition-colors"
            title={isCollapsed ? '展開工具卡片' : '捲起工具卡片'}
          >
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="p-1 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--card-bg)] rounded-lg transition-colors"
              title="重新整理小工具"
            >
              <RotateCcw size={13} />
            </button>
          )}

          {effectiveCanEdit && !isPresentationMode && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(tool)}
              className="p-1 text-[var(--muted)] hover:text-[var(--coral)] hover:bg-[var(--coral-light)] rounded-lg transition-colors"
              title="編輯小工具代碼與設定"
            >
              <Pencil size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={() => onFocus(tool)}
            className="p-1 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--card-bg)] rounded-lg transition-colors"
            title="全螢幕專注展示"
          >
            <Maximize2 size={13} />
          </button>

          {!isPresentationMode && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className={`p-1 rounded-lg transition-colors ${
                  moreMenuOpen
                    ? 'bg-[var(--coral-light)] text-[var(--coral)]'
                    : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--card-bg)]'
                }`}
                title="更多小工具動作"
              >
                <MoreVertical size={13} />
              </button>

              {moreMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMoreMenuOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-1 w-48 bg-[var(--card-bg)] border border-[var(--line)] rounded-xl shadow-xl z-50 p-1.5 text-xs divide-y divide-[var(--line)]/60"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="pb-1 space-y-0.5">
                      {effectiveCanEdit && onTogglePin && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onTogglePin(tool.id);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)]"
                        >
                          <Pin size={12} className={tool.isPinned ? 'text-[var(--coral)] fill-current' : 'text-[var(--muted)]'} />
                          <span>{tool.isPinned ? '取消置頂釘選' : '置頂釘選'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          handlePopout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)]"
                      >
                        <ExternalLink size={12} className="text-[var(--muted)]" />
                        <span>獨立視窗彈出</span>
                      </button>

                      {effectiveCanEdit && onChangeColor && (
                        <div className="px-2.5 py-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] font-medium mb-1">
                            <Palette size={11} />
                            <span>便箋色票</span>
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
                                className={`w-5 h-5 rounded-md border transition-transform hover:scale-110 ${
                                  colorId === c.id ? 'ring-2 ring-[var(--coral)]' : ''
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
                      {onPublishHosted && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onPublishHosted(tool);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium"
                        >
                          <Share2 size={12} />
                          <span>發布為獨立網站...</span>
                        </button>
                      )}
                      {effectiveCanEdit && onDuplicate && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onDuplicate(tool);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)]"
                        >
                          <Copy size={12} className="text-[var(--coral)]" />
                          <span>建立副本</span>
                        </button>
                      )}
                      {onCloneToSpace && (
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onCloneToSpace(tool);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)]"
                        >
                          <Send size={12} className="text-blue-500" />
                          <span>複製到其他空間...</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleExportTool}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[var(--paper)] rounded-lg flex items-center gap-2 text-[var(--ink)]"
                      >
                        <Download size={12} className="text-emerald-500" />
                        <span>匯出小工具 (.json)</span>
                      </button>
                    </div>

                    {effectiveCanEdit && onDelete && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false);
                            onDelete(tool.id);
                          }}
                          className="w-full text-left px-2.5 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 font-medium"
                        >
                          <Trash2 size={12} />
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

      {/* 內嵌沙盒主體 (捲起時完全折疊) */}
      {!isCollapsed && (
        <div className="flex-1 w-full relative overflow-hidden rounded-b-xl bg-[var(--card-bg)] min-h-0">
          <SandboxedFrame
            htmlContent={parsed.htmlContent}
            title={tool.title}
            reloadKey={reloadKey}
          />

          {/* 拖曳 / 調整尺寸期間啟用全域透明防護罩，防止 iframe 攔截指標事件 */}
          {anyDragging && (
            <div
              className="absolute inset-0 z-30 bg-transparent"
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* 桌機版三向縮放把手與即時尺寸 HUD */}
      {!isMobile && !isPresentationMode && !isCollapsed && (
        <>
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartResize(e, tool.id, 'resize-r');
            }}
            className="canvas-resize-edge-r"
            title="拖曳調整寬度"
          />
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartResize(e, tool.id, 'resize-b');
            }}
            className="canvas-resize-edge-b"
            title="拖曳調整高度"
          />
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartResize(e, tool.id, 'resize-br');
            }}
            className="canvas-resize-corner"
            title="拖曳斜角自由縮放卡片"
          >
            <span className="canvas-resize-corner-grip" />
          </div>
        </>
      )}

      {/* 調整尺寸時顯示即時寬高徽章 */}
      {isActiveInteraction && (
        <div className="pointer-events-none absolute bottom-2 right-6 z-40 px-2 py-0.5 rounded-md bg-[var(--ink)] text-[var(--paper)] text-[10px] font-mono shadow-md">
          {Math.round(rect.w)} × {Math.round(visualHeight)}
        </div>
      )}
    </div>
  );
}

export default function FreeCanvasBoard({
  spaceId,
  tools = [],
  allToolsCount = 0,
  effectiveCanEdit,
  isPresentationMode,
  isBatchMode,
  selectedToolIds = [],
  onToggleSelectTool,
  onFocusTool,
  onEditTool,
  onDeleteTool,
  onTogglePin,
  onChangeColor,
  onDuplicateTool,
  onCloneToolToSpace,
  onPublishHosted,
  onOpenAddModal,
  showFilterBar,
  onToggleFilterBar,
}) {
  const boardContainerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  );
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [containerWidth, setContainerWidth] = useState(1120);
  const [canvasMap, setCanvasMap] = useState(() => loadCanvasMap(spaceId));
  const [dragState, setDragState] = useState(null);

  const dragRef = useRef(dragState);
  const snapRef = useRef(snapToGrid);
  const zoomRef = useRef(zoom);
  const spaceIdRef = useRef(spaceId);

  dragRef.current = dragState;
  snapRef.current = snapToGrid;
  zoomRef.current = zoom;
  spaceIdRef.current = spaceId;

  // 切換空間時重新讀取該空間的自由畫布座標
  useEffect(() => {
    setCanvasMap(loadCanvasMap(spaceId));
  }, [spaceId]);

  // 監測視窗與容器寬度以決定行動版降級與自動排盤寬度
  useEffect(() => {
    const updateSize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
      if (boardContainerRef.current) {
        setContainerWidth(Math.max(840, boardContainerRef.current.clientWidth));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 確保所有卡片都有合法的座標與層級，並補齊新加入的工具位置
  const resolvedMap = useMemo(
    () => ensureCanvasMap(tools, canvasMap, containerWidth),
    [tools, canvasMap, containerWidth]
  );

  // 若偵測到未定位的新工具，同步寫回 state 與 localStorage
  useEffect(() => {
    const hasMissing = tools.some((t) => !canvasMap?.[t.id]);
    if (hasMissing && tools.length > 0) {
      setCanvasMap(resolvedMap);
      saveCanvasMap(spaceId, resolvedMap);
    }
  }, [tools, canvasMap, resolvedMap, spaceId]);

  // 拖曳 / 縮放期間進行即時計算，套用當下座標
  const activeMap = useMemo(() => {
    if (!dragState) return resolvedMap;
    return {
      ...resolvedMap,
      [dragState.toolId]: dragState.currentRect,
    };
  }, [resolvedMap, dragState]);

  const bounds = useMemo(
    () => computeCanvasBounds(tools, activeMap, Math.max(960, containerWidth / zoom), 644),
    [tools, activeMap, containerWidth, zoom]
  );

  const commitMap = useCallback(
    (nextMap) => {
      setCanvasMap(nextMap);
      saveCanvasMap(spaceIdRef.current, nextMap);
    },
    []
  );

  const handleBringToFront = useCallback(
    (toolId) => {
      setCanvasMap((prev) => {
        const ensured = ensureCanvasMap(tools, prev, containerWidth);
        const brought = bringCardToFront(ensured, toolId);
        if (brought !== prev) {
          saveCanvasMap(spaceIdRef.current, brought);
        }
        return brought;
      });
    },
    [tools, containerWidth]
  );

  const handleToggleCollapse = useCallback(
    (toolId) => {
      setCanvasMap((prev) => {
        const ensured = ensureCanvasMap(tools, prev, containerWidth);
        const current = ensured[toolId];
        if (!current) return ensured;
        const nextMap = {
          ...ensured,
          [toolId]: { ...current, collapsed: !current.collapsed },
        };
        saveCanvasMap(spaceIdRef.current, nextMap);
        return nextMap;
      });
    },
    [tools, containerWidth]
  );

  const handleStartDrag = useCallback(
    (e, toolId) => {
      const currentRect = resolvedMap[toolId];
      if (!currentRect) return;
      const brought = bringCardToFront(resolvedMap, toolId);
      setCanvasMap(brought);
      setDragState({
        type: 'move',
        toolId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startRect: brought[toolId],
        currentRect: brought[toolId],
      });
    },
    [resolvedMap]
  );

  const handleStartResize = useCallback(
    (e, toolId, resizeType) => {
      const currentRect = resolvedMap[toolId];
      if (!currentRect) return;
      const brought = bringCardToFront(resolvedMap, toolId);
      setCanvasMap(brought);
      setDragState({
        type: resizeType,
        toolId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startRect: brought[toolId],
        currentRect: brought[toolId],
      });
    },
    [resolvedMap]
  );

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e) => {
      const current = dragRef.current;
      if (!current) return;
      const scale = zoomRef.current || 1;
      const dx = (e.clientX - current.startClientX) / scale;
      const dy = (e.clientY - current.startClientY) / scale;
      const snap = snapRef.current;
      const base = current.startRect;

      let nextRect = { ...base };
      if (current.type === 'move') {
        nextRect = clampCardRect({ ...base, x: base.x + dx, y: base.y + dy }, snap);
      } else if (current.type === 'resize-r') {
        nextRect = clampCardRect({ ...base, w: base.w + dx }, snap);
      } else if (current.type === 'resize-b') {
        nextRect = clampCardRect({ ...base, h: base.h + dy }, snap);
      } else if (current.type === 'resize-br') {
        nextRect = clampCardRect({ ...base, w: base.w + dx, h: base.h + dy }, snap);
      }

      setDragState((prev) => (prev ? { ...prev, currentRect: nextRect } : null));
    };

    const handlePointerUp = () => {
      const current = dragRef.current;
      if (!current) return;
      const finalRect = clampCardRect(current.currentRect, snapRef.current);
      setCanvasMap((prev) => {
        const ensured = ensureCanvasMap(tools, prev, containerWidth);
        const next = {
          ...ensured,
          [current.toolId]: finalRect,
        };
        saveCanvasMap(spaceIdRef.current, next);
        return next;
      });
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [Boolean(dragState), tools, containerWidth]);

  const handleTidyDesk = () => {
    const tidied = tidyCanvasLayout(tools, resolvedMap, Math.max(containerWidth / zoom, 924));
    commitMap({ ...resolvedMap, ...tidied });
  };

  return (
    <div ref={boardContainerRef} className="relative flex-1 flex flex-col min-h-[620px]">
      {isMobile ? (
        /* 行動裝置優雅降級為直向書桌堆疊卡片 */
        <div className="space-y-4 pb-24">
          {tools.map((tool) => (
            <CanvasToolCard
              key={tool.id}
              tool={tool}
              rect={activeMap[tool.id]}
              isActiveInteraction={false}
              anyDragging={false}
              effectiveCanEdit={effectiveCanEdit}
              isPresentationMode={isPresentationMode}
              isBatchMode={isBatchMode}
              isSelected={selectedToolIds.includes(tool.id)}
              onToggleSelect={onToggleSelectTool}
              onToggleCollapse={handleToggleCollapse}
              onFocus={onFocusTool}
              onEdit={onEditTool}
              onDelete={onDeleteTool}
              onTogglePin={onTogglePin}
              onChangeColor={onChangeColor}
              onDuplicate={onDuplicateTool}
              onCloneToSpace={onCloneToolToSpace}
              onPublishHosted={onPublishHosted}
              isMobile
            />
          ))}
        </div>
      ) : (
        /* 桌機版 28px 方格紙自由書桌拼貼畫布 */
        <div className="notebook-grid-bg relative flex-1 rounded-2xl border border-[var(--line)] overflow-auto shadow-inner">
          <div
            style={{
              width: `${Math.round(bounds.width * zoom)}px`,
              height: `${Math.round(bounds.height * zoom)}px`,
            }}
            className="relative"
          >
            <div
              style={{
                width: `${bounds.width}px`,
                height: `${bounds.height}px`,
                transform: `scale(${zoom})`,
                transformOrigin: '0 0',
              }}
              className="relative"
            >
              {tools.map((tool) => (
                <CanvasToolCard
                  key={tool.id}
                  tool={tool}
                  rect={activeMap[tool.id]}
                  isActiveInteraction={dragState?.toolId === tool.id}
                  anyDragging={Boolean(dragState)}
                  effectiveCanEdit={effectiveCanEdit}
                  isPresentationMode={isPresentationMode}
                  isBatchMode={isBatchMode}
                  isSelected={selectedToolIds.includes(tool.id)}
                  onToggleSelect={onToggleSelectTool}
                  onBringToFront={handleBringToFront}
                  onStartDrag={handleStartDrag}
                  onStartResize={handleStartResize}
                  onToggleCollapse={handleToggleCollapse}
                  onFocus={onFocusTool}
                  onEdit={onEditTool}
                  onDelete={onDeleteTool}
                  onTogglePin={onTogglePin}
                  onChangeColor={onChangeColor}
                  onDuplicate={onDuplicateTool}
                  onCloneToSpace={onCloneToolToSpace}
                  onPublishHosted={onPublishHosted}
                  isMobile={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 書桌底部浮動文具停靠列 (Desk Dock) */}
      {!isPresentationMode && (
        <div className="canvas-desk-dock fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-[var(--line)] shadow-xl max-w-[95vw] overflow-x-auto scrollbar-none">
          {effectiveCanEdit && onOpenAddModal && (
            <button
              type="button"
              onClick={() => onOpenAddModal('一般工具')}
              className="notebook-btn-primary notebook-btn-sm rounded-xl shrink-0"
            >
              <Plus size={14} />
              <span>新增工具</span>
            </button>
          )}

          {!isMobile && (
            <>
              <button
                type="button"
                onClick={() => setSnapToGrid((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap ${
                  snapToGrid
                    ? 'bg-[var(--coral-light)] text-[var(--coral)] border border-[var(--coral-border)]'
                    : 'text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]'
                }`}
                title="切換拖曳與縮放時對齊 28px 方格紙格線"
              >
                <Grid size={13} />
                <span>格線吸附</span>
              </button>

              <button
                type="button"
                onClick={handleTidyDesk}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)] flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap"
                title="依當前卡片尺寸自動整齊排列桌面"
              >
                <LayoutGrid size={13} />
                <span>一鍵整齊</span>
              </button>

              <button
                type="button"
                onClick={() => setZoom((z) => (z === 1 ? 0.75 : 1))}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)] flex items-center gap-1 transition-colors shrink-0 whitespace-nowrap"
                title="切換畫布縮放比例 (100% / 75%)"
              >
                {zoom === 1 ? <ZoomOut size={13} /> : <ZoomIn size={13} />}
                <span>{Math.round(zoom * 100)}%</span>
              </button>
            </>
          )}

          {allToolsCount > 0 && onToggleFilterBar && (
            <button
              type="button"
              onClick={onToggleFilterBar}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 whitespace-nowrap ${
                showFilterBar
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'text-[var(--muted)] hover:bg-[var(--paper)] hover:text-[var(--ink)]'
              }`}
              title="顯示或隱藏搜尋與標籤篩選列"
            >
              <Search size={13} />
              <span>篩選</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
