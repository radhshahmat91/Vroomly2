import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptBooking,
  cancelBooking,
  createBooking,
  getBooking,
  getMyBookings,
  getOwnerBookings,
  rejectBooking,
} from "@/lib/api/bookings";
import type { BookingStatus } from "@/types";

function invalidateBookingQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["bookings"] });
  queryClient.invalidateQueries({ queryKey: ["owner", "dashboard"] });
  queryClient.invalidateQueries({ queryKey: ["cars"] });
}

export function useMyBookings(status?: BookingStatus) {
  return useQuery({ queryKey: ["bookings", "mine", status], queryFn: () => getMyBookings(status) });
}

export function useOwnerBookings(status?: BookingStatus) {
  return useQuery({ queryKey: ["bookings", "owner", status], queryFn: () => getOwnerBookings(status) });
}

export function useBooking(id: string) {
  return useQuery({ queryKey: ["bookings", id], queryFn: () => getBooking(id), enabled: !!id });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => invalidateBookingQueries(queryClient),
  });
}

export function useAcceptBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptBooking,
    onSuccess: () => invalidateBookingQueries(queryClient),
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectBooking(id, reason),
    onSuccess: () => invalidateBookingQueries(queryClient),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => cancelBooking(id, reason),
    onSuccess: () => invalidateBookingQueries(queryClient),
  });
}
