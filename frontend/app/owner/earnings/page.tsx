"use client";

import { useOwnerEarnings } from "@/hooks/useOwner";
import { MonthlyBarChart } from "@/components/charts/MonthlyBarChart";
import { Card, StatBlock } from "@/components/ui/Card";
import { FullPageSpinner, EmptyState } from "@/components/ui/Feedback";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export default function OwnerEarningsPage() {
  const { data, isLoading } = useOwnerEarnings();

  if (isLoading || !data) return <FullPageSpinner />;

  const totalNet = data.transactions.reduce((sum, t) => sum + t.ownerEarning, 0);
  const totalCommission = data.transactions.reduce((sum, t) => sum + t.platformCommission, 0);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Earnings</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatBlock label="Net earnings (all time)" value={formatCurrency(totalNet)} />
        <StatBlock label="Paid trips" value={String(data.transactions.length)} />
        <StatBlock label="Platform commission paid" value={formatCurrency(totalCommission)} />
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-display text-lg text-ink">Monthly earnings</h2>
        <div className="mt-4">
          <MonthlyBarChart data={data.byMonth} dataKey="earnings" />
        </div>
      </Card>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-lg text-ink">Transactions</h2>
        {!data.transactions.length ? (
          <EmptyState title="No paid trips yet" />
        ) : (
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left text-ink-soft/60">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Vehicle</th>
                  <th className="px-4 py-2.5 font-medium">Renter</th>
                  <th className="px-4 py-2.5 font-medium">Dates</th>
                  <th className="px-4 py-2.5 text-right font-medium">Total</th>
                  <th className="px-4 py-2.5 text-right font-medium">Your net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-paper-raised">
                {data.transactions.map((t) => (
                  <tr key={t._id}>
                    <td className="px-4 py-2.5">{t.car.brand} {t.car.model}</td>
                    <td className="px-4 py-2.5">{t.renter.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft/60">
                      {formatDateShort(t.startDate)} – {formatDateShort(t.endDate)}
                    </td>
                    <td className="px-4 py-2.5 text-right">{formatCurrency(t.totalPrice)}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-route-600">{formatCurrency(t.ownerEarning)}</td>
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
