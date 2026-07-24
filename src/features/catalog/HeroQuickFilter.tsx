"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface QuickFilterProps {
  brands: { id: string; name: string }[];
  purposes: { id: string; name: string }[];
}

export default function HeroQuickFilter({ brands, purposes }: QuickFilterProps) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [purpose, setPurpose] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (purpose) params.set("purpose", purpose);
    const qs = params.toString();
    router.push(`/zh-tw/products${qs ? `?${qs}` : ""}`);
  };

  const controlClass =
    "mt-1 block w-full min-h-[44px] rounded-[var(--radius-md)] bg-[var(--color-surface)] px-3 text-sm shadow-[var(--shadow-control)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-[var(--focus-ring-offset)]";

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="qf-brand" className="block text-sm font-[700] text-[var(--color-primary)]">
            品牌
          </label>
          <select
            id="qf-brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={controlClass}
          >
            <option value="">全部</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="qf-purpose" className="block text-sm font-[700] text-[var(--color-primary)]">
            用途
          </label>
          <select
            id="qf-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className={controlClass}
          >
            <option value="">全部</option>
            {purposes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-[var(--button-primary-padding-inline)] text-sm font-[800] text-[var(--button-primary-fg)] shadow-[var(--shadow-action)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-[var(--focus-ring-offset)] hover:brightness-110"
        >
          搜尋產品
        </button>
      </div>
    </form>
  );
}
