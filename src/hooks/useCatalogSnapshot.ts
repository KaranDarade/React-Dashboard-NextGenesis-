"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { usePersistedBoolean } from "@/hooks/usePersistedBoolean";
import { fetchCatalogSnapshot } from "@/lib/api/products";
import {
  decorateList,
  filterCreated,
  type OverridesState,
} from "@/lib/overrides";
import {
  categorySparkline,
  computeCatalogStats,
  computeCategoryStats,
  computeRatingHistogram,
  topRatedProducts,
  type CatalogStats,
  type CategoryStat,
  type RatingBucket,
} from "@/lib/stats";
import type { ConnectionStatus } from "@/lib/system";
import type { Category, Product } from "@/types/product";

const POLL_MS = 30000;
const AUTO_REFRESH_KEY = "ng_auto_refresh";

interface SnapshotData {
  products: Product[];
  categories: Category[];
  latencyMs: number;
  at: number;
}

interface SnapshotResult {
  signature: string;
  data: SnapshotData | null;
  error: string | null;
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
  refresh: () => void;
  products: Product[];
  categories: Category[];
  stats: CatalogStats;
  categoryStats: CategoryStat[];
  ratingHistogram: RatingBucket[];
  topRated: Product[];
  countSparkline: number[];
  priceSparkline: number[];
}

export function useCatalogSnapshot(
  overrides: OverridesState,
): CatalogSnapshotValue {
  const online = useOnlineStatus();
  const [autoRefresh, setAutoRefresh] = usePersistedBoolean(
    AUTO_REFRESH_KEY,
    true,
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
        setResult({
          signature: String(reloadKey),
          error: null,
          data: {
            products,
            categories,
            latencyMs: Math.max(1, Math.round(performance.now() - startedAt)),
            at: Date.now(),
          },
        });
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
    () => computeCatalogStats(mergedProducts),
    [mergedProducts],
  );
  const categoryStats = useMemo(
    () => computeCategoryStats(mergedProducts, data?.categories ?? []),
    [mergedProducts, data],
  );
  const ratingHistogram = useMemo(
    () => computeRatingHistogram(mergedProducts),
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
    () => categorySparkline(categoryStats, "avgPrice"),
    [categoryStats],
  );

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);

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
    refresh,
    products: mergedProducts,
    categories: data?.categories ?? [],
    stats,
    categoryStats,
    ratingHistogram,
    topRated,
    countSparkline,
    priceSparkline,
  };
}
