"use client";

import { LayoutDashboard, Users, Car, CalendarClock, CreditCard, MessageSquareWarning, ShieldCheck } from "lucide-react";
import { RequireRole } from "@/components/auth/RequireRole";
import { DashboardShell, type DashboardNavItem } from "@/components/layout/DashboardShell";

const navItems: DashboardNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Vehicle owners", href: "/admin/owners", icon: ShieldCheck },
  { label: "Cars", href: "/admin/cars", icon: Car },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarClock },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Complaints", href: "/admin/complaints", icon: MessageSquareWarning },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={["admin"]}>
      <DashboardShell navItems={navItems} eyebrow="Admin">
        {children}
      </DashboardShell>
    </RequireRole>
  );
}
