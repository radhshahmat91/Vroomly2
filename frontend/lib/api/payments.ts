import { api } from "../apiClient";
import type { Booking, Payment } from "@/types";

export async function createPaymentIntent(bookingId: string) {
  const { data } = await api.post<{ success: true; clientSecret: string }>("/payments/create-intent", {
    bookingId,
  });
  return data.clientSecret;
}

export async function confirmPayment(bookingId: string, paymentIntentId: string) {
  const { data } = await api.post<{ success: true; booking: Booking }>("/payments/confirm", {
    bookingId,
    paymentIntentId,
  });
  return data.booking;
}

export async function getMyPayments() {
  const { data } = await api.get<{ success: true; payments: Payment[] }>("/payments/mine");
  return data.payments;
}
