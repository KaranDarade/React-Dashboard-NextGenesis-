/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ProductRowMenu } from "@/components/products/ProductRowMenu";
import { StatusBadge, type StockStatus } from "@/components/products/StatusBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { RatingStars } from "@/components/ui/RatingStars";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { isLocalId } from "@/lib/overrides";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  statusOf,
  onDelete,
}: {
  product: Product;
  statusOf: (stock: number) => StockStatus;
  onDelete: (product: Product) => void;
}) {
  return (
    <GlassCard hover className="flex flex-col overflow-hidden">
      <Link href={`/products/${product.id}`} className="block">
        <img
          src={product.thumbnail || FALLBACK_IMAGE}
          alt={product.title}
          loading="lazy"
          className="h-36 w-full bg-white/[0.03] object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${product.id}`}
              className="line-clamp-1 text-sm font-medium text-fg transition hover:text-brand"
            >
              {product.title}
            </Link>
            <p className="mt-0.5 line-clamp-1 text-[11px] capitalize text-fg-3">
              {product.category}
              {isLocalId(product.id) ? " · added locally" : ""}
            </p>
          </div>
          <ProductRowMenu product={product} onDelete={onDelete} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-fg tabular-nums">
            {formatPrice(product.price)}
          </span>
          <RatingStars rating={product.rating} />
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-[11px] text-fg-3">Stock: {product.stock}</span>
          <StatusBadge status={statusOf(product.stock)} />
        </div>
      </div>
    </GlassCard>
  );
}
