import { useQuery } from "@tanstack/react-query";
import { getOwnerDashboard, getOwnerEarnings } from "@/lib/api/owner";

export function useOwnerDashboard() {
  return useQuery({ queryKey: ["owner", "dashboard"], queryFn: getOwnerDashboard });
}

export function useOwnerEarnings() {
  return useQuery({ queryKey: ["owner", "earnings"], queryFn: getOwnerEarnings });
}
