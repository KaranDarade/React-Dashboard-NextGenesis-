"use client";

import { useId, useState } from "react";

export interface AreaPoint {
  label: string;
  value: number;
}

export function AreaChart({
  points,
  unit = "products",
}: {
  points: AreaPoint[];
  unit?: string;
}) {
  const gradientId = useId();
  const [active, setActive] = useState<number | null>(null);

  const width = 620;
  const height = 220;
  const padX = 10;
  const padTop = 18;
  const padBottom = 18;
  const innerH = height - padTop - padBottom;
  const max = Math.max(...points.map((point) => point.value), 1);
  const count = points.length;
  const step = count > 1 ? (width - padX * 2) / (count - 1) : 0;

  const coords = points.map((point, index) => [
    padX + index * step,
    padTop + innerH - (point.value / max) * innerH,
  ]);

  const line = coords
    .map(
      (coord, index) =>
        `${index === 0 ? "M" : "L"}${coord[0].toFixed(1)} ${coord[1].toFixed(1)}`,
    )
    .join(" ");

  const area = `${line} L ${coords[count - 1][0].toFixed(1)} ${
    padTop + innerH
  } L ${coords[0][0].toFixed(1)} ${padTop + innerH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => padTop + innerH * t);
  const shown = active === null ? null : points[active];
  const shownCoord = active === null ? null : coords[active];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Catalogue distribution"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridLines.map((y) => (
          <line
            key={y}
            x1={padX}
            x2={width - padX}
            y1={y}
            y2={y}
            stroke="var(--line)"
            strokeWidth="1"
          />
        ))}

        <path d={area} fill={`url(#${gradientId})`} />
        <path
          d={line}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((coord, index) => (
          <g key={index}>
            {active === index ? (
              <>
                <line
                  x1={coord[0]}
                  x2={coord[0]}
                  y1={padTop}
                  y2={padTop + innerH}
                  stroke="var(--line-strong)"
                />
                <circle cx={coord[0]} cy={coord[1]} r="4.5" fill="#4ade80" />
              </>
            ) : null}
            <rect
              x={coord[0] - step / 2}
              y={padTop}
              width={Math.max(step, 1)}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
            />
          </g>
        ))}
      </svg>

      {shown && shownCoord ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] rounded-lg border border-line-strong bg-canvas-soft px-2.5 py-1.5 text-center shadow-xl"
          style={{
            left: `${(shownCoord[0] / width) * 100}%`,
            top: `${(shownCoord[1] / height) * 100}%`,
          }}
        >
          <p className="text-[10px] text-fg-3">{shown.label}</p>
          <p className="text-xs font-semibold text-fg tabular-nums">
            {shown.value} {unit}
          </p>
        </div>
      ) : null}

      <div className="mt-1 flex justify-between px-1 text-[10px] text-fg-4">
        <span>{points[0]?.label}</span>
        <span>{points[Math.floor(count / 2)]?.label}</span>
        <span>{points[count - 1]?.label}</span>
      </div>
    </div>
  );
}
