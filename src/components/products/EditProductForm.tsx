"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ProductForm } from "@/components/products/ProductForm";
import { ErrorState } from "@/components/ui/ErrorState";
import { NotFoundState } from "@/components/ui/NotFoundState";
import { Spinner } from "@/components/ui/Spinner";
import { useProduct } from "@/hooks/useProduct";
import { updateProduct } from "@/lib/api/products";
import { applyPatch, findCreated, isLocalId } from "@/lib/overrides";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";
import { useProductOverrides } from "@/store/ProductOverridesContext";
import type { ProductInput } from "@/types/product";

export function EditProductForm({ id }: { id: string }) {
  const router = useRouter();
  const { categories } = useDashboardData();
  const { state, updateLocal } = useProductOverrides();
  const { log } = useDashboardActivity();
  const remote = useProduct(id);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  const created = findCreated(state, id);
  const product =
    created ?? (remote.product ? applyPatch(remote.product, state) : null);
  const loading = !created && remote.loading;
  const error = !created ? remote.error : null;

  if (loading) return <Spinner label="Loading product..." />;
  if (error) return <ErrorState message={error} onRetry={remote.retry} />;
  if (!product) return <NotFoundState />;

  const handleSubmit = async (input: ProductInput) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    try {
      if (!isLocalId(id)) {
        await updateProduct(id, input).catch(() => undefined);
      }
      updateLocal(id, input);
      log({
        action: "Updated product",
        detail: input.title,
        status: "success",
      });
      router.push(`/products/${id}`);
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          Edit product
        </h2>
        <p className="mt-0.5 text-sm text-ink-500">
          Updates are stored in this browser, not on the API.
        </p>
      </div>
      <ProductForm
        initialValues={product}
        submitLabel="Save changes"
        submitting={submitting}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/products/${id}`)}
      />
    </div>
  );
}
