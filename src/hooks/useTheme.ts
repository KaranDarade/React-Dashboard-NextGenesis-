"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "ng_theme";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function resolveTheme(raw: string | null): Theme {
  return raw === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

function readStored(): string | null {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme(resolveTheme(readStored()));
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  listeners.add(callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    listeners.delete(callback);
  };
}

function getSnapshot(): string | null {
  return readStored();
}

function getServerSnapshot(): string | null {
  return null;
}

/**
 * Reads the persisted theme (set before paint by an inline script) and lets the
 * user toggle it. Stored via useSyncExternalStore so there is no hydration
 * mismatch.
 */
export function useTheme() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const theme = resolveTheme(raw);

  const setTheme = useCallback((next: Theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyTheme(next);
    emit();
  }, []);

  const toggle = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [theme, setTheme],
  );

  return { theme, setTheme, toggle };
}
