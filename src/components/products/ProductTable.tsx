/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ProductRowMenu } from "@/components/products/ProductRowMenu";
import { StatusBadge, type StockStatus } from "@/components/products/StatusBadge";
import { RatingStars } from "@/components/ui/RatingStars";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import { isLocalId } from "@/lib/overrides";
import type { Product } from "@/types/product";

export function ProductTable({
  products,
  statusOf,
  onDelete,
}: {
  products: Product[];
  statusOf: (stock: number) => StockStatus;
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="scroll-slim overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.14em] text-fg-3">
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={String(product.id)}
              className="border-t border-line transition hover:bg-surface-1"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={product.thumbnail || FALLBACK_IMAGE}
                    alt={product.title}
                    loading="lazy"
                    className="h-10 w-10 shrink-0 rounded-lg bg-surface-2 object-cover ring-1 ring-line"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/products/${product.id}`}
                      className="line-clamp-1 font-medium text-fg transition hover:text-brand"
                    >
                      {product.title}
                    </Link>
                    {isLocalId(product.id) ? (
                      <span className="text-[10px] font-medium text-brand">
                        Added locally
                      </span>
                    ) : null}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 capitalize text-fg-2">
                {product.category}
              </td>
              <td className="px-4 py-3 font-medium text-fg tabular-nums">
                {formatPrice(product.price)}
              </td>
              <td className="px-4 py-3">
                <RatingStars rating={product.rating} />
              </td>
              <td className="px-4 py-3 text-fg-2 tabular-nums">
                {product.stock}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={statusOf(product.stock)} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <ProductRowMenu product={product} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
