"use client";

import { useRef, useState } from "react";
import ImageDialog from "@/components/ImageDialog";

export default function SeriesActions({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const multiple = images.length > 1;

  const active = images[activeIndex] ?? images[0];
  const activeAlt = multiple ? `${name} 產品圖 ${activeIndex + 1}` : `${name} 產品圖`;
  const activeLabel = multiple ? `放大檢視 ${name} 圖片 ${activeIndex + 1}` : `放大檢視 ${name} 圖片`;

  const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % images.length);
  const closeDialog = () => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[var(--product-card-radius)] bg-white shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
            aria-label={activeLabel}
          >
            {failedImages.has(active) ? (
              <span role="status" className="p-4 text-sm text-[var(--color-text-muted)]">圖片無法載入，請稍後再試。</span>
            ) : (
              <img src={active} alt={activeAlt} onError={() => setFailedImages((images) => new Set(images).add(active))} className="h-full w-full object-contain p-4" />
            )}
          </button>

          {multiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--color-primary)] shadow-[0_2px_10px_rgba(11,42,61,.15)] transition-colors hover:bg-white focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
                aria-label="上一張圖片"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--color-primary)] shadow-[0_2px_10px_rgba(11,42,61,.15)] transition-colors hover:bg-white focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
                aria-label="下一張圖片"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </>
          )}
        </div>

        {multiple && (
          <div className="flex flex-wrap gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-[6px] border bg-white transition-colors ${
                  i === activeIndex
                    ? "border-[var(--color-action)] ring-2 ring-[var(--color-action)]/30"
                    : "border-[var(--color-border)] hover:border-[var(--color-action)]"
                }`}
                aria-label={`顯示 ${name} 圖片 ${i + 1}`}
                aria-current={i === activeIndex ? "true" : undefined}
                aria-pressed={i === activeIndex}
              >
                {failedImages.has(src) ? (
                  <span className="p-1 text-center text-xs text-[var(--color-text-muted)]">無法載入</span>
                ) : (
                  <img src={src} alt="" onError={() => setFailedImages((images) => new Set(images).add(src))} className="h-full w-full object-contain p-1" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {open && <ImageDialog src={active} alt={activeAlt} initiallyFailed={failedImages.has(active)} onClose={closeDialog} />}
    </>
  );
}
