"use client";

import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { confirmPayment } from "@/lib/api/payments";
import { apiErrorMessage } from "@/lib/apiClient";

export function StripeCheckoutForm({
  bookingId,
  onSuccess,
}: {
  bookingId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        await confirmPayment(bookingId, paymentIntent.id);
        onSuccess();
      } else {
        toast.info("Payment is processing — this can take a moment to confirm.");
      }
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not confirm the payment on our end"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      <Button type="submit" className="w-full" size="lg" isLoading={submitting} disabled={!stripe}>
        Pay now
      </Button>
      <p className="text-center text-xs text-ink-soft/40">
        Test mode — use card number 4242 4242 4242 4242, any future expiry, any CVC.
      </p>
    </form>
  );
}
