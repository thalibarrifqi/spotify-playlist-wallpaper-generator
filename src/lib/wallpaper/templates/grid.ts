import type { LayoutCell } from "../types";
import type { TemplateSettings, WallpaperTemplate } from "./types";

export const gridTemplate: WallpaperTemplate = {
  id: "grid",
  label: "Grid",
  description: "Square cells, equal size",
  settings: [],
  computeLayout: (
    count: number,
    width: number,
    height: number,
    _settings: TemplateSettings,
    spacing: number
  ): LayoutCell[] => {
    if (count === 0) return [];
    const columns = findBestColumns(count, width, height, spacing);
    const rows = Math.ceil(count / columns);
    return computeGridLayout(columns * rows, width, height, spacing);
  },
};

export function findBestColumns(
  count: number,
  width: number,
  height: number,
  spacing: number
): number {
  if (count === 0) return 1;
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
  return bestColumns;
}

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

  const bestColumns = findBestColumns(count, width, height, spacing);
  const rows = Math.ceil(count / bestColumns);
  const size = Math.min(availW / bestColumns, availH / rows);

  const gridWidth = bestColumns * size;
  const gridHeight = rows * size;
  const scaleX = (width - spacing) / gridWidth;
  const scaleY = (height - spacing) / gridHeight;
  const scale = Math.max(scaleX, scaleY);
  const cellSize = size * scale;
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
