"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { fetchCurrentUser } from "@/lib/api/auth";
import type { AuthUser } from "@/types/product";

interface ProfileResult {
  signature: string;
  user: AuthUser | null;
  error: string | null;
}

export function useProfile() {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState<ProfileResult | null>(null);
  const signature = String(reloadKey);

  useEffect(() => {
    const controller = new AbortController();
    const requestSignature = String(reloadKey);

    fetchCurrentUser(controller.signal)
      .then((user) => {
        setResult({ signature: requestSignature, user, error: null });
      })
      .catch((cause: unknown) => {
        if (axios.isCancel(cause)) return;
        setResult({
          signature: requestSignature,
          user: null,
          error:
            cause instanceof Error
              ? cause.message
              : "Failed to load profile.",
        });
      });

    return () => controller.abort();
  }, [reloadKey]);

  const matched = result && result.signature === signature ? result : null;
  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    user: matched?.user ?? null,
    loading: matched === null,
    error: matched?.error ?? null,
    retry,
  };
}
