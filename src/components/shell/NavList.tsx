"use client";

import Link from "next/link";
import { NAV_SECTIONS } from "@/components/shell/nav";
import { cn } from "@/lib/format";

export function NavList({
  pathname,
  collapsed = false,
  onNavigate,
}: {
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-5">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          {!collapsed ? (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-4">
              {section.title}
            </p>
          ) : null}
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => {
              const active = item.isActive(pathname);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-brand group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-brand/10 font-medium text-fg ring-1 ring-brand/25"
                        : "font-normal text-fg-2 hover:bg-white/[0.04] hover:text-fg",
                    )}
                  >
                    {active ? (
                      <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand" />
                    ) : null}
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition",
                        active ? "text-brand" : "text-fg-3 group-hover:text-fg-2",
                      )}
                    />
                    {!collapsed ? (
                      <span className="truncate">{item.label}</span>
                    ) : (
                      <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-line bg-canvas-soft px-2.5 py-1 text-xs font-medium text-fg opacity-0 shadow-xl transition group-hover:opacity-100">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
