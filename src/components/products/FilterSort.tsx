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
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-slate-500">Category</span>
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
          <span className="flex items-center gap-2 text-xs text-red-600">
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
        <span className="text-xs font-medium text-slate-500">Sort by</span>
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
