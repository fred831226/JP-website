"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type PageTransitionProps = Readonly<{
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}>;

export default function PageTransition({ children, footer, header }: PageTransitionProps) {
  const pathname = usePathname();
  const shouldAnimate = !pathname.startsWith("/zh-tw/series/");

  return (
    <>
      {header}
      <main
        key={pathname}
        className="page-transition-content flex-1"
        data-page-transition={shouldAnimate || undefined}
      >
        {children}
      </main>
      {footer}
      <style jsx global>{`
        .page-transition-content[data-page-transition] {
          animation: page-content-arrive 260ms cubic-bezier(.16, 1, .3, 1) both;
          will-change: opacity, transform;
        }

        @keyframes page-content-arrive {
          from {
            opacity: .7;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .page-transition-content[data-page-transition] {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}
