import type { WallpaperSettings } from "./storage";

export const HISTORY_LIMIT = 20;

export interface HistoryEntry {
  id: string;
  playlistName: string;
  url: string;
  thumbnail: string;
  settings: WallpaperSettings;
  createdAt: number;
}

export function createHistoryId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function addHistoryEntry(
  list: HistoryEntry[],
  entry: Omit<HistoryEntry, "id" | "createdAt">,
  limit: number = HISTORY_LIMIT
): HistoryEntry[] {
  const full: HistoryEntry = {
    ...entry,
    id: createHistoryId(),
    createdAt: Date.now(),
  };
  return [full, ...list].slice(0, limit);
}

export function removeHistoryEntry(
  list: HistoryEntry[],
  id: string
): HistoryEntry[] {
  return list.filter((entry) => entry.id !== id);
}

export function clearHistory(): HistoryEntry[] {
  return [];
}

export function exportHistoryJson(list: HistoryEntry[]): string {
  return JSON.stringify(list, null, 2);
}

export function downloadHistoryJson(list: HistoryEntry[], filename = "wallpaper-history.json"): void {
  const blob = new Blob([exportHistoryJson(list)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
