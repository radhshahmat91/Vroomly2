"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useCarAvailability } from "@/hooks/useCars";
import { useCreateBooking } from "@/hooks/useBookings";
import { AvailabilityCalendar } from "../cars/AvailabilityCalendar";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Feedback";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { estimateBookingPrice } from "@/lib/pricing";
import { apiErrorMessage } from "@/lib/apiClient";
import type { Car } from "@/types";

export function BookingWidget({ car }: { car: Car }) {
  const { user } = useAuth();
  const router = useRouter();
  const { data: unavailable, isLoading } = useCarAvailability(car._id);
  const createBooking = useCreateBooking();
  const [range, setRange] = useState<DateRange | undefined>();

  const isOwnCar = user?._id === car.owner._id;
  const estimate =
    range?.from && range?.to
      ? estimateBookingPrice({
          pricePerDay: car.pricePerDay,
          startDate: range.from,
          endDate: range.to,
          discountWeeklyPercent: car.discountWeeklyPercent,
          discountMonthlyPercent: car.discountMonthlyPercent,
        })
      : null;

  async function handleRequest() {
    if (!user) {
      router.push(`/login?next=/cars/${car._id}`);
      return;
    }
    if (!range?.from || !range?.to) {
      toast.error("Pick your pickup and return dates first");
      return;
    }
    try {
      const booking = await createBooking.mutateAsync({
        carId: car._id,
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
      });
      toast.success("Request sent! We'll notify you once the host responds.");
      router.push(`/dashboard/bookings?highlight=${booking._id}`);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not send that booking request"));
    }
  }

  return (
    <div className="rounded-md border border-line bg-paper-raised p-5">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="font-display text-2xl text-ink">{formatCurrency(car.pricePerDay)}</span>
          <span className="text-sm text-ink-soft/60"> / day</span>
        </p>
        {(car.discountWeeklyPercent > 0 || car.discountMonthlyPercent > 0) && (
          <p className="text-xs text-route-600">
            {car.discountWeeklyPercent > 0 && `${car.discountWeeklyPercent}% off 7+ days`}
            {car.discountWeeklyPercent > 0 && car.discountMonthlyPercent > 0 && " · "}
            {car.discountMonthlyPercent > 0 && `${car.discountMonthlyPercent}% off 30+ days`}
          </p>
        )}
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <AvailabilityCalendar unavailable={unavailable || []} selected={range} onSelect={setRange} />
        )}
      </div>

      {estimate && (
        <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-ink-soft/70">
            <span>
              {formatCurrency(car.pricePerDay)} × {estimate.totalDays} day{estimate.totalDays > 1 ? "s" : ""}
            </span>
            <span>{formatCurrency(estimate.subtotal)}</span>
          </div>
          {estimate.discountAmount > 0 && (
            <div className="flex justify-between text-route-600">
              <span>{estimate.discountPercent}% multi-day discount</span>
              <span>-{formatCurrency(estimate.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-1.5 font-medium text-ink">
            <span>Total</span>
            <span>{formatCurrency(estimate.totalPrice)}</span>
          </div>
          <p className="pt-0.5 text-xs text-ink-soft/50">
            {formatDateShort(range!.from!)} – {formatDateShort(range!.to!)} · charged only after the host accepts
          </p>
        </div>
      )}

      <Button
        className="mt-4 w-full"
        size="lg"
        onClick={handleRequest}
        isLoading={createBooking.isPending}
        disabled={isOwnCar || !car.isActive}
      >
        {isOwnCar ? "This is your listing" : "Request to book"}
      </Button>
      {!user && <p className="mt-2 text-center text-xs text-ink-soft/50">You&apos;ll need to log in first</p>}
    </div>
  );
}
