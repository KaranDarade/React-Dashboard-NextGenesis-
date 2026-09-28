"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { AlertIcon, BellIcon, CheckIcon } from "@/components/shell/icons";
import { Badge } from "@/components/ui/Badge";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/format";
import { useDashboardData } from "@/store/DashboardDataContext";

interface Alert {
  tone: "danger" | "warning" | "info";
  title: string;
  detail: string;
  href: string;
}

export function NotificationsMenu() {
  const { stats } = useDashboardData();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close);

  const alerts = useMemo<Alert[]>(() => {
    const list: Alert[] = [];
    if (stats.outOfStock > 0) {
      list.push({
        tone: "danger",
        title: `${stats.outOfStock} products out of stock`,
        detail: "Restock required",
        href: "/products",
      });
    }
    if (stats.lowStock > 0) {
      list.push({
        tone: "warning",
        title: `${stats.lowStock} products low on stock`,
        detail: "Fewer than 20 units",
        href: "/products",
      });
    }
    if (stats.discountedCount > 0) {
      list.push({
        tone: "info",
        title: `${stats.discountedCount} products discounted`,
        detail: `Average ${stats.avgDiscount.toFixed(0)}% off`,
        href: "/products",
      });
    }
    return list;
  }, [stats]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/60 bg-white/55 text-ink-700 shadow-sm transition hover:bg-white/80"
      >
        <BellIcon className="h-5 w-5" />
        {alerts.length > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 px-1 text-[10px] font-semibold text-white shadow">
            {alerts.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="glass-float absolute right-0 top-[calc(100%+10px)] z-50 w-80 rounded-2xl p-2 chart-rise">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-semibold text-ink-900">Alerts</p>
            <span className="text-[11px] text-ink-500">
              From live catalogue data
            </span>
          </div>
          <ul className="flex flex-col gap-1">
            {alerts.length === 0 ? (
              <li className="flex items-center gap-3 rounded-xl bg-white/50 px-3 py-3 text-sm text-ink-700">
                <CheckIcon className="h-4 w-4 text-emerald-500" />
                Everything looks healthy.
              </li>
            ) : (
              alerts.map((alert) => (
                <li key={alert.title}>
                  <Link
                    href={alert.href}
                    onClick={close}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/60"
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                        alert.tone === "danger" && "bg-rose-100 text-rose-600",
                        alert.tone === "warning" &&
                          "bg-amber-100 text-amber-600",
                        alert.tone === "info" &&
                          "bg-indigo-100 text-indigo-600",
                      )}
                    >
                      <AlertIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-ink-900">
                        {alert.title}
                      </span>
                      <span className="block text-xs text-ink-500">
                        {alert.detail}
                      </span>
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
          <div className="px-3 pb-2 pt-1">
            <Badge tone="neutral">Updates every 30s</Badge>
          </div>
        </div>
      ) : null}
    </div>
  );
}
