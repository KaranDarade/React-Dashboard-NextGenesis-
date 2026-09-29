"use client";

import { MoonIcon, SunIcon } from "@/components/shell/icons";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="focus-brand grid h-10 w-10 place-items-center rounded-xl border border-line text-fg-2 transition hover:bg-surface-2 hover:text-fg"
    >
      {isDark ? (
        <SunIcon className="h-[18px] w-[18px]" />
      ) : (
        <MoonIcon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
