/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon, XIcon } from "@/components/shell/icons";
import { Logo } from "@/components/shell/Logo";
import { NavList } from "@/components/shell/NavList";
import { useStoredUser } from "@/hooks/useStoredUser";
import { clearSession } from "@/lib/auth";
import { cn } from "@/lib/format";
import { useDashboardActivity } from "@/store/DashboardDataContext";

export function MobileNavDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const router = useRouter();
  const user = useStoredUser();
  const { log } = useDashboardActivity();

  const handleLogout = () => {
    log({ action: "Signed out", status: "info" });
    clearSession();
    router.replace("/login");
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "glass-strong absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col border-y-0 border-l-0 transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="text-sm font-semibold tracking-tight text-ink-900">
                NextGenesis
              </p>
              <p className="text-[11px] text-ink-500">Control centre</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/60 bg-white/50 text-ink-700 transition hover:bg-white/80"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="scroll-slim flex-1 overflow-y-auto px-3 py-2">
          <NavList pathname={pathname} onNavigate={onClose} />
        </div>

        <div className="border-t border-white/50 p-3">
          {user ? (
            <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/50 p-2">
              <img
                src={user.image}
                alt=""
                className="h-8 w-8 rounded-full ring-1 ring-white/70"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-ink-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-[11px] text-ink-500">
                  {user.email}
                </p>
              </div>
            </div>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/60 px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </div>
  );
}
