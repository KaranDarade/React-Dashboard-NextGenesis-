"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProductForm } from "@/components/products/ProductForm";
import { useCategories } from "@/hooks/useCategories";
import { createProduct } from "@/lib/api/products";
import { makeLocalProduct } from "@/lib/overrides";
import { useProductOverrides } from "@/store/ProductOverridesContext";
import type { ProductInput } from "@/types/product";

export function AddProductForm() {
  const router = useRouter();
  const { categories } = useCategories();
  const { addLocal } = useProductOverrides();
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  const handleSubmit = async (input: ProductInput) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    try {
      // DummyJSON returns a simulated result but does not persist it, so the
      // real change lives in the local overrides store.
      await createProduct(input).catch(() => undefined);
      const product = makeLocalProduct(input);
      addLocal(product);
      router.push(`/products/${product.id}`);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Add product</h1>
        <p className="text-sm text-slate-500">
          The new product is stored in this browser, not on the API.
        </p>
      </div>
      <ProductForm
        submitLabel="Create product"
        submitting={submitting}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/products")}
      />
    </div>
  );
}
