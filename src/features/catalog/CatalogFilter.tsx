"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface FilterOption {
  id: string;
  name: string;
}

interface CatalogFilterProps {
  brands: FilterOption[];
  pumpTypes: FilterOption[];
  purposes: FilterOption[];
}

export default function CatalogFilter({ brands, pumpTypes, purposes }: CatalogFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentBrand = searchParams.get("brand") || "";
  const currentTypes = useMemo(() => searchParams.getAll("type"), [searchParams]);
  const currentPurposes = useMemo(() => searchParams.getAll("purpose"), [searchParams]);
  const currentQ = searchParams.get("q") || "";

  const buildHref = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(params)) {
        next.delete(k);
        if (v === null) continue;
        if (Array.isArray(v)) {
          v.forEach((x) => next.append(k, x));
        } else {
          next.set(k, v);
        }
      }
      const qs = next.toString();
      return `/zh-tw/products${qs ? `?${qs}` : ""}`;
    },
    [searchParams],
  );

  const setParam = (k: string, v: string | null) => {
    router.push(buildHref({ [k]: v }));
  };

  const toggleArray = (k: string, v: string) => {
    const current = searchParams.getAll(k);
    const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
    router.push(buildHref({ [k]: next.length > 0 ? next : null }));
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
            defaultValue={currentQ}
            placeholder="系列名稱或型號..."
            className="mt-1 block w-full rounded-[var(--radius-md)] bg-[var(--color-surface)] px-3 py-2 text-sm shadow-[var(--shadow-control)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const v = (e.target as HTMLInputElement).value;
                setParam("q", v || null);
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
              onClick={() => setParam("brand", null)}
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
                onClick={() => setParam("brand", currentBrand === b.id ? null : b.id)}
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
                  <button type="button" onClick={() => setParam("brand", null)} className="ml-1 text-[var(--color-on-action)]/70 hover:text-[var(--color-on-action)]" aria-label="移除品牌條件">✕</button>
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
