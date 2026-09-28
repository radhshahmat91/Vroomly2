import { api } from "../apiClient";
import type { Review } from "@/types";

export async function createReview(payload: { bookingId: string; rating: number; comment?: string }) {
  const { data } = await api.post<{ success: true; review: Review }>("/reviews", payload);
  return data.review;
}

export async function getCarReviews(carId: string) {
  const { data } = await api.get<{ success: true; reviews: Review[] }>(`/cars/${carId}/reviews`);
  return data.reviews;
}

export async function getMyReviews() {
  const { data } = await api.get<{ success: true; reviews: Review[] }>("/reviews/mine");
  return data.reviews;
}

export async function getOwnerReviews() {
  const { data } = await api.get<{ success: true; reviews: Review[] }>("/reviews/owner/mine");
  return data.reviews;
}

export async function replyToReview(id: string, reply: string) {
  const { data } = await api.put<{ success: true; review: Review }>(`/reviews/${id}/reply`, { reply });
  return data.review;
}

export async function deleteReview(id: string) {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
}
