export type ResolutionKey = "mobile" | "desktop";

export interface AlbumImage {
  url: string;
  width: number;
  height: number;
}

export interface LayoutCell {
  x: number;
  y: number;
  size: number;
}

export interface WallpaperConfig {
  width: number;
  height: number;
}

export const RESOLUTIONS: Record<
  ResolutionKey,
  { label: string; width: number; height: number }
> = {
  mobile: { label: "Mobile", width: 1080, height: 1920 },
  desktop: { label: "Desktop", width: 1920, height: 1080 },
};
