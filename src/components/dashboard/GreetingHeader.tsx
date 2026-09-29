"use client";

import { ConnectionBadge } from "@/components/dashboard/ConnectionBadge";
import { RefreshIcon } from "@/components/shell/icons";
import { useNow } from "@/hooks/useNow";
import { useStoredUser } from "@/hooks/useStoredUser";
import { cn, formatCompactNumber } from "@/lib/format";
import { relativeTime } from "@/lib/system";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function GreetingHeader() {
  const user = useStoredUser();
  const { stats, updatedAt, refreshing, refresh, autoRefresh, setAutoRefresh, connection } =
    useDashboardData();
  const { log } = useDashboardActivity();
  const now = useNow(10000);

  const handleRefresh = () => {
    log({ action: "Refreshed catalogue", detail: "Manual sync", status: "success" });
    refresh();
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">
          {greeting(new Date(now).getHours())}
          {user ? `, ${user.firstName}` : ""}
        </h2>
        <p className="mt-0.5 text-sm text-fg-2">
          Here&apos;s what&apos;s happening with your product catalog ·{" "}
          {formatCompactNumber(stats.total)} products
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ConnectionBadge connection={connection} />
        <span className="text-[11px] text-fg-3">
          {updatedAt ? `Updated ${relativeTime(updatedAt, now)}` : "Waiting"}
        </span>
        <button
          type="button"
          onClick={() => setAutoRefresh(!autoRefresh)}
          aria-pressed={autoRefresh}
          className={cn(
            "focus-brand inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition",
            autoRefresh
              ? "border-brand/30 bg-brand/10 text-brand"
              : "border-line text-fg-2 hover:bg-white/[0.05]",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              autoRefresh ? "animate-pulse bg-brand" : "bg-fg-4",
            )}
          />
          Auto {autoRefresh ? "on" : "off"}
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="focus-brand inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-medium text-fg-2 transition hover:bg-white/[0.05] hover:text-fg disabled:opacity-60"
        >
          <RefreshIcon className={cn("h-4 w-4", refreshing && "animate-spin")} />
          {refreshing ? "Syncing" : "Refresh"}
        </button>
      </div>
    </div>
  );
}
