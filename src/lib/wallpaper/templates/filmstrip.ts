import type { LayoutCell } from "../types";
import type { TemplateSettings, WallpaperTemplate } from "./types";

export const filmstripTemplate: WallpaperTemplate = {
  id: "filmstrip",
  label: "Film Strip",
  description: "Horizontal or vertical strip of artworks",
  settings: [
    {
      key: "vertical",
      label: "Vertical orientation",
      min: 0,
      max: 1,
      step: 1,
      defaultValue: 0,
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

    const vertical = (settings.vertical ?? 0) > 0.5;

    if (vertical) {
      const availH = height - spacing * (count - 1);
      const cellH = availH / count;
      return Array.from({ length: count }, (_, i) => ({
        x: 0,
        y: i * (cellH + spacing),
        width,
        height: cellH,
      }));
    }

    const availW = width - spacing * (count - 1);
    const cellW = availW / count;
    return Array.from({ length: count }, (_, i) => ({
      x: i * (cellW + spacing),
      y: 0,
      width: cellW,
      height,
    }));
  },
};
