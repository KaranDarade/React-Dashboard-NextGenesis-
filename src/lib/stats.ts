import { STOCK_LOW_THRESHOLD } from "@/lib/constants";
import { toInr } from "@/lib/format";
import type { Category, Product } from "@/types/product";

/**
 * Pure aggregations over the real catalogue. Every value is derived from actual
 * API data (optionally merged with local overrides) - nothing is invented,
 * because DummyJSON exposes no historical time series.
 */

function num(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export interface CatalogStats {
  total: number;
  categories: number;
  brands: number;
  inventoryValueUsd: number;
  totalUnits: number;
  avgPrice: number;
  avgRating: number;
  avgDiscount: number;
  discountedCount: number;
  lowStock: number;
  outOfStock: number;
  inStock: number;
  highRated: number;
}

export function computeCatalogStats(
  products: Product[],
  lowStockThreshold = STOCK_LOW_THRESHOLD,
): CatalogStats {
  const total = products.length;
  let inventoryValueUsd = 0;
  let priceSum = 0;
  let ratingSum = 0;
  let discountSum = 0;
  let discountedCount = 0;
  let lowStock = 0;
  let outOfStock = 0;
  let inStock = 0;
  let highRated = 0;
  let totalUnits = 0;
  const categories = new Set<string>();
  const brands = new Set<string>();

  for (const product of products) {
    const price = num(product.price);
    const stock = num(product.stock);
    const rating = num(product.rating);
    const discount = num(product.discountPercentage);

    inventoryValueUsd += price * stock;
    totalUnits += stock;
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
      if (stock < lowStockThreshold) lowStock += 1;
    }

    if (rating >= 4) highRated += 1;
    if (product.category) categories.add(product.category);
    if (product.brand) brands.add(product.brand);
  }

  return {
    total,
    categories: categories.size,
    brands: brands.size,
    inventoryValueUsd,
    totalUnits,
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
  inventoryValueUsd: number;
  low: number;
  out: number;
  inStockPct: number;
}

export function computeCategoryStats(
  products: Product[],
  categories: Category[],
  lowStockThreshold = STOCK_LOW_THRESHOLD,
): CategoryStat[] {
  const nameBySlug = new Map(categories.map((c) => [c.slug, c.name]));
  const groups = new Map<string, Product[]>();

  for (const product of products) {
    const slug = product.category || "uncategorised";
    const list = groups.get(slug);
    if (list) list.push(product);
    else groups.set(slug, [product]);
  }

  for (const category of categories) {
    if (!groups.has(category.slug)) groups.set(category.slug, []);
  }

  return Array.from(groups.entries())
    .map(([slug, items]) => {
      const count = items.length;
      let priceSum = 0;
      let ratingSum = 0;
      let inventoryValueUsd = 0;
      let low = 0;
      let out = 0;

      for (const product of items) {
        const price = num(product.price);
        const stock = num(product.stock);
        priceSum += price;
        ratingSum += num(product.rating);
        inventoryValueUsd += price * stock;
        if (stock <= 0) out += 1;
        else if (stock < lowStockThreshold) low += 1;
      }

      return {
        slug,
        name: nameBySlug.get(slug) ?? prettify(slug),
        count,
        avgPrice: count ? priceSum / count : 0,
        avgRating: count ? ratingSum / count : 0,
        inventoryValueUsd,
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

export interface PriceBand {
  label: string;
  count: number;
  valueUsd: number;
}

/** Real distribution of products across price bands (INR-equivalent labels). */
export function computePriceBands(products: Product[]): PriceBand[] {
  const edges = [
    0, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, Number.POSITIVE_INFINITY,
  ];
  // edges are in INR (demo display currency)
  const bands: PriceBand[] = edges.slice(0, -1).map((min, index) => {
    const max = edges[index + 1];
    const label =
      max === Number.POSITIVE_INFINITY
        ? `₹${formatBand(min)}+`
        : `₹${formatBand(min)}-${formatBand(max)}`;
    return { label, count: 0, valueUsd: 0 };
  });

  for (const product of products) {
    const inr = toInr(num(product.price));
    let index = edges.findIndex(
      (min, i) => inr >= min && inr < edges[i + 1],
    );
    if (index < 0) index = bands.length - 1;
    bands[index].count += 1;
    bands[index].valueUsd += num(product.price);
  }

  return bands;
}

function formatBand(value: number): string {
  if (value >= 100000) return `${Math.round(value / 1000)}K`;
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return String(value);
}

export interface BrandStat {
  brand: string;
  count: number;
  avgRating: number;
}

export function computeBrandStats(products: Product[], limit = 8): BrandStat[] {
  const groups = new Map<string, { total: number; rating: number }>();

  for (const product of products) {
    if (!product.brand) continue;
    const entry = groups.get(product.brand) ?? { total: 0, rating: 0 };
    entry.total += 1;
    entry.rating += num(product.rating);
    groups.set(product.brand, entry);
  }

  return Array.from(groups.entries())
    .map(([brand, entry]) => ({
      brand,
      count: entry.total,
      avgRating: entry.total ? entry.rating / entry.total : 0,
    }))
    .sort((a, b) => b.count - a.count || b.avgRating - a.avgRating)
    .slice(0, limit);
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

export function recentProducts(products: Product[], limit = 6): Product[] {
  return [...products]
    .sort((a, b) => {
      const aTime = a.meta?.createdAt ? Date.parse(a.meta.createdAt) : NaN;
      const bTime = b.meta?.createdAt ? Date.parse(b.meta.createdAt) : NaN;
      if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
        return bTime - aTime;
      }
      return num(b.id) - num(a.id);
    })
    .slice(0, limit);
}

export function topCategoriesBy(
  categoryStats: CategoryStat[],
  key: "count" | "avgPrice" | "inventoryValueUsd",
  limit = 8,
): CategoryStat[] {
  return [...categoryStats].sort((a, b) => b[key] - a[key]).slice(0, limit);
}

/** Distribution series used for KPI sparklines (real category shape, not time). */
export function categorySparkline(
  categoryStats: CategoryStat[],
  key: "count" | "avgPrice" | "inventoryValueUsd" = "count",
): number[] {
  return topCategoriesBy(categoryStats, key, 12)
    .map((entry) => entry[key])
    .reverse();
}
