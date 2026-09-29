import { cn } from "@/lib/format";

export type StockStatus = "in" | "low" | "out";

const MAP: Record<StockStatus, { label: string; pill: string; dot: string }> = {
  in: { label: "In Stock", pill: "bg-brand/10 text-brand", dot: "bg-brand" },
  low: { label: "Low Stock", pill: "bg-warn/10 text-warn", dot: "bg-warn" },
  out: {
    label: "Out of Stock",
    pill: "bg-danger/10 text-danger",
    dot: "bg-danger",
  },
};

export function StatusBadge({ status }: { status: StockStatus }) {
  const entry = MAP[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        entry.pill,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", entry.dot)} />
      {entry.label}
    </span>
  );
}

export function statusFromStock(
  stock: number,
  threshold: number,
): StockStatus {
  if (stock <= 0) return "out";
  if (stock < threshold) return "low";
  return "in";
}
