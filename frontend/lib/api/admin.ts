import { api } from "../apiClient";
import type { Booking, Car, Complaint, Payment, User } from "@/types";

export interface AdminStats {
  totalUsers: number;
  totalOwners: number;
  pendingOwners: number;
  totalCars: number;
  pendingCars: number;
  totalBookings: number;
  openComplaints: number;
  totalRevenue: number;
  totalCommission: number;
}

export interface StatusCount {
  _id: string;
  count: number;
}

export interface RevenueByMonth {
  _id: { year: number; month: number };
  revenue: number;
  commission: number;
  bookings: number;
}

export async function getAdminDashboard() {
  const { data } = await api.get<{
    success: true;
    stats: AdminStats;
    bookingsByStatus: StatusCount[];
    revenueByMonth: RevenueByMonth[];
  }>("/admin/dashboard");
  return data;
}

export async function getAdminUsers(params: { role?: string; search?: string } = {}) {
  const { data } = await api.get<{ success: true; users: User[] }>("/admin/users", { params });
  return data.users;
}

export async function banUser(id: string, reason?: string) {
  const { data } = await api.put<{ success: true; user: User }>(`/admin/users/${id}/ban`, { reason });
  return data.user;
}

export async function unbanUser(id: string) {
  const { data } = await api.put<{ success: true; user: User }>(`/admin/users/${id}/unban`);
  return data.user;
}

export async function approveOwner(id: string) {
  const { data } = await api.put<{ success: true; user: User }>(`/admin/owners/${id}/approve`);
  return data.user;
}

export async function rejectOwner(id: string, reason?: string) {
  const { data } = await api.put<{ success: true; user: User }>(`/admin/owners/${id}/reject`, { reason });
  return data.user;
}

export async function getAdminCars(status?: "pending" | "approved") {
  const { data } = await api.get<{ success: true; cars: Car[] }>("/admin/cars", { params: status ? { status } : undefined });
  return data.cars;
}

export async function approveCar(id: string) {
  const { data } = await api.put<{ success: true; car: Car }>(`/admin/cars/${id}/approve`);
  return data.car;
}

export async function rejectCar(id: string, reason?: string) {
  const { data } = await api.put<{ success: true; car: Car }>(`/admin/cars/${id}/reject`, { reason });
  return data.car;
}

export async function adminDeleteCar(id: string) {
  const { data } = await api.delete(`/admin/cars/${id}`);
  return data;
}

export async function getAdminBookings(status?: string) {
  const { data } = await api.get<{ success: true; bookings: Booking[] }>("/admin/bookings", {
    params: status ? { status } : undefined,
  });
  return data.bookings;
}

export async function getAdminPayments() {
  const { data } = await api.get<{ success: true; payments: Payment[] }>("/admin/payments");
  return data.payments;
}

export async function getAdminComplaints(status?: string) {
  const { data } = await api.get<{ success: true; complaints: Complaint[] }>("/admin/complaints", {
    params: status ? { status } : undefined,
  });
  return data.complaints;
}

export async function updateComplaint(id: string, payload: { status?: string; adminResponse?: string }) {
  const { data } = await api.put<{ success: true; complaint: Complaint }>(`/admin/complaints/${id}`, payload);
  return data.complaint;
}
