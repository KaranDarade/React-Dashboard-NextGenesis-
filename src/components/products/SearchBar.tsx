"use client";

import { SearchIcon } from "@/components/shell/icons";

export function SearchBar({
  value,
  onChange,
  loading = false,
}: {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
}) {
  return (
    <div className="relative w-full">
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products by title or brand..."
        aria-label="Search products"
        className="w-full rounded-xl border border-white/60 bg-white/55 py-2.5 pl-10 pr-24 text-sm text-ink-900 shadow-sm outline-none backdrop-blur transition placeholder:text-ink-500/70 focus:border-indigo-300 focus:bg-white/80 focus:ring-2 focus:ring-indigo-200"
      />
      {loading ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-500">
          searching...
        </span>
      ) : null}
    </div>
  );
}
