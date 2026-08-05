"use client";

import { useCallback, useEffect, useState } from "react";
import { createStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/storage";
import {
  addHistoryEntry,
  clearHistory,
  downloadHistoryJson,
  removeHistoryEntry,
} from "@/lib/history";
import type { HistoryEntry } from "@/lib/history";

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const storage = createStorage();
    const saved = storage.read<unknown>(STORAGE_KEYS.history, []);
    return Array.isArray(saved) ? (saved as HistoryEntry[]) : [];
  });

  useEffect(() => {
    const storage = createStorage();
    storage.write(STORAGE_KEYS.history, history);
  }, [history]);

  const add = useCallback((entry: Omit<HistoryEntry, "id" | "createdAt">) => {
    setHistory((prev) => addHistoryEntry(prev, entry));
  }, []);

  const remove = useCallback((id: string) => {
    setHistory((prev) => removeHistoryEntry(prev, id));
  }, []);

  const clear = useCallback(() => {
    setHistory(clearHistory());
  }, []);

  const exportJson = useCallback(() => {
    downloadHistoryJson(history);
  }, [history]);

  return { history, add, remove, clear, exportJson };
}
