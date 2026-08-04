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

  const cells = computeGridLayout(images.length, config.width, config.height);

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
    const scale = Math.max(
      cell.size / element.width,
      cell.size / element.height
    );
    const width = element.width * scale;
    const height = element.height * scale;
    ctx.drawImage(
      element,
      cell.x + cell.size / 2 - width / 2,
      cell.y + cell.size / 2 - height / 2,
      width,
      height
    );
  }
}
