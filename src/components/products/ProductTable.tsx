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
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={String(product.id)} className="hover:bg-slate-50/70">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={product.thumbnail || FALLBACK_IMAGE}
                    alt={product.title}
                    loading="lazy"
                    className="h-11 w-11 shrink-0 rounded-lg bg-slate-100 object-cover"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product.id}`}
                      className="line-clamp-1 font-medium text-slate-900 hover:text-indigo-600"
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
              <td className="px-4 py-3 capitalize text-slate-600">
                {product.category}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">
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
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    View
                  </Link>
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
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
  );
}
