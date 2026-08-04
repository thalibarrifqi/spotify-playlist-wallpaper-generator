import { describe, it, expect } from "vitest";
import { computeGridLayout } from "../src/lib/wallpaper/grid-layout";

const RESOLUTIONS = {
  mobile: { width: 1080, height: 1920 },
  desktop: { width: 1920, height: 1080 },
};

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

describe("grid layout", () => {
  for (const [label, res] of Object.entries(RESOLUTIONS)) {
    describe(label, () => {
      for (let count = 1; count <= 50; count++) {
        it(`count ${count}: returns correct number of square cells covering the canvas`, () => {
          const cells = computeGridLayout(count, res.width, res.height);

          expect(cells.length).toBe(count);

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
          expect(minX).toBeLessThanOrEqual(0.01);
          expect(minY).toBeLessThanOrEqual(0.01);
          expect(maxX).toBeGreaterThanOrEqual(res.width - 0.01);
          expect(maxY).toBeGreaterThanOrEqual(res.height - 0.01);

          for (let i = 0; i < cells.length; i++) {
            for (let j = i + 1; j < cells.length; j++) {
              const a = cells[i];
              const b = cells[j];
              const aClip = {
                x: Math.max(a.x, 0),
                y: Math.max(a.y, 0),
                width: Math.min(a.x + a.width, res.width) - Math.max(a.x, 0),
                height:
                  Math.min(a.y + a.height, res.height) - Math.max(a.y, 0),
              };
              const bClip = {
                x: Math.max(b.x, 0),
                y: Math.max(b.y, 0),
                width: Math.min(b.x + b.width, res.width) - Math.max(b.x, 0),
                height:
                  Math.min(b.y + b.height, res.height) - Math.max(b.y, 0),
              };
              if (
                aClip.width > 0 &&
                aClip.height > 0 &&
                bClip.width > 0 &&
                bClip.height > 0
              ) {
                expect(intersectArea(aClip, bClip)).toBeLessThan(0.01);
              }
            }
          }
        });
      }
    });
  }
});
