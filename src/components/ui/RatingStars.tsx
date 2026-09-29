const STARS = "★★★★★";

export function RatingStars({
  rating,
  showValue = true,
}: {
  rating: number;
  showValue?: boolean;
}) {
  const safeRating = Number.isFinite(rating) ? rating : 0;
  const rounded = Math.max(0, Math.min(5, Math.round(safeRating)));

  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`Rating ${safeRating.toFixed(1)} out of 5`}
    >
      <span aria-hidden className="text-sm text-warn">
        {STARS.slice(0, rounded)}
        <span className="text-fg-4">{STARS.slice(rounded)}</span>
      </span>
      {showValue ? (
        <span className="text-xs text-fg-3 tabular-nums">
          {safeRating.toFixed(1)}
        </span>
      ) : null}
    </span>
  );
}
