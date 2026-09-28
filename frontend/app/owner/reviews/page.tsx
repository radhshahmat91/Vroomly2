"use client";

import { getCarImage } from "@/lib/carImages";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useOwnerReviews, useReplyToReview } from "@/hooks/useReviews";
import { RatingStars } from "@/components/ui/RatingStars";
import { Textarea } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { formatDate } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";

export default function OwnerReviewsPage() {
  const { data: reviews, isLoading } = useOwnerReviews();
  const replyToReview = useReplyToReview();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function submitReply(id: string) {
    const reply = drafts[id]?.trim();
    if (!reply) return;
    try {
      await replyToReview.mutateAsync({ id, reply });
      toast.success("Reply posted");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not post your reply"));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Reviews</h1>
      <p className="mt-1 text-sm text-ink-soft/60">Reviews renters have left on your vehicles.</p>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !reviews?.length ? (
          <EmptyState icon={Star} title="No reviews yet" />
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              const car = typeof r.car === "object" ? r.car : null;
              return (
                <div key={r._id} className="rounded-md border border-line bg-paper-raised p-4">
                  <div className="flex gap-3">
                    {car?.images?.[0] && (
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-[6px] bg-line">
                        <Image src={getCarImage(car.brand, car.model, car.images[0])} alt="" fill sizes="48px" className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-ink">
                          {r.user.name} {car && `· ${car.brand} ${car.model}`}
                        </p>
                        <p className="shrink-0 text-xs text-ink-soft/50">{formatDate(r.createdAt)}</p>
                      </div>
                      <RatingStars value={r.rating} />
                      {r.comment && <p className="mt-1.5 text-sm text-ink-soft/70">{r.comment}</p>}
                    </div>
                  </div>

                  {r.ownerReply ? (
                    <div className="mt-3 rounded-md bg-route-50 px-3 py-2.5">
                      <p className="text-xs font-medium text-route-700">Your reply</p>
                      <p className="mt-0.5 text-sm text-ink-soft/70">{r.ownerReply}</p>
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <Textarea
                        placeholder="Write a reply…"
                        rows={2}
                        value={drafts[r._id] || ""}
                        onChange={(e) => setDrafts((d) => ({ ...d, [r._id]: e.target.value }))}
                      />
                      <Button size="sm" onClick={() => submitReply(r._id)} isLoading={replyToReview.isPending}>
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
