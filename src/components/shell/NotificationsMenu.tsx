"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { AlertIcon, BellIcon, CheckIcon } from "@/components/shell/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/format";
import { useDashboardData } from "@/store/DashboardDataContext";

interface Alert {
  tone: "danger" | "warning" | "info";
  title: string;
  detail: string;
  href: string;
}

const toneDot: Record<Alert["tone"], string> = {
  danger: "bg-danger",
  warning: "bg-warn",
  info: "bg-info",
};

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
        detail: "Below the low-stock threshold",
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
        className="focus-brand relative grid h-10 w-10 place-items-center rounded-xl border border-line text-fg-2 transition hover:bg-white/[0.05] hover:text-fg"
      >
        <BellIcon className="h-[18px] w-[18px]" />
        {alerts.length > 0 ? (
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand ring-2 ring-canvas-soft" />
        ) : null}
      </button>

      {open ? (
        <div className="glass-float pop absolute right-0 top-[calc(100%+10px)] z-50 w-80 rounded-2xl p-2">
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-sm font-semibold text-fg">Alerts</p>
            <span className="text-[11px] text-fg-3">Live catalogue</span>
          </div>
          <ul className="flex flex-col gap-1">
            {alerts.length === 0 ? (
              <li className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-fg-2">
                <CheckIcon className="h-4 w-4 text-brand" />
                Everything looks healthy.
              </li>
            ) : (
              alerts.map((alert) => (
                <li key={alert.title}>
                  <Link
                    href={alert.href}
                    onClick={close}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.05]"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        toneDot[alert.tone],
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-fg">
                        {alert.title}
                      </span>
                      <span className="block text-xs text-fg-3">
                        {alert.detail}
                      </span>
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
          {alerts.length === 0 ? null : (
            <div className="flex items-center gap-2 px-3 pb-2 pt-1 text-[11px] text-fg-4">
              <AlertIcon className="h-3.5 w-3.5" />
              Derived from the live catalogue
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
