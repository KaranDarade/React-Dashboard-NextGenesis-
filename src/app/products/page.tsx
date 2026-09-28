import { Suspense } from "react";
import { ProductsBrowser } from "@/components/products/ProductsBrowser";
import { Spinner } from "@/components/ui/Spinner";

export default function ProductsPage() {
  return (
    <Suspense fallback={<Spinner label="Loading products..." />}>
      <ProductsBrowser />
    </Suspense>
  );
}
