import { computeGridLayout } from "./grid-layout";
import type { AlbumImage, GradientConfig, WallpaperConfig } from "./types";

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
  height: number,
  spacing: number
): number {
  const gapX = spacing * (Math.min(count, Math.ceil(width / height)) + 1);
  const gapY = spacing * (Math.ceil(count / Math.min(count, Math.ceil(width / height))) + 1);
  const availW = width - gapX;
  const availH = height - gapY;

  let bestColumns = 1;
  let bestSize = 0;
  for (let columns = 1; columns <= count; columns++) {
    const rows = Math.ceil(count / columns);
    const size = Math.min(availW / columns, availH / rows);
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

function drawGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gradient: GradientConfig
): void {
  const angle = (gradient.angle * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const len = Math.max(width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  const x1 = centerX - cos * len;
  const y1 = centerY - sin * len;
  const x2 = centerX + cos * len;
  const y2 = centerY + sin * len;

  if (gradient.type === "radial") {
    const grd = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.max(width, height) / 2
    );
    gradient.colors.forEach((color, i) => {
      grd.addColorStop(i / (gradient.colors.length - 1), color);
    });
    ctx.fillStyle = grd;
  } else {
    const grd = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.colors.forEach((color, i) => {
      grd.addColorStop(i / (gradient.colors.length - 1), color);
    });
    ctx.fillStyle = grd;
  }

  ctx.fillRect(0, 0, width, height);
}

async function drawBlurBackground(
  ctx: CanvasRenderingContext2D,
  images: AlbumImage[],
  width: number,
  height: number,
  blurImageIndex: number,
  blurIntensity: number
): Promise<void> {
  const index = Math.min(blurImageIndex, images.length - 1);
  const image = images[index];
  if (!image) return;

  const img = await loadImage(image.url);

  ctx.save();
  ctx.filter = `blur(${blurIntensity}px)`;

  const scale = Math.max(width / img.width, height / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;

  ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
  ctx.filter = "none";
  ctx.restore();
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

  const bgColor = config.backgroundColor ?? "#000000";
  const spacing = config.spacing ?? 0;
  const borderRadius = config.borderRadius ?? 0;

  if (config.blur) {
    await drawBlurBackground(
      ctx,
      images,
      config.width,
      config.height,
      config.blurImageIndex ?? 0,
      config.blurIntensity ?? 20
    );
  } else if (config.gradient) {
    drawGradient(ctx, config.width, config.height, config.gradient);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, config.width, config.height);
  }

  const columns = findBestColumns(images.length, config.width, config.height, spacing);
  const rows = Math.ceil(images.length / columns);
  const targetCount = columns * rows;
  const padded = padImages(images, targetCount);

  const cells = computeGridLayout(padded.length, config.width, config.height, spacing);

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
    if (borderRadius > 0) {
      const r = Math.min(borderRadius, cell.width / 2, cell.height / 2);
      ctx.beginPath();
      ctx.roundRect(cell.x, cell.y, cell.width, cell.height, r);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.rect(cell.x, cell.y, cell.width, cell.height);
      ctx.clip();
    }
    ctx.drawImage(
      element,
      cell.x + (cell.width - drawW) / 2,
      cell.y + (cell.height - drawH) / 2,
      drawW,
      drawH
    );
    ctx.restore();
  }

  if (config.title) {
    const isDesktop = config.width > config.height;
    const fontSize = Math.round(config.width * (isDesktop ? 0.02 : 0.035));
    const padding = Math.round(fontSize * 0.5);
    const barHeight = fontSize + padding * 2;
    const barY = config.height - barHeight;

    ctx.fillStyle = config.titleBarColor ?? "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, barY, config.width, barHeight);

    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = config.titleTextColor ?? "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.textBaseline = "middle";
    ctx.fillText(config.title, padding, barY + barHeight / 2);
    ctx.shadowColor = "transparent";
  }
}
