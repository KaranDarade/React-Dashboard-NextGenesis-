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
        "flex flex-col items-center justify-center gap-3 py-12 text-ink-500",
        className,
      )}
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/60 border-t-indigo-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
