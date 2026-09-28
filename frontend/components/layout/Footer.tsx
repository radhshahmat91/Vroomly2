import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white/70">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <span className="flex size-7 items-center justify-center rounded-[3px] bg-signal-500">
              <Car className="size-4 text-white" />
            </span>
            Vroomly
          </div>
          <p className="mt-3 max-w-xs text-sm">
            A peer-to-peer car rental marketplace — book a ride from a local host, or list your own car and earn.
          </p>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-wide text-white/40">Renters</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/cars" className="hover:text-white">Browse cars</Link></li>
            <li><Link href="/register" className="hover:text-white">Create an account</Link></li>
            <li><Link href="/dashboard/bookings" className="hover:text-white">My bookings</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-wide text-white/40">Hosts</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/register" className="hover:text-white">List your car</Link></li>
            <li><Link href="/owner" className="hover:text-white">Host dashboard</Link></li>
            <li><Link href="/owner/earnings" className="hover:text-white">Earnings</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-wide text-white/40">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/login" className="hover:text-white">Log in</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Support</Link></li>
            <li><Link href="/credits" className="hover:text-white">Image credits</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        Vroomly is a demo project built for a developer portfolio — not a real booking service.
      </div>
    </footer>
  );
}
