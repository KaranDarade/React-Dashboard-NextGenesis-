"use client";

import { useState } from "react";
import { cn } from "@/lib/format";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export function CategoryDonut({
  data,
  totalLabel = "products",
}: {
  data: DonutSlice[];
  totalLabel?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((sum, slice) => sum + slice.value, 0) || 1;
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  const segments = data.map((slice, index) => {
    const dash = (slice.value / total) * circumference;
    const offset = data
      .slice(0, index)
      .reduce(
        (sum, previous) => sum + (previous.value / total) * circumference,
        0,
      );
    return { ...slice, index, dash, offset };
  });

  const shown = active === null ? null : data[active];

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(148,163,184,0.18)"
            strokeWidth="16"
          />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={active === segment.index ? 19 : 15}
              strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
              strokeDashoffset={-segment.offset}
              className="cursor-pointer transition-all duration-200"
              style={{
                opacity:
                  active === null || active === segment.index ? 1 : 0.3,
              }}
              onMouseEnter={() => setActive(segment.index)}
              onMouseLeave={() => setActive(null)}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-2xl font-semibold tabular-nums text-ink-900">
              {shown ? shown.value : total}
            </p>
            <p className="max-w-[7rem] truncate text-[11px] capitalize text-ink-500">
              {shown ? shown.label : totalLabel}
            </p>
          </div>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-1">
        {data.map((slice, index) => (
          <li
            key={slice.label}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(null)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-2 py-1 text-xs transition",
              active === index ? "bg-white/70" : "",
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: slice.color }}
              />
              <span className="truncate capitalize text-ink-700">
                {slice.label}
              </span>
            </span>
            <span className="shrink-0 tabular-nums text-ink-500">
              {Math.round((slice.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
