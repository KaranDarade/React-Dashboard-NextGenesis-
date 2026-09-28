"use client";

import { useEffect, useState } from "react";

/**
 * Returns a value that only updates after the caller stops changing it for
 * `delay` ms. Used to avoid firing a request on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
