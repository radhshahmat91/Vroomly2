"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications, useUnreadCount } from "@/hooks/useNotifications";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Feedback";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: unreadCount } = useUnreadCount();
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-[3px] p-2 text-ink-soft hover:bg-black/5"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {!!unreadCount && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-signal-500 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-md border border-line bg-paper-raised shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-base text-ink">Notifications</p>
            {!!unreadCount && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-xs font-medium text-route-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto thin-scrollbar">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : !notifications?.length ? (
              <p className="px-4 py-8 text-center text-sm text-ink-soft/60">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={n.link || "#"}
                  onClick={() => {
                    if (!n.isRead) markRead.mutate(n._id);
                    setOpen(false);
                  }}
                  className={cn(
                    "block border-b border-line px-4 py-3 text-sm last:border-0 hover:bg-black/[0.03]",
                    !n.isRead && "bg-signal-50"
                  )}
                >
                  <p className="font-medium text-ink">{n.title}</p>
                  <p className="mt-0.5 text-ink-soft/70">{n.message}</p>
                  <p className="mt-1 text-xs text-ink-soft/40">{formatRelativeTime(n.createdAt)}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
