"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProductForm } from "@/components/products/ProductForm";
import { createProduct } from "@/lib/api/products";
import { makeLocalProduct } from "@/lib/overrides";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";
import { useProductOverrides } from "@/store/ProductOverridesContext";
import type { ProductInput } from "@/types/product";

export function AddProductForm() {
  const router = useRouter();
  const { categories } = useDashboardData();
  const { addLocal } = useProductOverrides();
  const { log } = useDashboardActivity();
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  const handleSubmit = async (input: ProductInput) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    try {
      await createProduct(input).catch(() => undefined);
      const product = makeLocalProduct(input);
      addLocal(product);
      log({
        action: "Created product",
        detail: input.title,
        status: "success",
      });
      router.push(`/products/${product.id}`);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          Add product
        </h2>
        <p className="mt-0.5 text-sm text-fg-2">
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
