import { describe, it, expect } from "vitest";
import {
  TEMPLATES,
  TEMPLATE_LIST,
  defaultTemplateSettings,
  getTemplate,
  isTemplateId,
} from "../src/lib/wallpaper/templates";
import type { LayoutCell } from "../src/lib/wallpaper/types";

const RESOLUTIONS = {
  mobile: { width: 1080, height: 1920 },
  desktop: { width: 1920, height: 1080 },
};

const SPACING_VALUES = [0, 10];

function intersectArea(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): number {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  if (x2 <= x || y2 <= y) return 0;
  return (x2 - x) * (y2 - y);
}

function axisOverlap(a: LayoutCell, b: LayoutCell): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function cellBounds(cell: LayoutCell): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  const hw = cell.width / 2;
  const hh = cell.height / 2;
  const cx = cell.x + hw;
  const cy = cell.y + hh;
  if (!cell.rotation) {
    return { minX: cell.x, maxX: cell.x + cell.width, minY: cell.y, maxY: cell.y + cell.height };
  }
  const c = Math.abs(Math.cos(cell.rotation));
  const s = Math.abs(Math.sin(cell.rotation));
  const rx = c * hw + s * hh;
  const ry = s * hw + c * hh;
  return { minX: cx - rx, maxX: cx + rx, minY: cy - ry, maxY: cy + ry };
}

describe("template registry", () => {
  it("registers all 6 templates", () => {
    expect(TEMPLATE_LIST.map((t) => t.id).sort()).toEqual(
      ["border", "collage", "diagonal", "filmstrip", "grid", "mosaic"].sort()
    );
    expect(Object.keys(TEMPLATES).length).toBe(6);
  });

  it("getTemplate and isTemplateId behave correctly", () => {
    expect(getTemplate("grid").label).toBe("Grid");
    expect(isTemplateId("grid")).toBe(true);
    expect(isTemplateId("gridd")).toBe(false);
  });

  it("defaultTemplateSettings returns defaults for every template", () => {
    for (const template of TEMPLATE_LIST) {
      const settings = defaultTemplateSettings(template.id);
      for (const def of template.settings) {
        expect(settings[def.key]).toBe(def.defaultValue);
      }
    }
  });

  it("grid template has no settings", () => {
    expect(getTemplate("grid").settings).toEqual([]);
  });
});

describe("grid template", () => {
  for (const [label, res] of Object.entries(RESOLUTIONS)) {
    for (const spacing of SPACING_VALUES) {
      it(`${label} spacing=${spacing}: fills canvas with square cells`, () => {
        for (let count = 1; count <= 20; count++) {
          const cells = getTemplate("grid").computeLayout(
            count,
            res.width,
            res.height,
            {},
            spacing
          );
          expect(cells.length).toBeGreaterThanOrEqual(count);
          for (const cell of cells) {
            expect(Math.abs(cell.width - cell.height)).toBeLessThan(0.01);
          }
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          for (const c of cells) {
            minX = Math.min(minX, c.x);
            minY = Math.min(minY, c.y);
            maxX = Math.max(maxX, c.x + c.width);
            maxY = Math.max(maxY, c.y + c.height);
          }
          expect(minX).toBeLessThanOrEqual(spacing / 2 + 0.01);
          expect(minY).toBeLessThanOrEqual(spacing / 2 + 0.01);
          expect(maxX).toBeGreaterThanOrEqual(res.width - spacing / 2 - 0.01);
          expect(maxY).toBeGreaterThanOrEqual(res.height - spacing / 2 - 0.01);
        }
      });
    }
  }
});

describe("filmstrip template", () => {
  for (const [label, res] of Object.entries(RESOLUTIONS)) {
    it(`${label}: horizontal strip spans full width with no overlap`, () => {
      const cells = getTemplate("filmstrip").computeLayout(
        8,
        res.width,
        res.height,
        { vertical: 0 },
        10
      );
      expect(cells.length).toBe(8);
      for (const cell of cells) {
        expect(cell.y).toBe(0);
        expect(cell.height).toBe(res.height);
      }
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          expect(axisOverlap(cells[i], cells[j])).toBe(false);
        }
      }
      const first = cells[0];
      const last = cells[cells.length - 1];
      expect(first.x).toBe(0);
      expect(last.x + last.width).toBe(res.width);
    });

    it(`${label}: vertical strip spans full height with no overlap`, () => {
      const cells = getTemplate("filmstrip").computeLayout(
        8,
        res.width,
        res.height,
        { vertical: 1 },
        10
      );
      expect(cells.length).toBe(8);
      for (const cell of cells) {
        expect(cell.x).toBe(0);
        expect(cell.width).toBe(res.width);
      }
      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          expect(axisOverlap(cells[i], cells[j])).toBe(false);
        }
      }
      const first = cells[0];
      const last = cells[cells.length - 1];
      expect(first.y).toBe(0);
      expect(last.y + last.height).toBe(res.height);
    });
  }
});

