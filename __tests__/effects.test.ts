import { describe, it, expect } from "vitest";
import {
  DEFAULT_EFFECTS,
  buildFilterString,
  clamp,
  effectsEqual,
  isDefaultEffects,
  noiseDensity,
  scaleEffects,
  vignetteAlpha,
} from "../src/lib/wallpaper/effects";
import type { WallpaperEffects } from "../src/lib/wallpaper/types";

describe("buildFilterString", () => {
  it("builds an identity filter for default effects", () => {
    expect(buildFilterString(DEFAULT_EFFECTS)).toBe(
      "brightness(1) contrast(1) saturate(1)"
    );
  });

  it("maps brightness, contrast, and saturation ranges", () => {
    const effects: WallpaperEffects = {
      ...DEFAULT_EFFECTS,
      brightness: 50,
      contrast: 100,
      saturation: -100,
    };
    const filter = buildFilterString(effects);
    expect(filter).toContain("brightness(1.5)");
    expect(filter).toContain("contrast(2)");
    expect(filter).toContain("saturate(0)");
  });

  it("maps -100 to the minimum of each adjustment", () => {
    const effects: WallpaperEffects = {
      ...DEFAULT_EFFECTS,
      brightness: -100,
      contrast: -100,
      saturation: -100,
    };
    const filter = buildFilterString(effects);
    expect(filter).toContain("brightness(0)");
    expect(filter).toContain("contrast(0)");
    expect(filter).toContain("saturate(0)");
  });

  it("appends toggle filters in a consistent order", () => {
    const effects: WallpaperEffects = {
      ...DEFAULT_EFFECTS,
      grayscale: true,
      sepia: true,
      invert: true,
    };
    const filter = buildFilterString(effects);
    expect(filter).toBe(
      "brightness(1) contrast(1) saturate(1) grayscale(1) sepia(1) invert(1)"
    );
  });

  it("includes blur only when non-zero", () => {
    expect(buildFilterString(DEFAULT_EFFECTS)).not.toContain("blur");
    const blurred: WallpaperEffects = { ...DEFAULT_EFFECTS, blur: 5 };
    expect(buildFilterString(blurred)).toContain("blur(5px)");
  });
});

describe("isDefaultEffects", () => {
  it("returns true for the default effects object", () => {
    expect(isDefaultEffects(DEFAULT_EFFECTS)).toBe(true);
  });

  it("returns false when any effect is customized", () => {
    expect(
      isDefaultEffects({ ...DEFAULT_EFFECTS, brightness: 10 })
    ).toBe(false);
    expect(isDefaultEffects({ ...DEFAULT_EFFECTS, vignette: true })).toBe(
      false
    );
    expect(isDefaultEffects({ ...DEFAULT_EFFECTS, blur: 2 })).toBe(false);
  });
});

describe("effectsEqual", () => {
  it("treats identical effects as equal", () => {
    expect(effectsEqual(DEFAULT_EFFECTS, { ...DEFAULT_EFFECTS })).toBe(true);
  });

  it("detects differences in any field", () => {
    expect(
      effectsEqual(DEFAULT_EFFECTS, { ...DEFAULT_EFFECTS, saturation: 20 })
    ).toBe(false);
    expect(
      effectsEqual(DEFAULT_EFFECTS, {
        ...DEFAULT_EFFECTS,
        vignetteIntensity: 80,
      })
    ).toBe(false);
  });
});

describe("scaleEffects", () => {
  it("scales blur in pixels for high-DPI export", () => {
    const scaled = scaleEffects({ ...DEFAULT_EFFECTS, blur: 5 }, 3);
    expect(scaled.blur).toBe(15);
  });

  it("leaves percentage-based values unchanged", () => {
    const scaled = scaleEffects(
      { ...DEFAULT_EFFECTS, brightness: 20, saturation: -30, blur: 4 },
      2
    );
    expect(scaled.brightness).toBe(20);
    expect(scaled.saturation).toBe(-30);
    expect(scaled.blur).toBe(8);
  });
});

describe("vignetteAlpha", () => {
  it("scales with intensity", () => {
    expect(vignetteAlpha(0)).toBe(0);
    expect(vignetteAlpha(50)).toBeCloseTo(0.425);
    expect(vignetteAlpha(100)).toBeCloseTo(0.85);
  });

  it("clamps out-of-range intensity", () => {
    expect(vignetteAlpha(-50)).toBe(0);
    expect(vignetteAlpha(200)).toBeCloseTo(0.85);
  });
});

describe("noiseDensity", () => {
  it("scales grain probability with intensity", () => {
    expect(noiseDensity(0)).toBe(0);
    expect(noiseDensity(50)).toBeCloseTo(0.25);
    expect(noiseDensity(100)).toBeCloseTo(0.5);
  });
});

describe("clamp", () => {
  it("bounds values to a range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
