import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-md border border-line bg-paper-raised", className)}>{children}</div>;
}

export function StatBlock({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  hint?: string;
}) {
  return (
    <div className="border border-line bg-paper-raised px-5 py-4 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft/70">{label}</p>
        {Icon && <Icon className="size-4 text-ink-soft/40" />}
      </div>
      <p className="mt-1.5 font-display text-3xl text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft/50">{hint}</p>}
    </div>
  );
}
