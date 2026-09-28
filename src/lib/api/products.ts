import { apiClient } from "@/lib/api/client";
import type {
  Category,
  Product,
  ProductInput,
  ProductsResponse,
} from "@/types/product";

const LIST_SELECT = [
  "id",
  "title",
  "description",
  "category",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "brand",
  "thumbnail",
].join(",");

export interface FetchProductsArgs {
  q?: string;
  category?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  limit: number;
  skip: number;
  signal?: AbortSignal;
}

/**
 * DummyJSON exposes three separate list endpoints and none of them can search
 * and filter by category at the same time. Search takes priority.
 */
export async function fetchProducts({
  q,
  category,
  sortBy,
  order,
  limit,
  skip,
  signal,
}: FetchProductsArgs): Promise<ProductsResponse> {
  const params: Record<string, string | number> = {
    limit,
    skip,
    select: LIST_SELECT,
  };

  let endpoint = "/products";
  if (q) {
    endpoint = "/products/search";
    params.q = q;
  } else if (category) {
    endpoint = `/products/category/${encodeURIComponent(category)}`;
  }

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order ?? "asc";
  }

  const { data } = await apiClient.get<ProductsResponse>(endpoint, {
    params,
    signal,
  });
  return data;
}

export async function fetchProductById(
  id: string | number,
  signal?: AbortSignal,
): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`, { signal });
  return data;
}

function normaliseCategory(value: unknown): Category | null {
  if (typeof value === "string") {
    return {
      slug: value,
      name: value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    };
  }
  if (value && typeof value === "object") {
    const record = value as { slug?: string; name?: string };
    if (record.slug && record.name) {
      return { slug: record.slug, name: record.name };
    }
  }
  return null;
}

export async function fetchCategories(
  signal?: AbortSignal,
): Promise<Category[]> {
  const { data } = await apiClient.get<unknown[]>("/products/categories", {
    signal,
  });
  return data
    .map(normaliseCategory)
    .filter((category): category is Category => category !== null);
}

/**
 * DummyJSON simulates these writes. It returns a plausible object but does not
 * persist anything, so the app mirrors the change in a local overrides store.
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  const { data } = await apiClient.post<Product>("/products/add", input);
  return data;
}

export async function updateProduct(
  id: string | number,
  input: Partial<ProductInput>,
): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/products/${id}`, input);
  return data;
}

export async function deleteProduct(id: string | number): Promise<Product> {
  const { data } = await apiClient.delete<Product>(`/products/${id}`);
  return data;
}

/** Fields needed to compute every dashboard aggregation in one request. */
export const CATALOG_SELECT = [
  "id",
  "title",
  "category",
  "price",
  "discountPercentage",
  "rating",
  "stock",
  "brand",
  "availabilityStatus",
  "thumbnail",
].join(",");

export interface CatalogSnapshot {
  products: Product[];
  categories: Category[];
}

/**
 * One bulk request for all products (limit=0) plus the category list. Used by
 * the dashboard to derive real aggregate metrics without per-card requests.
 */
export async function fetchCatalogSnapshot(
  signal?: AbortSignal,
): Promise<CatalogSnapshot> {
  const [productsResponse, categories] = await Promise.all([
    apiClient.get<ProductsResponse>("/products", {
      params: { limit: 0, select: CATALOG_SELECT },
      signal,
    }),
    fetchCategories(signal),
  ]);

  return { products: productsResponse.data.products, categories };
}
