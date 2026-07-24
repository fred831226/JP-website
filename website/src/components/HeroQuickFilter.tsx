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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div>
        <label htmlFor="qf-brand" className="block text-sm font-[650] text-[var(--color-on-primary)]">品牌</label>
        <select
          id="qf-brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="mt-1 block min-h-[44px] rounded-[var(--radius-md)] bg-white px-3 text-sm shadow-[0_3px_10px_rgba(11,42,61,0.10)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
        >
          <option value="">全部</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="qf-purpose" className="block text-sm font-[650] text-[var(--color-on-primary)]">用途</label>
        <select
          id="qf-purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="mt-1 block min-h-[44px] rounded-[var(--radius-md)] bg-white px-3 text-sm shadow-[0_3px_10px_rgba(11,42,61,0.10)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
        >
          <option value="">全部</option>
          {purposes.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="inline-flex min-h-[44px] items-center rounded-[var(--button-primary-radius)] bg-[var(--button-primary-bg)] px-6 text-sm font-[650] text-[var(--button-primary-fg)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] hover:brightness-110"
      >
        瀏覽產品
      </button>
    </form>
  );
}
