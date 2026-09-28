"use client";

import { getCarImage } from "@/lib/carImages";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Car as CarIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMyCars, useDeleteCar } from "@/hooks/useCars";
import { Badge, EmptyState, Spinner } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";

export default function OwnerCarsPage() {
  const { user } = useAuth();
  const { data: cars, isLoading } = useMyCars();
  const deleteCar = useDeleteCar();

  async function handleDelete(id: string) {
    if (!confirm("Remove this listing? This can't be undone.")) return;
    try {
      await deleteCar.mutateAsync(id);
      toast.success("Listing removed");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not remove this listing"));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">My vehicles</h1>
        <Link href="/owner/cars/new">
          <Button disabled={!user?.isOwnerApproved}>
            <Plus className="size-4" /> Add vehicle
          </Button>
        </Link>
      </div>

      {!user?.isOwnerApproved && (
        <p className="mt-3 text-sm text-[#8a5a12]">Your host account needs admin approval before you can add a vehicle.</p>
      )}

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !cars?.length ? (
          <EmptyState icon={CarIcon} title="No vehicles listed yet" description="Add your first car to start receiving booking requests." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div key={car._id} className="overflow-hidden rounded-md border border-line bg-paper-raised">
                <div className="relative aspect-[4/3] bg-line">
                  {car.images?.[0] && <Image src={getCarImage(car.brand, car.model, car.images[0])} alt={car.title} fill sizes="33vw" className="object-cover" />}
                  <div className="absolute left-2 top-2 flex gap-1.5">
                    {car.isApproved ? (
                      <Badge tone="route">Live</Badge>
                    ) : car.rejectionReason ? (
                      <Badge tone="danger">Needs changes</Badge>
                    ) : (
                      <Badge tone="caution">Pending review</Badge>
                    )}
                    {!car.isActive && <Badge tone="neutral">Deactivated</Badge>}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-display text-lg text-ink">{car.title}</p>
                  <p className="text-sm text-ink-soft/60">{car.location.city} · {formatCurrency(car.pricePerDay)}/day</p>
                  {car.rejectionReason && <p className="mt-1 text-xs text-signal-600">{car.rejectionReason}</p>}
                  <div className="mt-3 flex gap-2">
                    <Link href={`/owner/cars/${car._id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(car._id)}>
                      <Trash2 className="size-3.5" />
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
