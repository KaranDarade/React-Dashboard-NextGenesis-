"use client";

import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { ConnectionBadge } from "@/components/dashboard/ConnectionBadge";
import { useNow } from "@/hooks/useNow";
import { relativeTime } from "@/lib/system";
import { useDashboardData } from "@/store/DashboardDataContext";

export default function AnalyticsPage() {
  const { connection, updatedAt, latencyMs, stats } = useDashboardData();
  const now = useNow(10000);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-fg">
            Analytics
          </h2>
          <p className="mt-0.5 text-sm text-fg-2">
            Computed live from {stats.total} products across {stats.categories}{" "}
            categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionBadge connection={connection} />
          <span className="text-[11px] text-fg-3">
            {latencyMs !== null ? `${latencyMs} ms · ` : ""}
            {updatedAt ? `updated ${relativeTime(updatedAt, now)}` : "waiting"}
          </span>
        </div>
      </div>

      <AnalyticsSection />
    </div>
  );
}
