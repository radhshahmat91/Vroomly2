"use client";

import { useState } from "react";
import { useAdminBookings } from "@/hooks/useAdmin";
import { StatusBadge, EmptyState, Spinner } from "@/components/ui/Feedback";
import { Select } from "@/components/ui/FormControls";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import type { BookingStatus } from "@/types";

export default function AdminBookingsPage() {
  const [status, setStatus] = useState<BookingStatus | "">("");
  const { data: bookings, isLoading } = useAdminBookings(status || undefined);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Bookings</h1>
        <Select className="w-auto" value={status} onChange={(e) => setStatus(e.target.value as BookingStatus | "")}>
          <option value="">All statuses</option>
          {["pending", "accepted", "confirmed", "completed", "rejected", "cancelled"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !bookings?.length ? (
          <EmptyState title="No bookings found" />
        ) : (
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left text-ink-soft/60">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Vehicle</th>
                  <th className="px-4 py-2.5 font-medium">Renter</th>
                  <th className="px-4 py-2.5 font-medium">Host</th>
                  <th className="px-4 py-2.5 font-medium">Dates</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-paper-raised">
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="px-4 py-2.5">{b.car.brand} {b.car.model}</td>
                    <td className="px-4 py-2.5 text-ink-soft/70">{b.renter.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft/70">{b.owner.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft/60">
                      {formatDateShort(b.startDate)} – {formatDateShort(b.endDate)}
                    </td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(b.totalPrice)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
