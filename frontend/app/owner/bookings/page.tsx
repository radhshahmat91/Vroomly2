"use client";

import { getCarImage } from "@/lib/carImages";

import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  useOwnerBookings,
  useAcceptBooking,
  useRejectBooking,
  useCancelBooking,
} from "@/hooks/useBookings";
import { StatusBadge, EmptyState, Spinner } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateShort, cn } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";
import type { BookingStatus } from "@/types";
import { CalendarClock } from "lucide-react";

const TABS: { label: string; value?: BookingStatus }[] = [
  { label: "All" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Completed", value: "completed" },
];

export default function OwnerBookingsPage() {
  const [tab, setTab] = useState<BookingStatus | undefined>("pending");

  const { data: bookings, isLoading } = useOwnerBookings(tab);

  const acceptBooking = useAcceptBooking();
  const rejectBooking = useRejectBooking();
  const cancelBooking = useCancelBooking();

  async function handleAccept(id: string) {
    try {
      await acceptBooking.mutateAsync(id);

      toast.success(
        "Booking accepted — the renter can now pay to confirm"
      );
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not accept this booking"));
    }
  }

  async function handleReject(id: string) {
    const reason = prompt("Reason for declining (optional):") || undefined;

    try {
      await rejectBooking.mutateAsync({ id, reason });

      toast.success("Booking declined");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not decline this booking"));
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this confirmed booking?")) return;

    try {
      await cancelBooking.mutateAsync({
        id,
        reason: "Cancelled by host",
      });

      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not cancel this booking"));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">
        Booking requests
      </h1>

      <div className="mt-5 flex gap-1 overflow-x-auto thin-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.value)}
            className={cn(
              "shrink-0 rounded-[3px] px-3 py-1.5 text-sm font-medium",
              tab === t.value
                ? "bg-ink text-white"
                : "text-ink-soft/70 hover:bg-black/5"
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
            icon={CalendarClock}
            title="No bookings here"
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="rounded-md border border-line bg-paper-raised p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    {b.car.images?.[0] && (
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-[6px] bg-line">
                        <Image
                          src={getCarImage(
                            b.car.brand,
                            b.car.model,
                            b.car.images[0]
                          )}
                          alt={b.car.brand}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <p className="font-display text-lg text-ink">
                        {b.car.brand} {b.car.model}
                      </p>

                      <p className="text-sm text-ink-soft/60">
                        {formatDateShort(b.startDate)} –{" "}
                        {formatDateShort(b.endDate)} · {b.renter.name}
                        {b.renter.phone && ` · ${b.renter.phone}`}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={b.status} />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                  <div className="text-sm">
                    <span className="font-medium text-ink">
                      {formatCurrency(b.totalPrice)}
                    </span>

                    <span className="text-ink-soft/50">
                      {" "}
                      · your earning{" "}
                      {formatCurrency(b.ownerEarning)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {b.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleAccept(b._id)}
                          isLoading={acceptBooking.isPending}
                        >
                          Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReject(b._id)}
                        >
                          Decline
                        </Button>
                      </>
                    )}

                    {["accepted", "confirmed"].includes(b.status) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancel(b._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}