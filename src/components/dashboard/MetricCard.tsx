"use client";

import type { ReactNode } from "react";
import { MiniSparkline } from "@/components/dashboard/charts/MiniSparkline";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/format";

export type MetricTone =
  | "accent"
  | "aqua"
  | "violet"
  | "amber"
  | "rose"
  | "emerald";

const toneIcon: Record<MetricTone, string> = {
  accent: "bg-indigo-100 text-indigo-600",
  aqua: "bg-cyan-100 text-cyan-600",
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-amber-100 text-amber-600",
  rose: "bg-rose-100 text-rose-600",
  emerald: "bg-emerald-100 text-emerald-600",
};

const toneChip: Record<MetricTone, string> = {
  accent: "bg-indigo-50 text-indigo-700",
  aqua: "bg-cyan-50 text-cyan-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

const toneStroke: Record<MetricTone, string> = {
  accent: "#6366f1",
  aqua: "#06b6d4",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  rose: "#f43f5e",
  emerald: "#10b981",
};

export function MetricCard({
  label,
  value,
  context,
  chip,
  tone = "accent",
  icon,
  sparkline,
  delay = 0,
}: {
  label: string;
  value: string;
  context: string;
  chip?: string;
  tone?: MetricTone;
  icon?: ReactNode;
  sparkline?: number[];
  delay?: number;
}) {
  return (
    <GlassCard
      hover
      className="chart-rise relative overflow-hidden p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-ink-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-900 tabular-nums">
            {value}
          </p>
        </div>
        {icon ? (
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
              toneIcon[tone],
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {chip ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                toneChip[tone],
              )}
            >
              {chip}
            </span>
          ) : null}
          <p className="mt-1.5 text-[11px] leading-snug text-ink-500">
            {context}
          </p>
        </div>
        {sparkline && sparkline.length > 1 ? (
          <MiniSparkline
            values={sparkline}
            stroke={toneStroke[tone]}
            className="h-9 w-20 shrink-0 opacity-90 sm:w-24"
          />
        ) : null}
      </div>
    </GlassCard>
  );
}
