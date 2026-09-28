import { cn } from "@/lib/format";
import { CONNECTION_LABEL, type ConnectionStatus } from "@/lib/system";

const toneBg: Record<ConnectionStatus, string> = {
  operational: "bg-emerald-50 text-emerald-700",
  syncing: "bg-sky-50 text-sky-700",
  degraded: "bg-amber-50 text-amber-700",
  offline: "bg-rose-50 text-rose-700",
};

const dotTone: Record<ConnectionStatus, string> = {
  operational: "bg-emerald-500",
  syncing: "bg-sky-500",
  degraded: "bg-amber-500",
  offline: "bg-rose-500",
};

export function ConnectionBadge({
  connection,
}: {
  connection: ConnectionStatus;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-medium",
        toneBg[connection],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          dotTone[connection],
          connection !== "offline" && "animate-pulse",
        )}
      />
      {CONNECTION_LABEL[connection]}
    </span>
  );
}
