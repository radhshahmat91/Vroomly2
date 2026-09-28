"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { carSchema, type CarFormInput } from "@/lib/validators";
import { uploadImages } from "@/lib/api/uploads";
import { apiErrorMessage } from "@/lib/apiClient";
import { Field, Input, Select, Textarea } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import type { Car } from "@/types";

export type CarFormValues = Omit<CarFormInput, "featuresText"> & {
  images: string[];
  features: string[];
};

export function CarForm({
  defaultValues,
  onSubmit,
  submitLabel,
  isSubmitting,
}: {
  defaultValues?: Partial<Car>;
  onSubmit: (values: CarFormValues) => Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
}) {
  const [images, setImages] = useState<string[]>(defaultValues?.images || []);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormInput>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      brand: defaultValues?.brand,
      model: defaultValues?.model,
      year: defaultValues?.year ?? new Date().getFullYear(),
      category: defaultValues?.category ?? "Sedan",
      pricePerDay: defaultValues?.pricePerDay,
      discountWeeklyPercent: defaultValues?.discountWeeklyPercent ?? 0,
      discountMonthlyPercent: defaultValues?.discountMonthlyPercent ?? 0,
      seats: defaultValues?.seats ?? 5,
      fuelType: defaultValues?.fuelType ?? "Petrol",
      transmission: defaultValues?.transmission ?? "Automatic",
      licensePlate: defaultValues?.licensePlate,
      city: defaultValues?.location?.city,
      address: defaultValues?.location?.address,
      description: defaultValues?.description,
      featuresText: defaultValues?.features?.join(", "),
    },
  });

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await uploadImages(files, "cars");
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not upload one or more images"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function submit(values: CarFormInput) {
    if (!images.length) {
      toast.error("Add at least one photo of the vehicle");
      return;
    }
    const { featuresText, ...rest } = values;
    const features = (featuresText || "")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    await onSubmit({ ...rest, images, features });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-ink">Photos</p>
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative size-24 overflow-hidden rounded-[6px] bg-line">
              <Image src={url} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-ink/80 text-white"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-[6px] border border-dashed border-line-strong text-ink-soft/50 hover:border-ink">
            <Upload className="size-5" />
            <span className="text-xs">{uploading ? "Uploading…" : "Add photo"}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Brand" error={errors.brand?.message}>
          <Input {...register("brand")} placeholder="e.g. Toyota" />
        </Field>
        <Field label="Model" error={errors.model?.message}>
          <Input {...register("model")} placeholder="e.g. Corolla Altis" />
        </Field>
        <Field label="Year" error={errors.year?.message}>
          <Input type="number" {...register("year", { valueAsNumber: true })} />
        </Field>
        <Field label="Category" error={errors.category?.message}>
          <Select {...register("category")}>
            {["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Van", "Truck", "Luxury", "Electric"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="License plate" error={errors.licensePlate?.message}>
          <Input {...register("licensePlate")} placeholder="e.g. DHA-1234" />
        </Field>
        <Field label="Seats" error={errors.seats?.message}>
          <Input type="number" {...register("seats", { valueAsNumber: true })} />
        </Field>
        <Field label="Fuel type" error={errors.fuelType?.message}>
          <Select {...register("fuelType")}>
            {["Petrol", "Diesel", "Electric", "Hybrid", "CNG"].map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Transmission" error={errors.transmission?.message}>
          <Select {...register("transmission")}>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price per day (USD)" error={errors.pricePerDay?.message}>
          <Input type="number" step="0.01" {...register("pricePerDay", { valueAsNumber: true })} />
        </Field>
        <Field label="Discount 7+ days (%)" error={errors.discountWeeklyPercent?.message}>
          <Input type="number" {...register("discountWeeklyPercent", { valueAsNumber: true })} />
        </Field>
        <Field label="Discount 30+ days (%)" error={errors.discountMonthlyPercent?.message}>
          <Input type="number" {...register("discountMonthlyPercent", { valueAsNumber: true })} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City" error={errors.city?.message}>
          <Input {...register("city")} placeholder="e.g. Dhaka" />
        </Field>
        <Field label="Street address (optional)">
          <Input {...register("address")} placeholder="e.g. Road 11, Gulshan 2" />
        </Field>
      </div>

      <Field label="Features (comma-separated)">
        <Input {...register("featuresText")} placeholder="Air conditioning, Bluetooth audio, Reverse camera" />
      </Field>

      <Field label="Description">
        <Textarea rows={4} {...register("description")} placeholder="Tell renters about the car's condition, quirks, or anything they should know." />
      </Field>

      <Button type="submit" size="lg" isLoading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
}
