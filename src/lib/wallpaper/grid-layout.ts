import type { LayoutCell } from "./types";

export const GRID_COLUMNS = 5;

export function computeGridLayout(
  count: number,
  width: number,
  height: number
): LayoutCell[] {
  const columns = Math.min(GRID_COLUMNS, count);
  const rows = Math.max(1, Math.ceil(count / columns));
  const cellWidth = width / columns;
  const cellHeight = height / rows;

  const cells: LayoutCell[] = [];
  for (let i = 0; i < count; i++) {
    cells.push({
      x: (i % columns) * cellWidth,
      y: Math.floor(i / columns) * cellHeight,
      width: cellWidth,
      height: cellHeight,
      rotation: 0,
    });
  }
  return cells;
}
