"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function usePersistedNumber(
  key: string,
  fallback: number,
): readonly [number, (next: number) => void] {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parsed = raw === null ? NaN : Number(raw);
  const value = Number.isFinite(parsed) ? parsed : fallback;

  const setValue = useCallback(
    (next: number) => {
      try {
        window.localStorage.setItem(key, String(next));
      } catch {
        /* ignore */
      }
      emit();
    },
    [key],
  );

  return [value, setValue] as const;
}
