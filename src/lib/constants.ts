import type { SortField } from "@/types/product";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://dummyjson.com";

export const AUTH_COOKIE = "ng_token";
export const USER_STORAGE_KEY = "ng_user";
export const OVERRIDES_STORAGE_KEY = "ng_product_overrides_v1";

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = 10;
export const DEBOUNCE_MS = 500;

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "", label: "Sort: Default" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "price-desc", label: "Price (high to low)" },
  { value: "rating-asc", label: "Rating (low to high)" },
  { value: "rating-desc", label: "Rating (high to low)" },
];

export const SORT_FIELDS: SortField[] = ["title", "price", "rating"];

export const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="#e2e8f0"/><text x="120" y="120" font-family="sans-serif" font-size="16" fill="#64748b" text-anchor="middle" dominant-baseline="middle">No image</text></svg>',
  );
