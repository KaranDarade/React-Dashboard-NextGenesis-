"use client";

import {
  GridIcon,
  RowsIcon,
  SearchIcon,
} from "@/components/shell/icons";
import { PAGE_SIZE_OPTIONS, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/format";
import { groupCategories } from "@/lib/taxonomy";
import type { Category } from "@/types/product";

export type ProductView = "table" | "grid";

const selectClass =
  "focus-brand h-10 rounded-lg border border-line bg-white/[0.04] px-2.5 text-xs text-fg outline-none transition hover:border-line-strong focus:border-brand/50";

export function ProductToolbar({
  search,
  onSearch,
  searchLoading,
  categories,
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  category,
  onCategory,
  sort,
  onSort,
  limit,
  onLimit,
  view,
  onViewChange,
}: {
  search: string;
  onSearch: (value: string) => void;
  searchLoading: boolean;
  categories: Category[];
  categoriesLoading: boolean;
  categoriesError: string | null;
  onRetryCategories: () => void;
  category: string;
  onCategory: (value: string) => void;
  sort: string;
  onSort: (value: string) => void;
  limit: number;
  onLimit: (value: number) => void;
  view: ProductView;
  onViewChange: (view: ProductView) => void;
}) {
  const groups = groupCategories(categories);

  const viewButton =
    "focus-brand grid h-8 w-8 place-items-center rounded-md transition";

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center">
      <div className="relative flex-1 lg:max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-3" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className="focus-brand h-10 w-full rounded-lg border border-line bg-white/[0.04] pl-9 pr-9 text-sm text-fg outline-none transition placeholder:text-fg-4 hover:border-line-strong focus:border-brand/50"
        />
        {searchLoading ? (
          <span className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-line-strong border-t-brand" />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
        <select
          value={category}
          onChange={(event) => onCategory(event.target.value)}
          disabled={categoriesLoading || Boolean(categoriesError)}
          aria-label="Filter by category"
          className={selectClass}
        >
          <option value="">All Categories</option>
          {groups.map((group) => (
            <optgroup key={group.name} label={group.name} className="bg-canvas-soft">
              {group.items.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {categoriesError ? (
          <button
            type="button"
            onClick={onRetryCategories}
            className="text-[11px] font-medium text-danger underline"
          >
            Retry categories
          </button>
        ) : null}

        <select
          value={sort}
          onChange={(event) => onSort(event.target.value)}
          aria-label="Sort products"
          className={selectClass}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-canvas-soft">
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={limit}
          onChange={(event) => onLimit(Number(event.target.value))}
          aria-label="Products per page"
          className={selectClass}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size} className="bg-canvas-soft">
              {size} / page
            </option>
          ))}
        </select>

        <div className="flex items-center gap-0.5 rounded-lg border border-line p-0.5">
          <button
            type="button"
            onClick={() => onViewChange("table")}
            aria-label="Table view"
            aria-pressed={view === "table"}
            className={cn(
              viewButton,
              view === "table"
                ? "bg-brand/12 text-brand"
                : "text-fg-3 hover:text-fg",
            )}
          >
            <RowsIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={cn(
              viewButton,
              view === "grid"
                ? "bg-brand/12 text-brand"
                : "text-fg-3 hover:text-fg",
            )}
          >
            <GridIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
