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

  const handleLogout = () => {
    log({ action: "Signed out" });
    clearSession();
    router.replace("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="focus-brand flex items-center gap-2 rounded-xl border border-line p-1 pr-2 transition hover:bg-surface-2"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt=""
            className="h-8 w-8 rounded-lg object-cover ring-1 ring-line-strong"
          />
        ) : (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand/15 text-brand">
            <UserIcon className="h-4 w-4" />
          </span>
        )}
        <ChevronDownIcon className="hidden h-3.5 w-3.5 text-fg-3 sm:block" />
      </button>

      {open ? (
        <div
          role="menu"
          className="glass-float pop absolute right-0 top-[calc(100%+10px)] z-50 w-56 rounded-2xl p-2"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-fg">
              {user ? `${user.firstName} ${user.lastName}` : "Signed in"}
            </p>
            <p className="truncate text-[11px] text-fg-3">
              {user?.email ?? "—"}
            </p>
          </div>
          <div className="my-1 h-px bg-line" />
          <Link
            href="/profile"
            onClick={close}
            role="menuitem"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-fg-2 transition hover:bg-surface-2 hover:text-fg"
          >
            <UserIcon className="h-4 w-4" />
            View profile
          </Link>
          <Link
            href="/settings"
            onClick={close}
            role="menuitem"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-fg-2 transition hover:bg-surface-2 hover:text-fg"
          >
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-fg-2 transition hover:bg-danger/10 hover:text-danger"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
