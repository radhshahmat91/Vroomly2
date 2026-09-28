"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CarForm, type CarFormValues } from "@/components/cars/CarForm";
import { useCreateCar } from "@/hooks/useCars";
import { apiErrorMessage } from "@/lib/apiClient";

export default function NewCarPage() {
  const router = useRouter();
  const createCar = useCreateCar();

  async function handleSubmit(values: CarFormValues) {
    try {
      const { city, address, ...rest } = values;
      // Simplification: pins new listings to Vroomly's Dhaka default center.
      // A production build would geocode `address` via the Google Places
      // Autocomplete API to get real coordinates.
      await createCar.mutateAsync({
        ...rest,
        location: { city, address: address || "", coordinates: { type: "Point", coordinates: [90.4125, 23.8103] } },
      });
      toast.success("Listing submitted for review");
      router.push("/owner/cars");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not create this listing"));
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl text-ink">Add a vehicle</h1>
      <p className="mt-1 text-sm text-ink-soft/60">New listings are reviewed by an admin before they go live.</p>
      <div className="mt-6">
        <CarForm onSubmit={handleSubmit} submitLabel="Submit for review" isSubmitting={createCar.isPending} />
      </div>
    </div>
  );
}
