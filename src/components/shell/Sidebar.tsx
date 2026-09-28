/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import { ChevronLeftIcon } from "@/components/shell/icons";
import { Logo } from "@/components/shell/Logo";
import { NavList } from "@/components/shell/NavList";
import { useStoredUser } from "@/hooks/useStoredUser";
import { cn } from "@/lib/format";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const user = useStoredUser();

  return (
    <aside
      className={cn(
        "glass-strong sticky top-0 hidden h-screen shrink-0 flex-col rounded-none border-y-0 border-l-0 transition-[width] duration-300 ease-out md:flex",
        collapsed ? "w-[84px]" : "w-[264px]",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-5 py-5",
          collapsed && "justify-center px-0",
        )}
      >
        <Logo />
        {!collapsed ? (
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-ink-900">
              NextGenesis
            </p>
            <p className="text-[11px] text-ink-500">Control centre</p>
          </div>
        ) : null}
      </div>

      <div className="scroll-slim flex-1 overflow-y-auto px-3 py-2">
        <NavList pathname={pathname} collapsed={collapsed} />
      </div>

      <div className="border-t border-white/50 p-3">
        {user ? (
          <div
            className={cn(
              "mb-2 flex items-center gap-3 rounded-xl bg-white/50 p-2",
              collapsed && "justify-center bg-transparent p-0",
            )}
          >
            <img
              src={user.image}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full ring-1 ring-white/70"
            />
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-[11px] text-ink-500">
                  {user.email}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-ink-500 transition hover:bg-white/50 hover:text-ink-900",
            collapsed && "px-0",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
