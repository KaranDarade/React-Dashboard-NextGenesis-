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
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <Link href={`/products/${product.id}`} className="block">
        <img
          src={product.thumbnail || FALLBACK_IMAGE}
          alt={product.title}
          loading="lazy"
          className="h-40 w-full bg-slate-100 object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${product.id}`}
            className="line-clamp-1 font-semibold text-slate-900 hover:text-indigo-600"
          >
            {product.title}
          </Link>
          {isLocalId(product.id) ? <Badge tone="info">Local</Badge> : null}
        </div>
        <p className="text-xs capitalize text-slate-500">{product.category}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">
            {formatCurrency(product.price)}
          </span>
          <RatingStars rating={product.rating} />
        </div>
        <Badge tone={stockTone(product.stock)}>{product.stock} in stock</Badge>
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-center text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            View
          </Link>
          <Link
            href={`/products/${product.id}/edit`}
            className="flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-center text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex-1 rounded-md border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
