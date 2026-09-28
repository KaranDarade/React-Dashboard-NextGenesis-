import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/format";

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <GlassCard
      className={cn("flex flex-col p-5 chart-rise", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-ink-500">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </GlassCard>
  );
}
