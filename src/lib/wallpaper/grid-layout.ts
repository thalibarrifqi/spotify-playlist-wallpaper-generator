import type { LayoutCell } from "./types";

export function computeGridLayout(
  count: number,
  width: number,
  height: number,
  spacing: number = 0
): LayoutCell[] {
  if (count === 0) return [];

  const gapX = spacing * (Math.min(count, Math.ceil(width / height)) + 1);
  const gapY = spacing * (Math.ceil(count / Math.min(count, Math.ceil(width / height))) + 1);
  const availW = width - gapX;
  const availH = height - gapY;

  let bestColumns = 1;
  let bestSize = 0;

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const size = Math.min(availW / columns, availH / rows);
    if (size > bestSize) {
      bestSize = size;
      bestColumns = columns;
    }
  }

  const rows = Math.ceil(count / bestColumns);
  const gridWidth = bestColumns * bestSize;
  const gridHeight = rows * bestSize;
  const scaleX = (width - spacing) / gridWidth;
  const scaleY = (height - spacing) / gridHeight;
  const scale = Math.max(scaleX, scaleY);
  const cellSize = bestSize * scale;
  const totalGridW = bestColumns * cellSize + spacing * (bestColumns - 1);
  const totalGridH = rows * cellSize + spacing * (rows - 1);
  const offsetX = (width - totalGridW) / 2;
  const offsetY = (height - totalGridH) / 2;

  const cells: LayoutCell[] = [];
  for (let i = 0; i < count; i++) {
    const column = i % bestColumns;
    const row = Math.floor(i / bestColumns);
    cells.push({
      x: offsetX + column * (cellSize + spacing),
      y: offsetY + row * (cellSize + spacing),
      width: cellSize,
      height: cellSize,
    });
  }
  return cells;
}
