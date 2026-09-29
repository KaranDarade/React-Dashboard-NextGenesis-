import { StoreFlowMark } from "@/components/shell/icons";
import { cn } from "@/lib/format";

export function Logo({ className }: { className?: string }) {
  return (
    <StoreFlowMark className={cn("h-9 w-9 shrink-0", className)} />
  );
}

export function Wordmark({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  if (collapsed) return null;
  return (
    <div className="min-w-0 leading-tight">
      <p className="truncate text-[15px] font-semibold tracking-tight text-fg">
        StoreFlow
      </p>
      <p className="truncate text-[11px] text-fg-3">Product Management</p>
    </div>
  );
}
