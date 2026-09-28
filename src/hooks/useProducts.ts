"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchProducts } from "@/lib/api/products";
import type { ListQuery } from "@/lib/search-params";
import type { ProductsResponse } from "@/types/product";

interface ProductsResult {
  signature: string;
  data: ProductsResponse | null;
  error: string | null;
}

/**
 * Fetches one page of products. It defends against out-of-order responses in
 * two ways:
 *   1. every run aborts the previous request (AbortController)
 *   2. a monotonically increasing request id drops any late response
 * This is what keeps a slow search (e.g. ?delay=2000) from overwriting newer
 * results when the user types quickly.
 *
 * `loading` is derived by comparing the current query signature with the last
 * completed one, which avoids setting state synchronously inside the effect.
 */
export function useProducts(query: ListQuery) {
  const { q, category, sortBy, order, page, limit } = query;
  const skip = (page - 1) * limit;

  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<ProductsResult | null>(null);
  const requestIdRef = useRef(0);

  const signature = JSON.stringify([
    q,
    category,
    sortBy,
    order,
    limit,
    skip,
    reloadKey,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;
    const requestSignature = JSON.stringify([
      q,
      category,
      sortBy,
      order,
      limit,
      skip,
      reloadKey,
    ]);

    fetchProducts({
      q,
      category,
      sortBy,
      order,
      limit,
      skip,
      signal: controller.signal,
    })
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setResult({ signature: requestSignature, data, error: null });
      })
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return;
        if (requestId !== requestIdRef.current) return;
        setResult({
          signature: requestSignature,
          data: null,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load products.",
        });
      });

    return () => controller.abort();
  }, [q, category, sortBy, order, limit, skip, reloadKey]);

  const matched = result && result.signature === signature ? result : null;
  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    data: matched?.data ?? null,
    loading: matched === null,
    error: matched?.error ?? null,
    retry,
  };
}
