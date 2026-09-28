"use client";

import Link from "next/link";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/hooks/useNotifications";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { Bell } from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Notifications</h1>
        {!!notifications?.some((n) => !n.isRead) && (
          <Button variant="ghost" size="sm" onClick={() => markAllRead.mutate()}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : !notifications?.length ? (
          <EmptyState icon={Bell} title="No notifications yet" description="Booking updates will show up here." />
        ) : (
          <div className="divide-y divide-line rounded-md border border-line bg-paper-raised">
            {notifications.map((n) => (
              <Link
                key={n._id}
                href={n.link || "#"}
                onClick={() => !n.isRead && markRead.mutate(n._id)}
                className={cn("block px-4 py-3.5 hover:bg-black/[0.03]", !n.isRead && "bg-signal-50")}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-ink">{n.title}</p>
                  <p className="shrink-0 text-xs text-ink-soft/40">{formatDateTime(n.createdAt)}</p>
                </div>
                <p className="mt-0.5 text-sm text-ink-soft/70">{n.message}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
