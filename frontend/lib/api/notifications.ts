import { api } from "../apiClient";
import type { AppNotification } from "@/types";

export async function getMyNotifications() {
  const { data } = await api.get<{ success: true; notifications: AppNotification[] }>("/notifications");
  return data.notifications;
}

export async function getUnreadCount() {
  const { data } = await api.get<{ success: true; count: number }>("/notifications/unread-count");
  return data.count;
}

export async function markNotificationRead(id: string) {
  const { data } = await api.put<{ success: true; notification: AppNotification }>(`/notifications/${id}/read`);
  return data.notification;
}

export async function markAllNotificationsRead() {
  const { data } = await api.put("/notifications/read-all");
  return data;
}
