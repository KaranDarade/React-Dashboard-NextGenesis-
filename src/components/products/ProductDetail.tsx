"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ReviewList } from "@/components/products/ReviewList";
import { Badge, stockTone } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { NotFoundState } from "@/components/ui/NotFoundState";
import { RatingStars } from "@/components/ui/RatingStars";
import { Spinner } from "@/components/ui/Spinner";
import { useProduct } from "@/hooks/useProduct";
import { deleteProduct } from "@/lib/api/products";
import { formatCurrency } from "@/lib/format";
import { applyPatch, findCreated, isDeleted, isLocalId } from "@/lib/overrides";
import { useProductOverrides } from "@/store/ProductOverridesContext";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { state, deleteLocal } = useProductOverrides();
  const remote = useProduct(id);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const created = findCreated(state, id);
  const deleted = isDeleted(state, id);
  const product =
    created ?? (remote.product ? applyPatch(remote.product, state) : null);
  const loading = !created && remote.loading;
  const error = !created ? remote.error : null;
  const notFound = !created && (deleted || remote.notFound);

  if (loading) return <Spinner label="Loading product..." />;
  if (error) return <ErrorState message={error} onRetry={remote.retry} />;
  if (notFound || !product) return <NotFoundState />;

  const discounted = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
        ? [product.thumbnail]
        : [];

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      if (/^\d+$/.test(id)) {
        await deleteProduct(id);
      }
    } catch {
      // DummyJSON does not persist deletes - keep the local change.
    } finally {
      deleteLocal(id);
      setDeleting(false);
      router.push("/products");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/products"
          className="text-sm text-slate-600 transition hover:text-indigo-600"
        >
          &larr; Back to products
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}/edit`}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ImageGallery images={images} title={product.title} />

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info" className="capitalize">
                {product.category}
              </Badge>
              {isLocalId(product.id) ? (
                <Badge tone="info">Added locally</Badge>
              ) : null}
              {product.brand ? <Badge>{product.brand}</Badge> : null}
            </div>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {product.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold text-slate-900">
              {formatCurrency(discounted ?? product.price)}
            </span>
            {discounted ? (
              <span className="text-sm text-slate-400 line-through">
                {formatCurrency(product.price)}
              </span>
            ) : null}
            {product.discountPercentage ? (
              <Badge tone="success">
                -{Math.round(product.discountPercentage)}%
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <RatingStars rating={product.rating} />
            <Badge tone={stockTone(product.stock)}>
              {product.stock} in stock
            </Badge>
            {product.availabilityStatus ? (
              <Badge>{product.availabilityStatus}</Badge>
            ) : null}
          </div>

          {product.description ? (
            <p className="text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          ) : null}

          <dl className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-4 text-sm sm:grid-cols-2">
            {product.sku ? <DetailRow label="SKU" value={product.sku} /> : null}
            {product.weight ? (
              <DetailRow label="Weight" value={String(product.weight)} />
            ) : null}
            {product.warrantyInformation ? (
              <DetailRow
                label="Warranty"
                value={product.warrantyInformation}
              />
            ) : null}
            {product.shippingInformation ? (
              <DetailRow
                label="Shipping"
                value={product.shippingInformation}
              />
            ) : null}
            {product.returnPolicy ? (
              <DetailRow label="Returns" value={product.returnPolicy} />
            ) : null}
            {product.minimumOrderQuantity ? (
              <DetailRow
                label="Min order"
                value={String(product.minimumOrderQuantity)}
              />
            ) : null}
          </dl>

          {product.tags && product.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag}>#{tag}</Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
        <ReviewList reviews={product.reviews ?? []} />
      </section>

      <ConfirmDialog
        open={confirming}
        title="Delete product"
        message={`Are you sure you want to delete "${product.title}"? This cannot be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setConfirming(false);
        }}
      />
    </div>
  );
}
