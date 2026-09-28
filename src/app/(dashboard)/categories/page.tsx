"use client";

import Link from "next/link";
import { BarChartIcon } from "@/components/shell/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { RatingStars } from "@/components/ui/RatingStars";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCompactCurrency, formatCurrency } from "@/lib/format";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";

export default function CategoriesPage() {
  const { categoryStats, stats, loading } = useDashboardData();
  const { log } = useDashboardActivity();

  return (
    <div className="flex flex-col gap-5">
      <GlassCard className="p-5">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          Categories
        </h2>
        <p className="mt-0.5 text-sm text-ink-500">
          {stats.categories} categories across {stats.total} products, ranked by
          catalogue share.
        </p>
      </GlassCard>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="glass rounded-2xl p-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-3 w-20" />
              <Skeleton className="mt-4 h-3 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryStats.map((category, index) => (
            <Link
              key={category.slug}
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              onClick={() =>
                log({
                  action: "Opened category",
                  detail: category.name,
                  status: "info",
                })
              }
              className="chart-rise block"
              style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
            >
              <GlassCard hover className="h-full p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold capitalize text-ink-900">
                      {category.name}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {category.count} products
                    </p>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                    <BarChartIcon className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-ink-500">Avg price</p>
                    <p className="font-medium text-ink-900">
                      {formatCurrency(category.avgPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-ink-500">Inventory</p>
                    <p className="font-medium text-ink-900">
                      {formatCompactCurrency(category.inventoryValue)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <RatingStars rating={category.avgRating} showValue={false} />
                  <span className="text-[11px] text-ink-500">
                    {category.inStockPct}% in stock
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${category.inStockPct}%` }}
                  />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
