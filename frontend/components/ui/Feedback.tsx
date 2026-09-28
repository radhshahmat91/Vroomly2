import { Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-5 animate-spin text-ink-soft/50", className)} />;
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line-strong px-6 py-16 text-center">
      {Icon && <Icon className="mb-3 size-8 text-ink-soft/30" strokeWidth={1.5} />}
      <p className="font-display text-xl text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-soft/70">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

type BadgeTone = "neutral" | "signal" | "route" | "caution" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-black/[0.06] text-ink-soft",
  signal: "bg-signal-100 text-signal-700",
  route: "bg-route-100 text-route-700",
  caution: "bg-caution-500/15 text-[#8a5a12]",
  danger: "bg-red-100 text-red-700",
};

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium", toneClasses[tone])}>
      {children}
    </span>
  );
}

const STATUS_TONE: Record<string, BadgeTone> = {
  pending: "caution",
  accepted: "route",
  confirmed: "signal",
  completed: "neutral",
  rejected: "danger",
  cancelled: "danger",
  open: "caution",
  in_review: "route",
  resolved: "signal",
  dismissed: "neutral",
  paid: "signal",
  unpaid: "caution",
  refunded: "neutral",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] || "neutral"}>{status.replace("_", " ")}</Badge>;
}
