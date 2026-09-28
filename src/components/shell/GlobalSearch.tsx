"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "@/components/shell/icons";
import { cn } from "@/lib/format";
import { useDashboardActivity } from "@/store/DashboardDataContext";

export function GlobalSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { log } = useDashboardActivity();
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;
    log({ action: "Searched catalogue", detail: `"${query}"` });
    router.push(`/products?q=${encodeURIComponent(query)}`);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn("relative hidden sm:block", className)}
    >
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search catalogue..."
        aria-label="Search catalogue"
        className="w-44 rounded-xl border border-white/60 bg-white/55 py-2 pl-9 pr-3 text-sm text-ink-900 shadow-sm outline-none backdrop-blur transition-all duration-200 placeholder:text-ink-500/70 focus:w-64 focus:border-indigo-300 focus:bg-white/75 focus:ring-2 focus:ring-indigo-200 lg:w-56"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/70 bg-white/70 px-1.5 py-0.5 text-[10px] font-medium text-ink-500 lg:block">
        Ctrl K
      </kbd>
    </form>
  );
}
