"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobalSearch } from "@/components/shell/GlobalSearch";
import { MenuIcon, PlusIcon } from "@/components/shell/icons";
import { pageTitle } from "@/components/shell/nav";
import { NotificationsMenu } from "@/components/shell/NotificationsMenu";
import { UserMenu } from "@/components/shell/UserMenu";

export function Topbar({ onOpenNav }: { onOpenNav: () => void }) {
  const pathname = usePathname();

  return (
    <header className="glass-strong sticky top-0 z-40 flex items-center gap-3 border-x-0 border-t-0 px-4 py-3 sm:px-6">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/60 bg-white/55 text-ink-700 shadow-sm transition hover:bg-white/80 md:hidden"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-500">
          Dashboard
        </p>
        <h1 className="truncate text-[15px] font-semibold text-ink-900">
          {pageTitle(pathname)}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <GlobalSearch />
        <Link
          href="/products/new"
          className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 px-3.5 py-2 text-sm font-medium text-white shadow-[0_10px_24px_-12px_rgba(79,70,229,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-14px_rgba(79,70,229,0.95)] lg:inline-flex"
        >
          <PlusIcon className="h-4 w-4" />
          Add product
        </Link>
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
