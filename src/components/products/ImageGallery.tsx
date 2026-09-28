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
          className="h-72 w-full rounded-xl bg-white/60 object-contain sm:h-96"
        />
      </div>
      {gallery.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "h-16 w-16 overflow-hidden rounded-xl border-2 bg-white/60 transition",
                index === active
                  ? "border-indigo-500 ring-2 ring-indigo-200"
                  : "border-white/60 hover:border-white/90",
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
