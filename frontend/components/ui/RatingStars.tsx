"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const px = size === "sm" ? "size-3.5" : "size-5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(px, i <= Math.round(value) ? "fill-caution-500 text-caution-500" : "text-line-strong")}
        />
      ))}
    </div>
  );
}

export function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
          className="p-0.5"
        >
          <Star
            className={cn(
              "size-7 transition-colors",
              i <= (hover || value) ? "fill-caution-500 text-caution-500" : "text-line-strong"
            )}
          />
        </button>
      ))}
    </div>
  );
}
