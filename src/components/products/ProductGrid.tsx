import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

export function ProductGrid({
  products,
  onDelete,
}: {
  products: Product[];
  onDelete: (product: Product) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
      {products.map((product) => (
        <ProductCard
          key={String(product.id)}
          product={product}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
