"use client";

import { useCallback, useEffect, useState } from "react";
import { createStorage } from "@/lib/storage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const storage = createStorage();
    return storage.read<T>(key, initialValue);
  });

  useEffect(() => {
    const storage = createStorage();
    storage.write(key, value);
  }, [key, value]);

  const setStored = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => (typeof next === "function" ? (next as (p: T) => T)(prev) : next));
    },
    []
  );

  return [value, setStored];
}
