import { cn } from "@/lib/format";

export interface StockBar {
  label: string;
  inStockPct: number;
  low: number;
  out: number;
}

function barTone(pct: number): string {
  if (pct >= 90) return "bg-brand";
  if (pct >= 70) return "bg-warn";
  return "bg-danger";
}

export function StockProgressList({ items }: { items: StockBar[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="truncate capitalize text-fg-2">{item.label}</span>
            <span className="flex shrink-0 items-center gap-2 text-fg-3">
              {item.low > 0 ? (
                <span className="text-warn">{item.low} low</span>
              ) : null}
              {item.out > 0 ? (
                <span className="text-danger">{item.out} out</span>
              ) : null}
              <span className="font-medium text-fg tabular-nums">
                {item.inStockPct}%
              </span>
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                barTone(item.inStockPct),
              )}
              style={{ width: `${item.inStockPct}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
