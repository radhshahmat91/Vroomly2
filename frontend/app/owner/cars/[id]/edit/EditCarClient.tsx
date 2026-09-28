"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useCar, useUpdateCar, useSetCarAvailability } from "@/hooks/useCars";
import { CarForm, type CarFormValues } from "@/components/cars/CarForm";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { FullPageSpinner, EmptyState } from "@/components/ui/Feedback";
import { apiErrorMessage } from "@/lib/apiClient";
import { formatDate, toDateInputValue } from "@/lib/utils";
import type { UnavailableRange } from "@/types";

export function EditCarClient({ carId }: { carId: string }) {
  const router = useRouter();
  const { data: car, isLoading } = useCar(carId);
  const updateCar = useUpdateCar(carId);
  const setAvailability = useSetCarAvailability(carId);

  const [blockStart, setBlockStart] = useState("");
  const [blockEnd, setBlockEnd] = useState("");
  const [blockReason, setBlockReason] = useState("");

  if (isLoading) return <FullPageSpinner />;
  if (!car) return <EmptyState title="Listing not found" />;

  async function handleSubmit(values: CarFormValues) {
    try {
      const { city, address, ...rest } = values;
      const { message } = await updateCar.mutateAsync({
        ...rest,
        location: { city, address: address || "" },
      });
      toast.success(message || "Listing updated");
      router.push("/owner/cars");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update this listing"));
    }
  }

  async function addBlock() {
    if (!blockStart || !blockEnd) {
      toast.error("Pick a start and end date");
      return;
    }
    const next: UnavailableRange[] = [
      ...(car!.unavailableDates || []),
      { start: blockStart, end: blockEnd, reason: blockReason || "Unavailable" },
    ];
    try {
      await setAvailability.mutateAsync(next);
      setBlockStart("");
      setBlockEnd("");
      setBlockReason("");
      toast.success("Dates blocked");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update availability"));
    }
  }

  async function removeBlock(index: number) {
    const next = (car!.unavailableDates || []).filter((_, i) => i !== index);
    try {
      await setAvailability.mutateAsync(next);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update availability"));
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Edit vehicle</h1>
        <p className="mt-1 text-sm text-ink-soft/60">Saving changes sends this listing back for admin review.</p>
      </div>

      <CarForm defaultValues={car} onSubmit={handleSubmit} submitLabel="Save changes" isSubmitting={updateCar.isPending} />

      <Card className="p-5">
        <h2 className="font-display text-lg text-ink">Block off dates</h2>
        <p className="mt-1 text-sm text-ink-soft/60">
          Mark dates the car is unavailable for maintenance, personal use, or anything else.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label="From">
            <Input type="date" min={toDateInputValue(new Date())} value={blockStart} onChange={(e) => setBlockStart(e.target.value)} />
          </Field>
          <Field label="To">
            <Input type="date" min={blockStart || toDateInputValue(new Date())} value={blockEnd} onChange={(e) => setBlockEnd(e.target.value)} />
          </Field>
          <Field label="Reason (optional)">
            <Input value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g. Servicing" />
          </Field>
        </div>
        <Button className="mt-3" variant="outline" onClick={addBlock} isLoading={setAvailability.isPending}>
          Add block
        </Button>

        {!!car.unavailableDates?.length && (
          <div className="mt-4 space-y-2">
            {car.unavailableDates.map((block, i) => (
              <div key={i} className="flex items-center justify-between rounded-[3px] bg-black/[0.03] px-3 py-2 text-sm">
                <span>
                  {formatDate(block.start)} – {formatDate(block.end)}
                  {block.reason && <span className="text-ink-soft/50"> · {block.reason}</span>}
                </span>
                <button onClick={() => removeBlock(i)} className="text-ink-soft/50 hover:text-signal-600">
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
