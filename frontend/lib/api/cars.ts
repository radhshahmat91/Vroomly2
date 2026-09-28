import { api } from "../apiClient";
import type { Car, Paginated, UnavailableRange } from "@/types";
import { DEMO_CARS } from "@/lib/demoCars";

export interface CarSearchFilters {
  brand?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  fuelType?: string;
  transmission?: string;
  category?: string;
  q?: string;
  startDate?: string;
  endDate?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function searchCars(filters: CarSearchFilters) {
  const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ""));
  const { data } = await api.get<{ success: true } & Paginated<Car>>("/cars", { params });
  return data;
}

export async function getCar(id: string) {
  if (id.startsWith("demo-car-")) {
    const demoCar = DEMO_CARS.find((car) => car._id === id);
    if (demoCar) return demoCar;
  }
  const { data } = await api.get<{ success: true; car: Car }>(`/cars/${id}`);
  return data.car;
}

export async function getSimilarCars(id: string) {
  const { data } = await api.get<{ success: true; cars: Car[] }>(`/cars/${id}/similar`);
  return data.cars;
}

export async function getCarAvailability(id: string) {
  const { data } = await api.get<{ success: true; unavailable: UnavailableRange[] }>(`/cars/${id}/availability`);
  return data.unavailable;
}

export async function getMyCars() {
  const { data } = await api.get<{ success: true; cars: Car[] }>("/cars/owner/mine");
  return data.cars;
}

export type CarInput = Omit<
  Car,
  | "_id"
  | "owner"
  | "isApproved"
  | "rejectionReason"
  | "ratingAvg"
  | "ratingCount"
  | "totalBookings"
  | "title"
  | "createdAt"
  | "unavailableDates"
  | "location"
> & {
  location?: { city: string; address?: string; coordinates?: Car["location"]["coordinates"] };
  lat?: number;
  lng?: number;
};

export async function createCar(payload: Partial<CarInput>) {
  const { data } = await api.post<{ success: true; car: Car }>("/cars", payload);
  return data.car;
}

export async function updateCar(id: string, payload: Partial<CarInput>) {
  const { data } = await api.put<{ success: true; car: Car; message: string }>(`/cars/${id}`, payload);
  return data;
}

export async function deleteCar(id: string) {
  const { data } = await api.delete(`/cars/${id}`);
  return data;
}

export async function setCarAvailability(id: string, unavailableDates: UnavailableRange[]) {
  const { data } = await api.put<{ success: true; unavailableDates: UnavailableRange[] }>(
    `/cars/${id}/availability`,
    { unavailableDates }
  );
  return data.unavailableDates;
}
