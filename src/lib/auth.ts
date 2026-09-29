import { AUTH_COOKIE, USER_STORAGE_KEY } from "@/lib/constants";
import type { AuthUser } from "@/types/product";

const MAX_AGE_SECONDS = 60 * 60 * 24;

/**
 * The token lives in a JS-readable cookie so that the server-side proxy can
 * gate protected routes. (A production app would prefer an httpOnly cookie set
 * by a server route; this demo keeps it simple and documents the trade-off.)
 */
export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function setSession(token: string, user: AuthUser): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(
    token,
  )}; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
  try {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* storage can be unavailable (private mode) - ignore */
  }
}

export function clearSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; samesite=lax`;
  try {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
