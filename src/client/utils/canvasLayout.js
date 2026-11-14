/**
 * 自由書桌拼貼畫布 (Free-Desk Canvas) 幾何運算與持久化工具
 * 純函式設計，無 DOM 相依，方便於瀏覽器與 Node 單元測試共用。
 */

export const CANVAS_GRID_SIZE = 28;
export const DEFAULT_CARD_WIDTH = 420; // 15 * 28
export const WIDE_CARD_WIDTH = 616; // 22 * 28
export const DEFAULT_CARD_HEIGHT = 364; // 13 * 28
export const MIN_CARD_WIDTH = 280; // 10 * 28
export const MAX_CARD_WIDTH = 1176; // 42 * 28
export const MIN_CARD_HEIGHT = 224; // 8 * 28
export const MAX_CARD_HEIGHT = 896; // 32 * 28
export const COLLAPSED_CARD_HEIGHT = 56; // 2 * 28
export const CANVAS_GUTTER = 28;

export function snapValue(value, snapEnabled = true, grid = CANVAS_GRID_SIZE) {
  const num = Number.isFinite(value) ? value : 0;
  if (!snapEnabled || grid <= 0) return Math.round(num);
  return Math.round(num / grid) * grid;
}

export function clampCardRect(rect, snapEnabled = false) {
  const rawX = Number.isFinite(rect?.x) ? rect.x : 0;
  const rawY = Number.isFinite(rect?.y) ? rect.y : 0;
  const rawW = Number.isFinite(rect?.w) ? rect.w : DEFAULT_CARD_WIDTH;
  const rawH = Number.isFinite(rect?.h) ? rect.h : DEFAULT_CARD_HEIGHT;

  const snappedX = snapEnabled ? snapValue(rawX, true) : Math.round(rawX);
  const snappedY = snapEnabled ? snapValue(rawY, true) : Math.round(rawY);
  const snappedW = snapEnabled ? snapValue(rawW, true) : Math.round(rawW);
  const snappedH = snapEnabled ? snapValue(rawH, true) : Math.round(rawH);

  return {
    x: Math.max(0, snappedX),
    y: Math.max(0, snappedY),
    w: Math.min(MAX_CARD_WIDTH, Math.max(MIN_CARD_WIDTH, snappedW)),
    h: Math.min(MAX_CARD_HEIGHT, Math.max(MIN_CARD_HEIGHT, snappedH)),
    z: Number.isFinite(rect?.z) ? rect.z : 1,
    collapsed: Boolean(rect?.collapsed),
  };
}

function rectsOverlap(a, b, padding = 14) {
  const ah = a.collapsed ? COLLAPSED_CARD_HEIGHT : a.h;
  const bh = b.collapsed ? COLLAPSED_CARD_HEIGHT : b.h;
  return (
    a.x < b.x + b.w + padding &&
    a.x + a.w + padding > b.x &&
    a.y < b.y + bh + padding &&
    a.y + ah + padding > b.y
  );
}

/**
 * 補齊所有工具在畫布上的座標與層級，確保已定位卡片位置保留，新卡片自動避開重疊區域。
 */
export function ensureCanvasMap(tools = [], existingMap = {}, containerWidth = 1120) {
  const nextMap = {};
  let maxZ = 0;

  tools.forEach((tool) => {
    const saved = existingMap?.[tool.id];
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      const clamped = clampCardRect(saved, false);
      nextMap[tool.id] = clamped;
      if (clamped.z > maxZ) maxZ = clamped.z;
    }
  });

  const placedRects = Object.values(nextMap);
  const usableWidth = Math.max(924, snapValue(containerWidth - CANVAS_GUTTER, true));

  tools.forEach((tool) => {
    if (nextMap[tool.id]) return;

    const w = tool.col_span === 2 ? Math.min(WIDE_CARD_WIDTH, usableWidth - CANVAS_GUTTER) : DEFAULT_CARD_WIDTH;
    const h = DEFAULT_CARD_HEIGHT;

    let candidateX = CANVAS_GUTTER;
    let candidateY = CANVAS_GUTTER;
    let found = false;

    // 以 28px 步進尋找第一個不與現有卡片重疊的書桌空位
    for (let y = CANVAS_GUTTER; y <= 4200 && !found; y += CANVAS_GRID_SIZE * 2) {
      for (let x = CANVAS_GUTTER; x + w <= usableWidth || x === CANVAS_GUTTER; x += CANVAS_GRID_SIZE * 2) {
        const probe = { x, y, w, h, collapsed: false };
        const collides = placedRects.some((other) => rectsOverlap(probe, other, 20));
        if (!collides) {
          candidateX = x;
          candidateY = y;
          found = true;
          break;
        }
        if (x + w > usableWidth) break;
      }
    }

    maxZ += 1;
    const created = clampCardRect({
      x: candidateX,
      y: candidateY,
      w,
      h,
      z: maxZ,
      collapsed: false,
    });
    nextMap[tool.id] = created;
    placedRects.push(created);
  });

  return nextMap;
}

