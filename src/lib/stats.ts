import type { Category, Product } from "@/types/product";

/**
 * Pure aggregations over the real catalogue. Every value here is derived from
 * actual API data (optionally merged with local overrides) - nothing is
 * invented, because DummyJSON exposes no historical time series.
 */

function num(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export interface CatalogStats {
  total: number;
  categories: number;
  brands: number;
  inventoryValue: number;
  avgPrice: number;
  avgRating: number;
  avgDiscount: number;
  discountedCount: number;
  lowStock: number;
  outOfStock: number;
  inStock: number;
  highRated: number;
}

export function computeCatalogStats(products: Product[]): CatalogStats {
  const total = products.length;
  let inventoryValue = 0;
  let priceSum = 0;
  let ratingSum = 0;
  let discountSum = 0;
  let discountedCount = 0;
  let lowStock = 0;
  let outOfStock = 0;
  let inStock = 0;
  let highRated = 0;
  const categories = new Set<string>();
  const brands = new Set<string>();

  for (const product of products) {
    const price = num(product.price);
    const stock = num(product.stock);
    const rating = num(product.rating);
    const discount = num(product.discountPercentage);

    inventoryValue += price * stock;
    priceSum += price;
    ratingSum += rating;

    if (discount > 0) {
      discountSum += discount;
      discountedCount += 1;
    }

    if (stock <= 0) {
      outOfStock += 1;
    } else {
      inStock += 1;
      if (stock < 20) lowStock += 1;
    }

    if (rating >= 4) highRated += 1;
    if (product.category) categories.add(product.category);
    if (product.brand) brands.add(product.brand);
  }

  return {
    total,
    categories: categories.size,
    brands: brands.size,
    inventoryValue,
    avgPrice: total ? priceSum / total : 0,
    avgRating: total ? ratingSum / total : 0,
    avgDiscount: discountedCount ? discountSum / discountedCount : 0,
    discountedCount,
    lowStock,
    outOfStock,
    inStock,
    highRated,
  };
}

export interface CategoryStat {
  slug: string;
  name: string;
  count: number;
  avgPrice: number;
  avgRating: number;
  inventoryValue: number;
  low: number;
  out: number;
  inStockPct: number;
}

export function computeCategoryStats(
  products: Product[],
  categories: Category[],
): CategoryStat[] {
  const nameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const groups = new Map<string, Product[]>();

  for (const product of products) {
    const slug = product.category || "uncategorised";
    const list = groups.get(slug);
    if (list) list.push(product);
    else groups.set(slug, [product]);
  }

  // include categories that currently have no products so the view is complete
  for (const category of categories) {
    if (!groups.has(category.slug)) groups.set(category.slug, []);
  }

  return Array.from(groups.entries())
    .map(([slug, items]) => {
      const count = items.length;
      let priceSum = 0;
      let ratingSum = 0;
      let inventoryValue = 0;
      let low = 0;
      let out = 0;

      for (const product of items) {
        const price = num(product.price);
        const stock = num(product.stock);
        priceSum += price;
        ratingSum += num(product.rating);
        inventoryValue += price * stock;
        if (stock <= 0) out += 1;
        else if (stock < 20) low += 1;
      }

      return {
        slug,
        name: nameBySlug.get(slug) ?? prettify(slug),
        count,
        avgPrice: count ? priceSum / count : 0,
        avgRating: count ? ratingSum / count : 0,
        inventoryValue,
        low,
        out,
        inStockPct: count ? Math.round(((count - out) / count) * 100) : 0,
      };
    })
    .filter((entry) => entry.count > 0 || nameBySlug.has(entry.slug))
    .sort((a, b) => b.count - a.count);
}

export function prettify(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export interface RatingBucket {
  rating: number;
  count: number;
}

export function computeRatingHistogram(products: Product[]): RatingBucket[] {
  const buckets: RatingBucket[] = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: 0,
  }));

  for (const product of products) {
    const rounded = Math.min(5, Math.max(1, Math.round(num(product.rating))));
    buckets[rounded - 1].count += 1;
  }

  return buckets;
}

export function topRatedProducts(products: Product[], limit = 5): Product[] {
  return [...products]
    .sort((a, b) => {
      const ratingDiff = num(b.rating) - num(a.rating);
      if (ratingDiff !== 0) return ratingDiff;
      return num(b.stock) - num(a.stock);
    })
    .slice(0, limit);
}

export function topCategoriesBy(
  categoryStats: CategoryStat[],
  key: "count" | "avgPrice" | "inventoryValue",
  limit = 8,
): CategoryStat[] {
  return [...categoryStats].sort((a, b) => b[key] - a[key]).slice(0, limit);
}

/** Distribution series used for KPI sparklines (real category shape, not time). */
export function categorySparkline(
  categoryStats: CategoryStat[],
  key: "count" | "avgPrice" | "inventoryValue" = "count",
): number[] {
  return topCategoriesBy(categoryStats, key, 12)
    .map((entry) => entry[key])
    .reverse();
}
