"use client";

import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@/components/shell/icons";
import { MiniSparkline } from "@/components/dashboard/charts/MiniSparkline";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/format";

export type MetricTone = "brand" | "info" | "warn" | "danger" | "neutral";

const toneIcon: Record<MetricTone, string> = {
  brand: "bg-brand/12 text-brand",
  info: "bg-info/12 text-info",
  warn: "bg-warn/12 text-warn",
  danger: "bg-danger/12 text-danger",
  neutral: "bg-surface-2 text-fg-2",
};

const toneSpark: Record<MetricTone, string> = {
  brand: "#22c55e",
  info: "#60a5fa",
  warn: "#fbbf24",
  danger: "#fb7185",
  neutral: "#a7b8ad",
};

export interface MetricTrend {
  value: number;
  text?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  tone = "brand",
  trend,
  note,
  footer,
  sparkline,
  delay = 0,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  tone?: MetricTone;
  trend?: MetricTrend;
  note?: string;
  footer?: ReactNode;
  sparkline?: number[];
  delay?: number;
}) {
  const direction =
    trend === undefined || trend.value === 0
      ? "flat"
      : trend.value > 0
        ? "up"
        : "down";

  return (
    <GlassCard hover className="rise p-4" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-fg-3">{label}</p>
        {icon ? (
          <span
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
              toneIcon[tone],
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xl font-semibold tracking-tight text-fg tabular-nums">
            {value}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {trend ? (
              <span
                title="Change since this session loaded"
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
                  direction === "up" && "bg-brand/10 text-brand",
                  direction === "down" && "bg-danger/10 text-danger",
                  direction === "flat" && "bg-surface-2 text-fg-3",
                )}
              >
                {direction === "up" ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : direction === "down" ? (
                  <ArrowDownIcon className="h-3 w-3" />
                ) : null}
                {trend.text ??
                  `${trend.value > 0 ? "+" : ""}${trend.value.toFixed(trend.value % 1 === 0 ? 0 : 1)}`}
              </span>
            ) : null}
            {note ? <span className="text-[11px] text-fg-3">{note}</span> : null}
          </div>
        </div>
        {sparkline && sparkline.length > 1 ? (
          <MiniSparkline
            values={sparkline}
            stroke={toneSpark[tone]}
            className="h-9 w-16 shrink-0 opacity-90 sm:w-20"
          />
        ) : null}
      </div>

      {footer ? <div className="mt-2">{footer}</div> : null}
    </GlassCard>
  );
}
