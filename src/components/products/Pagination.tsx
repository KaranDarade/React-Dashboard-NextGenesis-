"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@/components/shell/icons";
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
    "focus-brand min-w-9 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-35";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <p className="text-xs text-fg-3" aria-live="polite">
          {rangeText({ skip: (page - 1) * limit, count, total })}
        </p>
        <label className="flex items-center gap-2 text-xs text-fg-3">
          <span className="hidden sm:inline">Per page</span>
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            aria-label="Products per page"
            className="focus-brand rounded-lg border border-line bg-surface-2 px-2 py-1.5 text-xs text-fg outline-none transition hover:border-line-strong focus:border-brand/50"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size} className="bg-canvas-soft">
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
          aria-label="Previous page"
          className={cn(
            buttonClass,
            "border-line text-fg-2 hover:bg-surface-2 hover:text-fg",
          )}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>

        {pages.map((entry, index) =>
          entry === "gap" ? (
            <span key={`gap-${index}`} className="px-1.5 text-fg-4" aria-hidden>
              …
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
                  ? "border-brand/30 bg-brand/12 text-brand"
                  : "border-line text-fg-2 hover:bg-surface-2 hover:text-fg",
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
          aria-label="Next page"
          className={cn(
            buttonClass,
            "border-line text-fg-2 hover:bg-surface-2 hover:text-fg",
          )}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
