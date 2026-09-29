import { cn } from "@/lib/format";

export function Spinner({
  label = "Loading...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-fg-3",
        className,
      )}
    >
      <span className="h-7 w-7 animate-spin rounded-full border-2 border-line-strong border-t-brand" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
