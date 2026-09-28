import Link from "next/link";
import Image from "next/image";
import { Users, Fuel, Gauge, MapPin } from "lucide-react";
import type { Car } from "@/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatCurrency } from "@/lib/utils";
import { getCarImage } from "@/lib/carImages";

export function CarCard({ car }: { car: Car }) {
  return (
    <Link
      href={`/cars/${car._id}`}
      className="group block overflow-hidden rounded-[var(--radius-photo)] border border-line bg-paper-raised transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
        {getCarImage(car.brand, car.model, car.images?.[0]) && (
          <Image
            src={getCarImage(car.brand, car.model, car.images?.[0])}
            alt={car.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-[3px] bg-ink/85 px-2 py-1 text-xs font-medium text-white">
          {car.category}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight text-ink">{car.title}</h3>
          {car.ratingCount > 0 && (
            <div className="flex shrink-0 items-center gap-1 pt-0.5 text-xs text-ink-soft/70">
              <RatingStars value={car.ratingAvg} />
              <span>({car.ratingCount})</span>
            </div>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft/60">
          <MapPin className="size-3.5" />
          {car.location.city}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-soft/70">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {car.seats} seats
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="size-3.5" /> {car.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="size-3.5" /> {car.transmission}
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
          <p>
            <span className="font-display text-xl text-ink">{formatCurrency(car.pricePerDay)}</span>
            <span className="text-sm text-ink-soft/60"> / day</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-photo)] border border-line bg-paper-raised">
      <div className="aspect-[4/3] w-full animate-pulse bg-line" />
      <div className="space-y-2 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-line" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-line" />
        <div className="h-8 w-full animate-pulse rounded bg-line" />
      </div>
    </div>
  );
}
