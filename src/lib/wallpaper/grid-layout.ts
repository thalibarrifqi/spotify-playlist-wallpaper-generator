import type { LayoutCell } from "./types";

export function computeGridLayout(
  count: number,
  width: number,
  height: number
): LayoutCell[] {
  if (count === 0) return [];

  let bestColumns = 1;
  let bestSize = 0;

  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const size = Math.min(width / columns, height / rows);
    if (size > bestSize) {
      bestSize = size;
      bestColumns = columns;
    }
  }

  const rows = Math.ceil(count / bestColumns);
  const gridWidth = bestColumns * bestSize;
  const gridHeight = rows * bestSize;
  const scale = Math.max(width / gridWidth, height / gridHeight);
  const cellSize = bestSize * scale;
  const offsetX = (width - gridWidth * scale) / 2;
  const offsetY = (height - gridHeight * scale) / 2;
  const lastRowCount = count % bestColumns;

  const cells: LayoutCell[] = [];
  for (let i = 0; i < count; i++) {
    const column = i % bestColumns;
    const row = Math.floor(i / bestColumns);
    const rowOffset =
      row === rows - 1 && lastRowCount > 0
        ? (width - lastRowCount * cellSize) / 2
        : offsetX;
    cells.push({
      x: rowOffset + column * cellSize,
      y: offsetY + row * cellSize,
      size: cellSize,
    });
  }
  return cells;
}
