import { describe, it, expect } from "vitest";
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  clearSettings,
  createStorage,
  loadSettings,
  mergeSettings,
  saveSettings,
} from "../src/lib/storage";
import type { StorageLike } from "../src/lib/storage";

function mockStorage(): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
}

describe("mergeSettings", () => {
  it("keeps valid saved values", () => {
    const merged = mergeSettings({
      theme: "light",
      resolution: "desktop",
      spacing: 24,
      borderRadius: 12,
      useGradient: true,
      template: "collage",
      templateSettings: { columns: 3 },
    });
    expect(merged.theme).toBe("light");
    expect(merged.resolution).toBe("desktop");
    expect(merged.spacing).toBe(24);
    expect(merged.borderRadius).toBe(12);
    expect(merged.useGradient).toBe(true);
    expect(merged.template).toBe("collage");
    expect(merged.templateSettings).toEqual({ columns: 3 });
  });

  it("drops unknown keys and bad types", () => {
    const merged = mergeSettings({
      spacing: "not-a-number",
      useGradient: "yes",
      unknownKey: 42,
      resolution: "tablet",
      template: 123,
      templateSettings: { columns: "three", rows: 2 },
    } as unknown);
    expect(merged.spacing).toBe(DEFAULT_SETTINGS.spacing);
    expect(merged.useGradient).toBe(false);
    expect("unknownKey" in merged).toBe(false);
    expect(merged.resolution).toBe("mobile");
    expect(merged.template).toBe(DEFAULT_SETTINGS.template);
    expect(merged.templateSettings).toEqual({ rows: 2 });
  });

  it("returns defaults for non-record input", () => {
    expect(mergeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(mergeSettings("nope")).toEqual(DEFAULT_SETTINGS);
    expect(mergeSettings([])).toEqual(DEFAULT_SETTINGS);
    expect(mergeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
  });

  it("normalizes gradient values", () => {
    const merged = mergeSettings({
      gradient: {
        type: "radial",
        angle: 90,
        colors: ["#000000", "#ffffff", 42],
      },
    });
    expect(merged.gradient.type).toBe("radial");
    expect(merged.gradient.angle).toBe(90);
    expect(merged.gradient.colors).toEqual(["#000000", "#ffffff"]);
  });

  it("falls back to default gradient for bad shape", () => {
    const merged = mergeSettings({ gradient: { type: "striped" } });
    expect(merged.gradient).toEqual(DEFAULT_SETTINGS.gradient);
  });

  it("clamps textStyle fontWeight to whitelist", () => {
    const merged = mergeSettings({
      textStyle: { fontWeight: 900, fontSize: 64 },
    });
    expect(merged.textStyle.fontWeight).toBe(DEFAULT_SETTINGS.textStyle.fontWeight);
    expect(merged.textStyle.fontSize).toBe(64);
  });

  it("merges effects and ignores bad effect types", () => {
    const merged = mergeSettings({
      effects: {
        brightness: 110,
        contrast: "high",
        noise: true,
        noiseIntensity: 35,
        grayscale: false,
      },
    });
    expect(merged.effects.brightness).toBe(110);
    expect(merged.effects.contrast).toBe(DEFAULT_SETTINGS.effects.contrast);
    expect(merged.effects.noise).toBe(true);
    expect(merged.effects.noiseIntensity).toBe(35);
    expect(merged.effects.grayscale).toBe(false);
  });
});

describe("createStorage", () => {
  it("reads, writes, and removes via the storage impl", () => {
    const store = mockStorage();
    const s = createStorage(store);
    expect(s.read("key", "fallback")).toBe("fallback");
    expect(s.write("key", { a: 1 })).toBe(true);
    expect(s.read("key", null)).toEqual({ a: 1 });
    s.remove("key");
    expect(s.read("key", null)).toBe(null);
  });

  it("returns fallback on corrupted JSON", () => {
    const store = mockStorage();
    store.setItem("bad", "{not json");
    const s = createStorage(store);
    expect(s.read("bad", "fallback")).toBe("fallback");
  });

  it("returns fallback when getItem throws", () => {
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => undefined,
      removeItem: () => undefined,
    };
    const s = createStorage(throwing);
    expect(s.read("key", "fallback")).toBe("fallback");
  });

  it("returns false when setItem throws", () => {
    const throwing: StorageLike = {
      getItem: () => null,
      setItem: () => {
        throw new Error("full");
      },
      removeItem: () => undefined,
    };
    const s = createStorage(throwing);
    expect(s.write("key", "value")).toBe(false);
  });
});

describe("loadSettings / saveSettings / clearSettings", () => {
  it("round-trips saved settings", () => {
    const store = mockStorage();
    const settings = {
      ...DEFAULT_SETTINGS,
      theme: "light" as const,
      template: "filmstrip" as const,
      templateSettings: { stripCount: 4 },
    };
    expect(saveSettings(settings, store)).toBe(true);
    expect(loadSettings(store)).toEqual(settings);
    clearSettings(store);
    expect(loadSettings(store)).toEqual(DEFAULT_SETTINGS);
  });

  it("loads defaults when nothing is stored", () => {
    expect(loadSettings(mockStorage())).toEqual(DEFAULT_SETTINGS);
  });

  it("uses the documented storage keys", () => {
    expect(STORAGE_KEYS.settings).toBe("spotify-wallpaper-settings");
    expect(STORAGE_KEYS.history).toBe("spotify-wallpaper-history");
    expect(STORAGE_KEYS.settingsVersion).toBe("spotify-wallpaper-settings-version");
  });
});
