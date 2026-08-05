import { drawWallpaperCore } from "./canvas-core";
import type { CanvasLike, RenderEnvironment } from "./canvas-core";
import type { WallpaperFont } from "./fonts";
import type { AlbumImage, FontWeight, WallpaperConfig } from "./types";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
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

function createCanvas(width: number, height: number): CanvasLike {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Main-thread rendering environment backed by DOM APIs (HTMLImageElement,
 * document.createElement, document.fonts).
 */
export const renderEnvironment: RenderEnvironment = {
  loadImage,
  createCanvas,
  ensureFontLoaded,
};

export async function drawWallpaper(
  images: AlbumImage[],
  canvas: HTMLCanvasElement,
  config: WallpaperConfig
): Promise<void> {
  return drawWallpaperCore(canvas, images, config, renderEnvironment);
}
