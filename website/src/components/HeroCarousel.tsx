"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroCarouselProps {
  images: string[];
  fallbackImage?: string;
}

const slideDuration = 10000;

export default function HeroCarousel({ images, fallbackImage }: HeroCarouselProps) {
  const carouselImages = images.length > 0 ? images : (fallbackImage ? [fallbackImage] : []);
  const finalIndex = carouselImages.length - 1;
  const [currentIndex, setCurrentIndex] = useState<number | null>(0);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [finalImageFailed, setFinalImageFailed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (carouselImages.length <= 1 || currentIndex === null || mediaFailed) return;

    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const shouldStayStatic =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g";
    if (shouldStayStatic) {
      timerRef.current = setTimeout(() => setCurrentIndex(null), 0);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }

    timerRef.current = setTimeout(() => {
      setCurrentIndex((index) => ((index ?? finalIndex) + 1) % carouselImages.length);
    }, slideDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [carouselImages.length, currentIndex, finalIndex, mediaFailed]);

  const changeSlide = (step: number) => {
    setCurrentIndex((index) => ((index ?? finalIndex) + step + carouselImages.length) % carouselImages.length);
  };

  const activeIndex = currentIndex ?? finalIndex;

  return (
    <div className="absolute inset-0 overflow-hidden" role="group" aria-label="首頁主視覺輪播">
      <div className="absolute inset-0" aria-hidden="true">
        {carouselImages.length > 0 && !finalImageFailed ? (
          carouselImages.map((image, index) => (
            <Image
              key={`${image}-${index}`}
              src={image}
              alt=""
              data-carousel-slide={index}
              data-active={index === activeIndex}
              data-zoom={currentIndex !== null && index === activeIndex}
              fill
              sizes="100vw"
              style={{ animationDuration: `${slideDuration}ms` }}
              className={`home-hero-image object-cover transition-opacity duration-[1000ms] ease-in-out motion-reduce:transition-none ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
              loading={index === 0 || index === finalIndex ? "eager" : "lazy"}
              onError={() => {
                if (timerRef.current) clearTimeout(timerRef.current);
                timerRef.current = null;
                setMediaFailed(true);
                setCurrentIndex(null);
                if (index === finalIndex) setFinalImageFailed(true);
              }}
            />
          ))
        ) : (
          <div className="h-full w-full bg-[var(--color-primary)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-primary)]/80 via-[var(--color-primary)]/42 to-[var(--color-primary)]/10" />
      </div>

      {carouselImages.length > 1 && !mediaFailed && currentIndex !== null && (
        <>
          <button
            type="button"
            aria-label="上一張 Hero 圖片"
            onClick={() => changeSlide(-1)}
            className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[var(--color-primary)]/65 text-2xl leading-none text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[var(--color-primary)]/90 focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] max-md:left-2 motion-reduce:hidden"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            aria-label="下一張 Hero 圖片"
            onClick={() => changeSlide(1)}
            className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-[var(--color-primary)]/65 text-2xl leading-none text-white backdrop-blur-sm transition-colors duration-200 hover:bg-[var(--color-primary)]/90 focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] max-md:right-2 motion-reduce:hidden"
          >
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}
    </div>
  );
}
