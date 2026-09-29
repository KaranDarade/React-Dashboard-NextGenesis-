"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { usePersistedBoolean } from "@/hooks/usePersistedBoolean";
import { usePersistedNumber } from "@/hooks/usePersistedNumber";
import { fetchCatalogSnapshot } from "@/lib/api/products";
import { STOCK_LOW_THRESHOLD, STORAGE_KEYS } from "@/lib/constants";
import {
  decorateList,
  filterCreated,
  type OverridesState,
} from "@/lib/overrides";
import {
  categorySparkline,
  computeBrandStats,
  computeCatalogStats,
  computeCategoryStats,
  computePriceBands,
  computeRatingHistogram,
  recentProducts,
  topRatedProducts,
  type BrandStat,
  type CatalogStats,
  type CategoryStat,
  type PriceBand,
  type RatingBucket,
} from "@/lib/stats";
import type { ConnectionStatus } from "@/lib/system";
import type { Category, Product } from "@/types/product";

const POLL_MS = 30000;

interface SnapshotData {
  products: Product[];
  categories: Category[];
  baseline: CatalogStats;
  latencyMs: number;
  at: number;
}

interface SnapshotResult {
  signature: string;
  data: SnapshotData | null;
  error: string | null;
}

export interface CatalogDeltas {
  total: number;
  avgRating: number;
  units: number;
  inventoryUsd: number;
}

export interface CatalogSnapshotValue {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  updatedAt: number | null;
  latencyMs: number | null;
  connection: ConnectionStatus;
  online: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  lowStockThreshold: number;
  statusOf: (stock: number) => "in" | "low" | "out";
  refresh: () => void;
  products: Product[];
  categories: Category[];
  stats: CatalogStats;
  deltas: CatalogDeltas | null;
  categoryStats: CategoryStat[];
  ratingHistogram: RatingBucket[];
  priceBands: PriceBand[];
  brandStats: BrandStat[];
  recent: Product[];
  topRated: Product[];
  countSparkline: number[];
  priceSparkline: number[];
}

export function useCatalogSnapshot(
  overrides: OverridesState,
): CatalogSnapshotValue {
  const online = useOnlineStatus();
  const [autoRefresh, setAutoRefresh] = usePersistedBoolean(
    STORAGE_KEYS.autoRefresh,
    true,
  );
  const [lowStockThreshold] = usePersistedNumber(
    STORAGE_KEYS.lowStockThreshold,
    STOCK_LOW_THRESHOLD,
  );
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<SnapshotResult | null>(null);
  const requestIdRef = useRef(0);

  const signature = String(reloadKey);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;
    const startedAt = performance.now();

    fetchCatalogSnapshot(controller.signal)
      .then(({ products, categories }) => {
        if (requestId !== requestIdRef.current) return;
        const latencyMs = Math.max(1, Math.round(performance.now() - startedAt));
        setResult((previous) => ({
          signature: String(reloadKey),
          error: null,
          data: {
            products,
            categories,
            baseline: previous?.data?.baseline ?? computeCatalogStats(products),
            latencyMs,
            at: Date.now(),
          },
        }));
      })
      .catch((cause: unknown) => {
        if (axios.isCancel(cause)) return;
        if (requestId !== requestIdRef.current) return;
        setResult((previous) => ({
          signature: String(reloadKey),
          data: previous?.data ?? null,
          error:
            cause instanceof Error
              ? cause.message
              : "Failed to load catalogue.",
        }));
      });

    return () => controller.abort();
  }, [reloadKey]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setReloadKey((key) => key + 1);
      }
    }, POLL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        setReloadKey((key) => key + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [autoRefresh]);

  const data = result?.data ?? null;
  const error = result?.error ?? null;
  const loading = result === null;
  const refreshing = result !== null && result.signature !== signature;

  const mergedProducts = useMemo(() => {
    if (!data) return [];
    const created = filterCreated(overrides.created, {});
    return [...created, ...decorateList(data.products, overrides)];
  }, [data, overrides]);

  const stats = useMemo(
    () => computeCatalogStats(mergedProducts, lowStockThreshold),
    [mergedProducts, lowStockThreshold],
  );
  const categoryStats = useMemo(
    () =>
      computeCategoryStats(
        mergedProducts,
        data?.categories ?? [],
        lowStockThreshold,
      ),
    [mergedProducts, data, lowStockThreshold],
  );
  const ratingHistogram = useMemo(
    () => computeRatingHistogram(mergedProducts),
    [mergedProducts],
  );
  const priceBands = useMemo(
    () => computePriceBands(mergedProducts),
    [mergedProducts],
  );
  const brandStats = useMemo(
    () => computeBrandStats(mergedProducts, 8),
    [mergedProducts],
  );
  const recent = useMemo(
    () => recentProducts(mergedProducts, 6),
    [mergedProducts],
  );
  const topRated = useMemo(
    () => topRatedProducts(mergedProducts, 5),
    [mergedProducts],
  );
  const countSparkline = useMemo(
    () => categorySparkline(categoryStats, "count"),
    [categoryStats],
  );
  const priceSparkline = useMemo(
    () => categorySparkline(categoryStats, "inventoryValueUsd"),
    [categoryStats],
  );

  const deltas = useMemo<CatalogDeltas | null>(() => {
    const baseline = data?.baseline;
    if (!baseline) return null;
    return {
      total: stats.total - baseline.total,
      avgRating: stats.avgRating - baseline.avgRating,
      units: stats.totalUnits - baseline.totalUnits,
      inventoryUsd: stats.inventoryValueUsd - baseline.inventoryValueUsd,
    };
  }, [data, stats]);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

  const statusOf = useCallback(
    (stock: number): "in" | "low" | "out" => {
      if (stock <= 0) return "out";
      if (stock < lowStockThreshold) return "low";
      return "in";
    },
    [lowStockThreshold],
  );

  const connection: ConnectionStatus = !online
    ? "offline"
    : error
      ? "degraded"
      : loading || refreshing
        ? "syncing"
        : "operational";

  return {
    loading,
    refreshing,
    error,
    updatedAt: data?.at ?? null,
    latencyMs: data?.latencyMs ?? null,
    connection,
    online,
    autoRefresh,
    setAutoRefresh,
    lowStockThreshold,
    statusOf,
    refresh,
    products: mergedProducts,
    categories: data?.categories ?? [],
    stats,
    deltas,
    categoryStats,
    ratingHistogram,
    priceBands,
    brandStats,
    recent,
    topRated,
    countSparkline,
    priceSparkline,
  };
}
