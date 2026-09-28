"use client";

import { toast } from "sonner";
import { useAdminUsers, useApproveOwner, useRejectOwner, useBanUser, useUnbanUser } from "@/hooks/useAdmin";
import { Badge, EmptyState, Spinner } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";

export default function AdminOwnersPage() {
  const { data: owners, isLoading } = useAdminUsers({ role: "owner" });
  const approveOwner = useApproveOwner();
  const rejectOwner = useRejectOwner();
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

  async function handleApprove(id: string) {
    try {
      await approveOwner.mutateAsync(id);
      toast.success("Host approved");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not approve this host"));
    }
  }

  async function handleReject(id: string) {
    const reason = prompt("Reason for rejecting this application:") || undefined;
    try {
      await rejectOwner.mutateAsync({ id, reason });
      toast.success("Host application rejected");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not reject this application"));
    }
  }

  async function handleBan(id: string) {
    const reason = prompt("Reason for suspending this account:") || undefined;
    try {
      await banUser.mutateAsync({ id, reason });
      toast.success("Account suspended");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not suspend this account"));
    }
  }

  async function handleUnban(id: string) {
    try {
      await unbanUser.mutateAsync(id);
      toast.success("Account reinstated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not reinstate this account"));
    }
  }

  const pending = owners?.filter((o) => !o.isOwnerApproved && !o.isBanned) || [];
  const active = owners?.filter((o) => o.isOwnerApproved || o.isBanned) || [];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Vehicle owners</h1>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-lg text-ink">Pending approval ({pending.length})</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : !pending.length ? (
          <p className="text-sm text-ink-soft/60">No pending applications.</p>
        ) : (
          <div className="space-y-2">
            {pending.map((o) => (
              <div key={o._id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-paper-raised p-4">
                <div>
                  <p className="font-medium text-ink">{o.name}</p>
                  <p className="text-sm text-ink-soft/60">{o.email} · applied {formatDate(o.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(o._id)} isLoading={approveOwner.isPending}>
                    Approve
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleReject(o._id)}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-display text-lg text-ink">All hosts</h2>
        {!active.length ? (
          <EmptyState title="No approved hosts yet" />
        ) : (
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left text-ink-soft/60">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Email</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-paper-raised">
                {active.map((o) => (
                  <tr key={o._id}>
                    <td className="px-4 py-2.5 font-medium text-ink">{o.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft/70">{o.email}</td>
                    <td className="px-4 py-2.5">
                      {o.isBanned ? <Badge tone="danger">Suspended</Badge> : <Badge tone="route">Approved</Badge>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {o.isBanned ? (
                        <Button size="sm" variant="outline" onClick={() => handleUnban(o._id)}>
                          Reinstate
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => handleBan(o._id)}>
                          Suspend
                        </Button>
                      )}
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
