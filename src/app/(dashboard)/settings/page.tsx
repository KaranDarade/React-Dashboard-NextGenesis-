"use client";

import { useState } from "react";
import { ConnectionBadge } from "@/components/dashboard/ConnectionBadge";
import { RefreshIcon, TrashIcon } from "@/components/shell/icons";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { GlassCard } from "@/components/ui/GlassCard";
import { useNow } from "@/hooks/useNow";
import { usePersistedNumber } from "@/hooks/usePersistedNumber";
import { STOCK_LOW_THRESHOLD, STORAGE_KEYS, API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/format";
import { relativeTime } from "@/lib/system";
import {
  useDashboardActivity,
  useDashboardData,
} from "@/store/DashboardDataContext";
import { useProductOverrides } from "@/store/ProductOverridesContext";

const THRESHOLD_OPTIONS = [5, 10, 20, 30, 50];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "focus-brand relative h-6 w-11 shrink-0 rounded-full transition",
        checked ? "bg-brand" : "bg-white/[0.12]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
          checked ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  );
}

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line py-3 first:border-t-0 first:pt-0">
      <div className="min-w-0">
        <p className="text-sm text-fg">{title}</p>
        <p className="text-[11px] text-fg-3">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const {
    connection,
    online,
    latencyMs,
    updatedAt,
    autoRefresh,
    setAutoRefresh,
    refresh,
    refreshing,
    stats,
  } = useDashboardData();
  const { state, clearLocal } = useProductOverrides();
  const { clear: clearActivity } = useDashboardActivity();
  const [threshold, setThreshold] = usePersistedNumber(
    STORAGE_KEYS.lowStockThreshold,
    STOCK_LOW_THRESHOLD,
  );
  const [confirmClear, setConfirmClear] = useState(false);
  const now = useNow(10000);

  const localChanges =
    state.created.length +
    Object.keys(state.updates).length +
    state.deleted.length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-fg">
          Settings
        </h2>
        <p className="mt-0.5 text-sm text-fg-2">
          Preferences for this browser session.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-fg">Data &amp; refresh</h3>
          <p className="mt-0.5 text-xs text-fg-3">
            The dashboard syncs the live catalogue from DummyJSON.
          </p>
          <div className="mt-3">
            <Row
              title="Auto-refresh"
              description="Poll the catalogue every 30 seconds"
            >
              <Toggle
                checked={autoRefresh}
                onChange={setAutoRefresh}
                label="Auto-refresh"
              />
            </Row>
            <Row title="Connection" description={online ? "Online" : "Offline"}>
              <ConnectionBadge connection={connection} />
            </Row>
            <Row title="Last response" description="Round-trip time to the API">
              <span className="text-sm text-fg tabular-nums">
                {latencyMs !== null ? `${latencyMs} ms` : "—"}
              </span>
            </Row>
            <Row title="Last synced" description="Most recent successful fetch">
              <span className="text-sm text-fg">
                {updatedAt ? relativeTime(updatedAt, now) : "—"}
              </span>
            </Row>
            <Row title="API endpoint" description="Shared Axios base URL">
              <span className="max-w-[45%] truncate text-xs text-fg-2">
                {API_BASE_URL}
              </span>
            </Row>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="focus-brand mt-4 inline-flex items-center gap-2 rounded-xl border border-line px-3.5 py-2 text-sm font-medium text-fg-2 transition hover:bg-white/[0.05] hover:text-fg disabled:opacity-60"
          >
            <RefreshIcon
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
            {refreshing ? "Syncing" : "Refresh now"}
          </button>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="text-sm font-semibold text-fg">Catalog preferences</h3>
          <p className="mt-0.5 text-xs text-fg-3">
            Affects stock status across the app.
          </p>
          <div className="mt-3">
            <Row
              title="Low-stock threshold"
              description={`Products below this are "Low Stock" · ${stats.lowStock} currently low`}
            >
              <select
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                aria-label="Low-stock threshold"
                className="focus-brand rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-fg outline-none transition hover:border-line-strong focus:border-brand/50"
              >
                {THRESHOLD_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-canvas-soft">
                    {option} units
                  </option>
                ))}
              </select>
            </Row>
            <Row
              title="Stock statuses"
              description="Derived from live stock levels"
            >
              <span className="text-xs text-fg-2">
                In · Low · Out
              </span>
            </Row>
          </div>
        </GlassCard>

        <GlassCard className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-fg">Demo data</h3>
          <p className="mt-0.5 text-xs text-fg-3">
            Product data comes from DummyJSON; prices are shown in INR using a
            fixed demo conversion. These are demonstration values, not real
            market prices. Add/edit/delete changes are stored in this browser
            only and are never saved to the API.
          </p>
          <div className="mt-3">
            <Row
              title="Local changes"
              description="Created, edited or deleted products in this browser"
            >
              <span className="text-sm text-fg tabular-nums">
                {localChanges}
              </span>
            </Row>
            <Row
              title="Clear local changes"
              description="Reset the catalogue to the API state"
            >
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={localChanges === 0}
                className="focus-brand inline-flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-medium text-fg-2 transition hover:bg-danger/10 hover:text-danger disabled:opacity-40"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Clear
              </button>
            </Row>
            <Row
              title="Activity log"
              description="Clear the live activity feed"
            >
              <button
                type="button"
                onClick={clearActivity}
                className="focus-brand rounded-xl border border-line px-3 py-2 text-xs font-medium text-fg-2 transition hover:bg-white/[0.05] hover:text-fg"
              >
                Clear log
              </button>
            </Row>
          </div>
        </GlassCard>
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear local changes?"
        message="This removes products you added, edits you made and restores deleted products to the API state. It does not affect DummyJSON."
        confirmLabel="Clear changes"
        onConfirm={() => {
          clearLocal();
          setConfirmClear(false);
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}
