/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOutIcon, PlusIcon, UserIcon, XIcon } from "@/components/shell/icons";
import { Logo, Wordmark } from "@/components/shell/Logo";
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
    log({ action: "Signed out" });
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
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "glass-strong absolute inset-y-0 left-0 flex w-[280px] max-w-[84vw] flex-col border-y-0 border-l-0 border-r border-line-strong transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <Logo />
            <Wordmark />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="focus-brand grid h-9 w-9 place-items-center rounded-xl border border-line text-fg-2 transition hover:bg-white/[0.05] hover:text-fg"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="scroll-slim flex-1 overflow-y-auto px-3 py-2">
          <NavList pathname={pathname} onNavigate={onClose} />
        </div>

        <div className="flex flex-col gap-2 border-t border-line p-3">
          <Link
            href="/products/new"
            onClick={onClose}
            className="focus-brand flex items-center justify-center gap-2 rounded-xl bg-brand px-3 py-2.5 text-sm font-medium text-brand-darker transition hover:bg-brand-bright"
          >
            <PlusIcon className="h-4 w-4" />
            Add product
          </Link>
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/[0.04]"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-1 ring-line-strong"
              />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/15 text-[11px] font-semibold text-brand">
                <UserIcon className="h-4 w-4" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-xs font-medium text-fg">
                {user ? `${user.firstName} ${user.lastName}` : "Profile"}
              </span>
              <span className="block truncate text-[11px] text-fg-3">
                Admin
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="focus-brand flex items-center justify-center gap-2 rounded-xl border border-line px-3 py-2.5 text-sm font-medium text-fg-2 transition hover:bg-danger/10 hover:text-danger"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}
