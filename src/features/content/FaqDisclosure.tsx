"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqDisclosureProps {
  items: FaqItem[];
}

export default function FaqDisclosure({ items }: FaqDisclosureProps) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <FaqRow key={i} item={item} />
      ))}
    </div>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--color-contact-surface-raised)]">
      <button
        type="button"
        aria-expanded={open}
        className="flex min-h-[44px] w-full items-center justify-between gap-3 px-4 text-left text-sm font-[650] text-[var(--color-on-primary)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{item.q}</span>
        <span className="text-lg leading-none" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="border-t border-[var(--color-contact-surface)] px-4 py-3 text-sm leading-[var(--font-body-line-height)] text-[var(--color-contact-text-muted)]">
          {item.a}
        </div>
      )}
    </div>
  );
}
