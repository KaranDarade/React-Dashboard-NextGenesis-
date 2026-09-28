import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatDate } from "@/lib/format";
import type { Review } from "@/types/product";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-ink-500">No reviews yet for this product.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {reviews.map((review, index) => (
        <li
          key={`${review.reviewerEmail}-${index}`}
          className="glass-2 rounded-2xl p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-ink-900">
              {review.reviewerName}
            </span>
            <RatingStars rating={review.rating} showValue={false} />
          </div>
          {review.comment ? (
            <p className="mt-2 text-sm text-ink-600">{review.comment}</p>
          ) : null}
          <div className="mt-3">
            <Badge tone="neutral">{formatDate(review.date)}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
