import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex size-9 items-center justify-center rounded-sm border border-line-strong disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1)
        .reduce<number[]>((acc, p) => {
          if (acc.length && p - acc[acc.length - 1] > 1) acc.push(-1);
          acc.push(p);
          return acc;
        }, [])
        .map((p, i) =>
          p === -1 ? (
            <span key={`gap-${i}`} className="px-1 text-ink-soft/40">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                "flex size-9 items-center justify-center rounded-sm text-sm",
                p === page ? "bg-ink text-white" : "border border-line-strong hover:bg-black/5"
              )}
            >
              {p}
            </button>
          )
        )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        className="flex size-9 items-center justify-center rounded-sm border border-line-strong disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
