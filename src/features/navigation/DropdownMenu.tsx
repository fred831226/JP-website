"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface DropdownItem {
  id: string;
  label: string;
  href: string;
}

interface DropdownMenuProps {
  label: string;
  items: DropdownItem[];
}

export default function DropdownMenu({ label, items }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent | FocusEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("focusin", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("focusin", handle);
    };
  }, [open, close]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className="flex min-h-[44px] items-center gap-1 px-3 text-sm font-[650] text-[var(--color-text)] hover:text-[var(--color-action)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape") close();
        }}
      >
        {label}
        <span
          className={`inline-block transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute left-0 top-full z-50 min-w-[200px] rounded-[var(--floating-layer-radius)] bg-[var(--color-surface)] p-1 shadow-[var(--floating-layer-shadow)]"
        >
          {items.map((item) => (
            <Link
              key={item.id}
              role="menuitem"
              href={item.href}
              className="flex min-h-[44px] items-center rounded-[var(--radius-md)] px-4 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-action)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
