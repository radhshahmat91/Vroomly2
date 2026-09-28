"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/FormControls";
import { RatingInput } from "@/components/ui/RatingStars";
import { useCreateReview } from "@/hooks/useReviews";
import { apiErrorMessage } from "@/lib/apiClient";
import type { Booking } from "@/types";

export function ReviewFormModal({
  booking,
  open,
  onClose,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const createReview = useCreateReview();

  if (!booking) return null;

  async function handleSubmit() {
    try {
      await createReview.mutateAsync({ bookingId: booking!._id, rating, comment });
      toast.success("Thanks for the review!");
      setRating(5);
      setComment("");
      onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not submit your review"));
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Review your trip — ${booking.car.brand} ${booking.car.model}`}>
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium text-ink">Your rating</p>
          <RatingInput value={rating} onChange={setRating} />
        </div>
        <Field label="Comment (optional)">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the car, and the host?"
            rows={4}
          />
        </Field>
        <Button className="w-full" onClick={handleSubmit} isLoading={createReview.isPending}>
          Submit review
        </Button>
      </div>
    </Modal>
  );
}
