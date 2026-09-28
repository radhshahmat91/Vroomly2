"use client";

import { useAdminPayments } from "@/hooks/useAdmin";
import { StatusBadge, EmptyState, Spinner } from "@/components/ui/Feedback";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const { data: payments, isLoading } = useAdminPayments();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Payments</h1>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !payments?.length ? (
          <EmptyState title="No payments yet" />
        ) : (
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left text-ink-soft/60">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Vehicle</th>
                  <th className="px-4 py-2.5 font-medium">Payer</th>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Stripe reference</th>
                  <th className="px-4 py-2.5 text-right font-medium">Amount</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-paper-raised">
                {payments.map((p) => {
                  const booking = typeof p.booking === "object" ? p.booking : null;
                  return (
                    <tr key={p._id}>
                      <td className="px-4 py-2.5">
                        {booking && typeof booking.car === "object" ? `${booking.car.brand} ${booking.car.model}` : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft/70">
                        {typeof p.user === "object" ? p.user.name : ""}
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft/60">{formatDateTime(p.createdAt)}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-ink-soft/50">{p.stripePaymentIntentId}</td>
                      <td className="px-4 py-2.5 text-right">{formatCurrency(p.amount, p.currency?.toUpperCase())}</td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
