import { StarIcon } from "@/components/shell/icons";
import type { RatingBucket } from "@/lib/stats";

export function RatingHistogram({ buckets }: { buckets: RatingBucket[] }) {
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);

  return (
    <div className="flex h-44 items-end gap-3">
      {buckets.map((bucket) => (
        <div
          key={bucket.rating}
          className="group flex flex-1 flex-col items-center gap-2"
        >
          <span className="text-xs font-medium text-fg-2 tabular-nums">
            {bucket.count}
          </span>
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-brand/80 to-brand-bright/60 transition-all duration-500 group-hover:from-brand group-hover:to-brand-bright"
              style={{
                height: `${(bucket.count / max) * 100}%`,
                minHeight: 6,
              }}
            />
          </div>
          <span className="flex items-center gap-0.5 text-[11px] text-fg-3">
            {bucket.rating}
            <StarIcon className="h-3 w-3 text-warn" />
          </span>
        </div>
      ))}
    </div>
  );
}
