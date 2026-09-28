"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useCarSearch } from "@/hooks/useCars";
import { CarCard, CarCardSkeleton } from "@/components/cars/CarCard";
import { FilterSidebar, SortSelect } from "@/components/cars/FilterSidebar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/Feedback";
import type { CarSearchFilters } from "@/lib/api/cars";

function SearchResults() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<CarSearchFilters>({
    city: searchParams.get("city") || undefined,
    category: searchParams.get("category") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    page: 1,
    limit: 12,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading, isFetching } = useCarSearch(filters);

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Browse cars</h1>
          <p className="mt-1 text-sm text-ink-soft/60">
            {isLoading ? "Searching…" : `${data?.total ?? 0} car${data?.total === 1 ? "" : "s"} found`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SortSelect value={filters.sort} onChange={(sort) => setFilters((f) => ({ ...f, sort, page: 1 }))} />
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 rounded-[3px] border border-line-strong px-3 py-2.5 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filters
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={setFilters} />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileFiltersOpen(false)} />
            <div className="relative ml-auto h-full w-80 max-w-[85vw] overflow-y-auto bg-paper p-5">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mb-4 flex items-center gap-1 text-sm font-medium text-ink-soft"
              >
                <X className="size-4" /> Close
              </button>
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </div>
        )}

        <div>
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          ) : !data?.cars.length ? (
            <EmptyState
              title="No cars match those filters"
              description="Try widening your price range or clearing a filter or two."
            />
          ) : (
            <div className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
              {data.cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}

          {data && (
            <Pagination page={data.page} pages={data.pages} onChange={(page) => setFilters((f) => ({ ...f, page }))} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function CarsSearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
