"use client";

import { RotateCcw } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/FormControls";
import type { CarSearchFilters } from "@/lib/api/cars";

const BRANDS = [
  "Toyota", "Honda", "Hyundai", "BMW", "Mercedes-Benz", "Tesla", "Nissan",
  "Mitsubishi", "Suzuki", "Kia",
];

export function FilterSidebar({
  filters,
  onChange,
}: {
  filters: CarSearchFilters;
  onChange: (next: CarSearchFilters) => void;
}) {
  const set = <K extends keyof CarSearchFilters>(key: K, value: CarSearchFilters[K]) =>
    onChange({ ...filters, [key]: value, page: 1 });

  return (
    <aside className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg text-ink">Filters</p>
        <button
          onClick={() => onChange({ sort: filters.sort })}
          className="flex items-center gap-1 text-xs font-medium text-ink-soft/60 hover:text-ink"
        >
          <RotateCcw className="size-3" /> Reset
        </button>
      </div>

      <Field label="City">
        <Input
          placeholder="e.g. Dhaka"
          value={filters.city || ""}
          onChange={(e) => set("city", e.target.value)}
        />
      </Field>

      <Field label="Brand">
        <Select value={filters.brand || ""} onChange={(e) => set("brand", e.target.value || undefined)}>
          <option value="">Any brand</option>
          {BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Price per day (USD)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
          <span className="text-ink-soft/40">–</span>
          <Input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </Field>

      <Field label="Minimum seats">
        <Select value={filters.seats ?? ""} onChange={(e) => set("seats", e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">Any</option>
          {[2, 4, 5, 7, 12].map((s) => (
            <option key={s} value={s}>
              {s}+ seats
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Fuel type">
        <Select value={filters.fuelType || ""} onChange={(e) => set("fuelType", e.target.value || undefined)}>
          <option value="">Any</option>
          {["Petrol", "Diesel", "Electric", "Hybrid", "CNG"].map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Transmission">
        <Select value={filters.transmission || ""} onChange={(e) => set("transmission", e.target.value || undefined)}>
          <option value="">Any</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </Select>
      </Field>

      <Field label="Category">
        <Select value={filters.category || ""} onChange={(e) => set("category", e.target.value || undefined)}>
          <option value="">Any</option>
          {["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Van", "Truck", "Luxury", "Electric"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
    </aside>
  );
}

export function SortSelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <Select value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-auto">
      <option value="">Sort: Recommended</option>
      <option value="price_asc">Price: Low to high</option>
      <option value="price_desc">Price: High to low</option>
      <option value="rating">Highest rated</option>
      <option value="newest">Newest listings</option>
    </Select>
  );
}
