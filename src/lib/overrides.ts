import type { Product, ProductInput } from "@/types/product";

/**
 * DummyJSON does not persist writes, so the app keeps its own list of changes
 * (created products, per-product edits and deletes) and layers them on top of
 * whatever the API returns.
 */
export interface OverridesState {
  created: Product[];
  updates: Record<string, Partial<Product>>;
  deleted: string[];
}

export const emptyOverrides: OverridesState = {
  created: [],
  updates: {},
  deleted: [],
};

export function keyOf(id: Product["id"]): string {
  return String(id);
}

export function isDeleted(state: OverridesState, id: Product["id"]): boolean {
  return state.deleted.includes(keyOf(id));
}

export function isLocalId(id: Product["id"]): boolean {
  return keyOf(id).startsWith("local-");
}

export function applyPatch(product: Product, state: OverridesState): Product {
  const patch = state.updates[keyOf(product.id)];
  return patch ? { ...product, ...patch } : product;
}

export function decorateList(
  products: Product[],
  state: OverridesState,
): Product[] {
  return products
    .filter((product) => !isDeleted(state, product.id))
    .map((product) => applyPatch(product, state));
}

export function findCreated(
  state: OverridesState,
  id: Product["id"],
): Product | undefined {
  return state.created.find((product) => keyOf(product.id) === keyOf(id));
}

export function filterCreated(
  created: Product[],
  { q, category }: { q?: string; category?: string },
): Product[] {
  const needle = (q ?? "").trim().toLowerCase();
  return created.filter((product) => {
    if (category && product.category !== category) return false;
    if (needle) {
      const haystack =
        `${product.title} ${product.category} ${product.brand ?? ""}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export function makeLocalProduct(input: ProductInput): Product {
  const thumbnail = input.thumbnail?.trim();
  return {
    id: `local-${Date.now()}`,
    title: input.title,
    description: input.description,
    category: input.category,
    price: input.price,
    rating: input.rating,
    stock: input.stock,
    brand: input.brand,
    thumbnail: thumbnail || "",
    images: thumbnail ? [thumbnail] : [],
    reviews: [],
    meta: { createdAt: new Date().toISOString() },
  };
}
