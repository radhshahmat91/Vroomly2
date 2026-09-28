import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReview, deleteReview, getCarReviews, getMyReviews, getOwnerReviews, replyToReview } from "@/lib/api/reviews";

export function useCarReviews(carId: string) {
  return useQuery({ queryKey: ["reviews", "car", carId], queryFn: () => getCarReviews(carId), enabled: !!carId });
}

export function useMyReviews() {
  return useQuery({ queryKey: ["reviews", "mine"], queryFn: getMyReviews });
}

export function useOwnerReviews() {
  return useQuery({ queryKey: ["reviews", "owner"], queryFn: getOwnerReviews });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useReplyToReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) => replyToReview(id, reply),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
