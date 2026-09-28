"use client";

import { ConnectionBadge } from "@/components/dashboard/ConnectionBadge";
import { RefreshIcon } from "@/components/shell/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { useNow } from "@/hooks/useNow";
import { cn, formatCompactCurrency } from "@/lib/format";
import { relativeTime } from "@/lib/system";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";

export function DashboardHeader() {
  const {
    stats,
    updatedAt,
    refreshing,
    refresh,
    autoRefresh,
    setAutoRefresh,
    connection,
  } = useDashboardData();
  const { log } = useDashboardActivity();
  const now = useNow(10000);

  const handleRefresh = () => {
    log({
      action: "Refreshed catalogue",
      detail: "Manual sync",
      status: "success",
    });
    refresh();
  };

  return (
    <GlassCard className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">
          Catalogue intelligence
        </h2>
        <p className="mt-0.5 text-sm text-ink-500">
          A live view of {stats.total.toLocaleString()} products across{" "}
          {stats.categories} categories, holding{" "}
          {formatCompactCurrency(stats.inventoryValue)} of inventory value.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ConnectionBadge connection={connection} />
        <span className="text-[11px] text-ink-500">
          {updatedAt
            ? `Updated ${relativeTime(updatedAt, now)}`
            : "Waiting for data"}
        </span>
        <button
          type="button"
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition",
            autoRefresh
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-white/60 bg-white/55 text-ink-700 hover:bg-white/80",
          )}
          aria-pressed={autoRefresh}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              autoRefresh ? "animate-pulse bg-indigo-500" : "bg-slate-400",
            )}
          />
          Auto-refresh {autoRefresh ? "on" : "off"}
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/55 px-3 py-2 text-xs font-medium text-ink-700 transition hover:bg-white/80 disabled:opacity-60"
        >
          <RefreshIcon
            className={cn("h-4 w-4", refreshing && "animate-spin")}
          />
          {refreshing ? "Syncing" : "Refresh"}
        </button>
      </div>
    </GlassCard>
  );
}
