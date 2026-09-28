import type { RatingBucket } from "@/lib/stats";

function StarGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-amber-400" aria-hidden>
      <path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8L6.7 20l1-6L3.4 9.9 9.4 9 12 3.5Z" />
    </svg>
  );
}

export function RatingHistogram({ buckets }: { buckets: RatingBucket[] }) {
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);

  return (
    <div className="flex h-44 items-end gap-3">
      {buckets.map((bucket) => (
        <div
          key={bucket.rating}
          className="group flex flex-1 flex-col items-center gap-2"
        >
          <span className="text-xs font-medium tabular-nums text-ink-700">
            {bucket.count}
          </span>
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500/85 to-cyan-400/75 transition-all duration-500 group-hover:from-indigo-600 group-hover:to-cyan-500"
              style={{
                height: `${(bucket.count / max) * 100}%`,
                minHeight: 6,
              }}
            />
          </div>
          <span className="flex items-center gap-0.5 text-[11px] text-ink-500">
            {bucket.rating}
            <StarGlyph />
          </span>
        </div>
      ))}
    </div>
  );
}
