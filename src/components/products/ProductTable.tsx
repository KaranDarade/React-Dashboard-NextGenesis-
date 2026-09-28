/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Badge, stockTone } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { isLocalId } from "@/lib/overrides";
import type { Product } from "@/types/product";

export function ProductTable({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="glass hidden overflow-hidden rounded-2xl md:block">
      <div className="scroll-slim overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-ink-500">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={String(product.id)}
                className="border-t border-white/50 transition hover:bg-white/45"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail || FALLBACK_IMAGE}
                      alt={product.title}
                      loading="lazy"
                      className="h-11 w-11 shrink-0 rounded-xl bg-white/60 object-cover ring-1 ring-white/60"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="line-clamp-1 font-medium text-ink-900 transition hover:text-indigo-600"
                      >
                        {product.title}
                      </Link>
                      {isLocalId(product.id) ? (
                        <Badge tone="info" className="mt-1">
                          Added locally
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-ink-600">
                  {product.category}
                </td>
                <td className="px-4 py-3 font-medium text-ink-900">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3">
                  <RatingStars rating={product.rating} />
                </td>
                <td className="px-4 py-3">
                  <Badge tone={stockTone(product.stock)}>
                    {product.stock} in stock
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="rounded-lg border border-white/60 bg-white/55 px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:bg-white/90"
                    >
                      View
                    </Link>
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="rounded-lg border border-white/60 bg-white/55 px-2.5 py-1 text-xs font-medium text-ink-700 transition hover:bg-white/90"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      className="rounded-lg border border-rose-200/70 bg-rose-50/70 px-2.5 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
