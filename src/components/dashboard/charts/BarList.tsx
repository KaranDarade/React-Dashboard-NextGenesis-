export interface BarItem {
  label: string;
  value: number;
  display: string;
}

export function BarList({
  items,
  colorFrom = "#22c55e",
  colorTo = "#4ade80",
}: {
  items: BarItem[];
  colorFrom?: string;
  colorTo?: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={item.label} className="group">
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="truncate capitalize text-fg-2">
              {item.label}
            </span>
            <span className="shrink-0 font-medium text-fg tabular-nums">
              {item.display}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(4, (item.value / max) * 100)}%`,
                backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo})`,
                transitionDelay: `${index * 35}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
