import type { LayoutCell, TemplateId } from "../types";

export type TemplateSettings = Record<string, number>;

export interface TemplateSettingDef {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

export interface WallpaperTemplate {
  id: TemplateId;
  label: string;
  description: string;
  settings: TemplateSettingDef[];
  computeLayout: (
    count: number,
    width: number,
    height: number,
    settings: TemplateSettings,
    spacing: number
  ) => LayoutCell[];
}
