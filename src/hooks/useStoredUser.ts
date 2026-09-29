"use client";

import { useSyncExternalStore } from "react";
import { buildDisplayUser } from "@/lib/credentials";
import { USER_STORAGE_KEY } from "@/lib/constants";
import type { AuthUser } from "@/types/product";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(USER_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

/**
 * Reads the logged-in user from localStorage without a hydration mismatch, and
 * normalises the identity to the app's admin (so a stale demo session can never
 * display the DummyJSON demo name).
 */
export function useStoredUser(): AuthUser | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!raw) return null;
  try {
    return buildDisplayUser(JSON.parse(raw) as AuthUser);
  } catch {
    return null;
  }
}
