export type Role = "user" | "owner" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  role: Role;
  isOwnerApproved: boolean;
  isBanned: boolean;
  banReason?: string;
  createdAt: string;
}

export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";
export type Transmission = "Manual" | "Automatic";
export type CarCategory =
  | "Sedan"
  | "SUV"
  | "Hatchback"
  | "Coupe"
  | "Convertible"
  | "Van"
  | "Truck"
  | "Luxury"
  | "Electric";

export interface UnavailableRange {
  start: string;
  end: string;
  reason?: string;
}

export interface Car {
  _id: string;
  owner: Pick<User, "_id" | "name" | "avatar" | "phone" | "createdAt">;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  pricePerDay: number;
  discountWeeklyPercent: number;
  discountMonthlyPercent: number;
  seats: number;
  fuelType: FuelType;
  transmission: Transmission;
  location: {
    address: string;
    city: string;
    coordinates: { type: "Point"; coordinates: [number, number] };
  };
  images: string[];
  features: string[];
  description: string;
  licensePlate: string;
  unavailableDates: UnavailableRange[];
  isApproved: boolean;
  rejectionReason?: string;
  isActive: boolean;
  ratingAvg: number;
  ratingCount: number;
  totalBookings: number;
  title: string;
  createdAt: string;
}

export type BookingStatus = "pending" | "accepted" | "rejected" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Booking {
  _id: string;
  car: Pick<Car, "_id" | "brand" | "model" | "year" | "images" | "location" | "licensePlate">;
  renter: Pick<User, "_id" | "name" | "avatar" | "phone">;
  owner: Pick<User, "_id" | "name" | "avatar" | "phone">;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  platformCommission: number;
  ownerEarning: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  rejectReason?: string;
  cancelReason?: string;
  cancelledBy?: "renter" | "owner" | "system" | "";
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  booking: string;
  car: string | Pick<Car, "_id" | "brand" | "model" | "images">;
  user: Pick<User, "_id" | "name" | "avatar">;
  owner: string;
  rating: number;
  comment: string;
  ownerReply?: string;
  ownerReplyAt?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  booking: Booking | string;
  user: string | Pick<User, "_id" | "name" | "email">;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: string;
}

export type NotificationType =
  | "booking_request"
  | "booking_accepted"
  | "booking_rejected"
  | "booking_cancelled"
  | "payment_success"
  | "new_review"
  | "review_reply"
  | "owner_approved"
  | "owner_rejected"
  | "car_approved"
  | "car_rejected"
  | "complaint_update"
  | "general";

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export type ComplaintStatus = "open" | "in_review" | "resolved" | "dismissed";

export interface Complaint {
  _id: string;
  raisedBy: Pick<User, "_id" | "name" | "email" | "role">;
  booking?: { _id: string; car?: Pick<Car, "brand" | "model"> };
  subject: string;
  message: string;
  status: ComplaintStatus;
  adminResponse?: string;
  createdAt: string;
}

export interface Paginated<T> {
  count: number;
  total: number;
  page: number;
  pages: number;
  cars: T[];
}

export interface ApiErrorShape {
  success: false;
  message: string;
}
