import { cn } from "@/lib/format";

export interface StockBar {
  label: string;
  inStockPct: number;
  low: number;
  out: number;
}

function barTone(pct: number): string {
  if (pct >= 90) return "bg-gradient-to-r from-emerald-400 to-teal-400";
  if (pct >= 70) return "bg-gradient-to-r from-amber-400 to-orange-400";
  return "bg-gradient-to-r from-rose-400 to-pink-400";
}

export function StockProgressList({ items }: { items: StockBar[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="truncate capitalize text-ink-700">
              {item.label}
            </span>
            <span className="flex shrink-0 items-center gap-2 text-ink-500">
              {item.low > 0 ? (
                <span className="text-amber-600">{item.low} low</span>
              ) : null}
              {item.out > 0 ? (
                <span className="text-rose-600">{item.out} out</span>
              ) : null}
              <span className="font-medium tabular-nums text-ink-900">
                {item.inStockPct}%
              </span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/50">
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
