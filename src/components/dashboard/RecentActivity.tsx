"use client";

import { ChartCard } from "@/components/dashboard/ChartCard";
import { ActivityIcon, AlertIcon, CheckIcon } from "@/components/shell/icons";
import { useNow } from "@/hooks/useNow";
import type { ActivityEvent, ActivityStatus } from "@/lib/activity";
import { cn } from "@/lib/format";
import { relativeTime } from "@/lib/system";
import { useDashboardActivity } from "@/store/DashboardDataContext";

const visual: Record<
  ActivityStatus,
  { className: string; Icon: typeof ActivityIcon }
> = {
  success: { className: "bg-brand/12 text-brand", Icon: CheckIcon },
  info: { className: "bg-info/12 text-info", Icon: ActivityIcon },
  warning: { className: "bg-warn/12 text-warn", Icon: AlertIcon },
  error: { className: "bg-danger/12 text-danger", Icon: AlertIcon },
};

function ActivityItem({ event, now }: { event: ActivityEvent; now: number }) {
  const item = visual[event.status];
  const Icon = item.Icon;
  return (
    <li className="flex items-start gap-3 rounded-xl px-2 py-2 transition hover:bg-surface-1">
      <span
        className={cn(
          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
          item.className,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-fg">{event.action}</p>
        <p className="truncate text-[11px] text-fg-3">
          {event.detail ? `${event.detail} · ` : ""}
          {event.actor}
        </p>
      </div>
      <span className="shrink-0 text-[11px] text-fg-3 tabular-nums">
        {relativeTime(event.at, now)}
      </span>
    </li>
  );
}

export function RecentActivity() {
  const { events } = useDashboardActivity();
  const now = useNow(10000);

  return (
    <ChartCard
      title="Recent Activity"
      subtitle="Actions recorded in this session"
      className="h-full"
      action={
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-brand">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
          Live
        </span>
      }
    >
      {events.length === 0 ? (
        <p className="text-sm text-fg-3">
          No activity yet. Search, filter or open a product to see events here.
        </p>
      ) : (
        <ul className="scroll-slim flex max-h-[20rem] flex-col gap-0.5 overflow-y-auto pr-1">
          {events.map((event) => (
            <ActivityItem key={event.id} event={event} now={now} />
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
