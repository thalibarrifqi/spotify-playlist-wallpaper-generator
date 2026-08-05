import type { TemplateId } from "../types";
import type { TemplateSettings, WallpaperTemplate } from "./types";
import { gridTemplate } from "./grid";
import { collageTemplate } from "./collage";
import { mosaicTemplate } from "./mosaic";
import { diagonalTemplate } from "./diagonal";
import { borderTemplate } from "./border";
import { filmstripTemplate } from "./filmstrip";

export type { TemplateSettings, TemplateSettingDef, WallpaperTemplate } from "./types";

export const TEMPLATES: Record<TemplateId, WallpaperTemplate> = {
  grid: gridTemplate,
  collage: collageTemplate,
  mosaic: mosaicTemplate,
  diagonal: diagonalTemplate,
  border: borderTemplate,
  filmstrip: filmstripTemplate,
};

export const TEMPLATE_LIST: WallpaperTemplate[] = [
  gridTemplate,
  collageTemplate,
  mosaicTemplate,
  diagonalTemplate,
  borderTemplate,
  filmstripTemplate,
];

export function getTemplate(id: TemplateId): WallpaperTemplate {
  return TEMPLATES[id];
}

export function isTemplateId(value: string): value is TemplateId {
  return Object.prototype.hasOwnProperty.call(TEMPLATES, value);
}

export function defaultTemplateSettings(id: TemplateId): TemplateSettings {
  const template = TEMPLATES[id];
  const settings: TemplateSettings = {};
  for (const def of template.settings) {
    settings[def.key] = def.defaultValue;
  }
  return settings;
}
