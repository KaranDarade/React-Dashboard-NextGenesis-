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
      <img
        src={current}
        alt={title}
        className="h-72 w-full rounded-xl border border-slate-200 bg-white object-contain sm:h-96"
      />
      {gallery.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "h-16 w-16 overflow-hidden rounded-lg border-2 bg-white transition",
                index === active
                  ? "border-indigo-600"
                  : "border-transparent hover:border-slate-300",
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
