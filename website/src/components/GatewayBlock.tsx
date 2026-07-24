"use client";

import Link from "next/link";
import { useState } from "react";

interface Gateway {
  id: string;
  title: string;
  description: string;
  href: string;
}

interface GatewayBlockProps {
  gateways: Gateway[];
}

export default function GatewayBlock({ gateways }: GatewayBlockProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3 md:flex-row" role="group" aria-label="主要入口">
      {gateways.map((g) => {
        const isActive = activeId === g.id;
        return (
          <Link
            key={g.id}
            href={g.href}
            className={`flex flex-1 flex-col justify-center rounded-[var(--product-card-radius)] bg-white p-6 shadow-[var(--product-card-shadow)] transition-all duration-300 focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 max-md:w-full ${
              isActive ? "flex-[2]" : ""
            }`}
            onMouseEnter={() => setActiveId(g.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(g.id)}
            onBlur={() => setActiveId(null)}
          >
            <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
              {g.title}
            </span>
            <span className="mt-2 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              {g.description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
