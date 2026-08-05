import { describe, it, expect } from "vitest";
import {
  DEFAULT_TEXT_STYLE,
  FONT_SIZE_PRESETS,
  buildCanvasFont,
  computeTitleLayout,
  scaleForCanvas,
  withAlpha,
} from "../src/lib/wallpaper/text-layout";
import { getFont } from "../src/lib/wallpaper/fonts";
import type { TextPosition } from "../src/lib/wallpaper/types";

const POSITIONS: TextPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

describe("scaleForCanvas", () => {
  it("scales a base value proportionally to canvas width", () => {
    expect(scaleForCanvas(34, 1080)).toBeCloseTo(34);
    expect(scaleForCanvas(34, 1920)).toBeCloseTo(34 * (1920 / 1080));
    expect(scaleForCanvas(34, 540)).toBeCloseTo(17);
  });
});

describe("withAlpha", () => {
  it("converts 6-digit hex colors to rgba", () => {
    expect(withAlpha("#000000", 0.6)).toBe("rgba(0, 0, 0, 0.600)");
    expect(withAlpha("#1db954", 1)).toBe("rgba(29, 185, 84, 1.000)");
  });

  it("converts 3-digit hex colors to rgba", () => {
    expect(withAlpha("#fff", 0.5)).toBe("rgba(255, 255, 255, 0.500)");
  });

  it("overrides the alpha of rgba colors", () => {
    expect(withAlpha("rgba(0, 0, 0, 0.6)", 0.25)).toBe("rgba(0, 0, 0, 0.250)");
  });

  it("returns unrecognized colors unchanged", () => {
    expect(withAlpha("rebeccapurple", 0.5)).toBe("rebeccapurple");
  });

  it("clamps alpha to the 0..1 range", () => {
    expect(withAlpha("#000000", 2)).toContain("1.000");
    expect(withAlpha("#000000", -1)).toContain("0.000");
  });
});

describe("buildCanvasFont", () => {
  it("quotes google font family names", () => {
    const font = getFont("playfair")!;
    expect(buildCanvasFont(700, 34, font)).toBe('700 34px "Playfair Display"');
  });

  it("embeds system font stacks without quotes", () => {
    const font = getFont("system")!;
    expect(buildCanvasFont(400, 20, font)).toBe(
      "400 20px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    );
  });
});

describe("computeTitleLayout", () => {
  const width = 1080;
  const height = 1920;
  const fontSize = 34;
  const padding = 24;
  const textWidth = 400;

  it("keeps every position within the canvas", () => {
    for (const position of POSITIONS) {
      for (const showBackground of [true, false]) {
        const layout = computeTitleLayout(
          position,
          width,
          height,
          textWidth,
          fontSize,
          padding,
          showBackground
        );
        if (showBackground) {
          expect(layout.stripX).toBeGreaterThanOrEqual(0);
          expect(layout.stripY).toBeGreaterThanOrEqual(0);
          expect(layout.stripX + layout.stripWidth).toBeLessThanOrEqual(width);
          expect(layout.stripY + layout.stripHeight).toBeLessThanOrEqual(height);
        }
        expect(layout.textX).toBeGreaterThanOrEqual(0);
        expect(layout.textX).toBeLessThanOrEqual(width);
        expect(layout.textY).toBeGreaterThanOrEqual(0);
        expect(layout.textY).toBeLessThanOrEqual(height);
      }
    }
  });

  it("anchors top positions near the top edge", () => {
    const layout = computeTitleLayout(
      "top-left",
      width,
      height,
      textWidth,
      fontSize,
      padding,
      true
    );
    expect(layout.stripX).toBeCloseTo(padding);
    expect(layout.stripY).toBeCloseTo(padding);
    expect(layout.baseline).toBe("middle");
    expect(layout.textY).toBeCloseTo(padding + layout.stripHeight / 2);
  });

  it("anchors bottom positions near the bottom edge", () => {
    const layout = computeTitleLayout(
      "bottom-right",
      width,
      height,
      textWidth,
      fontSize,
      padding,
      true
    );
    expect(layout.stripX).toBeCloseTo(width - padding - layout.stripWidth);
    expect(layout.stripY).toBeCloseTo(height - padding - layout.stripHeight);
  });

  it("centers horizontally for center positions", () => {
    const layout = computeTitleLayout(
      "bottom-center",
      width,
      height,
      textWidth,
      fontSize,
      padding,
      true
    );
    expect(layout.textX).toBeCloseTo(width / 2);
    expect(layout.align).toBe("center");
  });

  it("sizes the strip from the measured text width", () => {
    const layout = computeTitleLayout(
      "bottom-center",
      width,
      height,
      textWidth,
      fontSize,
      padding,
      true
    );
    const expectedPad = fontSize * 0.45;
    expect(layout.stripWidth).toBeCloseTo(textWidth + expectedPad * 2);
    expect(layout.stripHeight).toBeCloseTo(fontSize * 1.4);
  });

  it("clamps the strip so long titles stay inside the canvas", () => {
    const hugeText = 5000;
    const layout = computeTitleLayout(
      "bottom-center",
      width,
      height,
      hugeText,
      fontSize,
      padding,
      true
    );
    expect(layout.stripWidth).toBeLessThanOrEqual(width - padding * 2 + 0.01);
    expect(layout.stripX).toBeGreaterThanOrEqual(0);
    expect(layout.stripX + layout.stripWidth).toBeLessThanOrEqual(width);
  });

  it("omits the strip when background is disabled", () => {
    const layout = computeTitleLayout(
      "bottom-center",
      width,
      height,
      textWidth,
      fontSize,
      padding,
      false
    );
    expect(layout.stripWidth).toBe(0);
    expect(layout.baseline).toBe("alphabetic");
    expect(layout.textY).toBeCloseTo(height - padding);
  });

  it("uses top baseline for un-backgrounded top text", () => {
    const layout = computeTitleLayout(
      "top-left",
      width,
      height,
      textWidth,
      fontSize,
      padding,
      false
    );
    expect(layout.baseline).toBe("top");
    expect(layout.textX).toBeCloseTo(padding);
    expect(layout.textY).toBeCloseTo(padding);
    expect(layout.align).toBe("left");
  });
});

describe("DEFAULT_TEXT_STYLE", () => {
  it("is a complete, valid text style", () => {
    expect(DEFAULT_TEXT_STYLE.fontFamilyId).toBeTruthy();
    expect(DEFAULT_TEXT_STYLE.fontSize).toBeGreaterThan(0);
    expect(DEFAULT_TEXT_STYLE.strokeWidth).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_TEXT_STYLE.backgroundOpacity).toBeGreaterThanOrEqual(0);
    expect(DEFAULT_TEXT_STYLE.backgroundOpacity).toBeLessThanOrEqual(100);
    expect(POSITIONS).toContain(DEFAULT_TEXT_STYLE.position);
  });

  it("defines small, medium, large, extra-large size presets", () => {
    const labels = FONT_SIZE_PRESETS.map((p) => p.label);
    expect(labels).toEqual(["Small", "Medium", "Large", "Extra Large"]);
    for (const preset of FONT_SIZE_PRESETS) {
      expect(preset.value).toBeGreaterThan(0);
    }
  });
});
