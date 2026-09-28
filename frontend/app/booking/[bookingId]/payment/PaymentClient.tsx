"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { CreditCard } from "lucide-react";
import { useBooking } from "@/hooks/useBookings";
import { createPaymentIntent } from "@/lib/api/payments";
import { getStripe } from "@/lib/stripe";
import { StripeCheckoutForm } from "@/components/booking/StripeCheckoutForm";
import { FullPageSpinner, EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";

export function PaymentClient({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const { data: booking, isLoading } = useBooking(bookingId);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!booking || booking.status !== "accepted" || !stripeConfigured) return;
    createPaymentIntent(booking._id)
      .then((secret) => setClientSecret(secret))
      .catch((err) => setError(apiErrorMessage(err, "Could not start the payment")));
  }, [booking, stripeConfigured]);

  if (isLoading) return <FullPageSpinner />;
  if (!booking) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Booking not found" />
      </div>
    );
  }

  if (booking.status !== "accepted") {
    return (
      <div className="container-page py-16">
        <EmptyState
          title={booking.paymentStatus === "paid" ? "This booking is already paid" : "Payment isn't available yet"}
          description={
            booking.paymentStatus === "paid"
              ? "You're all set — check your booking history for details."
              : `This booking is currently ${booking.status}.`
          }
          action={
            <Link href="/dashboard/bookings">
              <Button variant="outline">Go to my bookings</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (!stripeConfigured) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={CreditCard}
          title="Payments aren't configured yet"
          description="Add a Stripe publishable key to frontend/.env.local and a secret key to backend/.env to enable checkout."
        />
      </div>
    );
  }

  return (
    <div className="container-page flex justify-center py-14">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl text-ink">Complete payment</h1>
        <div className="mt-4 rounded-md border border-line bg-paper-raised p-4 text-sm">
          <p className="font-medium text-ink">{booking.car.brand} {booking.car.model}</p>
          <p className="mt-1 text-ink-soft/60">
            {formatDateShort(booking.startDate)} – {formatDateShort(booking.endDate)} · {booking.totalDays} day
            {booking.totalDays > 1 ? "s" : ""}
          </p>
          <p className="mt-2 flex justify-between border-t border-line pt-2 font-medium text-ink">
            <span>Total due</span>
            <span>{formatCurrency(booking.totalPrice)}</span>
          </p>
        </div>

        <div className="mt-6">
          {error ? (
            <p className="text-sm text-signal-600">{error}</p>
          ) : !clientSecret ? (
            <FullPageSpinner />
          ) : (
            <Elements stripe={getStripe()} options={{ clientSecret, appearance: { theme: "stripe" } }}>
              <StripeCheckoutForm bookingId={booking._id} onSuccess={() => router.push(`/booking/${booking._id}/confirmation`)} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
