"use client";

import { useMemo } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { AreaChart } from "@/components/dashboard/charts/AreaChart";
import { BarList } from "@/components/dashboard/charts/BarList";
import {
  CategoryDonut,
  type DonutSlice,
} from "@/components/dashboard/charts/CategoryDonut";
import { RatingHistogram } from "@/components/dashboard/charts/RatingHistogram";
import { StockProgressList } from "@/components/dashboard/charts/StockProgressList";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatCompactPrice, formatPrice } from "@/lib/format";
import { colorAt } from "@/lib/palette";
import { topCategoriesBy } from "@/lib/stats";
import { useDashboardData } from "@/store/DashboardDataContext";

export function AnalyticsSection() {
  const {
    categoryStats,
    ratingHistogram,
    priceBands,
    brandStats,
    topRated,
  } = useDashboardData();

  const donut = useMemo<DonutSlice[]>(() => {
    const top = categoryStats.slice(0, 7);
    const rest = categoryStats.slice(7);
    const slices = top.map((category, index) => ({
      label: category.name,
      value: category.count,
      color: colorAt(index),
    }));
    const restCount = rest.reduce((sum, category) => sum + category.count, 0);
    if (restCount > 0) {
      slices.push({ label: "Other", value: restCount, color: "#3F4A43" });
    }
    return slices;
  }, [categoryStats]);

  const priceBars = useMemo(
    () =>
      topCategoriesBy(categoryStats, "avgPrice", 6).map((category) => ({
        label: category.name,
        value: category.avgPrice,
        display: formatPrice(category.avgPrice),
      })),
    [categoryStats],
  );

  const inventoryBars = useMemo(
    () =>
      topCategoriesBy(categoryStats, "inventoryValueUsd", 6).map((category) => ({
        label: category.name,
        value: category.inventoryValueUsd,
        display: formatCompactPrice(category.inventoryValueUsd),
      })),
    [categoryStats],
  );

  const stockBars = useMemo(
    () =>
      topCategoriesBy(categoryStats, "count", 7).map((category) => ({
        label: category.name,
        inStockPct: category.inStockPct,
        low: category.low,
        out: category.out,
      })),
    [categoryStats],
  );

  const brandBars = useMemo(
    () =>
      brandStats.slice(0, 8).map((brand) => ({
        label: brand.brand,
        value: brand.count,
        display: `${brand.count} · ${brand.avgRating.toFixed(1)}★`,
      })),
    [brandStats],
  );

  const areaPoints = useMemo(
    () => priceBands.map((band) => ({ label: band.label, value: band.count })),
    [priceBands],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <ChartCard
        title="Catalogue distribution"
        subtitle="Products by price band"
        className="lg:col-span-2"
      >
        <AreaChart points={areaPoints} />
      </ChartCard>

      <ChartCard title="Category distribution" subtitle="Share of catalogue">
        <CategoryDonut data={donut} />
      </ChartCard>

      <ChartCard title="Rating distribution" subtitle="Rounded product ratings">
        <RatingHistogram buckets={ratingHistogram} />
      </ChartCard>

      <ChartCard title="Average price by category" subtitle="Top 6 categories">
        <BarList items={priceBars} />
      </ChartCard>

      <ChartCard
        title="Inventory value by category"
        subtitle="Price x stock, top 6"
      >
        <BarList items={inventoryBars} colorFrom="#60a5fa" colorTo="#4ade80" />
      </ChartCard>

      <ChartCard
        title="Stock health"
        subtitle="In-stock share by category"
        className="lg:col-span-2"
      >
        <StockProgressList items={stockBars} />
      </ChartCard>

      <ChartCard title="Top brands" subtitle="By number of products">
        <BarList items={brandBars} />
      </ChartCard>

      <ChartCard
        title="Top rated products"
        subtitle="Highest rated in the catalogue"
        className="lg:col-span-3"
      >
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {topRated.map((product) => (
            <li
              key={String(product.id)}
              className="glass-2 rounded-xl p-3"
            >
              <p className="line-clamp-2 text-sm font-medium text-fg">
                {product.title}
              </p>
              <p className="mt-1 line-clamp-1 text-[11px] capitalize text-fg-3">
                {product.category}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <RatingStars rating={product.rating} />
                <span className="text-xs font-medium text-fg tabular-nums">
                  {formatPrice(product.price)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </ChartCard>
    </div>
  );
}
