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
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500/90">
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
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-white/75 text-ink-900 ring-accent"
                        : "text-ink-700 hover:translate-x-0.5 hover:bg-white/50 hover:text-ink-900",
                    )}
                  >
                    {active ? (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-500 to-cyan-400" />
                    ) : null}
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition",
                        active
                          ? "text-indigo-600"
                          : "text-ink-500 group-hover:text-ink-700",
                      )}
                    />
                    {!collapsed ? (
                      <span className="truncate">{item.label}</span>
                    ) : (
                      <span className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink-950/90 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
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
