import Image from "next/image";
import type { Review } from "@/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatDate } from "@/lib/utils";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return <p className="text-sm text-ink-soft/60">No reviews yet — be the first to complete a trip and review it.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="border-b border-line pb-6 last:border-0">
          <div className="flex items-start gap-3">
            <div className="relative size-9 shrink-0 overflow-hidden rounded-full bg-line">
              {review.user.avatar && <Image src={review.user.avatar} alt={review.user.name} fill sizes="36px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-ink">{review.user.name}</p>
                <p className="shrink-0 text-xs text-ink-soft/50">{formatDate(review.createdAt)}</p>
              </div>
              <RatingStars value={review.rating} />
              {review.comment && <p className="mt-2 text-sm text-ink-soft/80">{review.comment}</p>}
              {review.ownerReply && (
                <div className="mt-3 rounded-md bg-route-50 px-3 py-2.5">
                  <p className="text-xs font-medium text-route-700">Response from the host</p>
                  <p className="mt-1 text-sm text-ink-soft/80">{review.ownerReply}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
