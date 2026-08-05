"use client";

import type { TemplateId } from "@/lib/wallpaper/types";
import { TEMPLATES } from "@/lib/wallpaper/templates";

interface ThumbCell {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
}

const THUMBNAILS: Record<TemplateId, ThumbCell[]> = {
  grid: [
    { x: 0, y: 0, w: 0.48, h: 0.48 },
    { x: 0.52, y: 0, w: 0.48, h: 0.48 },
    { x: 0, y: 0.52, w: 0.48, h: 0.48 },
    { x: 0.52, y: 0.52, w: 0.48, h: 0.48 },
  ],
  collage: [
    { x: 0, y: 0, w: 0.58, h: 1 },
    { x: 0.62, y: 0, w: 0.38, h: 0.47 },
    { x: 0.62, y: 0.52, w: 0.38, h: 0.48 },
  ],
  mosaic: [
    { x: 0, y: 0, w: 0.5, h: 0.55 },
    { x: 0.53, y: 0, w: 0.47, h: 0.55 },
    { x: 0, y: 0.58, w: 0.3, h: 0.42 },
    { x: 0.33, y: 0.58, w: 0.34, h: 0.42 },
    { x: 0.7, y: 0.58, w: 0.3, h: 0.42 },
  ],
  diagonal: [
    { x: 0.05, y: 0.06, w: 0.44, h: 0.44, r: -12 },
    { x: 0.51, y: 0.08, w: 0.44, h: 0.44, r: -12 },
    { x: 0.03, y: 0.52, w: 0.44, h: 0.44, r: -12 },
    { x: 0.51, y: 0.5, w: 0.44, h: 0.44, r: -12 },
  ],
  border: [
    { x: 0, y: 0, w: 0.5, h: 0.2 },
    { x: 0.5, y: 0, w: 0.5, h: 0.2 },
    { x: 0, y: 0.8, w: 0.5, h: 0.2 },
    { x: 0.5, y: 0.8, w: 0.5, h: 0.2 },
    { x: 0, y: 0.2, w: 0.2, h: 0.6 },
    { x: 0.8, y: 0.2, w: 0.2, h: 0.6 },
  ],
  filmstrip: [
    { x: 0, y: 0.5, w: 0.24, h: 0.5 },
    { x: 0.25, y: 0.5, w: 0.24, h: 0.5 },
    { x: 0.5, y: 0.5, w: 0.24, h: 0.5 },
    { x: 0.75, y: 0.5, w: 0.24, h: 0.5 },
  ],
};

interface TemplateSelectorProps {
  value: TemplateId;
  onChange: (id: TemplateId) => void;
}

export default function TemplateSelector({
  value,
  onChange,
}: TemplateSelectorProps) {
  const handleSelect = (id: TemplateId) => {
    onChange(id);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => {
          const template = TEMPLATES[id];
          const cells = THUMBNAILS[id];
          const selected = value === id;
          return (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              title={template.description}
              aria-pressed={selected}
              aria-label={`${template.label} template: ${template.description}`}
              className={`p-2 rounded-lg border-2 transition-all duration-150 ${
                selected
                  ? "border-[#1db954] bg-[#1db954]/5"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <div
                className="relative w-full aspect-[4/3] rounded bg-zinc-100 overflow-hidden"
                aria-hidden="true"
              >
                {cells.map((cell, i) => (
                  <div
                    key={i}
                    className="absolute bg-zinc-500 rounded-sm"
                    style={{
                      left: `${cell.x * 100}%`,
                      top: `${cell.y * 100}%`,
                      width: `${cell.w * 100}%`,
                      height: `${cell.h * 100}%`,
                      ...(cell.r
                        ? {
                            transform: `rotate(${cell.r}deg)`,
                            transformOrigin: "center",
                          }
                        : {}),
                    }}
                  />
                ))}
              </div>
              <span className="mt-1.5 block text-xs font-medium text-zinc-700">
                {template.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
