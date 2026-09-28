export interface BarItem {
  label: string;
  value: number;
  display: string;
}

export function BarList({ items }: { items: BarItem[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={item.label} className="group">
          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
            <span className="truncate capitalize text-ink-700">
              {item.label}
            </span>
            <span className="shrink-0 font-medium tabular-nums text-ink-900">
              {item.display}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500 group-hover:from-indigo-600 group-hover:to-cyan-500"
              style={{
                width: `${Math.max(4, (item.value / max) * 100)}%`,
                transitionDelay: `${index * 35}ms`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
