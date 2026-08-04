import { computeGridCellSize } from "./grid-layout";
import type { LayoutCell } from "./types";

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return function () {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getBounds(
  x: number,
  y: number,
  size: number,
  rotationDeg: number
): Bounds {
  const half = size / 2;
  const rad = (rotationDeg * Math.PI) / 180;
  const extent = half * (Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad)));
  return {
    minX: x + half - extent,
    maxX: x + half + extent,
    minY: y + half - extent,
    maxY: y + half + extent,
  };
}

function collides(bounds: Bounds, placed: Bounds[]): boolean {
  return placed.some(
    (p) =>
      bounds.minX < p.maxX &&
      bounds.maxX > p.minX &&
      bounds.minY < p.maxY &&
      bounds.maxY > p.minY
  );
}

function tryPlace(
  size: number,
  width: number,
  height: number,
  rotationMax: number,
  attempts: number,
  placed: Bounds[],
  rand: () => number
): LayoutCell | null {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const rotation = rand() * rotationMax;
    const x = rand() * (width - size);
    const y = rand() * (height - size);
    const bounds = getBounds(x, y, size, rotation);
    if (
      bounds.minX < 0 ||
      bounds.minY < 0 ||
      bounds.maxX > width ||
      bounds.maxY > height ||
      collides(bounds, placed)
    ) {
      continue;
    }
    return { x, y, size, rotation };
  }
  return null;
}

function rotationLimitFromBudget(budgetUnits: number): number {
  if (budgetUnits >= 2) return 90;
  if (budgetUnits <= 1) return 0;
  const cosPlusSin = Math.sqrt(budgetUnits);
  const rad = Math.acos(Math.min(1, cosPlusSin / Math.SQRT2));
  return Math.max(0, Math.min(90, 45 - (rad * 180) / Math.PI));
}

const SHRINK_FACTORS = [1, 0.8, 0.65, 0.5, 0.38, 0.28, 0.2, 0.14, 0.09, 0.05];

function scanPlace(
  size: number,
  width: number,
  height: number,
  rotationMax: number,
  placed: Bounds[]
): LayoutCell | null {
  const step = Math.max(1, size / 6);
  const rotations = [rotationMax, rotationMax * 0.7, rotationMax * 0.4, 0];
  for (const offset of [0, step / 2]) {
    for (const rotation of rotations) {
      for (let y = offset; y + size <= height + 0.5; y += step) {
        for (let x = offset; x + size <= width + 0.5; x += step) {
          const bounds = getBounds(x, y, size, rotation);
          if (
            bounds.minX < 0 ||
            bounds.minY < 0 ||
            bounds.maxX > width ||
            bounds.maxY > height ||
            collides(bounds, placed)
          ) {
            continue;
          }
          return { x, y, size, rotation };
        }
      }
    }
  }
  return null;
}

export function computeRandomLayout(
  count: number,
  width: number,
  height: number,
  seed = Date.now()
): LayoutCell[] {
  const gridSize = computeGridCellSize(count, width, height);
  const areaLimitedSize = Math.sqrt(
    (width * height) / (3 * count)
  );
  const size = Math.min(gridSize, areaLimitedSize);
  const rand = mulberry32(seed);
  const cells: (LayoutCell | null)[] = new Array(count).fill(null);
  const placed: Bounds[] = [];

  const order = Array.from({ length: count }, (_, i) => i);
  for (let k = order.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [order[k], order[j]] = [order[j], order[k]];
  }

  const totalUnits = (width * height) / (size * size);
  let usedUnits = 0;

  for (const index of order) {
    const remaining = count - placed.length - 1;
    const budgetUnits = Math.min(2, totalUnits - usedUnits - remaining);
    const rotationMax = rotationLimitFromBudget(budgetUnits);

    let cell: LayoutCell | null = null;

    for (const shrink of SHRINK_FACTORS) {
      const attemptSize = Math.max(size * shrink, 1);
      cell =
        tryPlace(attemptSize, width, height, rotationMax, 60, placed, rand) ??
        tryPlace(attemptSize, width, height, 0, 200, placed, rand) ??
        scanPlace(attemptSize, width, height, rotationMax, placed);
      if (cell) break;
    }

    if (!cell) {
      outer: for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (!collides(getBounds(x, y, 1, 0), placed)) {
            cell = { x, y, size: 1, rotation: 0 };
            break outer;
          }
        }
      }
    }

    if (!cell) {
      cell = { x: 0, y: 0, size: 1, rotation: 0 };
    }

    cells[index] = cell;
    const bounds = getBounds(cell.x, cell.y, cell.size, cell.rotation);
    usedUnits +=
      (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY) /
      (size * size);
    placed.push(bounds);
  }

  return cells as LayoutCell[];
}
