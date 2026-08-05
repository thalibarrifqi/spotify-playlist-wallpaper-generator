import type { FontWeight } from "./types";

export interface WallpaperFont {
  id: string;
  label: string;
  category: "google" | "system";
  family: string;
  cssVariable?: string;
  weights: FontWeight[];
}

export const FONT_WEIGHTS: FontWeight[] = [400, 500, 700];

export const WALLPAPER_FONTS: WallpaperFont[] = [
  {
    id: "inter",
    label: "Inter",
    category: "google",
    family: "Inter",
    cssVariable: "--font-wallpaper-inter",
    weights: FONT_WEIGHTS,
  },
  {
    id: "roboto",
    label: "Roboto",
    category: "google",
    family: "Roboto",
    cssVariable: "--font-wallpaper-roboto",
    weights: FONT_WEIGHTS,
  },
  {
    id: "playfair",
    label: "Playfair Display",
    category: "google",
    family: "Playfair Display",
    cssVariable: "--font-wallpaper-playfair",
    weights: FONT_WEIGHTS,
  },
  {
    id: "montserrat",
    label: "Montserrat",
    category: "google",
    family: "Montserrat",
    cssVariable: "--font-wallpaper-montserrat",
    weights: FONT_WEIGHTS,
  },
  {
    id: "poppins",
    label: "Poppins",
    category: "google",
    family: "Poppins",
    cssVariable: "--font-wallpaper-poppins",
    weights: FONT_WEIGHTS,
  },
  {
    id: "system",
    label: "System Sans",
    category: "system",
    family: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    weights: FONT_WEIGHTS,
  },
  {
    id: "serif",
    label: "Serif",
    category: "system",
    family: "Georgia, 'Times New Roman', serif",
    weights: FONT_WEIGHTS,
  },
  {
    id: "mono",
    label: "Monospace",
    category: "system",
    family: "'Courier New', Courier, monospace",
    weights: FONT_WEIGHTS,
  },
];

export const GOOGLE_FONTS = WALLPAPER_FONTS.filter((f) => f.category === "google");

export function getFont(id: string): WallpaperFont | undefined {
  return WALLPAPER_FONTS.find((font) => font.id === id);
}

export function getFontFamily(id: string): string {
  return getFont(id)?.family ?? WALLPAPER_FONTS[0].family;
}
