"use client";

import { LayoutDashboard, Car, CalendarClock, Wallet, Star, User } from "lucide-react";
import { RequireRole } from "@/components/auth/RequireRole";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/DashboardShell";

const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/owner", icon: LayoutDashboard },
  { label: "My vehicles", href: "/owner/cars", icon: Car },
  { label: "Booking requests", href: "/owner/bookings", icon: CalendarClock },
  { label: "Earnings", href: "/owner/earnings", icon: Wallet },
  { label: "Reviews", href: "/owner/reviews", icon: Star },
  { label: "Profile", href: "/owner/profile", icon: User },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={["owner"]}>
      <DashboardShell navItems={navItems} eyebrow="Host">
        {children}
      </DashboardShell>
    </RequireRole>
  );
}
