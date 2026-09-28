"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toDateInputValue } from "@/lib/utils";

export function HeroSearchWidget() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const today = toDateInputValue(new Date());

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    router.push(`/cars${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="grid gap-3 rounded-md border border-line bg-paper-raised p-3 shadow-lg sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:p-2"
    >
      <label className="flex items-center gap-2 rounded-[3px] px-3 py-2.5 sm:border-r sm:border-line">
        <MapPin className="size-4 shrink-0 text-ink-soft/40" />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Where to? e.g. Dhaka"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/40"
        />
      </label>
      <label className="flex items-center gap-2 rounded-[3px] px-3 py-2.5 sm:border-r sm:border-line">
        <Calendar className="size-4 shrink-0 text-ink-soft/40" />
        <input
          type="date"
          min={today}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          aria-label="Start date"
        />
      </label>
      <label className="flex items-center gap-2 rounded-[3px] px-3 py-2.5">
        <Calendar className="size-4 shrink-0 text-ink-soft/40" />
        <input
          type="date"
          min={startDate || today}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
          aria-label="End date"
        />
      </label>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <Search className="size-4" />
        Search
      </Button>
    </form>
  );
}
