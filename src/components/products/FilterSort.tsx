"use client";

import { SORT_OPTIONS } from "@/lib/constants";
import type { Category } from "@/types/product";

export function FilterSort({
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  loading = false,
  error,
  onRetry,
}: {
  categories: Category[];
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const selectClass =
    "w-full rounded-xl border border-white/60 bg-white/55 px-3 py-2.5 text-sm text-ink-900 shadow-sm outline-none backdrop-blur transition focus:border-indigo-300 focus:bg-white/80 focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
          Category
        </span>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          disabled={loading || Boolean(error)}
          className={selectClass}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        {error ? (
          <span className="flex items-center gap-2 text-xs text-rose-600">
            {error}
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="font-medium underline"
              >
                Retry
              </button>
            ) : null}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-500">
          Sort by
        </span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className={selectClass}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
