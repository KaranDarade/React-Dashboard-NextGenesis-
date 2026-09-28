"use client";

import { useMemo } from "react";
import {
  AlertIcon,
  BoxIcon,
  LayersIcon,
  TagIcon,
  TrendingUpIcon,
} from "@/components/shell/icons";
import { MetricCard, type MetricTone } from "@/components/dashboard/MetricCard";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatPercent,
} from "@/lib/format";
import { useDashboardData } from "@/store/DashboardDataContext";

export function KPIGrid() {
  const {
    stats,
    countSparkline,
    priceSparkline,
    ratingHistogram,
    loading,
  } = useDashboardData();

  const cards = useMemo(() => {
    const highRatedPct = stats.total
      ? (stats.highRated / stats.total) * 100
      : 0;

    return [
      {
        label: "Catalogue size",
        value: formatCompactNumber(stats.total),
        context: `${stats.categories} categories · ${stats.brands} brands`,
        chip: "Live",
        tone: "accent" as MetricTone,
        icon: <BoxIcon className="h-5 w-5" />,
        sparkline: countSparkline,
      },
      {
        label: "Inventory value",
        value: formatCompactCurrency(stats.inventoryValue),
        context: `Average price ${formatCurrency(stats.avgPrice)}`,
        chip: `${formatCompactNumber(stats.inStock)} in stock`,
        tone: "aqua" as MetricTone,
        icon: <LayersIcon className="h-5 w-5" />,
        sparkline: priceSparkline,
      },
      {
        label: "Average rating",
        value: stats.avgRating.toFixed(2),
        context: `${formatPercent(highRatedPct)} rate 4 stars or higher`,
        chip: `${stats.highRated} top rated`,
        tone: "amber" as MetricTone,
        icon: <TrendingUpIcon className="h-5 w-5" />,
        sparkline: ratingHistogram.map((bucket) => bucket.count),
      },
      {
        label: "Stock alerts",
        value: formatCompactNumber(stats.lowStock),
        context: `${stats.outOfStock} out of stock · ${stats.inStock} available`,
        chip: stats.outOfStock > 0 ? "Needs attention" : "Healthy",
        tone: (stats.outOfStock > 0 ? "rose" : "emerald") as MetricTone,
        icon: <AlertIcon className="h-5 w-5" />,
      },
      {
        label: "Average discount",
        value: formatPercent(stats.avgDiscount),
        context: `${stats.discountedCount} products on offer`,
        chip: `${stats.total - stats.discountedCount} full price`,
        tone: "violet" as MetricTone,
        icon: <TagIcon className="h-5 w-5" />,
      },
    ];
  }, [stats, countSparkline, priceSparkline, ratingHistogram]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="glass rounded-2xl p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-7 w-28" />
            <Skeleton className="mt-4 h-3 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {cards.map((card, index) => (
        <MetricCard key={card.label} {...card} delay={index * 45} />
      ))}
    </div>
  );
}
