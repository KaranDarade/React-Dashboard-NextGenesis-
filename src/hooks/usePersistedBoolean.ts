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

/**
 * Boolean state persisted in localStorage, read safely through
 * useSyncExternalStore so it never causes a hydration mismatch and avoids
 * setting state inside an effect.
 */
export function usePersistedBoolean(
  key: string,
  fallback = false,
): readonly [boolean, (next: boolean) => void] {
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = raw === null ? fallback : raw === "1";

  const setValue = useCallback(
    (next: boolean) => {
      try {
        window.localStorage.setItem(key, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      emit();
    },
    [key],
  );

  return [value, setValue] as const;
}
