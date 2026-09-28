"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Car, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { cn } from "@/lib/utils";

function dashboardPathFor(role: string) {
  if (role === "admin") return "/admin";
  if (role === "owner") return "/owner";
  return "/dashboard";
}

export function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdminOrOwnerArea = pathname?.startsWith("/admin") || pathname?.startsWith("/owner");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
          <span className="flex size-8 items-center justify-center rounded-[3px] bg-signal-500 text-white">
            <Car className="size-5" />
          </span>
          Vroomly
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/cars" className="text-sm font-medium text-ink-soft hover:text-ink">
            Browse cars
          </Link>
          {(!user || user.role === "user") && (
            <Link href={user ? "/dashboard" : "/register"} className="text-sm font-medium text-ink-soft hover:text-ink">
              Become a host
            </Link>
          )}
          {!isAdminOrOwnerArea && user && (
            <Link href={dashboardPathFor(user.role)} className="text-sm font-medium text-ink-soft hover:text-ink">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isLoading ? null : user ? (
            <>
              <NotificationBell />
              <Link
                href={`${dashboardPathFor(user.role)}/profile`}
                className="flex items-center gap-2 rounded-[3px] px-2 py-1.5 text-sm text-ink-soft hover:bg-black/5"
              >
                <UserIcon className="size-4" />
                {user.name.split(" ")[0]}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="size-4" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>

        <button className="p-2 md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/cars" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink-soft">
              Browse cars
            </Link>
            {user ? (
              <>
                <Link
                  href={dashboardPathFor(user.role)}
                  onClick={() => setMenuOpen(false)}
                  className={cn("flex items-center gap-2 text-sm font-medium text-ink-soft")}
                >
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
                <button onClick={logout} className="flex items-center gap-2 text-left text-sm font-medium text-ink-soft">
                  <LogOut className="size-4" /> Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-ink-soft">
                  Log in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-signal-600">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
