"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobalSearch } from "@/components/shell/GlobalSearch";
import { Logo } from "@/components/shell/Logo";
import { PlusIcon, SearchIcon } from "@/components/shell/icons";
import { pageTitle } from "@/components/shell/nav";
import { NotificationsMenu } from "@/components/shell/NotificationsMenu";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { UserMenu } from "@/components/shell/UserMenu";

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitle(pathname);

  return (
    <header className="glass-strong sticky top-0 z-40 flex items-center gap-3 border-x-0 border-t-0 border-b border-line px-4 py-2.5 sm:px-6">
      <Link href="/" className="flex items-center gap-2 md:hidden">
        <Logo className="h-8 w-8" />
        <span className="text-sm font-semibold tracking-tight text-fg">
          StoreFlow
        </span>
      </Link>

      <div className="hidden min-w-0 md:block">
        <p className="text-[11px] text-fg-3">
          StoreFlow <span className="text-fg-4">/</span> {title}
        </p>
        <h1 className="truncate text-[15px] font-semibold tracking-tight text-fg">
          {title}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <GlobalSearch />
        <Link
          href="/products"
          aria-label="Search products"
          className="focus-brand grid h-10 w-10 place-items-center rounded-xl border border-line text-fg-2 transition hover:bg-surface-2 hover:text-fg sm:hidden"
        >
          <SearchIcon className="h-[18px] w-[18px]" />
        </Link>
        <Link
          href="/products/new"
          className="focus-brand hidden items-center gap-1.5 rounded-xl bg-brand px-3.5 py-2 text-sm font-medium text-brand-darker transition hover:bg-brand-bright lg:inline-flex"
        >
          <PlusIcon className="h-4 w-4" />
          Add product
        </Link>
        <ThemeToggle />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
