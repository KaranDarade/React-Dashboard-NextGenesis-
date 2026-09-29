/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/shell/icons";
import { StatusBadge } from "@/components/products/StatusBadge";
import { RatingStars } from "@/components/ui/RatingStars";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { useDashboardData } from "@/store/DashboardDataContext";

export function RecentProducts() {
  const { recent, statusOf, loading } = useDashboardData();

  return (
    <GlassCard className="flex flex-col p-5 rise">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-fg">Recent Products</h3>
          <p className="mt-0.5 text-xs text-fg-3">
            Recently added and updated products
          </p>
        </div>
        <Link
          href="/products"
          className="focus-brand inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-brand transition hover:bg-brand/10"
        >
          View all
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-3 flex-1">
        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((product) => (
              <li key={String(product.id)}>
                <Link
                  href={`/products/${product.id}`}
                  className="focus-brand flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-white/[0.035]"
                >
                  <img
                    src={product.thumbnail || FALLBACK_IMAGE}
                    alt={product.title}
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded-lg bg-white/[0.04] object-cover ring-1 ring-line"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-fg">
                      {product.title}
                    </p>
                    <p className="line-clamp-1 text-[11px] capitalize text-fg-3">
                      {product.category}
                    </p>
                  </div>
                  <div className="hidden w-20 text-right sm:block">
                    <p className="text-sm font-medium text-fg tabular-nums">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <RatingStars rating={product.rating} />
                  </div>
                  <div className="w-14 text-right text-sm text-fg-2 tabular-nums">
                    {product.stock}
                  </div>
                  <div className="w-[92px] text-right">
                    <StatusBadge status={statusOf(product.stock)} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </GlassCard>
  );
}
