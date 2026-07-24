"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavTextLinkProps = {
  href: string;
  children: ReactNode;
};

/** Client island: pathname-based active style for top-level text links. */
export default function NavTextLink({ href, children }: NavTextLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex min-h-[44px] items-center px-3 text-sm font-[650] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 ${
        active
          ? "text-[var(--color-action)] underline underline-offset-4"
          : "text-[var(--color-text)] hover:text-[var(--color-action)]"
      }`}
    >
      {children}
    </Link>
  );
}
