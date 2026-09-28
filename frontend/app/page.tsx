"use client";

import Link from "next/link";
import { ShieldCheck, CreditCard, MessageSquareText, Search, CalendarCheck, KeyRound, Car as CarIcon, Zap, Crown, Bus } from "lucide-react";
import { useCarSearch } from "@/hooks/useCars";
import { CarCard, CarCardSkeleton } from "@/components/cars/CarCard";
import { HeroSearchWidget } from "@/components/cars/SearchWidget";
import { Button } from "@/components/ui/Button";

const CATEGORIES = [
  { label: "Sedans", value: "Sedan", icon: CarIcon },
  { label: "SUVs", value: "SUV", icon: Bus },
  { label: "Electric", value: "Electric", icon: Zap },
  { label: "Luxury", value: "Luxury", icon: Crown },
];

export default function HomePage() {
  const { data, isLoading } = useCarSearch({ sort: "rating", limit: 4 });

  return (
    <div>
      {/* Hero */}
      <section className="vroomly-hero relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-line bg-ink text-white">
        <video
          className="vroomly-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/media/vroomly-hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/media/vroomly-hero.mp4" type="video/mp4" />
        </video>
        <div className="vroomly-hero__veil" aria-hidden="true" />
        <div className="vroomly-hero__grain" aria-hidden="true" />
        <div className="container-page relative z-10 flex min-h-[calc(100svh-4rem)] items-center py-14 lg:py-20">
          <div className="w-full max-w-4xl">
            <div className="vroomly-hero__eyebrow animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                <span className="size-1.5 animate-pulse rounded-full bg-signal-500" /> Local cars. Local hosts.
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.9] tracking-tight text-white animate-fade-up sm:text-7xl lg:text-8xl">
              Rent the right car,
              <br />
              straight from a local host.
            </h1>
            <p className="prose-copy mt-6 max-w-2xl text-base leading-7 text-white/82 animate-fade-up sm:text-lg">
              Vroomly connects renters with everyday car owners — search by city, dates, and the specs that
              matter, then book and pay in a few minutes.
            </p>
            <div className="mt-8 max-w-4xl animate-fade-up">
              <HeroSearchWidget />
            </div>
            <p className="mt-4 text-sm text-white/65 animate-fade-up">
              Have a car sitting idle?{" "}
              <Link href="/register" className="font-medium text-white underline-offset-4 hover:underline">
                List it and start earning
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map(({ label, value, icon: Icon }) => (
            <Link
              key={value}
              href={`/cars?category=${value}`}
              className="group vroomly-lift flex flex-col items-center gap-3 rounded-md border border-line bg-paper-raised px-4 py-6 text-center transition-colors hover:border-ink"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-route-100 text-route-700 group-hover:bg-signal-100 group-hover:text-signal-700">
                <Icon className="size-5" />
              </span>
              <span className="font-display text-base text-ink">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured cars */}
      <section className="container-page py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl text-ink">Top-rated cars</h2>
            <p className="mt-1 text-ink-soft/60">Highly reviewed vehicles ready to book this week.</p>
          </div>
          <Link href="/cars" className="hidden text-sm font-medium text-route-600 hover:underline sm:block">
            Browse all cars
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CarCardSkeleton key={i} />)
            : data?.cars.map((car) => <CarCard key={car._id} car={car} />)}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <Link href="/cars">
            <Button variant="outline">Browse all cars</Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-paper-raised py-16">
        <div className="container-page">
          <h2 className="mb-10 text-center font-display text-3xl text-ink">How renting works</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: Search, title: "Search", copy: "Filter by city, dates, price, seats, fuel type, and transmission until you find the right fit." },
              { icon: CalendarCheck, title: "Request to book", copy: "Send a request for your dates. The host accepts or declines, usually within hours." },
              { icon: KeyRound, title: "Pay & pick up", copy: "Once accepted, pay securely by card and coordinate pickup directly with your host." },
            ].map(({ icon: Icon, title, copy }) => (
              <div key={title} className="text-center sm:text-left">
                <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-signal-100 text-signal-600">
                  <Icon className="size-6" />
                </span>
                <h3 className="font-display text-xl text-ink">{title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container-page py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Reviewed listings", copy: "Every vehicle is checked by our team before it goes live on the marketplace." },
            { icon: CreditCard, title: "Secure payment", copy: "Card payments are processed through Stripe — hosts are only paid out once a trip is confirmed." },
            { icon: MessageSquareText, title: "Real reviews", copy: "Ratings come only from renters who completed an actual trip on the platform." },
          ].map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex gap-4">
              <Icon className="size-6 shrink-0 text-route-600" />
              <div>
                <h3 className="font-display text-lg text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink-soft/70">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Host CTA */}
      <section className="bg-ink py-16 text-white">
        <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl">Turn your parked car into income</h2>
            <p className="mt-2 max-w-lg text-white/70">
              Set your own price and availability. You choose which booking requests to accept.
            </p>
          </div>
          <Link href="/register">
            <Button size="lg">Become a host</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
