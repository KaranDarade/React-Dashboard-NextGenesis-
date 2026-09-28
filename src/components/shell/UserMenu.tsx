/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ChevronDownIcon, LogOutIcon, UserIcon } from "@/components/shell/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useStoredUser } from "@/hooks/useStoredUser";
import { clearSession } from "@/lib/auth";
import { useDashboardActivity } from "@/store/DashboardDataContext";

export function UserMenu() {
  const router = useRouter();
  const user = useStoredUser();
  const { log } = useDashboardActivity();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useClickOutside<HTMLDivElement>(close);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "NG";

  const handleLogout = () => {
    log({ action: "Signed out", status: "info" });
    clearSession();
    router.replace("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-xl border border-white/60 bg-white/55 py-1.5 pl-1.5 pr-2.5 text-left shadow-sm transition hover:bg-white/80"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user?.image ? (
          <img
            src={user.image}
            alt=""
            className="h-7 w-7 rounded-lg ring-1 ring-white/70"
          />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-[11px] font-semibold text-white">
            {initials}
          </span>
        )}
        <span className="hidden min-w-0 leading-tight sm:block">
          <span className="block truncate text-xs font-semibold text-ink-900">
            {user ? `${user.firstName} ${user.lastName}` : "Guest"}
          </span>
          <span className="block truncate text-[10px] text-ink-500">
            {user?.email ?? "Not signed in"}
          </span>
        </span>
        <ChevronDownIcon className="h-3.5 w-3.5 text-ink-500" />
      </button>

      {open ? (
        <div
          role="menu"
          className="glass-float absolute right-0 top-[calc(100%+10px)] z-50 w-60 rounded-2xl p-2 chart-rise"
        >
          <div className="px-3 py-2">
            <p className="text-xs text-ink-500">Signed in as</p>
            <p className="truncate text-sm font-semibold text-ink-900">
              {user?.username ?? "guest"}
            </p>
          </div>
          <div className="my-1 h-px bg-white/60" />
          <Link
            href="/profile"
            onClick={close}
            role="menuitem"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-white/60 hover:text-ink-900"
          >
            <UserIcon className="h-4 w-4" />
            View profile
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
