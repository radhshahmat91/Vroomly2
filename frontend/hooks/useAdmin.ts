import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminDeleteCar,
  approveCar,
  approveOwner,
  banUser,
  getAdminBookings,
  getAdminCars,
  getAdminComplaints,
  getAdminDashboard,
  getAdminPayments,
  getAdminUsers,
  rejectCar,
  rejectOwner,
  unbanUser,
  updateComplaint,
} from "@/lib/api/admin";

export function useAdminDashboard() {
  return useQuery({ queryKey: ["admin", "dashboard"], queryFn: getAdminDashboard });
}

export function useAdminUsers(params: { role?: string; search?: string } = {}) {
  return useQuery({ queryKey: ["admin", "users", params], queryFn: () => getAdminUsers(params) });
}

export function useAdminCars(status?: "pending" | "approved") {
  return useQuery({ queryKey: ["admin", "cars", status], queryFn: () => getAdminCars(status) });
}

export function useAdminBookings(status?: string) {
  return useQuery({ queryKey: ["admin", "bookings", status], queryFn: () => getAdminBookings(status) });
}

export function useAdminPayments() {
  return useQuery({ queryKey: ["admin", "payments"], queryFn: getAdminPayments });
}

export function useAdminComplaints(status?: string) {
  return useQuery({ queryKey: ["admin", "complaints", status], queryFn: () => getAdminComplaints(status) });
}

function useAdminMutation<TVars>(mutationFn: (vars: TVars) => Promise<unknown>, invalidateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", invalidateKey] }),
  });
}

export function useBanUser() {
  return useAdminMutation(({ id, reason }: { id: string; reason?: string }) => banUser(id, reason), "users");
}
export function useUnbanUser() {
  return useAdminMutation((id: string) => unbanUser(id), "users");
}
export function useApproveOwner() {
  return useAdminMutation((id: string) => approveOwner(id), "users");
}
export function useRejectOwner() {
  return useAdminMutation(({ id, reason }: { id: string; reason?: string }) => rejectOwner(id, reason), "users");
}
export function useApproveCar() {
  return useAdminMutation((id: string) => approveCar(id), "cars");
}
export function useRejectCar() {
  return useAdminMutation(({ id, reason }: { id: string; reason?: string }) => rejectCar(id, reason), "cars");
}
export function useAdminDeleteCar() {
  return useAdminMutation((id: string) => adminDeleteCar(id), "cars");
}
export function useUpdateComplaint() {
  return useAdminMutation(
    ({ id, ...payload }: { id: string; status?: string; adminResponse?: string }) => updateComplaint(id, payload),
    "complaints"
  );
}
