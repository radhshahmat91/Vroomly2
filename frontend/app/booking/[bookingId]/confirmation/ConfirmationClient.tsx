"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useBooking } from "@/hooks/useBookings";
import { FullPageSpinner, EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export function ConfirmationClient({ bookingId }: { bookingId: string }) {
  const { data: booking, isLoading } = useBooking(bookingId);

  if (isLoading) return <FullPageSpinner />;
  if (!booking) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Booking not found" />
      </div>
    );
  }

  return (
    <div className="container-page flex flex-col items-center py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-route-100 text-route-600">
        <CheckCircle2 className="size-9" />
      </span>
      <h1 className="mt-5 font-display text-4xl text-ink">Booking confirmed</h1>
      <p className="mt-2 max-w-md text-ink-soft/70">
        {booking.car.brand} {booking.car.model} is reserved for {formatDateShort(booking.startDate)} –{" "}
        {formatDateShort(booking.endDate)}. The host will be in touch about pickup details.
      </p>

      <div className="mt-6 w-full max-w-sm rounded-md border border-line bg-paper-raised p-5 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-ink-soft/60">Total paid</span>
          <span className="font-medium text-ink">{formatCurrency(booking.totalPrice)}</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="text-ink-soft/60">Duration</span>
          <span className="font-medium text-ink">
            {booking.totalDays} day{booking.totalDays > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/dashboard/bookings">
          <Button>View my bookings</Button>
        </Link>
        <Link href="/cars">
          <Button variant="outline">Browse more cars</Button>
        </Link>
      </div>
    </div>
  );
}
