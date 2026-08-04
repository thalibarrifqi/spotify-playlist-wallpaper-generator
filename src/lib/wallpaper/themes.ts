export interface WallpaperTheme {
  label: string;
  backgroundColor: string;
  titleBarColor: string;
  titleTextColor: string;
  gradient?: {
    type: "linear" | "radial";
    angle: number;
    colors: string[];
  };
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
  neon: {
    label: "Neon",
    backgroundColor: "#0a0a2e",
    titleBarColor: "rgba(139, 92, 246, 0.7)",
    titleTextColor: "#ffffff",
    gradient: {
      type: "linear",
      angle: 135,
      colors: ["#0a0a2e", "#1e1b4b", "#312e81"],
    },
  },
  pastel: {
    label: "Pastel",
    backgroundColor: "#fef3c7",
    titleBarColor: "rgba(251, 191, 36, 0.6)",
    titleTextColor: "#78350f",
  },
  minimal: {
    label: "Minimal",
    backgroundColor: "#f5f5f4",
    titleBarColor: "rgba(0, 0, 0, 0.05)",
    titleTextColor: "#1c1917",
  },
  midnight: {
    label: "Midnight",
    backgroundColor: "#1e1b4b",
    titleBarColor: "rgba(99, 102, 241, 0.6)",
    titleTextColor: "#ffffff",
    gradient: {
      type: "linear",
      angle: 180,
      colors: ["#1e1b4b", "#312e81", "#4338ca"],
    },
  },
};

export type ThemeKey = keyof typeof THEMES;
