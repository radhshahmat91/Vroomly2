import { api } from "../apiClient";
import type { Complaint } from "@/types";

export async function createComplaint(payload: { subject: string; message: string; bookingId?: string }) {
  const { data } = await api.post<{ success: true; complaint: Complaint }>("/complaints", payload);
  return data.complaint;
}

export async function getMyComplaints() {
  const { data } = await api.get<{ success: true; complaints: Complaint[] }>("/complaints/mine");
  return data.complaints;
}
