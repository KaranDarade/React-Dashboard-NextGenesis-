/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/constants";
import { cn } from "@/lib/format";

export function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const gallery = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [active, setActive] = useState(0);
  const current = gallery[Math.min(active, gallery.length - 1)];

  return (
    <div className="flex flex-col gap-3">
      <div className="glass overflow-hidden rounded-2xl p-2">
        <img
          src={current}
          alt={title}
          className="h-72 w-full rounded-xl bg-surface-1 object-contain sm:h-[26rem]"
        />
      </div>
      {gallery.length > 1 ? (
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "focus-brand h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-surface-1 transition",
                index === active
                  ? "border-brand"
                  : "border-line hover:border-line-strong",
              )}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
