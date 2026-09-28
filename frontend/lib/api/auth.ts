import { api } from "../apiClient";
import type { User, Role } from "@/types";

export interface AuthResponse {
  success: true;
  token: string;
  user: User;
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
}) {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function loginRequest(payload: { email: string; password: string }) {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function getMeRequest() {
  const { data } = await api.get<{ success: true; user: User }>("/auth/me");
  return data.user;
}

export async function updateProfileRequest(payload: Partial<Pick<User, "name" | "phone" | "address" | "avatar">>) {
  const { data } = await api.put<{ success: true; user: User }>("/users/profile", payload);
  return data.user;
}

export async function changePasswordRequest(payload: { currentPassword: string; newPassword: string }) {
  const { data } = await api.put("/users/change-password", payload);
  return data;
}
