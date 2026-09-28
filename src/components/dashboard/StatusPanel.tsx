"use client";

import { ChartCard } from "@/components/dashboard/ChartCard";
import { ConnectionBadge } from "@/components/dashboard/ConnectionBadge";
import { useNow } from "@/hooks/useNow";
import { relativeTime } from "@/lib/system";
import { useDashboardData } from "@/store/DashboardDataContext";
import { useProductOverrides } from "@/store/ProductOverridesContext";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="text-xs text-ink-500">{label}</span>
      <span className="text-xs font-medium text-ink-900">{children}</span>
    </div>
  );
}

export function StatusPanel() {
  const { connection, latencyMs, updatedAt, stats, autoRefresh, online } =
    useDashboardData();
  const { state } = useProductOverrides();
  const now = useNow(10000);

  const localChanges =
    state.created.length +
    Object.keys(state.updates).length +
    state.deleted.length;

  return (
    <ChartCard
      title="System status"
      subtitle="Connection and dataset health"
      className="h-full"
    >
      <div className="divide-y divide-white/50">
        <Row label="API · dummyjson.com">
          <ConnectionBadge connection={connection} />
        </Row>
        <Row label="Last response">
          {latencyMs !== null ? `${latencyMs} ms` : "-"}
        </Row>
        <Row label="Last synced">
          {updatedAt ? relativeTime(updatedAt, now) : "-"}
        </Row>
        <Row label="Network">{online ? "Online" : "Offline"}</Row>
        <Row label="Auto refresh">
          {autoRefresh ? "Every 30s" : "Paused"}
        </Row>
        <Row label="Dataset">
          {stats.total} products · {stats.categories} categories
        </Row>
        <Row label="Local changes">{localChanges}</Row>
      </div>
    </ChartCard>
  );
}
