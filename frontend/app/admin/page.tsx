"use client";

import { Users, ShieldCheck, Car, CalendarClock, Wallet, MessageSquareWarning, Download } from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdmin";
import { StatBlock, Card } from "@/components/ui/Card";
import { FullPageSpinner } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { formatCurrency, downloadCsv } from "@/lib/utils";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminOverviewPage() {
  const { data, isLoading } = useAdminDashboard();

  if (isLoading || !data) return <FullPageSpinner />;

  const { stats, bookingsByStatus, revenueByMonth } = data;

  function exportReport() {
    downloadCsv(
      `vroomly-revenue-report-${Date.now()}.csv`,
      revenueByMonth.map((r) => ({
        month: `${MONTH_LABELS[r._id.month - 1]} ${r._id.year}`,
        bookings: r.bookings,
        revenue: r.revenue.toFixed(2),
        platform_commission: r.commission.toFixed(2),
      }))
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Platform overview</h1>
        <Button variant="outline" size="sm" onClick={exportReport}>
          <Download className="size-4" /> Export report (CSV)
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock label="Renters" value={String(stats.totalUsers)} icon={Users} />
        <StatBlock label="Hosts" value={String(stats.totalOwners)} icon={ShieldCheck} hint={`${stats.pendingOwners} pending approval`} />
        <StatBlock label="Vehicles" value={String(stats.totalCars)} icon={Car} hint={`${stats.pendingCars} pending review`} />
        <StatBlock label="Bookings" value={String(stats.totalBookings)} icon={CalendarClock} />
        <StatBlock label="Gross revenue" value={formatCurrency(stats.totalRevenue)} icon={Wallet} />
        <StatBlock label="Commission earned" value={formatCurrency(stats.totalCommission)} icon={Wallet} />
        <StatBlock label="Open complaints" value={String(stats.openComplaints)} icon={MessageSquareWarning} />
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-display text-lg text-ink">Revenue by month</h2>
        <div className="mt-4">
          <MonthlyBarChart data={revenueByMonth} dataKey="revenue" color="var(--color-route-500)" label="Revenue" />
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <h2 className="font-display text-lg text-ink">Bookings by status</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {bookingsByStatus.map((s) => (
            <div key={s._id} className="rounded-[3px] bg-black/[0.03] px-3 py-2.5">
              <p className="text-xs capitalize text-ink-soft/60">{s._id}</p>
              <p className="font-display text-xl text-ink">{s.count}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
