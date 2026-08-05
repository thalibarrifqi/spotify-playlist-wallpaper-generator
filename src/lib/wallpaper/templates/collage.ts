import type { LayoutCell } from "../types";
import type { TemplateSettings, WallpaperTemplate } from "./types";

export const collageTemplate: WallpaperTemplate = {
  id: "collage",
  label: "Collage",
  description: "Varied cell sizes, overlapping allowed",
  settings: [
    {
      key: "overlap",
      label: "Overlap",
      min: 0,
      max: 40,
      step: 2,
      defaultValue: 0,
      unit: "px",
    },
  ],
  computeLayout: (
    count: number,
    width: number,
    height: number,
    settings: TemplateSettings,
    spacing: number
  ): LayoutCell[] => {
    if (count === 0) return [];
    if (count === 1) return [{ x: 0, y: 0, width, height }];

    const overlap = settings.overlap ?? 0;
    const bigW = width * 0.6 + overlap;
    const smallCount = count - 1;
    const smallX = bigW + spacing - overlap;
    const smallW = Math.max(0, width - smallX);
    const availH = height - spacing * (smallCount - 1);
    const smallH = availH / smallCount;

    const cells: LayoutCell[] = [{ x: 0, y: 0, width: bigW, height }];

    for (let i = 0; i < smallCount; i++) {
      cells.push({
        x: smallX,
        y: i * (smallH + spacing),
        width: smallW,
        height: smallH,
      });
    }

    return cells;
  },
};
