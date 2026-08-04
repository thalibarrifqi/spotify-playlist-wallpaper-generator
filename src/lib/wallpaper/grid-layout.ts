import type { LayoutCell } from "./types";

export const GRID_COLUMNS = 5;

export function computeGridCellSize(
  count: number,
  width: number,
  height: number
): number {
  const rows = Math.max(1, Math.ceil(count / GRID_COLUMNS));
  return Math.min(width / GRID_COLUMNS, height / rows);
}

export function computeGridLayout(
  count: number,
  width: number,
  height: number
): LayoutCell[] {
  const size = computeGridCellSize(count, width, height);
  const rows = Math.max(1, Math.ceil(count / GRID_COLUMNS));
  const offsetX = (width - GRID_COLUMNS * size) / 2;
  const offsetY = (height - rows * size) / 2;

  const cells: LayoutCell[] = [];
  for (let i = 0; i < count; i++) {
    const column = i % GRID_COLUMNS;
    const row = Math.floor(i / GRID_COLUMNS);
    cells.push({
      x: offsetX + column * size,
      y: offsetY + row * size,
      size,
      rotation: 0,
    });
  }
  return cells;
}
