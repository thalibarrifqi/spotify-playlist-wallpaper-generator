import type { LayoutCell } from "../types";
import type { TemplateSettings, WallpaperTemplate } from "./types";
import { computeGridLayout, findBestColumns } from "./grid";

export const diagonalTemplate: WallpaperTemplate = {
  id: "diagonal",
  label: "Diagonal",
  description: "Cells rotated at angles",
  settings: [
    {
      key: "rotation",
      label: "Rotation",
      min: -30,
      max: 30,
      step: 1,
      defaultValue: 15,
      unit: "°",
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

    const deg = settings.rotation ?? 15;
    const rad = (deg * Math.PI) / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const cover = Math.abs(cosA) + Math.abs(sinA);
    if (cover === 0) return [];

    const W = width * cover;
    const H = height * cover;
    const columns = findBestColumns(count, W, H, spacing);
    const rows = Math.ceil(count / columns);
    const base = computeGridLayout(columns * rows, W, H, spacing);

    const cx = width / 2;
    const cy = height / 2;

    return base.map((c) => {
      const px = c.x + c.width / 2 - W / 2;
      const py = c.y + c.height / 2 - H / 2;
      const rx = px * cosA - py * sinA;
      const ry = px * sinA + py * cosA;
      return {
        x: rx + cx - c.width / 2,
        y: ry + cy - c.height / 2,
        width: c.width,
        height: c.height,
        rotation: rad,
      };
    });
  },
};
