export type ResolutionKey = "mobile" | "desktop";

export type FontWeight = 400 | 500 | 700;

export type TextPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface TextShadow {
  blur: number;
  color: string;
}

export interface TextStyle {
  fontFamilyId: string;
  fontWeight: FontWeight;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  shadow: TextShadow;
  position: TextPosition;
  padding: number;
  showBackground: boolean;
  backgroundOpacity: number;
}

export interface AlbumImage {
  url: string;
  width: number;
  height: number;
  albumName?: string;
}

export interface LayoutCell {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export type TemplateId =
  | "grid"
  | "collage"
  | "mosaic"
  | "diagonal"
  | "border"
  | "filmstrip";

export interface GradientConfig {
  type: "linear" | "radial";
  angle: number;
  colors: string[];
}

export interface WallpaperEffects {
  brightness: number;
  contrast: number;
  saturation: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
  blur: number;
  vignette: boolean;
  vignetteIntensity: number;
  noise: boolean;
  noiseIntensity: number;
}

export interface WallpaperConfig {
  width: number;
  height: number;
  title?: string;
  spacing?: number;
  borderRadius?: number;
  backgroundColor?: string;
  titleBarColor?: string;
  titleTextColor?: string;
  textStyle?: TextStyle;
  gradient?: GradientConfig;
  blur?: boolean;
  blurIntensity?: number;
  blurImageIndex?: number;
  artworkScale?: number;
  effects?: WallpaperEffects;
  template?: TemplateId;
  templateSettings?: Record<string, number>;
}

export const RESOLUTIONS: Record<
  ResolutionKey,
  { label: string; width: number; height: number }
> = {
  mobile: { label: "Mobile", width: 1080, height: 1920 },
  desktop: { label: "Desktop", width: 1920, height: 1080 },
};
