"use client";

import { PAGE_SIZE_OPTIONS } from "@/lib/constants";
import { cn, rangeText } from "@/lib/format";

function pageWindow(current: number, total: number): Array<number | "gap"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  const pages: Array<number | "gap"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("gap");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push("gap");
  pages.push(total);
  return pages;
}

export function Pagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const count = Math.min(limit, Math.max(0, total - (page - 1) * limit));
  const pages = pageWindow(page, totalPages);

  const buttonClass =
    "min-w-9 rounded-xl border px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex flex-col gap-4 border-t border-white/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <p className="text-sm text-ink-600" aria-live="polite">
          {rangeText({ skip: (page - 1) * limit, count, total })}
        </p>
        <label className="flex items-center gap-2 text-sm text-ink-600">
          <span className="hidden sm:inline">Per page</span>
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="rounded-xl border border-white/60 bg-white/55 px-2 py-1.5 text-sm text-ink-900 outline-none backdrop-blur transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
            aria-label="Products per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            buttonClass,
            "border-white/60 bg-white/55 text-ink-700 hover:bg-white/80",
          )}
        >
          Previous
        </button>

        {pages.map((entry, index) =>
          entry === "gap" ? (
            <span
              key={`gap-${index}`}
              className="px-2 text-sm text-ink-500"
              aria-hidden
            >
              ...
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              onClick={() => onPageChange(entry)}
              aria-current={entry === page ? "page" : undefined}
              className={cn(
                buttonClass,
                entry === page
                  ? "border-transparent bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_10px_22px_-12px_rgba(79,70,229,0.9)]"
                  : "border-white/60 bg-white/55 text-ink-700 hover:bg-white/80",
              )}
            >
              {entry}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            buttonClass,
            "border-white/60 bg-white/55 text-ink-700 hover:bg-white/80",
          )}
        >
          Next
        </button>
      </nav>
    </div>
  );
}
