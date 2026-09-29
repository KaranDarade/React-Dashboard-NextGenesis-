import { cn } from "@/lib/format";
import { CONNECTION_LABEL, type ConnectionStatus } from "@/lib/system";

const toneBg: Record<ConnectionStatus, string> = {
  operational: "bg-brand/10 text-brand",
  syncing: "bg-info/10 text-info",
  degraded: "bg-warn/10 text-warn",
  offline: "bg-danger/10 text-danger",
};

const dotTone: Record<ConnectionStatus, string> = {
  operational: "bg-brand",
  syncing: "bg-info",
  degraded: "bg-warn",
  offline: "bg-danger",
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
