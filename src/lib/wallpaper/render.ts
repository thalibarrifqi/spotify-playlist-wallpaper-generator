import { defaultTemplateSettings, getTemplate } from "./templates";
import { WALLPAPER_FONTS, getFont } from "./fonts";
import type { WallpaperFont } from "./fonts";
import {
  DEFAULT_TEXT_STYLE,
  buildCanvasFont,
  computeTitleLayout,
  scaleForCanvas,
  withAlpha,
} from "./text-layout";
import {
  DEFAULT_EFFECTS,
  buildFilterString,
  drawNoise,
  drawVignette,
} from "./effects";
import type {
  AlbumImage,
  FontWeight,
  GradientConfig,
  LayoutCell,
  WallpaperConfig,
} from "./types";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
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
  blurIntensity: number,
  artworkScale: number
): Promise<void> {
  const index = Math.min(blurImageIndex, images.length - 1);
  const image = images[index];
  if (!image) return;

  const img = await loadImage(image.url);

  ctx.save();
  ctx.filter = `blur(${blurIntensity}px)`;

  const baseScale = Math.max(width / img.width, height / img.height);
  const scale = baseScale * artworkScale;
  const drawW = img.width * scale;
  const drawH = img.height * scale;

  ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
  ctx.filter = "none";
  ctx.restore();
}

async function ensureFontLoaded(
  font: WallpaperFont,
  weight: FontWeight,
  size: number,
  text: string
): Promise<void> {
  if (font.category !== "google") return;
  if (typeof document === "undefined" || typeof document.fonts === "undefined") {
    return;
  }
  try {
    const fontSpec = `${weight} ${size}px "${font.family}"`;
    if (!document.fonts.check(fontSpec, text)) {
      await document.fonts.load(fontSpec, text);
    }
  } catch {
    // Font loading is best-effort; rendering falls back to a system font.
  }
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

  const effects = config.effects ?? DEFAULT_EFFECTS;

  // 1. Render the background + artwork grid to an offscreen canvas.
  const base = document.createElement("canvas");
  base.width = config.width;
  base.height = config.height;
  const baseCtx = base.getContext("2d");
  if (!baseCtx) {
    throw new Error("Canvas 2D context is not supported in this browser");
  }
  await renderBase(baseCtx, images, config);

  // 2. Composite the base onto the main canvas with the filter pipeline.
  ctx.save();
  ctx.filter = buildFilterString(effects);

  let drawX = 0;
  let drawY = 0;
  let drawWidth = config.width;
  let drawHeight = config.height;
  if (effects.blur > 0) {
    const margin = Math.max(16, effects.blur * 4);
    const scaleX = (config.width + margin * 2) / config.width;
    const scaleY = (config.height + margin * 2) / config.height;
    const scale = Math.max(scaleX, scaleY);
    drawWidth = config.width * scale;
    drawHeight = config.height * scale;
    drawX = (config.width - drawWidth) / 2;
    drawY = (config.height - drawHeight) / 2;
  }
  ctx.drawImage(base, drawX, drawY, drawWidth, drawHeight);
  ctx.filter = "none";
  ctx.restore();

  // 3. Overlay effects (vignette + noise) applied after the filter pass.
  if (effects.vignette) {
    drawVignette(ctx, config.width, config.height, effects.vignetteIntensity);
  }
  if (effects.noise) {
    drawNoise(ctx, config.width, config.height, effects.noiseIntensity);
  }

  if (config.title) {
    const textStyle = config.textStyle ?? DEFAULT_TEXT_STYLE;
    const font = getFont(textStyle.fontFamilyId) ?? WALLPAPER_FONTS[0];
    const fontSize = Math.round(scaleForCanvas(textStyle.fontSize, config.width));
    const padding = Math.round(scaleForCanvas(textStyle.padding, config.width));
    const canvasFont = buildCanvasFont(textStyle.fontWeight, fontSize, font);

    await ensureFontLoaded(font, textStyle.fontWeight, fontSize, config.title);

    ctx.save();
    ctx.font = canvasFont;

    const textWidth = ctx.measureText(config.title).width;
    const layout = computeTitleLayout(
      textStyle.position,
      config.width,
      config.height,
      textWidth,
      fontSize,
      padding,
      textStyle.showBackground
    );

    if (textStyle.showBackground) {
      const stripFill = withAlpha(
        config.titleBarColor ?? "#000000",
        textStyle.backgroundOpacity / 100
      );
      ctx.fillStyle = stripFill;
      ctx.beginPath();
      ctx.roundRect(
        layout.stripX,
        layout.stripY,
        layout.stripWidth,
        layout.stripHeight,
        layout.radius
      );
      ctx.fill();
    }

    ctx.textAlign = layout.align;
    ctx.textBaseline = layout.baseline;

    ctx.shadowColor = textStyle.shadow.color;
    ctx.shadowBlur = scaleForCanvas(textStyle.shadow.blur, config.width);
    const shadowOffset = Math.max(1, scaleForCanvas(1, config.width));
    ctx.shadowOffsetX = shadowOffset;
    ctx.shadowOffsetY = shadowOffset;

    const strokeWidth = scaleForCanvas(textStyle.strokeWidth, config.width);
    if (strokeWidth > 0) {
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = textStyle.strokeColor;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.strokeText(config.title, layout.textX, layout.textY);
    }

    ctx.fillStyle = textStyle.color;
    ctx.fillText(config.title, layout.textX, layout.textY);
    ctx.restore();
  }
}

async function renderBase(
  ctx: CanvasRenderingContext2D,
  images: AlbumImage[],
  config: WallpaperConfig
): Promise<void> {
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
      config.blurIntensity ?? 20,
      config.artworkScale ?? 1
    );
  } else if (config.gradient) {
    drawGradient(ctx, config.width, config.height, config.gradient);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, config.width, config.height);
  }

  if (images.length === 0) return;

  const template = getTemplate(config.template ?? "grid");
  const settings = {
    ...defaultTemplateSettings(template.id),
    ...config.templateSettings,
  };
  const cells = template.computeLayout(
    images.length,
    config.width,
    config.height,
    settings,
    spacing
  );
  const padded = padImages(images, cells.length);

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
    drawArtwork(ctx, item.element, item.cell, borderRadius, config.artworkScale ?? 1);
  }
}

function drawArtwork(
  ctx: CanvasRenderingContext2D,
  element: HTMLImageElement,
  cell: LayoutCell,
  borderRadius: number,
  artworkScale: number
): void {
  const radius = Math.min(borderRadius, cell.width / 2, cell.height / 2);
  const halfW = cell.width / 2;
  const halfH = cell.height / 2;

  ctx.save();
  ctx.translate(cell.x + halfW, cell.y + halfH);
  if (cell.rotation) {
    ctx.rotate(cell.rotation);
  }

  ctx.beginPath();
  if (radius > 0) {
    ctx.roundRect(-halfW, -halfH, cell.width, cell.height, radius);
  } else {
    ctx.rect(-halfW, -halfH, cell.width, cell.height);
  }
  ctx.clip();

  const scale =
    Math.max(cell.width / element.width, cell.height / element.height) *
    artworkScale;
  const drawW = element.width * scale;
  const drawH = element.height * scale;
  ctx.drawImage(element, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}
