"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Defers mounting heavy below-the-fold sections until they scroll near the
 * viewport, so the first paint stays fast.
 */
export function LazyMount({
  children,
  fallback,
  className,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <div ref={ref} className={className}>
      {shown ? children : fallback}
    </div>
  );
}