/**
 * 點擊或開始拖曳卡片時將其帶到最上層 (Bring to front)
 */
export function bringCardToFront(canvasMap = {}, toolId) {
  const entries = Object.entries(canvasMap);
  if (!canvasMap[toolId]) return canvasMap;

  const currentMax = entries.reduce((acc, [, rect]) => Math.max(acc, rect?.z || 1), 0);
  if (canvasMap[toolId].z === currentMax && currentMax > 0) {
    return canvasMap;
  }

  // 若層級累加超過 4000，正規化壓縮回 1..N 保持順序不爆掉
  if (currentMax >= 4000) {
    const sortedIds = entries
      .sort((a, b) => (a[1]?.z || 1) - (b[1]?.z || 1))
      .map(([id]) => id)
      .filter((id) => id !== String(toolId) && id !== toolId);
    const normalized = {};
    sortedIds.forEach((id, idx) => {
      normalized[id] = { ...canvasMap[id], z: idx + 1 };
    });
    normalized[toolId] = { ...canvasMap[toolId], z: sortedIds.length + 1 };
    return normalized;
  }

  return {
    ...canvasMap,
    [toolId]: {
      ...canvasMap[toolId],
      z: currentMax + 1,
    },
  };
}

/**
 * 一鍵整齊排列：維持每張卡片當前大小，吸附 28px 格線並依置頂優先順序由左至右書桌排盤。
 */
export function tidyCanvasLayout(tools = [], existingMap = {}, containerWidth = 1120) {
  const maxRowWidth = Math.max(924, snapValue(containerWidth - CANVAS_GUTTER, true));
  const nextMap = {};

  let cursorX = CANVAS_GUTTER;
  let cursorY = CANVAS_GUTTER;
  let rowMaxHeight = 0;

  tools.forEach((tool, idx) => {
    const prev = existingMap?.[tool.id];
    const baseW = prev?.w ?? (tool.col_span === 2 ? WIDE_CARD_WIDTH : DEFAULT_CARD_WIDTH);
    const baseH = prev?.h ?? DEFAULT_CARD_HEIGHT;
    const collapsed = Boolean(prev?.collapsed);

    const w = Math.min(maxRowWidth - CANVAS_GUTTER, Math.max(MIN_CARD_WIDTH, snapValue(baseW, true)));
    const h = Math.min(MAX_CARD_HEIGHT, Math.max(MIN_CARD_HEIGHT, snapValue(baseH, true)));
    const visualH = collapsed ? COLLAPSED_CARD_HEIGHT : h;

    if (cursorX > CANVAS_GUTTER && cursorX + w + CANVAS_GUTTER > maxRowWidth) {
      cursorX = CANVAS_GUTTER;
      cursorY = snapValue(cursorY + rowMaxHeight + CANVAS_GUTTER, true);
      rowMaxHeight = 0;
    }

    nextMap[tool.id] = clampCardRect({
      x: cursorX,
      y: cursorY,
      w,
      h,
      z: idx + 1,
      collapsed,
    });

    cursorX = snapValue(cursorX + w + CANVAS_GUTTER, true);
    rowMaxHeight = Math.max(rowMaxHeight, visualH);
  });

  return nextMap;
}

/**
 * 計算畫布總延伸尺寸，保留右下與底部浮動停靠列緩衝空間
 */
export function computeCanvasBounds(tools = [], canvasMap = {}, minWidth = 960, minHeight = 644) {
  let maxRight = minWidth;
  let maxBottom = minHeight;

  tools.forEach((tool) => {
    const rect = canvasMap[tool.id];
    if (!rect) return;
    const visualH = rect.collapsed ? COLLAPSED_CARD_HEIGHT : rect.h;
    maxRight = Math.max(maxRight, rect.x + rect.w + 84);
    maxBottom = Math.max(maxBottom, rect.y + visualH + 140);
  });

  return {
    width: Math.ceil(maxRight),
    height: Math.ceil(maxBottom),
  };
}

export function getCanvasStorageKey(spaceId) {
  return `notebook_canvas_${spaceId || 'default'}`;
}

export function loadCanvasMap(spaceId, storage = globalThis?.localStorage) {
  if (!storage || typeof storage.getItem !== 'function') return {};
  try {
    const raw = storage.getItem(getCanvasStorageKey(spaceId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCanvasMap(spaceId, canvasMap, storage = globalThis?.localStorage) {
  if (!storage || typeof storage.setItem !== 'function') return false;
  try {
    storage.setItem(getCanvasStorageKey(spaceId), JSON.stringify(canvasMap || {}));
    return true;
  } catch {
    return false;
  }
}
