"use client";

import { useEffect, useRef, useState } from "react";

interface HeroCarouselProps {
  images: string[];
  fallbackImage?: string;
}

export default function HeroCarousel({ images, fallbackImage }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const totalDuration = 5000;
    const step = totalDuration / images.length;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= images.length && timerRef.current) {
          clearInterval(timerRef.current);
          return prev;
        }
        return next;
      });
    }, step);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images]);

  const showImage = images.length > 0 ? images[currentIndex] : fallbackImage;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {showImage ? (
        <img
          src={showImage}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
      ) : (
        <div className="h-full w-full bg-[var(--color-primary)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/80 to-[var(--color-primary)]/40" />
    </div>
  );
}
