"use client";

import { useEffect, useRef, useState } from "react";

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export default function RevealSection({ children, className = "", delayMs = 0 }: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setRevealed(true);
          }, delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -3% 0px" },
    );

    observer.observe(el);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={`rv${revealed ? " is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}
