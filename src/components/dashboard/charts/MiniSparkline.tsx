"use client";

import { useId } from "react";

export function MiniSparkline({
  values,
  className,
  stroke = "#6366f1",
}: {
  values: number[];
  className?: string;
  stroke?: string;
}) {
  const gradientId = useId();
  const series = values.length > 1 ? values : [0, ...(values.length ? values : [0])];
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const range = max - min || 1;
  const width = 120;
  const height = 36;
  const pad = 4;
  const step = (width - pad * 2) / (series.length - 1);

  const points = series.map((value, index) => [
    pad + index * step,
    height - pad - ((value - min) / range) * (height - pad * 2),
  ]);

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point[0].toFixed(1)} ${point[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${points[points.length - 1][0].toFixed(1)} ${height} L ${points[0][0].toFixed(1)} ${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
