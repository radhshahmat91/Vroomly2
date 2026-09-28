"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useMyBookings, useCancelBooking } from "@/hooks/useBookings";
import { useMyReviews } from "@/hooks/useReviews";
import { StatusBadge } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { ReviewFormModal } from "@/components/reviews/ReviewForm";
import { formatCurrency, formatDateShort, cn } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";
import type { Booking, BookingStatus } from "@/types";

const TABS: { label: string; value?: BookingStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "Awaiting payment", value: "accepted" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled/Declined", value: "cancelled" },
];

function BookingsContent() {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const [tab, setTab] = useState<BookingStatus | undefined>(undefined);
  const { data: bookings, isLoading } = useMyBookings(tab);
  const { data: myReviews } = useMyReviews();
  const cancelBooking = useCancelBooking();
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);

  const reviewedBookingIds = new Set((myReviews || []).map((r) => r.booking));

  async function handleCancel(id: string) {
    if (!confirm("Cancel this booking?")) return;
    try {
      await cancelBooking.mutateAsync({ id });
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not cancel this booking"));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">My bookings</h1>

      <div className="mt-5 flex gap-1 overflow-x-auto thin-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.value)}
            className={cn(
              "shrink-0 rounded-[3px] px-3 py-1.5 text-sm font-medium",
              tab === t.value ? "bg-ink text-white" : "text-ink-soft/70 hover:bg-black/5"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !bookings?.length ? (
          <EmptyState
            title="No bookings here"
            description="Try a different tab, or browse cars to make your first booking."
            action={
              <Link href="/cars">
                <Button>Browse cars</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b._id}
                className={cn(
                  "rounded-md border bg-paper-raised p-4",
                  highlight === b._id ? "border-signal-500" : "border-line"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-ink">{b.car.brand} {b.car.model}</p>
                    <p className="text-sm text-ink-soft/60">
                      {formatDateShort(b.startDate)} – {formatDateShort(b.endDate)} · {b.totalDays} day
                      {b.totalDays > 1 ? "s" : ""} · hosted by {b.owner.name}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                  <p className="font-medium text-ink">{formatCurrency(b.totalPrice)}</p>
                  <div className="flex flex-wrap gap-2">
                    {b.status === "accepted" && (
                      <Link href={`/booking/${b._id}/payment`}>
                        <Button size="sm">Pay now</Button>
                      </Link>
                    )}
                    {b.status === "completed" && !reviewedBookingIds.has(b._id) && (
                      <Button size="sm" variant="outline" onClick={() => setReviewTarget(b)}>
                        Leave a review
                      </Button>
                    )}
                    {["pending", "accepted", "confirmed"].includes(b.status) && (
                      <Button size="sm" variant="ghost" onClick={() => handleCancel(b._id)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
                {b.status === "rejected" && b.rejectReason && (
                  <p className="mt-2 text-xs text-signal-600">Declined: {b.rejectReason}</p>
                )}
                {b.status === "cancelled" && b.cancelReason && (
                  <p className="mt-2 text-xs text-ink-soft/50">Cancelled: {b.cancelReason}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewFormModal booking={reviewTarget} open={!!reviewTarget} onClose={() => setReviewTarget(null)} />
    </div>
  );
}

export default function BookingsPage() {
  return (
    <Suspense>
      <BookingsContent />
    </Suspense>
  );
}
