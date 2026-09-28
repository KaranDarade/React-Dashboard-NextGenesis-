"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchProductById } from "@/lib/api/products";
import type { Product } from "@/types/product";

interface ProductResult {
  signature: string;
  product: Product | null;
  error: string | null;
  notFound: boolean;
}

/**
 * Fetches a single product. Locally-created ids (prefixed with `local-`) are
 * not requested from the API - the caller resolves those from the store.
 */
export function useProduct(id: string) {
  const isRemote = /^\d+$/.test(id);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<ProductResult | null>(null);

  const signature = `${id}|${reloadKey}`;

  useEffect(() => {
    if (!/^\d+$/.test(id)) return;

    const controller = new AbortController();
    const requestSignature = `${id}|${reloadKey}`;

    fetchProductById(id, controller.signal)
      .then((product) => {
        setResult({
          signature: requestSignature,
          product,
          error: null,
          notFound: false,
        });
      })
      .catch((cause: unknown) => {
        if (axios.isCancel(cause)) return;
        if (cause instanceof ApiError && cause.status === 404) {
          setResult({
            signature: requestSignature,
            product: null,
            error: null,
            notFound: true,
          });
          return;
        }
        setResult({
          signature: requestSignature,
          product: null,
          error:
            cause instanceof Error
              ? cause.message
              : "Failed to load product.",
          notFound: false,
        });
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  if (!isRemote) {
    return { product: null, loading: false, error: null, notFound: true, retry };
  }

  const matched = result && result.signature === signature ? result : null;

  return {
    product: matched?.product ?? null,
    loading: matched === null,
    error: matched?.error ?? null,
    notFound: matched?.notFound ?? false,
    retry,
  };
}
