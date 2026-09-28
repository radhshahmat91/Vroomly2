"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCarImages } from "@/lib/carImages";

export function Gallery({ images, alt, brand, model }: { images: string[]; alt: string; brand?: string; model?: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const photos = brand && model ? getCarImages(brand, model, images) : images.length ? images : ["/media/car-placeholder.svg"];

  const next = () => setActive((i) => (i + 1) % photos.length);
  const prev = () => setActive((i) => (i - 1 + photos.length) % photos.length);

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-photo)] bg-line">
        <Image src={photos[active]} alt={alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" priority />
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow"
              aria-label="Next photo"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
        <button
          onClick={() => setLightbox(true)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-[3px] bg-ink/80 px-3 py-1.5 text-xs font-medium text-white"
        >
          <Expand className="size-3.5" /> View all ({photos.length})
        </button>
      </div>

      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto thin-scrollbar">
          {photos.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-[6px] border-2",
                i === active ? "border-signal-500" : "border-transparent"
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4">
          <button onClick={() => setLightbox(false)} className="absolute right-5 top-5 text-white" aria-label="Close">
            <X className="size-7" />
          </button>
          <button onClick={prev} className="absolute left-4 text-white sm:left-8" aria-label="Previous photo">
            <ChevronLeft className="size-9" />
          </button>
          <div className="relative h-[80vh] w-full max-w-4xl">
            <Image src={photos[active]} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button onClick={next} className="absolute right-4 text-white sm:right-8" aria-label="Next photo">
            <ChevronRight className="size-9" />
          </button>
        </div>
      )}
    </div>
  );
}
