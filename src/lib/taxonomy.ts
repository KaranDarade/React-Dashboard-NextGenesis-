import type { Category } from "@/types/product";

/**
 * The DummyJSON catalogue exposes 24 fine-grained category slugs. To make the
 * category filter feel like a real product tool we group those real slugs into
 * friendly families. Filtering still uses the underlying API slug, so no data
 * is invented - only the labels/grouping are presentational.
 */
export interface CategoryFamily {
  name: string;
  slugs: string[];
}

export const CATEGORY_FAMILIES: CategoryFamily[] = [
  {
    name: "Electronics",
    slugs: ["smartphones", "laptops", "tablets", "mobile-accessories"],
  },
  {
    name: "Fashion",
    slugs: [
      "mens-shirts",
      "mens-shoes",
      "womens-dresses",
      "womens-shoes",
      "tops",
      "womens-bags",
      "womens-jewellery",
      "sunglasses",
    ],
  },
  { name: "Watches", slugs: ["mens-watches", "womens-watches"] },
  { name: "Beauty", slugs: ["beauty", "fragrances", "skin-care"] },
  {
    name: "Home & Living",
    slugs: ["furniture", "home-decoration", "kitchen-accessories"],
  },
  { name: "Grocery", slugs: ["groceries"] },
  { name: "Sports", slugs: ["sports-accessories"] },
  { name: "Automotive", slugs: ["automotive", "motorcycle", "vehicle"] },
];

export function familyOf(slug: string): string | null {
  return (
    CATEGORY_FAMILIES.find((family) => family.slugs.includes(slug))?.name ??
    null
  );
}

export interface CategoryGroup {
  name: string;
  items: Category[];
}

/** Groups the API categories into families, preserving API order within each. */
export function groupCategories(categories: Category[]): CategoryGroup[] {
  const known = new Set(CATEGORY_FAMILIES.flatMap((family) => family.slugs));
  const groups: CategoryGroup[] = CATEGORY_FAMILIES.map((family) => ({
    name: family.name,
    items: categories.filter((category) =>
      family.slugs.includes(category.slug),
    ),
  })).filter((group) => group.items.length > 0);

  const other = categories.filter((category) => !known.has(category.slug));
  if (other.length > 0) {
    groups.push({ name: "Other", items: other });
  }

  return groups;
}
