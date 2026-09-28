"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAdminComplaints, useUpdateComplaint } from "@/hooks/useAdmin";
import { StatusBadge, EmptyState, Spinner } from "@/components/ui/Feedback";
import { Textarea, Select } from "@/components/ui/FormControls";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { apiErrorMessage } from "@/lib/apiClient";
import type { ComplaintStatus } from "@/types";

export default function AdminComplaintsPage() {
  const { data: complaints, isLoading } = useAdminComplaints();
  const updateComplaint = useUpdateComplaint();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function handleUpdate(id: string, status?: ComplaintStatus, adminResponse?: string) {
    try {
      await updateComplaint.mutateAsync({ id, status, adminResponse });
      toast.success("Complaint updated");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not update this complaint"));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Complaints</h1>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !complaints?.length ? (
          <EmptyState title="No complaints filed" />
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c._id} className="rounded-md border border-line bg-paper-raised p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">{c.subject}</p>
                    <p className="text-xs text-ink-soft/50">
                      {c.raisedBy.name} ({c.raisedBy.role}) · {formatDate(c.createdAt)}
                      {c.booking?.car && ` · re: ${c.booking.car.brand} ${c.booking.car.model}`}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-2 text-sm text-ink-soft/80">{c.message}</p>

                {c.adminResponse && (
                  <div className="mt-3 rounded-md bg-route-50 px-3 py-2.5">
                    <p className="text-xs font-medium text-route-700">Admin response</p>
                    <p className="mt-0.5 text-sm text-ink-soft/70">{c.adminResponse}</p>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-line pt-3">
                  <div className="flex-1">
                    <Textarea
                      rows={2}
                      placeholder="Write a response…"
                      value={drafts[c._id] ?? c.adminResponse ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [c._id]: e.target.value }))}
                    />
                  </div>
                  <Select
                    className="w-auto"
                    defaultValue={c.status}
                    onChange={(e) => handleUpdate(c._id, e.target.value as ComplaintStatus)}
                  >
                    {["open", "in_review", "resolved", "dismissed"].map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </Select>
                  <Button size="sm" onClick={() => handleUpdate(c._id, undefined, drafts[c._id])}>
                    Save response
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
