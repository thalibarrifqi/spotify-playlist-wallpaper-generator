import { computeGridLayout } from "./grid-layout";
import { computeRandomLayout } from "./random-layout";
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

  const cells =
    config.layout === "grid"
      ? computeGridLayout(images.length, config.width, config.height)
      : computeRandomLayout(
          images.length,
          config.width,
          config.height,
          config.seed
        );

  const loaded = await Promise.all(
    images.map(async (image, index) => {
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
    const rad = (cell.rotation * Math.PI) / 180;

    ctx.save();
    ctx.translate(cell.x + cell.width / 2, cell.y + cell.height / 2);
    ctx.rotate(rad);

    const scale = Math.max(
      cell.width / element.width,
      cell.height / element.height
    );
    const width = element.width * scale;
    const height = element.height * scale;
    ctx.drawImage(element, -width / 2, -height / 2, width, height);

    ctx.restore();
  }
}
