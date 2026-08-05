import type { LayoutCell } from "../types";
import type { TemplateSettings, WallpaperTemplate } from "./types";

interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const mosaicTemplate: WallpaperTemplate = {
  id: "mosaic",
  label: "Mosaic",
  description: "Asymmetric layout with different cell sizes",
  settings: [
    {
      key: "variation",
      label: "Variation",
      min: 0,
      max: 1,
      step: 0.1,
      defaultValue: 0.5,
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

    const variation = settings.variation ?? 0.5;
    const regions: Region[] = [{ x: 0, y: 0, width, height }];

    while (regions.length < count) {
      let idx = 0;
      let best = 0;
      for (let i = 0; i < regions.length; i++) {
        const area = regions[i].width * regions[i].height;
        if (area > best) {
          best = area;
          idx = i;
        }
      }
      const r = regions.splice(idx, 1)[0];
      const parity = regions.length % 2 === 0 ? -1 : 1;
      const ratio = 0.5 + variation * 0.3 * parity;
      const clamp = Math.min(0.8, Math.max(0.2, ratio));

      if (r.height >= r.width) {
        const h1 = r.height * clamp;
        regions.push({ x: r.x, y: r.y, width: r.width, height: h1 });
        regions.push({ x: r.x, y: r.y + h1, width: r.width, height: r.height - h1 });
      } else {
        const w1 = r.width * clamp;
        regions.push({ x: r.x, y: r.y, width: w1, height: r.height });
        regions.push({ x: r.x + w1, y: r.y, width: r.width - w1, height: r.height });
      }
    }

    const inset = spacing / 2;
    return regions.map((r) => ({
      x: r.x + inset,
      y: r.y + inset,
      width: Math.max(1, r.width - spacing),
      height: Math.max(1, r.height - spacing),
    }));
  },
};
