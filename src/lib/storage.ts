import type {
  GradientConfig,
  TemplateId,
  TextStyle,
  WallpaperEffects,
} from "./wallpaper/types";
import type { ThemeKey } from "./wallpaper/themes";
import type { TemplateSettings } from "./wallpaper/templates";
import { isTemplateId } from "./wallpaper/templates";
import { DEFAULT_TEXT_STYLE } from "./wallpaper/text-layout";
import { DEFAULT_EFFECTS } from "./wallpaper/effects";

export const STORAGE_KEYS = {
  settings: "spotify-wallpaper-settings",
  history: "spotify-wallpaper-history",
  settingsVersion: "spotify-wallpaper-settings-version",
} as const;

export const SETTINGS_VERSION = 1;

export const DEFAULT_GRADIENT: GradientConfig = {
  type: "linear",
  angle: 135,
  colors: ["#667eea", "#764ba2"],
};

export interface WallpaperSettings {
  theme: ThemeKey;
  resolution: "mobile" | "desktop";
  customWidth: string;
  customHeight: string;
  useCustom: boolean;
  showTitle: boolean;
  textStyle: TextStyle;
  spacing: number;
  borderRadius: number;
  useGradient: boolean;
  gradient: GradientConfig;
  useBlur: boolean;
  blurIntensity: number;
  blurImageIndex: number;
  artworkScale: number;
  effects: WallpaperEffects;
  template: TemplateId;
  templateSettings: TemplateSettings;
}

export const DEFAULT_SETTINGS: WallpaperSettings = {
  theme: "dark",
  resolution: "mobile",
  customWidth: "",
  customHeight: "",
  useCustom: false,
  showTitle: false,
  textStyle: DEFAULT_TEXT_STYLE,
  spacing: 0,
  borderRadius: 0,
  useGradient: false,
  gradient: DEFAULT_GRADIENT,
  useBlur: false,
  blurIntensity: 20,
  blurImageIndex: 0,
  artworkScale: 1,
  effects: DEFAULT_EFFECTS,
  template: "grid",
  templateSettings: {},
};

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function pickString(value: unknown, fallback: string): string {
  return isString(value) ? value : fallback;
}

function pickNumber(value: unknown, fallback: number): number {
  return isNumber(value) ? value : fallback;
}

function pickBoolean(value: unknown, fallback: boolean): boolean {
  return isBoolean(value) ? value : fallback;
}

function pickRecord(value: unknown): Record<string, number> {
  if (!isRecord(value)) return {};
  const out: Record<string, number> = {};
  for (const [key, val] of Object.entries(value)) {
    if (isNumber(val)) out[key] = val;
  }
  return out;
}

