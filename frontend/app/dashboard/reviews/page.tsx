"use client";

import { getCarImage } from "@/lib/carImages";

import Image from "next/image";
import Link from "next/link";
import { useMyReviews } from "@/hooks/useReviews";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { RatingStars } from "@/components/ui/RatingStars";
import { Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function MyReviewsPage() {
  const { data: reviews, isLoading } = useMyReviews();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">My reviews</h1>
      <p className="mt-1 text-sm text-ink-soft/60">Reviews you&apos;ve left after completed trips.</p>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !reviews?.length ? (
          <EmptyState icon={Star} title="No reviews yet" description="Complete a trip to leave your first review." />
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              const car = typeof r.car === "object" ? r.car : null;
              return (
                <div key={r._id} className="flex gap-4 rounded-md border border-line bg-paper-raised p-4">
                  {car?.images?.[0] && (
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-[6px] bg-line">
                      <Image src={getCarImage(car.brand, car.model, car.images[0])} alt={car.brand} fill sizes="64px" className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      {car && (
                        <Link href={`/cars/${car._id}`} className="font-medium text-ink hover:underline">
                          {car.brand} {car.model}
                        </Link>
                      )}
                      <p className="shrink-0 text-xs text-ink-soft/50">{formatDate(r.createdAt)}</p>
                    </div>
                    <RatingStars value={r.rating} />
                    {r.comment && <p className="mt-1.5 text-sm text-ink-soft/70">{r.comment}</p>}
                    {r.ownerReply && (
                      <div className="mt-2 rounded-md bg-route-50 px-3 py-2">
                        <p className="text-xs font-medium text-route-700">Host response</p>
                        <p className="mt-0.5 text-sm text-ink-soft/70">{r.ownerReply}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
