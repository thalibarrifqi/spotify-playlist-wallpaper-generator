import type { WallpaperEffects } from "./types";

export const DEFAULT_EFFECTS: WallpaperEffects = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  grayscale: false,
  sepia: false,
  invert: false,
  blur: 0,
  vignette: false,
  vignetteIntensity: 40,
  noise: false,
  noiseIntensity: 30,
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function buildFilterString(effects: WallpaperEffects): string {
  const parts: string[] = [];
  parts.push(`brightness(${1 + effects.brightness / 100})`);
  parts.push(`contrast(${1 + effects.contrast / 100})`);
  parts.push(`saturate(${1 + effects.saturation / 100})`);
  if (effects.grayscale) parts.push("grayscale(1)");
  if (effects.sepia) parts.push("sepia(1)");
  if (effects.invert) parts.push("invert(1)");
  if (effects.blur > 0) parts.push(`blur(${effects.blur}px)`);
  return parts.join(" ");
}

export function isDefaultEffects(effects: WallpaperEffects): boolean {
  return (
    effects.brightness === 0 &&
    effects.contrast === 0 &&
    effects.saturation === 0 &&
    !effects.grayscale &&
    !effects.sepia &&
    !effects.invert &&
    effects.blur === 0 &&
    !effects.vignette &&
    !effects.noise
  );
}

export function effectsEqual(
  a: WallpaperEffects,
  b: WallpaperEffects
): boolean {
  return (
    a.brightness === b.brightness &&
    a.contrast === b.contrast &&
    a.saturation === b.saturation &&
    a.grayscale === b.grayscale &&
    a.sepia === b.sepia &&
    a.invert === b.invert &&
    a.blur === b.blur &&
    a.vignette === b.vignette &&
    a.vignetteIntensity === b.vignetteIntensity &&
    a.noise === b.noise &&
    a.noiseIntensity === b.noiseIntensity
  );
}

export function scaleEffects(
  effects: WallpaperEffects,
  multiplier: number
): WallpaperEffects {
  return {
    ...effects,
    blur: Math.round(effects.blur * multiplier * 10) / 10,
  };
}

export function vignetteAlpha(intensity: number): number {
  return (clamp(intensity, 0, 100) / 100) * 0.85;
}

export function noiseDensity(intensity: number): number {
  return (clamp(intensity, 0, 100) / 100) * 0.5;
}

export function drawVignette(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  const alpha = vignetteAlpha(intensity);
  if (alpha <= 0) return;

  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.45,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.72
  );
  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, `rgba(0, 0, 0, ${alpha.toFixed(3)})`);

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function drawNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
): void {
  const density = noiseDensity(intensity);
  if (density <= 0) return;

  const tileSize = 128;
  const tile = document.createElement("canvas");
  tile.width = tileSize;
  tile.height = tileSize;
  const tileCtx = tile.getContext("2d");
  if (!tileCtx) return;

  const data = tileCtx.createImageData(tileSize, tileSize);
  for (let i = 0; i < data.data.length; i += 4) {
    if (Math.random() < density) {
      const v = Math.floor(Math.random() * 256);
      data.data[i] = v;
      data.data[i + 1] = v;
      data.data[i + 2] = v;
      data.data[i + 3] = 51;
    } else {
      data.data[i + 3] = 0;
    }
  }
  tileCtx.putImageData(data, 0, 0);

  const pattern = ctx.createPattern(tile, "repeat");
  if (!pattern) return;

  ctx.save();
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}
