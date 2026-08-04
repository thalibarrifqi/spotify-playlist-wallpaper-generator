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
  const offsetX = (width - bestColumns * bestSize) / 2;
  const offsetY = (height - rows * bestSize) / 2;
  const lastRowCount = count % bestColumns;

  const cells: LayoutCell[] = [];
  for (let i = 0; i < count; i++) {
    const column = i % bestColumns;
    const row = Math.floor(i / bestColumns);
    const rowOffset =
      row === rows - 1 && lastRowCount > 0
        ? (width - lastRowCount * bestSize) / 2
        : offsetX;
    cells.push({
      x: rowOffset + column * bestSize,
      y: offsetY + row * bestSize,
      size: bestSize,
    });
  }
  return cells;
}
