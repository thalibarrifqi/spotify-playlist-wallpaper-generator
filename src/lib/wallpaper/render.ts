import { computeGridLayout } from "./grid-layout";
import type { AlbumImage, WallpaperConfig } from "./types";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function findBestColumns(
  count: number,
  width: number,
  height: number
): number {
  let bestColumns = 1;
  let bestSize = 0;
  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const size = Math.min(width / columns, height / rows);
    if (size > bestSize) {
      bestSize = size;
      bestColumns = columns;
    }
  }
  return bestColumns;
}

function padImages(images: AlbumImage[], targetCount: number): AlbumImage[] {
  if (images.length >= targetCount) return images.slice(0, targetCount);
  const padded = [...images];
  while (padded.length < targetCount) {
    padded.push(images[Math.floor(Math.random() * images.length)]);
  }
  return padded;
}

export async function drawWallpaper(
  images: AlbumImage[],
  canvas: HTMLCanvasElement,
  config: WallpaperConfig
): Promise<void> {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context is not supported in this browser");
  }

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, config.width, config.height);

  const columns = findBestColumns(images.length, config.width, config.height);
  const rows = Math.ceil(images.length / columns);
  const targetCount = columns * rows;
  const padded = padImages(images, targetCount);

  const cells = computeGridLayout(padded.length, config.width, config.height);

  const loaded = await Promise.all(
    padded.map(async (image, index) => {
      try {
        const element = await loadImage(image.url);
        return { element, cell: cells[index] };
      } catch {
        return null;
      }
    })
  );

  for (const item of loaded) {
    if (!item) continue;

    const { element, cell } = item;
    const scale = Math.max(
      cell.width / element.width,
      cell.height / element.height
    );
    const drawW = element.width * scale;
    const drawH = element.height * scale;

    ctx.save();
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, cell.width, cell.height);
    ctx.clip();
    ctx.drawImage(
      element,
      cell.x + (cell.width - drawW) / 2,
      cell.y + (cell.height - drawH) / 2,
      drawW,
      drawH
    );
    ctx.restore();
  }
}
