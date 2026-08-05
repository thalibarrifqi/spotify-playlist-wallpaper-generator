import { describe, it, expect } from "vitest";
import { EFFECT_PRESETS, getEffectsPreset } from "../src/lib/wallpaper/presets";
import { DEFAULT_EFFECTS } from "../src/lib/wallpaper/effects";

describe("effect presets", () => {
  it("provides 5+ selectable presets", () => {
    expect(EFFECT_PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  it("includes all required presets", () => {
    const ids = EFFECT_PRESETS.map((p) => p.id);
    for (const required of [
      "none",
      "vibrant",
      "muted",
      "vintage",
      "bw",
      "neon",
    ]) {
      expect(ids).toContain(required);
    }
  });

  it("gives every preset a unique id and label", () => {
    const ids = new Set(EFFECT_PRESETS.map((p) => p.id));
    expect(ids.size).toBe(EFFECT_PRESETS.length);
    for (const preset of EFFECT_PRESETS) {
      expect(preset.label.length).toBeGreaterThan(0);
    }
  });

  it("produces valid effects for every preset", () => {
    for (const preset of EFFECT_PRESETS) {
      const { effects } = preset;
      expect(effects.brightness).toBeGreaterThanOrEqual(-100);
      expect(effects.brightness).toBeLessThanOrEqual(100);
      expect(effects.contrast).toBeGreaterThanOrEqual(-100);
      expect(effects.contrast).toBeLessThanOrEqual(100);
      expect(effects.saturation).toBeGreaterThanOrEqual(-100);
      expect(effects.saturation).toBeLessThanOrEqual(100);
      expect(effects.blur).toBeGreaterThanOrEqual(0);
      expect(effects.vignetteIntensity).toBeGreaterThanOrEqual(0);
      expect(effects.vignetteIntensity).toBeLessThanOrEqual(100);
      expect(effects.noiseIntensity).toBeGreaterThanOrEqual(0);
      expect(effects.noiseIntensity).toBeLessThanOrEqual(100);
    }
  });

  it("the None preset is the default effects", () => {
    expect(EFFECT_PRESETS[0].id).toBe("none");
    expect(EFFECT_PRESETS[0].effects).toEqual(DEFAULT_EFFECTS);
  });

  it("Vibrant boosts saturation and contrast", () => {
    const preset = getEffectsPreset("vibrant")!;
    expect(preset.saturation).toBeGreaterThan(0);
    expect(preset.contrast).toBeGreaterThan(0);
  });

  it("Muted reduces saturation", () => {
    const preset = getEffectsPreset("muted")!;
    expect(preset.saturation).toBeLessThan(0);
  });

  it("Vintage applies sepia, vignette, and reduced contrast", () => {
    const preset = getEffectsPreset("vintage")!;
    expect(preset.sepia).toBe(true);
    expect(preset.vignette).toBe(true);
    expect(preset.contrast).toBeLessThan(0);
  });

  it("B&W applies grayscale with high contrast", () => {
    const preset = getEffectsPreset("bw")!;
    expect(preset.grayscale).toBe(true);
    expect(preset.contrast).toBeGreaterThan(0);
  });

  it("Neon boosts brightness and saturation", () => {
    const preset = getEffectsPreset("neon")!;
    expect(preset.brightness).toBeGreaterThan(0);
    expect(preset.saturation).toBeGreaterThan(0);
  });

  it("resolves unknown presets to undefined", () => {
    expect(getEffectsPreset("nope")).toBeUndefined();
  });
});
