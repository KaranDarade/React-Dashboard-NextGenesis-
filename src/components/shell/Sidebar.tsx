/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeftIcon,
  LogOutIcon,
} from "@/components/shell/icons";
import { Logo, Wordmark } from "@/components/shell/Logo";
import { NavList } from "@/components/shell/NavList";
import { useStoredUser } from "@/hooks/useStoredUser";
import { clearSession } from "@/lib/auth";
import { cn } from "@/lib/format";
import { useDashboardActivity } from "@/store/DashboardDataContext";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useStoredUser();
  const { log } = useDashboardActivity();

  const handleLogout = () => {
    log({ action: "Signed out" });
    clearSession();
    router.replace("/login");
  };

  return (
    <aside
      className={cn(
        "glass-strong sticky top-0 hidden h-screen shrink-0 flex-col border-y-0 border-l-0 border-r border-line transition-[width] duration-300 ease-out md:flex",
        collapsed ? "w-[84px]" : "w-[236px]",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-5",
          collapsed && "justify-center px-0",
        )}
      >
        <Logo />
        <Wordmark collapsed={collapsed} />
      </div>

      <div className="scroll-slim flex-1 overflow-y-auto px-3 py-2">
        <NavList pathname={pathname} collapsed={collapsed} />
      </div>

      <div className="border-t border-line p-3">
        <div
          className={cn(
            "mb-2 flex items-center gap-3 rounded-xl px-2 py-2",
            collapsed ? "justify-center px-0" : "bg-surface-1",
          )}
        >
          {user?.image ? (
            <img
              src={user.image}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-line-strong"
            />
          ) : (
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand/15 text-[11px] font-semibold text-brand">
              {user?.firstName?.[0] ?? "S"}
            </span>
          )}
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-fg">
                {user ? `${user.firstName} ${user.lastName}` : "Signed in"}
              </p>
              <p className="truncate text-[11px] text-fg-3">Admin</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "focus-brand mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-fg-2 transition hover:bg-danger/10 hover:text-danger",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOutIcon className="h-4 w-4" />
          {!collapsed ? <span>Logout</span> : null}
        </button>

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "focus-brand flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-fg-3 transition hover:bg-surface-2 hover:text-fg-2",
            collapsed && "justify-center px-0",
          )}
        >
          <ChevronLeftIcon
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              collapsed && "rotate-180",
            )}
          />
          {!collapsed ? <span>Collapse</span> : null}
        </button>
      </div>
    </aside>
  );
}
