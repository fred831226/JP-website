"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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

    const slideDuration = 5000;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, slideDuration);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images]);

  const carouselImages = images.length > 0 ? images : (fallbackImage ? [fallbackImage] : []);
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" role="group" aria-label="首頁主視覺輪播">
      <div className="absolute inset-0" aria-hidden="true">
        {carouselImages.length > 0 ? (
          carouselImages.map((image, index) => (
            <Image
              key={`${image}-${index}`}
              src={image}
              alt=""
              data-carousel-slide={index}
              data-active={index === currentIndex}
              fill
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none ${index === currentIndex ? "opacity-100" : "opacity-0"}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))
        ) : (
          <div className="h-full w-full bg-[var(--color-primary)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-primary)]/80 via-[var(--color-primary)]/42 to-[var(--color-primary)]/10" />
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="上一張 Hero 圖片"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[var(--color-primary)]/65 text-2xl leading-none text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[var(--color-primary)]/90 focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] max-md:left-2"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            aria-label="下一張 Hero 圖片"
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[var(--color-primary)]/65 text-2xl leading-none text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[var(--color-primary)]/90 focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] max-md:right-2"
          >
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}
    </div>
  );
}
