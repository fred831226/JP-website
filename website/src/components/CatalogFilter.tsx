"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { catalogHref, type CatalogFilterState } from "@/lib/catalog-query";

interface FilterOption {
  id: string;
  name: string;
}

interface CatalogFilterProps {
  brands: FilterOption[];
  pumpTypes: FilterOption[];
  purposes: FilterOption[];
  state: CatalogFilterState;
}

export default function CatalogFilter({ brands, pumpTypes, purposes, state }: CatalogFilterProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(state.q);
  const currentBrand = state.brand ?? "";
  const currentTypes = state.types;
  const currentPurposes = state.purposes;
  const currentQ = state.q;

  const buildHref = (params: Partial<CatalogFilterState>) => catalogHref({ ...state, ...params });

  const setBrand = (brand: string | null) => {
    router.push(buildHref({ brand }));
  };

  const toggleArray = (k: string, v: string) => {
    const current = k === "type" ? currentTypes : currentPurposes;
    const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
    router.push(buildHref(k === "type" ? { types: next } : { purposes: next }));
  };

  const clearAll = () => router.push("/zh-tw/products");

  const hasFilters = currentBrand || currentTypes.length > 0 || currentPurposes.length > 0 || currentQ;

  return (
    <aside className="w-full shrink-0 md:w-64" aria-label="產品篩選">
      <div className="space-y-5">
        {/* Search */}
        <div>
          <label htmlFor="catalog-search" className="text-sm font-[650] text-[var(--color-text)]">
            搜尋
          </label>
          <input
            id="catalog-search"
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="系列名稱或型號..."
            className="mt-1 block w-full rounded-[var(--radius-md)] bg-white px-3 py-2 text-sm shadow-[0_3px_10px_rgba(11,42,61,0.10)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = searchValue.trim();
                router.push(buildHref({ q: v }));
              }
            }}
          />
        </div>

        {/* Brand */}
        <fieldset>
          <legend className="text-sm font-[650] text-[var(--color-text)]">品牌</legend>
          <div className="mt-2 space-y-1">
            <button
              type="button"
              className={`flex min-h-[44px] w-full items-center rounded-[var(--radius-md)] px-3 text-sm text-left focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] ${
                !currentBrand ? "bg-[var(--color-action)] text-[var(--color-on-action)]" : "bg-[var(--color-surface-subtle)] text-[var(--color-text)] hover:bg-[var(--color-border)]"
              }`}
              onClick={() => setBrand(null)}
            >
              全部
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`flex min-h-[44px] w-full items-center rounded-[var(--radius-md)] px-3 text-sm text-left focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] ${
                  currentBrand === b.id ? "bg-[var(--color-action)] text-[var(--color-on-action)]" : "bg-[var(--color-surface-subtle)] text-[var(--color-text)] hover:bg-[var(--color-border)]"
                }`}
                onClick={() => setBrand(currentBrand === b.id ? null : b.id)}
              >
                {b.name}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Pump Type */}
        <fieldset>
          <legend className="text-sm font-[650] text-[var(--color-text)]">泵浦類型</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {pumpTypes.map((t) => {
              const active = currentTypes.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`inline-flex min-h-[44px] items-center rounded-[var(--radius-xs)] px-3 text-sm font-[650] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] ${
                    active ? "bg-[var(--color-action)] text-[var(--color-on-action)]" : "bg-[var(--color-surface-subtle)] text-[var(--color-primary)] hover:bg-[var(--color-border)]"
                  }`}
                  onClick={() => toggleArray("type", t.id)}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Purpose */}
        <fieldset>
          <legend className="text-sm font-[650] text-[var(--color-text)]">用途</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {purposes.map((p) => {
              const active = currentPurposes.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`inline-flex min-h-[44px] items-center rounded-[var(--radius-xs)] px-3 text-sm font-[650] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] ${
                    active ? "bg-[var(--color-action)] text-[var(--color-on-action)]" : "bg-[var(--color-surface-subtle)] text-[var(--color-primary)] hover:bg-[var(--color-border)]"
                  }`}
                  onClick={() => toggleArray("purpose", p.id)}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Active tags */}
        {hasFilters && (
          <div>
            <div className="flex flex-wrap gap-2">
              {currentBrand && (
                <span className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] bg-[var(--color-action)] px-2 py-1 text-xs text-[var(--color-on-action)]">
                  {brands.find((b) => b.id === currentBrand)?.name || currentBrand}
                  <button type="button" onClick={() => setBrand(null)} className="ml-1 text-[var(--color-on-action)]/70 hover:text-[var(--color-on-action)]" aria-label="移除品牌條件">✕</button>
                </span>
              )}
              {currentTypes.map((tid) => (
                <span key={tid} className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2 py-1 text-xs text-[var(--color-primary)]">
                  {pumpTypes.find((t) => t.id === tid)?.name || tid}
                  <button type="button" onClick={() => toggleArray("type", tid)} className="ml-1 hover:text-[var(--color-action)]" aria-label="移除泵浦類型條件">✕</button>
                </span>
              ))}
              {currentPurposes.map((pid) => (
                <span key={pid} className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2 py-1 text-xs text-[var(--color-primary)]">
                  {purposes.find((p) => p.id === pid)?.name || pid}
                  <button type="button" onClick={() => toggleArray("purpose", pid)} className="ml-1 hover:text-[var(--color-action)]" aria-label="移除用途條件">✕</button>
                </span>
              ))}
              <button type="button" onClick={clearAll} className="text-xs text-[var(--color-action)] hover:underline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]">
                重設全部條件
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
