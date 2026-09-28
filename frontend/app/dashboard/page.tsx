"use client";

import Link from "next/link";
import { CalendarClock, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMyBookings } from "@/hooks/useBookings";
import { StatBlock } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Feedback";
import { Spinner } from "@/components/ui/Feedback";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { data: bookings, isLoading } = useMyBookings();

  const upcoming = bookings?.filter((b) => ["accepted", "confirmed"].includes(b.status)).length ?? 0;
  const pending = bookings?.filter((b) => b.status === "pending").length ?? 0;
  const completed = bookings?.filter((b) => b.status === "completed").length ?? 0;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Welcome back, {user?.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-ink-soft/60">Here&apos;s what&apos;s happening with your bookings.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatBlock label="Upcoming trips" value={String(upcoming)} icon={CalendarClock} />
        <StatBlock label="Awaiting host response" value={String(pending)} icon={Clock} />
        <StatBlock label="Trips completed" value={String(completed)} icon={CheckCircle2} />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink">Recent bookings</h2>
          <Link href="/dashboard/bookings" className="text-sm font-medium text-route-600 hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : !bookings?.length ? (
          <p className="text-sm text-ink-soft/60">
            No bookings yet —{" "}
            <Link href="/cars" className="text-route-600 hover:underline">
              browse cars
            </Link>{" "}
            to get started.
          </p>
        ) : (
          <div className="divide-y divide-line rounded-md border border-line bg-paper-raised">
            {bookings.slice(0, 5).map((b) => (
              <div key={b._id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-ink">{b.car.brand} {b.car.model}</p>
                  <p className="text-xs text-ink-soft/50">
                    {formatDateShort(b.startDate)} – {formatDateShort(b.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-ink-soft/70">{formatCurrency(b.totalPrice)}</span>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
