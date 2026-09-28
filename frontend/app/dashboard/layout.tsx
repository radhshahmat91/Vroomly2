"use client";

import { LayoutDashboard, User, CalendarClock, Bell, Star } from "lucide-react";
import { RequireRole } from "@/components/auth/RequireRole";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/DashboardShell";

const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My bookings", href: "/dashboard/bookings", icon: CalendarClock },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "My reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={["user", "owner", "admin"]}>
      <DashboardShell navItems={navItems} eyebrow="Renter">
        {children}
      </DashboardShell>
    </RequireRole>
  );
}
