/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Badge, stockTone } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { isLocalId } from "@/lib/overrides";
import type { Product } from "@/types/product";

export function ProductCard({
  product,
  onDelete,
}: {
  product: Product;
  onDelete: (product: Product) => void;
}) {
  return (
    <article className="glass glass-hover flex flex-col overflow-hidden rounded-2xl">
      <Link href={`/products/${product.id}`} className="block">
        <img
          src={product.thumbnail || FALLBACK_IMAGE}
          alt={product.title}
          loading="lazy"
          className="h-40 w-full bg-white/50 object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${product.id}`}
            className="line-clamp-1 font-semibold text-ink-900 transition hover:text-indigo-600"
          >
            {product.title}
          </Link>
          {isLocalId(product.id) ? <Badge tone="info">Local</Badge> : null}
        </div>
        <p className="text-xs capitalize text-ink-500">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-ink-900">
            {formatCurrency(product.price)}
          </span>
          <RatingStars rating={product.rating} />
        </div>
        <Badge tone={stockTone(product.stock)}>{product.stock} in stock</Badge>
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 rounded-lg border border-white/60 bg-white/55 px-2.5 py-1.5 text-center text-xs font-medium text-ink-700 transition hover:bg-white/90"
          >
            View
          </Link>
          <Link
            href={`/products/${product.id}/edit`}
            className="flex-1 rounded-lg border border-white/60 bg-white/55 px-2.5 py-1.5 text-center text-xs font-medium text-ink-700 transition hover:bg-white/90"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex-1 rounded-lg border border-rose-200/70 bg-rose-50/70 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
