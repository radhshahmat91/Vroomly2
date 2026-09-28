"use client";

import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import type { UnavailableRange } from "@/types";
import "./calendar-overrides.css";

export function AvailabilityCalendar({
  unavailable,
  selected,
  onSelect,
}: {
  unavailable: UnavailableRange[];
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledRanges = unavailable.map((r) => ({ from: new Date(r.start), to: new Date(r.end) }));

  return (
    <div className="vroomly-calendar">
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={onSelect}
        disabled={[{ before: today }, ...disabledRanges]}
        numberOfMonths={1}
        showOutsideDays
      />
      {unavailable.length > 0 && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft/50">
          <span className="inline-block size-2.5 rounded-full bg-line-strong" /> Greyed-out dates are already
          booked or blocked by the host
        </p>
      )}
    </div>
  );
}
