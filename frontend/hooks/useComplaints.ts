import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComplaint, getMyComplaints } from "@/lib/api/complaints";

export function useMyComplaints() {
  return useQuery({ queryKey: ["complaints", "mine"], queryFn: getMyComplaints });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComplaint,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["complaints", "mine"] }),
  });
}
