"use client";

import { getCarImage } from "@/lib/carImages";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useAdminCars, useApproveCar, useRejectCar, useAdminDeleteCar } from "@/hooks/useAdmin";
import { Badge, EmptyState, Spinner } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { formatCurrency, cn } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";

const TABS: { label: string; value?: "pending" | "approved" }[] = [
  { label: "Pending review", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "All" },
];

export default function AdminCarsPage() {
  const [tab, setTab] = useState<"pending" | "approved" | undefined>("pending");
  const { data: cars, isLoading } = useAdminCars(tab);
  const approveCar = useApproveCar();
  const rejectCar = useRejectCar();
  const deleteCar = useAdminDeleteCar();

  async function handleApprove(id: string) {
    try {
      await approveCar.mutateAsync(id);
      toast.success("Listing approved");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not approve this listing"));
    }
  }

  async function handleReject(id: string) {
    const reason = prompt("Reason for rejecting this listing:") || undefined;
    try {
      await rejectCar.mutateAsync({ id, reason });
      toast.success("Listing sent back for changes");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not reject this listing"));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Permanently remove this listing?")) return;
    try {
      await deleteCar.mutateAsync(id);
      toast.success("Listing removed");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not remove this listing"));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Vehicle listings</h1>

      <div className="mt-5 flex gap-1">
        {TABS.map((t) => (
          <button
            key={t.label}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-[3px] px-3 py-1.5 text-sm font-medium",
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
        ) : !cars?.length ? (
          <EmptyState title="No listings here" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div key={car._id} className="overflow-hidden rounded-md border border-line bg-paper-raised">
                <div className="relative aspect-[4/3] bg-line">
                  {car.images?.[0] && <Image src={getCarImage(car.brand, car.model, car.images[0])} alt={car.title} fill sizes="33vw" className="object-cover" />}
                  <div className="absolute left-2 top-2">
                    {car.isApproved ? <Badge tone="route">Approved</Badge> : <Badge tone="caution">Pending</Badge>}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-display text-lg text-ink">{car.title}</p>
                  <p className="text-sm text-ink-soft/60">
                    {car.location.city} · {formatCurrency(car.pricePerDay)}/day · {car.licensePlate}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft/50">
                    Hosted by {typeof car.owner === "object" ? car.owner.name : ""}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {!car.isApproved && (
                      <Button size="sm" onClick={() => handleApprove(car._id)} isLoading={approveCar.isPending}>
                        Approve
                      </Button>
                    )}
                    {!car.isApproved && (
                      <Button size="sm" variant="ghost" onClick={() => handleReject(car._id)}>
                        Reject
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(car._id)}>
                      Remove
                    </Button>
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
