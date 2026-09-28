import { api } from "../apiClient";
import type { Booking } from "@/types";

export interface OwnerStats {
  totalCars: number;
  approvedCars: number;
  pendingRequests: number;
  activeBookings: number;
  totalEarnings: number;
  paidBookingsCount: number;
}

export async function getOwnerDashboard() {
  const { data } = await api.get<{
    success: true;
    stats: OwnerStats;
    recentBookings: Booking[];
    isOwnerApproved: boolean;
  }>("/owner/dashboard");
  return data;
}

export interface EarningsByMonth {
  _id: { year: number; month: number };
  earnings: number;
  commission: number;
  bookings: number;
}

export async function getOwnerEarnings() {
  const { data } = await api.get<{ success: true; byMonth: EarningsByMonth[]; transactions: Booking[] }>(
    "/owner/earnings"
  );
  return data;
}
