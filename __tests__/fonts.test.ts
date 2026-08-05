import { describe, it, expect } from "vitest";
import {
  WALLPAPER_FONTS,
  GOOGLE_FONTS,
  getFont,
  getFontFamily,
  FONT_WEIGHTS,
} from "../src/lib/wallpaper/fonts";

describe("wallpaper fonts", () => {
  it("provides 5+ selectable fonts", () => {
    expect(WALLPAPER_FONTS.length).toBeGreaterThanOrEqual(5);
  });

  it("includes the required Google Fonts", () => {
    const labels = WALLPAPER_FONTS.map((f) => f.label);
    for (const required of [
      "Inter",
      "Roboto",
      "Playfair Display",
      "Montserrat",
      "Poppins",
    ]) {
      expect(labels).toContain(required);
    }
  });

  it("exposes weight selection Regular, Medium, Bold", () => {
    expect(FONT_WEIGHTS).toEqual([400, 500, 700]);
  });

  it("gives every font a unique id, label, and weight list", () => {
    const ids = new Set(WALLPAPER_FONTS.map((f) => f.id));
    expect(ids.size).toBe(WALLPAPER_FONTS.length);

    for (const font of WALLPAPER_FONTS) {
      expect(font.label.length).toBeGreaterThan(0);
      expect(font.weights).toContain(400);
      expect(font.weights).toContain(500);
      expect(font.weights).toContain(700);
    }
  });

  it("assigns a cssVariable to every Google Font", () => {
    expect(GOOGLE_FONTS.length).toBeGreaterThanOrEqual(5);
    for (const font of GOOGLE_FONTS) {
      expect(font.cssVariable).toBeTruthy();
    }
  });

  it("resolves fonts by id and falls back safely", () => {
    expect(getFont("inter")?.label).toBe("Inter");
    expect(getFont("nope")).toBeUndefined();
    expect(getFontFamily("nope")).toBe(WALLPAPER_FONTS[0].family);
    expect(getFontFamily("poppins")).toBe("Poppins");
  });
});
