import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  DEMO_CARS,
  searchDemoCars,
} from "@/lib/demoCars";

import {
  createCar,
  deleteCar,
  getCar,
  getCarAvailability,
  getMyCars,
  getSimilarCars,
  searchCars,
  setCarAvailability,
  updateCar,
  type CarSearchFilters,
} from "@/lib/api/cars";

export function useCarSearch(
  filters: CarSearchFilters
) {
  return useQuery({
    queryKey: ["cars", "search", filters],

    queryFn: async () => {
      try {
        const result = await searchCars(filters);

        return result.total > 0
          ? result
          : searchDemoCars(
              filters as Record<string, unknown>
            );
      } catch {
        return searchDemoCars(
          filters as Record<string, unknown>
        );
      }
    },

    placeholderData: (prev) => prev,

    staleTime: 60_000,
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: ["cars", id],

    queryFn: async () => {
      try {
        return await getCar(id);
      } catch {
        return (
          DEMO_CARS.find((car) => car._id === id) ??
          null
        );
      }
    },

    enabled: !!id,
  });
}

export function useSimilarCars(id: string) {
  return useQuery({
    queryKey: ["cars", id, "similar"],
    queryFn: () => getSimilarCars(id),
    enabled: !!id,
  });
}

export function useCarAvailability(id: string) {
  return useQuery({
    queryKey: ["cars", id, "availability"],

    queryFn: () =>
      getCarAvailability(id),

    enabled: !!id,
  });
}

export function useMyCars() {
  return useQuery({
    queryKey: ["cars", "mine"],
    queryFn: getMyCars,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCar,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars", "mine"],
      });
    },
  });
}

export function useUpdateCar(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: Parameters<typeof updateCar>[1]
    ) => updateCar(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars", "mine"],
      });

      queryClient.invalidateQueries({
        queryKey: ["cars", id],
      });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCar,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cars", "mine"],
      });
    },
  });
}

export function useSetCarAvailability(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      unavailableDates: Parameters<
        typeof setCarAvailability
      >[1]
    ) =>
      setCarAvailability(
        id,
        unavailableDates
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "cars",
          id,
          "availability",
        ],
      });
    },
  });
}