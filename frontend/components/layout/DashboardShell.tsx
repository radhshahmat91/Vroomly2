"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { FullPageSpinner } from "@/components/ui/Feedback";

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export function DashboardShell({
  navItems,
  eyebrow,
  children,
}: {
  navItems: DashboardNavItem[];
  eyebrow: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (isLoading) return <FullPageSpinner />;
  if (!user) return null;

  return (
    <div className="container-page grid gap-8 py-8 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-24 md:self-start">
        <p className="mb-3 font-display text-sm uppercase tracking-wide text-ink-soft/40">{eyebrow}</p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible thin-scrollbar">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/owner" && item.href !== "/admin" && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-[3px] px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-ink text-white" : "text-ink-soft hover:bg-black/5"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
