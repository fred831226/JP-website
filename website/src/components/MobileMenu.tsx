"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface MobileMenuItem {
  id: string;
  label: string;
  href?: string;
  children?: { id: string; label: string; href: string }[];
}

interface MobileMenuProps {
  items: MobileMenuItem[];
}

export default function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setExpanded(null);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, close]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-label="選單"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-text)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2 md:hidden"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-t border-[var(--color-border)] bg-white shadow-[var(--floating-layer-shadow)] md:hidden">
          <nav className="flex flex-col px-4 py-3" role="navigation" aria-label="行動選單">
            {items.map((item) => (
              <div key={item.id}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={expanded === item.id}
                      className="flex min-h-[44px] w-full items-center justify-between text-sm font-[650] text-[var(--color-text)] hover:text-[var(--color-action)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                      onClick={() =>
                        setExpanded((v) => (v === item.id ? null : item.id))
                      }
                    >
                      {item.label}
                      <span
                        className={`transition-transform duration-200 ${
                          expanded === item.id ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>
                    {expanded === item.id && (
                      <div className="ml-4 flex flex-col border-l border-[var(--color-border)] pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.href!}
                            className="flex min-h-[44px] items-center text-sm text-[var(--color-text-muted)] hover:text-[var(--color-action)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                            onClick={close}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className="flex min-h-[44px] items-center text-sm font-[650] text-[var(--color-text)] hover:text-[var(--color-action)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
