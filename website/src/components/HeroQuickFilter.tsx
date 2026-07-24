"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface QuickFilterProps {
  brands: { id: string; name: string }[];
  pumpTypes: { id: string; name: string }[];
}

export default function HeroQuickFilter({ brands, pumpTypes }: QuickFilterProps) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [pumpType, setPumpType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set("brand", brand);
    if (pumpType) params.set("type", pumpType);
    const qs = params.toString();
    router.push(`/zh-tw/products${qs ? `?${qs}` : ""}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="qf-brand" className="block text-sm font-[700] text-[var(--color-primary)]">品牌</label>
          <select
            id="qf-brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-1 block w-full min-h-[48px] rounded-[6px] bg-white px-3 text-sm shadow-[0_3px_10px_rgba(11,42,61,0.10)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
          >
            <option value="">全部</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="qf-type" className="block text-sm font-[700] text-[var(--color-primary)]">泵浦類型</label>
          <select
            id="qf-type"
            value={pumpType}
            onChange={(e) => setPumpType(e.target.value)}
            className="mt-1 block w-full min-h-[48px] rounded-[6px] bg-white px-3 text-sm shadow-[0_3px_10px_rgba(11,42,61,0.10)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
          >
            <option value="">全部</option>
            {pumpTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex min-h-[48px] items-center rounded-[6px] bg-[var(--color-action)] px-6 text-sm font-[800] text-[var(--color-on-action)] shadow-[0_5px_14px_rgba(0,109,143,0.20)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] hover:brightness-110"
        >
          搜尋產品
        </button>
      </div>
    </form>
  );
}