export function mergeSettings(saved: unknown, defaults: WallpaperSettings = DEFAULT_SETTINGS): WallpaperSettings {
  if (!isRecord(saved)) return defaults;
  const gradient: GradientConfig = isRecord(saved.gradient)
    ? {
        type: saved.gradient.type === "radial" ? "radial" : "linear",
        angle: pickNumber(saved.gradient.angle, defaults.gradient.angle),
        colors: Array.isArray(saved.gradient.colors)
          ? saved.gradient.colors.filter(isString)
          : defaults.gradient.colors,
      }
    : defaults.gradient;

  const textStyle: TextStyle = {
    ...defaults.textStyle,
    ...(isRecord(saved.textStyle)
      ? {
          fontFamilyId: pickString(saved.textStyle.fontFamilyId, defaults.textStyle.fontFamilyId),
          fontWeight: isNumber(saved.textStyle.fontWeight)
            ? ([400, 500, 700].includes(saved.textStyle.fontWeight)
                ? (saved.textStyle.fontWeight as TextStyle["fontWeight"])
                : defaults.textStyle.fontWeight)
            : defaults.textStyle.fontWeight,
          fontSize: pickNumber(saved.textStyle.fontSize, defaults.textStyle.fontSize),
          color: pickString(saved.textStyle.color, defaults.textStyle.color),
          strokeColor: pickString(saved.textStyle.strokeColor, defaults.textStyle.strokeColor),
          strokeWidth: pickNumber(saved.textStyle.strokeWidth, defaults.textStyle.strokeWidth),
          padding: pickNumber(saved.textStyle.padding, defaults.textStyle.padding),
          position: isString(saved.textStyle.position)
            ? (["top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"] as const).includes(
                saved.textStyle.position as never
              )
              ? (saved.textStyle.position as TextStyle["position"])
              : defaults.textStyle.position
            : defaults.textStyle.position,
          showBackground: pickBoolean(saved.textStyle.showBackground, defaults.textStyle.showBackground),
          backgroundOpacity: pickNumber(saved.textStyle.backgroundOpacity, defaults.textStyle.backgroundOpacity),
          shadow: isRecord(saved.textStyle.shadow)
            ? {
                blur: pickNumber(saved.textStyle.shadow.blur, defaults.textStyle.shadow.blur),
                color: pickString(saved.textStyle.shadow.color, defaults.textStyle.shadow.color),
              }
            : defaults.textStyle.shadow,
        }
      : {}),
  };

  const template: TemplateId =
    isString(saved.template) && isTemplateId(saved.template)
      ? saved.template
      : defaults.template;

  return {
    theme: isString(saved.theme) ? (saved.theme as ThemeKey) : defaults.theme,
    resolution: saved.resolution === "desktop" ? "desktop" : "mobile",
    customWidth: pickString(saved.customWidth, defaults.customWidth),
    customHeight: pickString(saved.customHeight, defaults.customHeight),
    useCustom: pickBoolean(saved.useCustom, defaults.useCustom),
    showTitle: pickBoolean(saved.showTitle, defaults.showTitle),
    textStyle,
    spacing: pickNumber(saved.spacing, defaults.spacing),
    borderRadius: pickNumber(saved.borderRadius, defaults.borderRadius),
    useGradient: pickBoolean(saved.useGradient, defaults.useGradient),
    gradient,
    useBlur: pickBoolean(saved.useBlur, defaults.useBlur),
    blurIntensity: pickNumber(saved.blurIntensity, defaults.blurIntensity),
    blurImageIndex: pickNumber(saved.blurImageIndex, defaults.blurImageIndex),
    artworkScale: pickNumber(saved.artworkScale, defaults.artworkScale),
    effects: isRecord(saved.effects)
      ? {
          ...defaults.effects,
          ...saved.effects,
          brightness: pickNumber(saved.effects.brightness, defaults.effects.brightness),
          contrast: pickNumber(saved.effects.contrast, defaults.effects.contrast),
          saturation: pickNumber(saved.effects.saturation, defaults.effects.saturation),
          grayscale: pickBoolean(saved.effects.grayscale, defaults.effects.grayscale),
          sepia: pickBoolean(saved.effects.sepia, defaults.effects.sepia),
          invert: pickBoolean(saved.effects.invert, defaults.effects.invert),
          blur: pickNumber(saved.effects.blur, defaults.effects.blur),
          vignette: pickBoolean(saved.effects.vignette, defaults.effects.vignette),
          vignetteIntensity: pickNumber(saved.effects.vignetteIntensity, defaults.effects.vignetteIntensity),
          noise: pickBoolean(saved.effects.noise, defaults.effects.noise),
          noiseIntensity: pickNumber(saved.effects.noiseIntensity, defaults.effects.noiseIntensity),
        }
      : defaults.effects,
    template,
    templateSettings: pickRecord(saved.templateSettings),
  };
}

export function createStorage(storage?: StorageLike): {
  read: <T>(key: string, fallback: T) => T;
  write: (key: string, value: unknown) => boolean;
  remove: (key: string) => void;
} {
  const impl: StorageLike | null =
    storage ??
    (typeof window !== "undefined" && window.localStorage
      ? window.localStorage
      : null);

  return {
    read<T>(key: string, fallback: T): T {
      if (!impl) return fallback;
      try {
        const raw = impl.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    write(key: string, value: unknown): boolean {
      if (!impl) return false;
      try {
        impl.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key: string): void {
      if (!impl) return;
      try {
        impl.removeItem(key);
      } catch {
        // Ignore.
      }
    },
  };
}

export function loadSettings(storage?: StorageLike): WallpaperSettings {
  const store = createStorage(storage);
  const saved = store.read<unknown>(STORAGE_KEYS.settings, null);
  return mergeSettings(saved);
}

export function saveSettings(settings: WallpaperSettings, storage?: StorageLike): boolean {
  const store = createStorage(storage);
  return store.write(STORAGE_KEYS.settings, settings);
}

export function clearSettings(storage?: StorageLike): void {
  const store = createStorage(storage);
  store.remove(STORAGE_KEYS.settings);
}
