export interface WallpaperTheme {
  label: string;
  backgroundColor: string;
  titleBarColor: string;
  titleTextColor: string;
}

export const THEMES: Record<string, WallpaperTheme> = {
  dark: {
    label: "Dark",
    backgroundColor: "#000000",
    titleBarColor: "rgba(0, 0, 0, 0.6)",
    titleTextColor: "#ffffff",
  },
  light: {
    label: "Light",
    backgroundColor: "#ffffff",
    titleBarColor: "rgba(255, 255, 255, 0.6)",
    titleTextColor: "#18181b",
  },
};

export type ThemeKey = keyof typeof THEMES;
