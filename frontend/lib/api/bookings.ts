import { api } from "../apiClient";
import type { Booking, BookingStatus } from "@/types";

export async function createBooking(payload: { carId: string; startDate: string; endDate: string }) {
  const { data } = await api.post<{ success: true; booking: Booking }>("/bookings", payload);
  return data.booking;
}

export async function getMyBookings(status?: BookingStatus) {
  const { data } = await api.get<{ success: true; bookings: Booking[] }>("/bookings/mine", {
    params: status ? { status } : undefined,
  });
  return data.bookings;
}

export async function getOwnerBookings(status?: BookingStatus) {
  const { data } = await api.get<{ success: true; bookings: Booking[] }>("/bookings/owner/requests", {
    params: status ? { status } : undefined,
  });
  return data.bookings;
}

export async function getBooking(id: string) {
  const { data } = await api.get<{ success: true; booking: Booking }>(`/bookings/${id}`);
  return data.booking;
}

export async function acceptBooking(id: string) {
  const { data } = await api.put<{ success: true; booking: Booking }>(`/bookings/${id}/accept`);
  return data.booking;
}

export async function rejectBooking(id: string, reason?: string) {
  const { data } = await api.put<{ success: true; booking: Booking }>(`/bookings/${id}/reject`, { reason });
  return data.booking;
}

export async function cancelBooking(id: string, reason?: string) {
  const { data } = await api.put<{ success: true; booking: Booking }>(`/bookings/${id}/cancel`, { reason });
  return data.booking;
}
