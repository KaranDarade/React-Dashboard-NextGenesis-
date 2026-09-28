"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { fetchCategories } from "@/lib/api/products";
import type { Category } from "@/types/product";

interface CategoriesResult {
  signature: string;
  categories: Category[];
  error: string | null;
}

export function useCategories() {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<CategoriesResult | null>(null);

  const signature = String(reloadKey);

  useEffect(() => {
    const controller = new AbortController();
    const requestSignature = String(reloadKey);

    fetchCategories(controller.signal)
      .then((categories) => {
        setResult({ signature: requestSignature, categories, error: null });
      })
      .catch((cause: unknown) => {
        if (axios.isCancel(cause)) return;
        setResult({
          signature: requestSignature,
          categories: [],
          error:
            cause instanceof Error
              ? cause.message
              : "Failed to load categories.",
        });
      });

    return () => controller.abort();
  }, [reloadKey]);

  const matched = result && result.signature === signature ? result : null;
  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    categories: matched?.categories ?? [],
    loading: matched === null,
    error: matched?.error ?? null,
    retry,
  };
}
