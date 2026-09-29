"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/shell/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { RatingStars } from "@/components/ui/RatingStars";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCompactPrice, formatPrice } from "@/lib/format";
import { familyOf } from "@/lib/taxonomy";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";

export default function CategoriesPage() {
  const { categoryStats, stats, loading } = useDashboardData();
  const { log } = useDashboardActivity();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          Categories
        </h2>
        <p className="mt-0.5 text-sm text-fg-2">
          {stats.categories} categories across {stats.total} products, ranked by
          catalogue share.
        </p>
      </div>

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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryStats.map((category, index) => (
            <Link
              key={category.slug}
              href={`/products?category=${encodeURIComponent(category.slug)}`}
              onClick={() =>
                log({
                  action: "Opened category",
                  detail: category.name,
                })
              }
              className="rise group block"
              style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
            >
              <GlassCard hover className="h-full p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold capitalize text-fg">
                      {category.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-fg-3">
                      {familyOf(category.slug) ?? "Catalogue"} ·{" "}
                      {category.count} products
                    </p>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-fg-4 transition group-hover:translate-x-0.5 group-hover:text-brand" />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-fg-3">Avg price</p>
                    <p className="font-medium text-fg">
                      {formatPrice(category.avgPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-fg-3">Inventory</p>
                    <p className="font-medium text-fg">
                      {formatCompactPrice(category.inventoryValueUsd)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <RatingStars rating={category.avgRating} showValue={false} />
                  <span className="text-[11px] text-fg-3">
                    {category.inStockPct}% in stock
                  </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-500"
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
