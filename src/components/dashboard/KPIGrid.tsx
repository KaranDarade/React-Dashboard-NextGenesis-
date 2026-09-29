"use client";

import { useMemo } from "react";
import { MetricCard, type MetricTone } from "@/components/dashboard/MetricCard";
import {
  AlertIcon,
  BoxIcon,
  LayersIcon,
  StarIcon,
} from "@/components/shell/icons";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  formatCompactNumber,
  formatCompactPrice,
} from "@/lib/format";
import { useDashboardData } from "@/store/DashboardDataContext";

export function KPIGrid() {
  const {
    stats,
    deltas,
    countSparkline,
    priceSparkline,
    ratingHistogram,
    loading,
  } = useDashboardData();

  const cards = useMemo(
    () => [
      {
        label: "Total Products",
        value: stats.total.toLocaleString(),
        tone: "brand" as MetricTone,
        icon: <BoxIcon className="h-[18px] w-[18px]" />,
        trend: { value: deltas?.total ?? 0 },
        note: `${stats.categories} categories`,
        sparkline: countSparkline,
      },
      {
        label: "Average Rating",
        value: stats.avgRating.toFixed(1),
        tone: "info" as MetricTone,
        icon: <StarIcon className="h-[18px] w-[18px]" />,
        trend: { value: deltas?.avgRating ?? 0 },
        note: `${stats.highRated} rated 4★+`,
        sparkline: ratingHistogram.map((bucket) => bucket.count),
      },
      {
        label: "Total Inventory",
        value: formatCompactNumber(stats.totalUnits),
        tone: "neutral" as MetricTone,
        icon: <LayersIcon className="h-[18px] w-[18px]" />,
        trend: { value: deltas?.units ?? 0 },
        note: `${formatCompactPrice(stats.inventoryValueUsd)} value`,
        sparkline: priceSparkline,
      },
      {
        label: "Low Stock",
        value: stats.lowStock.toLocaleString(),
        tone: (stats.lowStock > 0 ? "warn" : "brand") as MetricTone,
        icon: <AlertIcon className="h-[18px] w-[18px]" />,
        note: `${stats.outOfStock} out of stock`,
        footer: (
          <span
            className={
              stats.outOfStock > 0 || stats.lowStock > 0
                ? "inline-flex items-center gap-1.5 text-[11px] font-medium text-warn"
                : "inline-flex items-center gap-1.5 text-[11px] font-medium text-brand"
            }
          >
            <span
              className={
                stats.outOfStock > 0 || stats.lowStock > 0
                  ? "h-1.5 w-1.5 rounded-full bg-warn"
                  : "h-1.5 w-1.5 rounded-full bg-brand"
              }
            />
            {stats.outOfStock > 0 || stats.lowStock > 0
              ? "Needs attention"
              : "Healthy"}
          </span>
        ),
      },
    ],
    [stats, deltas, countSparkline, priceSparkline, ratingHistogram],
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass rounded-2xl p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-24" />
            <Skeleton className="mt-3 h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, index) => (
        <MetricCard key={card.label} {...card} delay={index * 40} />
      ))}
    </div>
  );
}
