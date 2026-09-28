"use client";

import { ChartCard } from "@/components/dashboard/ChartCard";
import { ActivityIcon, AlertIcon, CheckIcon } from "@/components/shell/icons";
import { useNow } from "@/hooks/useNow";
import type { ActivityEvent, ActivityStatus } from "@/lib/activity";
import { cn } from "@/lib/format";
import { relativeTime } from "@/lib/system";
import { useDashboardActivity } from "@/store/DashboardDataContext";

const statusVisual: Record<
  ActivityStatus,
  { className: string; Icon: typeof ActivityIcon }
> = {
  success: { className: "bg-emerald-100 text-emerald-600", Icon: CheckIcon },
  info: { className: "bg-indigo-100 text-indigo-600", Icon: ActivityIcon },
  warning: { className: "bg-amber-100 text-amber-600", Icon: AlertIcon },
  error: { className: "bg-rose-100 text-rose-600", Icon: AlertIcon },
};

function ActivityItem({
  event,
  now,
}: {
  event: ActivityEvent;
  now: number;
}) {
  const visual = statusVisual[event.status];
  const Icon = visual.Icon;

  return (
    <li className="flex items-start gap-3 rounded-xl px-2 py-2 transition hover:bg-white/50">
      <span
        className={cn(
          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
          visual.className,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink-900">
          {event.action}
        </p>
        <p className="truncate text-[11px] text-ink-500">
          {event.detail ? `${event.detail} · ` : ""}
          {event.actor}
        </p>
      </div>
      <span className="shrink-0 text-[11px] tabular-nums text-ink-500">
        {relativeTime(event.at, now)}
      </span>
    </li>
  );
}

export function ActivityFeed() {
  const { events, clear } = useDashboardActivity();
  const now = useNow(10000);

  return (
    <ChartCard
      title="Live activity"
      subtitle="Actions recorded in this session"
      className="h-full"
      action={
        events.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="text-[11px] font-medium text-ink-500 transition hover:text-ink-900"
          >
            Clear
          </button>
        ) : null
      }
    >
      {events.length === 0 ? (
        <p className="text-sm text-ink-500">
          No activity yet. Search, filter or open a product to see events
          appear here in real time.
        </p>
      ) : (
        <ul className="scroll-slim flex max-h-[22rem] flex-col gap-1 overflow-y-auto pr-1">
          {events.map((event) => (
            <ActivityItem key={event.id} event={event} now={now} />
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
