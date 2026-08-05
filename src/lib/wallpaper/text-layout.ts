import type { FontWeight, TextPosition, TextStyle } from "./types";
import type { WallpaperFont } from "./fonts";

export const FONT_SIZE_PRESETS: { label: string; value: number }[] = [
  { label: "Small", value: 24 },
  { label: "Medium", value: 34 },
  { label: "Large", value: 48 },
  { label: "Extra Large", value: 64 },
];

export const TEXT_COLOR_PRESETS = [
  "#ffffff",
  "#18181b",
  "#1db954",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#a855f7",
];

export const STROKE_COLOR_PRESETS = ["#000000", "#ffffff", "#18181b", "#1db954"];

export const SHADOW_COLOR_PRESETS = [
  "rgba(0, 0, 0, 0.8)",
  "rgba(0, 0, 0, 0.5)",
  "rgba(0, 0, 0, 0.25)",
  "rgba(255, 255, 255, 0.8)",
];

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamilyId: "inter",
  fontWeight: 700,
  fontSize: 34,
  color: "#ffffff",
  strokeColor: "#000000",
  strokeWidth: 0,
  shadow: { blur: 6, color: "rgba(0, 0, 0, 0.6)" },
  position: "bottom-center",
  padding: 24,
  showBackground: true,
  backgroundOpacity: 100,
};

export function scaleForCanvas(
  value: number,
  canvasWidth: number,
  referenceWidth: number = 1080
): number {
  return value * (canvasWidth / referenceWidth);
}

export function buildCanvasFont(
  fontWeight: FontWeight,
  fontSize: number,
  font: WallpaperFont
): string {
  const family = font.category === "google" ? `"${font.family}"` : font.family;
  return `${fontWeight} ${fontSize}px ${family}`;
}

export function withAlpha(color: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));

  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a.toFixed(3)})`;
  }

  const hexShort = color.match(/^#([0-9a-f]{3})$/i);
  if (hexShort) {
    const r = parseInt(hexShort[1][0], 16) * 17;
    const g = parseInt(hexShort[1][1], 16) * 17;
    const b = parseInt(hexShort[1][2], 16) * 17;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
  }

  const rgba = color.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*[\d.]+)?\s*\)$/i
  );
  if (rgba) {
    return `rgba(${rgba[1]}, ${rgba[2]}, ${rgba[3]}, ${a.toFixed(3)})`;
  }

  return color;
}

export interface TitleLayout {
  stripX: number;
  stripY: number;
  stripWidth: number;
  stripHeight: number;
  radius: number;
  textX: number;
  textY: number;
  align: "left" | "center" | "right";
  baseline: "middle" | "top" | "alphabetic";
}

export function computeTitleLayout(
  position: TextPosition,
  canvasWidth: number,
  canvasHeight: number,
  textWidth: number,
  fontSize: number,
  padding: number,
  showBackground: boolean
): TitleLayout {
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");
  const isRight = position.endsWith("right");

  const stripPad = fontSize * 0.45;
  const stripHeight = fontSize * 1.4;
  const maxStripWidth = Math.max(0, canvasWidth - padding * 2);
  const rawStripWidth = showBackground ? textWidth + stripPad * 2 : 0;
  const stripWidth = Math.min(rawStripWidth, maxStripWidth);

  let stripX = 0;
  if (showBackground) {
    if (isLeft) stripX = padding;
    else if (isRight) stripX = canvasWidth - padding - stripWidth;
    else stripX = (canvasWidth - stripWidth) / 2;
  }

  const stripY = isTop
    ? padding
    : canvasHeight - padding - stripHeight;

  const align = showBackground ? "center" : isLeft ? "left" : isRight ? "right" : "center";
  const baseline = showBackground ? "middle" : isTop ? "top" : "alphabetic";

  const textX = showBackground
    ? stripX + stripWidth / 2
    : isLeft
      ? padding
      : isRight
        ? canvasWidth - padding
        : canvasWidth / 2;

  const textY = showBackground
    ? stripY + stripHeight / 2
    : isTop
      ? padding
      : canvasHeight - padding;

  return {
    stripX,
    stripY,
    stripWidth,
    stripHeight,
    radius: Math.min(fontSize * 0.28, stripHeight / 2),
    textX,
    textY,
    align,
    baseline,
  };
}
