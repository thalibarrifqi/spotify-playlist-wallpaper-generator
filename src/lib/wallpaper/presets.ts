import { DEFAULT_EFFECTS } from "./effects";
import type { WallpaperEffects } from "./types";

export interface EffectsPreset {
  id: string;
  label: string;
  effects: WallpaperEffects;
}

export const EFFECT_PRESETS: EffectsPreset[] = [
  {
    id: "none",
    label: "None",
    effects: DEFAULT_EFFECTS,
  },
  {
    id: "vibrant",
    label: "Vibrant",
    effects: {
      ...DEFAULT_EFFECTS,
      saturation: 25,
      contrast: 15,
    },
  },
  {
    id: "muted",
    label: "Muted",
    effects: {
      ...DEFAULT_EFFECTS,
      saturation: -35,
    },
  },
  {
    id: "vintage",
    label: "Vintage",
    effects: {
      ...DEFAULT_EFFECTS,
      sepia: true,
      contrast: -10,
      saturation: -10,
      vignette: true,
      vignetteIntensity: 45,
    },
  },
  {
    id: "bw",
    label: "B&W",
    effects: {
      ...DEFAULT_EFFECTS,
      grayscale: true,
      contrast: 25,
    },
  },
  {
    id: "neon",
    label: "Neon",
    effects: {
      ...DEFAULT_EFFECTS,
      brightness: 15,
      saturation: 50,
    },
  },
];

export function getEffectsPreset(id: string): WallpaperEffects | undefined {
  return EFFECT_PRESETS.find((preset) => preset.id === id)?.effects;
}