describe("border template", () => {
  for (const [label, res] of Object.entries(RESOLUTIONS)) {
    it(`${label}: cells form a ring with blank center`, () => {
      const settings = { thickness: 0.3 };
      const cells = getTemplate("border").computeLayout(
        10,
        res.width,
        res.height,
        settings,
        0
      );
      const short = Math.min(res.width, res.height);
      const cellSize = short * 0.3;
      const cols = Math.max(2, Math.round(res.width / cellSize));
      const rows = Math.max(2, Math.round(res.height / cellSize));
      expect(cells.length).toBe(2 * (cols + rows) - 6);

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      for (const c of cells) {
        minX = Math.min(minX, c.x);
        minY = Math.min(minY, c.y);
        maxX = Math.max(maxX, c.x + c.width);
        maxY = Math.max(maxY, c.y + c.height);
      }
      expect(minX).toBe(0);
      expect(minY).toBe(0);
      expect(maxX).toBe(res.width);
      expect(maxY).toBe(res.height);

      for (let i = 0; i < cells.length; i++) {
        for (let j = i + 1; j < cells.length; j++) {
          expect(intersectArea(cells[i], cells[j])).toBeLessThan(0.01);
        }
      }
      for (const c of cells) {
        const centerIn =
          res.width / 2 > c.x &&
          res.width / 2 < c.x + c.width &&
          res.height / 2 > c.y &&
          res.height / 2 < c.y + c.height;
        expect(centerIn).toBe(false);
      }
    });
  }
});

describe("mosaic template", () => {
  for (const [label, res] of Object.entries(RESOLUTIONS)) {
    for (const spacing of SPACING_VALUES) {
      it(`${label} spacing=${spacing}: produces varied, non-overlapping cells covering the canvas`, () => {
        for (let count = 1; count <= 15; count++) {
          const cells = getTemplate("mosaic").computeLayout(
            count,
            res.width,
            res.height,
            { variation: 0.5 },
            spacing
          );
          expect(cells.length).toBe(count);

          let totalArea = 0;
          let maxW = 0;
          for (const c of cells) {
            expect(c.width).toBeGreaterThan(0);
            expect(c.height).toBeGreaterThan(0);
            totalArea += c.width * c.height;
            maxW = Math.max(maxW, c.width);
          }
          const maxArea =
            (res.width - spacing) * (res.height - spacing) + 0.01;
          expect(totalArea).toBeLessThanOrEqual(maxArea);

          for (let i = 0; i < cells.length; i++) {
            for (let j = i + 1; j < cells.length; j++) {
              expect(intersectArea(cells[i], cells[j])).toBeLessThan(0.01);
            }
          }

          if (count >= 4) {
            const widths = new Set(
              cells.map((c) => Math.round(c.width / 100))
            );
            expect(widths.size).toBeGreaterThan(1);
          }
        }
      });
    }
  }
});

describe("collage template", () => {
  for (const [label, res] of Object.entries(RESOLUTIONS)) {
    it(`${label}: features a large cell and varied small cells`, () => {
      for (let count = 2; count <= 10; count++) {
        const cells = getTemplate("collage").computeLayout(
          count,
          res.width,
          res.height,
          { overlap: 0 },
          10
        );
        expect(cells.length).toBe(count);

        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        for (const c of cells) {
          minX = Math.min(minX, c.x);
          minY = Math.min(minY, c.y);
          maxX = Math.max(maxX, c.x + c.width);
          maxY = Math.max(maxY, c.y + c.height);
        }
        expect(minX).toBe(0);
        expect(minY).toBe(0);
        expect(maxX).toBeCloseTo(res.width, 5);
        expect(maxY).toBeCloseTo(res.height, 5);

        const big = cells[0];
        expect(big.width).toBeGreaterThan(res.width * 0.55);
        expect(big.height).toBe(res.height);

        for (let i = 0; i < cells.length; i++) {
          for (let j = i + 1; j < cells.length; j++) {
            expect(intersectArea(cells[i], cells[j])).toBeLessThan(0.01);
          }
        }
      }
    });

    it(`${label}: overlap setting makes cells overlap`, () => {
      const cells = getTemplate("collage").computeLayout(
        4,
        res.width,
        res.height,
        { overlap: 30 },
        10
      );
      expect(intersectArea(cells[0], cells[1])).toBeGreaterThan(0);
    });
  }
});

describe("diagonal template", () => {
  for (const [label, res] of Object.entries(RESOLUTIONS)) {
    for (const deg of [0, 15, -20, 30]) {
      it(`${label} rotation=${deg}: rotates cells while covering the canvas`, () => {
        const rad = (deg * Math.PI) / 180;
        const cells = getTemplate("diagonal").computeLayout(
          12,
          res.width,
          res.height,
          { rotation: deg },
          10
        );
        expect(cells.length).toBeGreaterThanOrEqual(12);
        for (const cell of cells) {
          expect(cell.rotation).toBeCloseTo(rad, 6);
          expect(cell.width).toBeGreaterThan(0);
          expect(cell.height).toBeGreaterThan(0);
        }

        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        for (const cell of cells) {
          const b = cellBounds(cell);
          minX = Math.min(minX, b.minX);
          minY = Math.min(minY, b.minY);
          maxX = Math.max(maxX, b.maxX);
          maxY = Math.max(maxY, b.maxY);
        }
        expect(minX).toBeLessThanOrEqual(2);
        expect(minY).toBeLessThanOrEqual(2);
        expect(maxX).toBeGreaterThanOrEqual(res.width - 2);
        expect(maxY).toBeGreaterThanOrEqual(res.height - 2);
      });
    }
  }
});
