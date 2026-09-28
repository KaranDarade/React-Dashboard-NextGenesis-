import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  SORT_FIELDS,
} from "@/lib/constants";
import type { SortField, SortOrder } from "@/types/product";

interface ParamReader {
  get(key: string): string | null;
}

export interface ListQuery {
  q: string;
  category: string;
  sortBy: SortField | "";
  order: SortOrder;
  page: number;
  limit: number;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

export function parsePageSize(value: string | null): number {
  const parsed = Number(value);
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed)
    ? parsed
    : DEFAULT_PAGE_SIZE;
}

/**
 * Reads the list query from the URL and applies safe defaults so that bad
 * values (e.g. ?page=abc) can never break the page.
 *
 * DummyJSON cannot search and filter by category at the same time, so when a
 * search term is present we drop the category filter (search wins).
 */
export function parseListQuery(params: ParamReader): ListQuery {
  const q = (params.get("q") ?? "").trim();
  const rawCategory = (params.get("category") ?? "").trim();

  const sortByRaw = params.get("sortBy");
  const sortBy = SORT_FIELDS.includes(sortByRaw as SortField)
    ? (sortByRaw as SortField)
    : "";

  return {
    q,
    category: q ? "" : rawCategory,
    sortBy,
    order: params.get("order") === "desc" ? "desc" : "asc",
    page: parsePositiveInt(params.get("page"), 1),
    limit: parsePageSize(params.get("limit")),
  };
}

export function buildListQuery(query: Partial<ListQuery>): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.sortBy) {
    params.set("sortBy", query.sortBy);
    params.set("order", query.order === "desc" ? "desc" : "asc");
  }
  if (query.page && query.page > 1) params.set("page", String(query.page));
  if (query.limit && query.limit !== DEFAULT_PAGE_SIZE) {
    params.set("limit", String(query.limit));
  }
  return params.toString();
}

export function sortValue(sortBy: SortField | "", order: SortOrder): string {
  return sortBy ? `${sortBy}-${order}` : "";
}

export function parseSortValue(value: string): {
  sortBy: SortField | "";
  order: SortOrder;
} {
  if (!value) return { sortBy: "", order: "asc" };
  const [field, order] = value.split("-");
  if (!SORT_FIELDS.includes(field as SortField)) {
    return { sortBy: "", order: "asc" };
  }
  return { sortBy: field as SortField, order: order === "desc" ? "desc" : "asc" };
}
