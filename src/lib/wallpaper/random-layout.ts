import type { LayoutCell } from "./types";

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return function () {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function optimalGrid(
  count: number,
  width: number,
  height: number
): { cols: number; rows: number } {
  let bestCols = 1;
  let bestSize = 0;
  for (let cols = 1; cols <= Math.max(1, count); cols++) {
    const rows = Math.ceil(count / cols);
    const size = Math.min(width / cols, height / rows);
    if (size > bestSize) {
      bestSize = size;
      bestCols = cols;
    }
  }
  return { cols: bestCols, rows: Math.ceil(count / bestCols) };
}

export function computeRandomLayout(
  count: number,
  width: number,
  height: number,
  seed = Date.now()
): LayoutCell[] {
  if (count === 1) {
    return [{ x: 0, y: 0, width, height, rotation: 0 }];
  }

  const { cols, rows } = optimalGrid(count, width, height);
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  const fullRows = Math.floor(count / cols);
  const lastRowCount = count % cols;
  const lastRowCellWidth =
    lastRowCount > 0 ? width / lastRowCount : cellWidth;

  const rand = mulberry32(seed);
  const order = Array.from({ length: count }, (_, i) => i);
  for (let k = order.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [order[k], order[j]] = [order[j], order[k]];
  }

  const rotationMax = count >= 25 ? 25 : count >= 10 ? 15 : 10;
  const rotationFraction = count >= 25 ? 0.2 : 0.12;
  const rotationCount = Math.max(1, Math.round(count * rotationFraction));
  let rotatedRemaining = rotationCount;

  const cells: LayoutCell[] = [];
  for (const slotIndex of order) {
    const row = Math.floor(slotIndex / cols);
    const column = slotIndex % cols;
    const lastRow = row >= fullRows;
    const cellW = lastRow ? lastRowCellWidth : cellWidth;
    const x = lastRow ? column * cellW : column * cellWidth;
    const y = row * cellHeight;

    const shouldRotate = !lastRow && rotatedRemaining > 0;
    if (shouldRotate) rotatedRemaining--;
    const rotation = shouldRotate ? rand() * rotationMax : 0;
    if (rotation === 0) {
      cells.push({ x, y, width: cellW, height: cellHeight, rotation });
    } else {
      const rad = (rotation * Math.PI) / 180;
      const size =
        Math.min(cellW, cellHeight) /
        (Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad)));
      cells.push({
        x: x + cellW / 2 - size / 2,
        y: y + cellHeight / 2 - size / 2,
        width: size,
        height: size,
        rotation,
      });
    }
  }
  return cells;
}
