"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChartIcon,
  BoxIcon,
  DashboardIcon,
  MenuIcon,
} from "@/components/shell/icons";
import { cn } from "@/lib/format";

const ITEMS = [
  {
    href: "/",
    label: "Home",
    Icon: DashboardIcon,
    isActive: (pathname: string) => pathname === "/",
  },
  {
    href: "/products",
    label: "Products",
    Icon: BoxIcon,
    isActive: (pathname: string) => pathname.startsWith("/products"),
  },
  {
    href: "/analytics",
    label: "Analytics",
    Icon: BarChartIcon,
    isActive: (pathname: string) => pathname.startsWith("/analytics"),
  },
];

export function BottomNav({ onOpenMore }: { onOpenMore: () => void }) {
  const pathname = usePathname();

  const itemClass =
    "focus-brand flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition";

  return (
    <nav className="glass-strong fixed inset-x-0 bottom-0 z-40 flex items-stretch border-x-0 border-b-0 border-t border-line-strong px-2 pb-[env(safe-area-inset-bottom)] md:hidden">
      {ITEMS.map((item) => {
        const active = item.isActive(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              itemClass,
              active ? "text-brand" : "text-fg-3 hover:text-fg-2",
            )}
          >
            <item.Icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onOpenMore}
        className={cn(itemClass, "text-fg-3 hover:text-fg-2")}
      >
        <MenuIcon className="h-[18px] w-[18px]" />
        More
      </button>
    </nav>
  );
}
