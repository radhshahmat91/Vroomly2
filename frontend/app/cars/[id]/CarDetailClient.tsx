"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, Fuel, Gauge, Calendar, ShieldCheck } from "lucide-react";
import { useCar, useSimilarCars } from "@/hooks/useCars";
import { useCarReviews } from "@/hooks/useReviews";
import { Gallery } from "@/components/cars/Gallery";
import { MapView } from "@/components/cars/MapView";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { ReviewList } from "@/components/reviews/ReviewList";
import { RatingStars } from "@/components/ui/RatingStars";
import { CarCard, CarCardSkeleton } from "@/components/cars/CarCard";
import { FullPageSpinner, EmptyState } from "@/components/ui/Feedback";
import { formatDate } from "@/lib/utils";

export function CarDetailClient({ carId }: { carId: string }) {
  const { data: car, isLoading, isError } = useCar(carId);
  const { data: reviews } = useCarReviews(carId);
  const { data: similar, isLoading: similarLoading } = useSimilarCars(carId);

  if (isLoading) return <FullPageSpinner />;
  if (isError || !car) {
    return (
      <div className="container-page py-16">
        <EmptyState title="This listing isn't available" description="It may have been removed by the host." />
      </div>
    );
  }

  const [lng, lat] = car.location.coordinates.coordinates;

  return (
    <div className="container-page py-8">
      <div className="mb-5">
        <p className="text-sm text-ink-soft/50">
          <Link href="/cars" className="hover:underline">
            Browse cars
          </Link>{" "}
          / {car.location.city}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          <h1 className="font-display text-4xl text-ink">{car.title}</h1>
          {car.ratingCount > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-ink-soft/70">
              <RatingStars value={car.ratingAvg} size="md" />
              {car.ratingAvg.toFixed(1)} ({car.ratingCount} review{car.ratingCount === 1 ? "" : "s"})
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <Gallery images={car.images} alt={car.title} brand={car.brand} model={car.model} />

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-6">
            <span className="flex items-center gap-2 text-sm text-ink-soft/80">
              <Users className="size-4 text-ink-soft/40" /> {car.seats} seats
            </span>
            <span className="flex items-center gap-2 text-sm text-ink-soft/80">
              <Fuel className="size-4 text-ink-soft/40" /> {car.fuelType}
            </span>
            <span className="flex items-center gap-2 text-sm text-ink-soft/80">
              <Gauge className="size-4 text-ink-soft/40" /> {car.transmission}
            </span>
            <span className="flex items-center gap-2 text-sm text-ink-soft/80">
              <Calendar className="size-4 text-ink-soft/40" /> {car.year}
            </span>
          </div>

          <div className="border-b border-line py-6">
            <h2 className="font-display text-xl text-ink">About this car</h2>
            <p className="prose-copy mt-2 text-sm text-ink-soft/80">{car.description || "No description provided."}</p>
          </div>

          {car.features.length > 0 && (
            <div className="border-b border-line py-6">
              <h2 className="font-display text-xl text-ink">Features</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {car.features.map((f) => (
                  <span key={f} className="flex items-center gap-1.5 text-sm text-ink-soft/80">
                    <ShieldCheck className="size-3.5 shrink-0 text-route-600" /> {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-b border-line py-6">
            <h2 className="font-display text-xl text-ink">Location</h2>
            <p className="mt-1 text-sm text-ink-soft/70">{car.location.address ? `${car.location.address}, ` : ""}{car.location.city}</p>
            <div className="mt-3">
              <MapView lat={lat} lng={lng} address={car.location.address} city={car.location.city} />
            </div>
          </div>

          <div className="border-b border-line py-6">
            <div className="flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-line">
                {car.owner.avatar && <Image src={car.owner.avatar} alt={car.owner.name} fill sizes="48px" className="object-cover" />}
              </div>
              <div>
                <p className="font-medium text-ink">Hosted by {car.owner.name}</p>
                <p className="text-xs text-ink-soft/50">
                  Member since {car.owner.createdAt ? formatDate(car.owner.createdAt, { year: "numeric", month: "long", day: undefined }) : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="py-6">
            <h2 className="font-display text-xl text-ink">
              Reviews {car.ratingCount > 0 && `(${car.ratingCount})`}
            </h2>
            <div className="mt-4">
              <ReviewList reviews={reviews || []} />
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget car={car} />
        </div>
      </div>

      {(similarLoading || !!similar?.length) && (
        <div className="mt-12 border-t border-line pt-10">
          <h2 className="mb-5 font-display text-2xl text-ink">Similar cars</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similarLoading
              ? Array.from({ length: 3 }).map((_, i) => <CarCardSkeleton key={i} />)
              : similar?.map((c) => <CarCard key={c._id} car={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
