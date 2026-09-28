import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["user", "owner"]),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;

export const carSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required"),
  model: z.string().trim().min(1, "Model is required"),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  category: z.enum(["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Van", "Truck", "Luxury", "Electric"]),
  pricePerDay: z.number().positive("Daily price must be greater than 0"),
  discountWeeklyPercent: z.number().min(0).max(100),
  discountMonthlyPercent: z.number().min(0).max(100),
  seats: z.number().int().min(1).max(20),
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]),
  transmission: z.enum(["Manual", "Automatic"]),
  licensePlate: z.string().trim().min(1, "License plate is required"),
  city: z.string().trim().min(1, "City is required"),
  address: z.string().optional(),
  description: z.string().max(2000).optional(),
  featuresText: z.string().optional(),
});
export type CarFormInput = z.infer<typeof carSchema>;

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const complaintSchema = z.object({
  subject: z.string().trim().min(3, "Give it a short subject line"),
  message: z.string().trim().min(10, "Please add a bit more detail"),
});
export type ComplaintInput = z.infer<typeof complaintSchema>;
