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
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search products, categories..."
        aria-label="Search products"
        className="focus-brand w-48 rounded-xl border border-line bg-white/[0.04] py-2 pl-9 pr-14 text-sm text-fg outline-none transition placeholder:text-fg-4 hover:border-line-strong focus:border-brand/50 focus:bg-white/[0.06] lg:w-64"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-line bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-fg-3 lg:block">
        ⌘ K
      </kbd>
    </form>
  );
}
