"use client";

import { getCarImage } from "@/lib/carImages";

import Link from "next/link";
import Image from "next/image";
import { Car, Clock, CalendarCheck, Wallet, AlertTriangle } from "lucide-react";
import { useOwnerDashboard } from "@/hooks/useOwner";
import { StatBlock } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Feedback";
import { FullPageSpinner } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export default function OwnerOverviewPage() {
  const { data, isLoading } = useOwnerDashboard();

  if (isLoading || !data) return <FullPageSpinner />;

  const { stats, recentBookings, isOwnerApproved } = data;

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Host overview</h1>

      {!isOwnerApproved && (
        <div className="mt-4 flex items-start gap-3 rounded-md border border-caution-500/40 bg-caution-500/10 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#8a5a12]" />
          <div>
            <p className="font-medium text-[#8a5a12]">Your host account is awaiting admin approval</p>
            <p className="mt-0.5 text-sm text-[#8a5a12]/80">
              You can browse the dashboard, but you won&apos;t be able to publish a vehicle listing until an admin
              approves your account.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock label="Vehicles listed" value={String(stats.totalCars)} icon={Car} hint={`${stats.approvedCars} live`} />
        <StatBlock label="Pending requests" value={String(stats.pendingRequests)} icon={Clock} />
        <StatBlock label="Active bookings" value={String(stats.activeBookings)} icon={CalendarCheck} />
        <StatBlock label="Total earnings" value={formatCurrency(stats.totalEarnings)} icon={Wallet} hint={`${stats.paidBookingsCount} paid trips`} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Recent bookings</h2>
        <Link href="/owner/cars/new">
          <Button size="sm" disabled={!isOwnerApproved}>
            Add a vehicle
          </Button>
        </Link>
      </div>

      {!recentBookings.length ? (
        <p className="mt-3 text-sm text-ink-soft/60">No bookings yet.</p>
      ) : (
        <div className="mt-3 divide-y divide-line rounded-md border border-line bg-paper-raised">
          {recentBookings.map((b) => (
            <div key={b._id} className="flex items-center gap-3 px-4 py-3">
              {b.car.images?.[0] && (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-[6px] bg-line">
                  <Image src={b.getCarImage(car.brand, car.model, car.images[0])} alt={b.car.brand} fill sizes="48px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">
                  {b.car.brand} {b.car.model} · {b.renter.name}
                </p>
                <p className="text-xs text-ink-soft/50">
                  {formatDateShort(b.startDate)} – {formatDateShort(b.endDate)}
                </p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
