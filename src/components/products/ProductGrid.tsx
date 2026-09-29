import { ProductCard } from "@/components/products/ProductCard";
import type { StockStatus } from "@/components/products/StatusBadge";
import { cn } from "@/lib/format";
import type { Product } from "@/types/product";

export function ProductGrid({
  products,
  statusOf,
  onDelete,
  className,
}: {
  products: Product[];
  statusOf: (stock: number) => StockStatus;
  onDelete: (product: Product) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={String(product.id)}
          product={product}
          statusOf={statusOf}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
