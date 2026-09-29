"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ImageGallery } from "@/components/products/ImageGallery";
import { ReviewList } from "@/components/products/ReviewList";
import { StatusBadge } from "@/components/products/StatusBadge";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassCard } from "@/components/ui/GlassCard";
import { NotFoundState } from "@/components/ui/NotFoundState";
import { RatingStars } from "@/components/ui/RatingStars";
import { Spinner } from "@/components/ui/Spinner";
import { useProduct } from "@/hooks/useProduct";
import { deleteProduct } from "@/lib/api/products";
import { cn, formatPrice } from "@/lib/format";
import { applyPatch, findCreated, isDeleted, isLocalId } from "@/lib/overrides";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";
import { useProductOverrides } from "@/store/ProductOverridesContext";

type Tab = "overview" | "reviews" | "details";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-t border-line py-2.5 first:border-t-0">
      <dt className="text-fg-3">{label}</dt>
      <dd className="text-right font-medium text-fg">{value}</dd>
    </div>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { state, deleteLocal } = useProductOverrides();
  const remote = useProduct(id);
  const { log } = useDashboardActivity();
  const { statusOf } = useDashboardData();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const loggedView = useRef(false);

  const created = findCreated(state, id);
  const deleted = isDeleted(state, id);
  const product =
    created ?? (remote.product ? applyPatch(remote.product, state) : null);
  const loading = !created && remote.loading;
  const error = !created ? remote.error : null;
  const notFound = !created && (deleted || remote.notFound);

  useEffect(() => {
    if (loggedView.current || !product) return;
    loggedView.current = true;
    log({ action: "Viewed product", detail: product.title });
  }, [product, log]);

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
      log({
        action: "Deleted product",
        detail: product.title,
        status: "warning",
      });
      deleteLocal(id);
      setDeleting(false);
      router.push("/products");
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: `Reviews (${product.reviews?.length ?? 0})` },
    { id: "details", label: "Details" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/products"
          className="focus-brand rounded-lg text-sm text-fg-3 transition hover:text-brand"
        >
          ← Back to products
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}/edit`}
            className="focus-brand rounded-xl border border-line px-3.5 py-2 text-sm font-medium text-fg-2 transition hover:bg-white/[0.05] hover:text-fg"
          >
            Edit Product
          </Link>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="focus-brand rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2 text-sm font-medium text-danger transition hover:bg-danger/15"
          >
            Delete Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ImageGallery images={images} title={product.title} />

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info" className="capitalize">
                {product.category}
              </Badge>
              {isLocalId(product.id) ? (
                <Badge tone="success">Added locally</Badge>
              ) : null}
              {product.brand ? <Badge>{product.brand}</Badge> : null}
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-fg">
              {product.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold text-fg tabular-nums">
              {formatPrice(discounted ?? product.price)}
            </span>
            {discounted ? (
              <span className="text-sm text-fg-4 line-through">
                {formatPrice(product.price)}
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
            <StatusBadge status={statusOf(product.stock)} />
            <span className="text-sm text-fg-2">
              Stock: <span className="text-fg">{product.stock}</span>
            </span>
          </div>

          <div className="glass-2 rounded-2xl p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-fg-3">Availability</span>
              <span className="font-medium text-fg">
                {product.availabilityStatus ?? "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <GlassCard className="p-5">
        <div className="flex gap-1 border-b border-line">
          {tabs.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={cn(
                "focus-brand relative px-3.5 py-2.5 text-sm font-medium transition",
                tab === entry.id ? "text-fg" : "text-fg-3 hover:text-fg-2",
              )}
            >
              {entry.label}
              {tab === entry.id ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand" />
              ) : null}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {tab === "overview" ? (
            <div className="flex flex-col gap-4">
              <p className="max-w-3xl text-sm leading-relaxed text-fg-2">
                {product.description ?? "No description provided."}
              </p>
              {product.tags && product.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag}>#{tag}</Badge>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === "reviews" ? (
            <ReviewList reviews={product.reviews ?? []} />
          ) : null}

          {tab === "details" ? (
            <dl className="max-w-2xl text-sm">
              <DetailRow label="Category" value={product.category} />
              <DetailRow label="Brand" value={product.brand ?? "—"} />
              <DetailRow label="SKU" value={product.sku ?? "—"} />
              <DetailRow
                label="Weight"
                value={product.weight ? String(product.weight) : "—"}
              />
              <DetailRow
                label="Warranty"
                value={product.warrantyInformation ?? "—"}
              />
              <DetailRow
                label="Shipping"
                value={product.shippingInformation ?? "—"}
              />
              <DetailRow label="Returns" value={product.returnPolicy ?? "—"} />
              <DetailRow
                label="Min order"
                value={
                  product.minimumOrderQuantity
                    ? String(product.minimumOrderQuantity)
                    : "—"
                }
              />
              <DetailRow
                label="Discount"
                value={
                  product.discountPercentage
                    ? `${product.discountPercentage}%`
                    : "—"
                }
              />
            </dl>
          ) : null}
        </div>
      </GlassCard>

      <ConfirmDialog
        open={confirming}
        title="Delete product?"
        message={`This will remove "${product.title}" from the current catalog. Changes are stored in this browser only.`}
        confirmLabel="Delete Product"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) setConfirming(false);
        }}
      />
    </div>
  );
}
