import type { LayoutCell } from "../types";
import type { TemplateSettings, WallpaperTemplate } from "./types";

export const borderTemplate: WallpaperTemplate = {
  id: "border",
  label: "Border",
  description: "Artwork forms a border, center blank",
  settings: [
    {
      key: "thickness",
      label: "Border thickness",
      min: 0.15,
      max: 0.5,
      step: 0.05,
      defaultValue: 0.3,
      unit: "x",
    },
  ],
  computeLayout: (
    _count: number,
    width: number,
    height: number,
    settings: TemplateSettings
  ): LayoutCell[] => {
    const thickness = settings.thickness ?? 0.3;
    const short = Math.min(width, height);
    const cellSize = Math.max(1, short * thickness);
    const cols = Math.max(2, Math.round(width / cellSize));
    const rows = Math.max(2, Math.round(height / cellSize));
    const cellW = width / cols;
    const cellH = height / rows;

    const cells: LayoutCell[] = [];

    for (let c = 0; c < cols; c++) {
      cells.push({ x: c * cellW, y: 0, width: cellW, height: cellH });
    }
    for (let r = 1; r < rows - 1; r++) {
      cells.push({
        x: width - cellW,
        y: r * cellH,
        width: cellW,
        height: cellH,
      });
    }
    for (let c = cols - 2; c >= 1; c--) {
      cells.push({
        x: c * cellW,
        y: height - cellH,
        width: cellW,
        height: cellH,
      });
    }
    for (let r = rows - 2; r >= 1; r--) {
      cells.push({ x: 0, y: r * cellH, width: cellW, height: cellH });
    }

    return cells;
  },
};
