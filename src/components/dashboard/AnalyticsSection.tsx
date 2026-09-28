"use client";

import { useMemo } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { BarList } from "@/components/dashboard/charts/BarList";
import {
  CategoryDonut,
  type DonutSlice,
} from "@/components/dashboard/charts/CategoryDonut";
import { RatingHistogram } from "@/components/dashboard/charts/RatingHistogram";
import { StockProgressList } from "@/components/dashboard/charts/StockProgressList";
import {
  formatCompactCurrency,
  formatCurrency,
} from "@/lib/format";
import { colorAt } from "@/lib/palette";
import { topCategoriesBy } from "@/lib/stats";
import { useDashboardData } from "@/store/DashboardDataContext";

export function AnalyticsSection() {
  const { categoryStats, ratingHistogram } = useDashboardData();

  const donut = useMemo<DonutSlice[]>(() => {
    const top = categoryStats.slice(0, 8);
    const rest = categoryStats.slice(8);
    const slices = top.map((category, index) => ({
      label: category.name,
      value: category.count,
      color: colorAt(index),
    }));
    const restCount = rest.reduce((sum, category) => sum + category.count, 0);
    if (restCount > 0) {
      slices.push({ label: "Other", value: restCount, color: "#94a3b8" });
    }
    return slices;
  }, [categoryStats]);

  const priceBars = useMemo(
    () =>
      topCategoriesBy(categoryStats, "avgPrice", 6).map((category) => ({
        label: category.name,
        value: category.avgPrice,
        display: formatCurrency(category.avgPrice),
      })),
    [categoryStats],
  );

  const inventoryBars = useMemo(
    () =>
      topCategoriesBy(categoryStats, "inventoryValue", 6).map((category) => ({
        label: category.name,
        value: category.inventoryValue,
        display: formatCompactCurrency(category.inventoryValue),
      })),
    [categoryStats],
  );

  const stockBars = useMemo(
    () =>
      topCategoriesBy(categoryStats, "count", 6).map((category) => ({
        label: category.name,
        inStockPct: category.inStockPct,
        low: category.low,
        out: category.out,
      })),
    [categoryStats],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <ChartCard title="Category mix" subtitle="Products per category">
        <CategoryDonut data={donut} />
      </ChartCard>
      <ChartCard
        title="Rating distribution"
        subtitle="Rounded product ratings"
        delay={40}
      >
        <RatingHistogram buckets={ratingHistogram} />
      </ChartCard>
      <ChartCard
        title="Average price by category"
        subtitle="Top 6 categories"
        delay={80}
      >
        <BarList items={priceBars} />
      </ChartCard>
      <ChartCard
        title="Inventory value by category"
        subtitle="Price x stock, top 6"
        delay={120}
      >
        <BarList items={inventoryBars} />
      </ChartCard>
      <ChartCard
        title="Stock health"
        subtitle="In-stock share by category"
        className="lg:col-span-2"
        delay={160}
      >
        <StockProgressList items={stockBars} />
      </ChartCard>
    </div>
  );
}
