"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminUsers, useBanUser, useUnbanUser } from "@/hooks/useAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/FormControls";
import { Badge } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { formatDate } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const { data: users, isLoading } = useAdminUsers({ role: "user", search: debouncedSearch || undefined });
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

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

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Users</h1>
      <div className="mt-4 max-w-xs">
        <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !users?.length ? (
          <EmptyState title="No matching users" />
        ) : (
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.03] text-left text-ink-soft/60">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Email</th>
                  <th className="px-4 py-2.5 font-medium">Joined</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-paper-raised">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-2.5 font-medium text-ink">{u.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft/70">{u.email}</td>
                    <td className="px-4 py-2.5 text-ink-soft/60">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-2.5">
                      {u.isBanned ? <Badge tone="danger">Suspended</Badge> : <Badge tone="route">Active</Badge>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {u.isBanned ? (
                        <Button size="sm" variant="outline" onClick={() => handleUnban(u._id)}>
                          Reinstate
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => handleBan(u._id)}>
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
