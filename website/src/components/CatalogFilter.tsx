"use client";

import { useEffect, useRef } from "react";
import type { CatalogFilterState } from "@/lib/catalog-query";

interface FilterOption {
  id: string;
  name: string;
}

interface CatalogFilterProps {
  brands: FilterOption[];
  pumpTypes: FilterOption[];
  purposes: FilterOption[];
  state: CatalogFilterState;
  onChange: (update: (previous: CatalogFilterState) => CatalogFilterState) => void;
}

export default function CatalogFilter({ brands, pumpTypes, purposes, state, onChange }: CatalogFilterProps) {
  const lastStateQuery = useRef(state.q);
  const searchValue = useRef(state.q);
  const searchRef = useRef<HTMLInputElement>(null);
  const hydratedSearchValue = useRef(false);

  // A user can type before React hydrates this Client Component. Reconcile the
  // browser-owned value once so the URL and filtered result do not lose it.
  useEffect(() => {
    if (hydratedSearchValue.current) return;
    hydratedSearchValue.current = true;
    const value = searchRef.current?.value ?? state.q;
    if (value !== state.q) {
      searchValue.current = value;
      lastStateQuery.current = value;
      onChange((previous) => ({ ...previous, q: value.trim() }));
    }
  }, [onChange, state.q]);

  useEffect(() => {
    if (state.q !== lastStateQuery.current) {
      lastStateQuery.current = state.q;
      if (document.activeElement !== searchRef.current) {
        searchValue.current = state.q;
        if (searchRef.current) searchRef.current.value = state.q;
      }
    }
  }, [state.q]);

  useEffect(() => {
    const syncSearchFromHistory = () => {
      const query = new URLSearchParams(window.location.search).getAll("q").map((value) => value.trim()).find(Boolean) ?? "";
      lastStateQuery.current = query;
      searchValue.current = query;
      if (searchRef.current) searchRef.current.value = query;
    };
    window.addEventListener("popstate", syncSearchFromHistory);
    return () => window.removeEventListener("popstate", syncSearchFromHistory);
  }, []);

  const change = (patch: Partial<CatalogFilterState>) => {
    onChange((previous) => ({ ...previous, q: searchValue.current.trim(), ...patch }));
  };

  const currentBrand = state.brand ?? "";
  const currentTypes = state.types;
  const currentPurposes = state.purposes;
  const currentQ = state.q;

  const updateSearch = (value: string) => {
    searchValue.current = value;
    change({ q: value.trim() });
  };

  const setBrand = (brand: string | null) => {
    change({ brand });
  };

  const toggleArray = (k: string, v: string) => {
    onChange((previous) => {
      const current = k === "type" ? previous.types : previous.purposes;
      const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
      return k === "type"
        ? { ...previous, q: searchValue.current.trim(), types: next }
        : { ...previous, q: searchValue.current.trim(), purposes: next };
    });
  };

  const clearAll = () => change({ brand: null, types: [], purposes: [], q: "" });

  const hasFilters = currentBrand || currentTypes.length > 0 || currentPurposes.length > 0 || currentQ;

  return (
    <aside className="w-full shrink-0 md:w-64 md:border-r md:border-[var(--color-border)] md:pr-6" aria-label="產品篩選">
      <div className="space-y-7">
        {/* Search */}
        <div>
          <label htmlFor="catalog-search" className="text-xs font-[750] uppercase tracking-[0.08em] text-[var(--color-text)]">
            搜尋
          </label>
          <input
            id="catalog-search"
            ref={searchRef}
            type="text"
            defaultValue={state.q}
            onChange={(event) => updateSearch(event.currentTarget.value)}
            placeholder="系列名稱或型號..."
            className="catalog-filter-search mt-2 block min-h-[45px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm shadow-[0_3px_10px_rgba(11,42,61,0.06)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]"
          />
        </div>

        {/* Brand */}
        <fieldset className="border-t border-[var(--color-border)] pt-5">
          <legend className="text-xs font-[750] uppercase tracking-[0.08em] text-[var(--color-text)]">品牌</legend>
          <div className="mt-3 space-y-1">
            <button
              type="button"
              className={`catalog-filter-option flex min-h-[36px] w-full items-center rounded-[var(--radius-xs)] px-2 text-sm text-left focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] ${
                !currentBrand ? "catalog-filter-option-active text-[var(--color-action)]" : "text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]"
              }`}
              onClick={() => setBrand(null)}
              aria-pressed={!currentBrand}
            >
              全部
            </button>
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`catalog-filter-option flex min-h-[36px] w-full items-center rounded-[var(--radius-xs)] px-2 text-sm text-left focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] ${
                  currentBrand === b.id ? "catalog-filter-option-active text-[var(--color-action)]" : "text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]"
                }`}
                onClick={() => setBrand(currentBrand === b.id ? null : b.id)}
                aria-pressed={currentBrand === b.id}
              >
                {b.name}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Pump Type */}
        <fieldset className="border-t border-[var(--color-border)] pt-5">
          <legend className="text-xs font-[750] uppercase tracking-[0.08em] text-[var(--color-text)]">泵浦類型</legend>
          <div className="mt-3 space-y-1" role="group" aria-label="泵浦類型">
            {pumpTypes.map((t) => {
              const active = currentTypes.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`catalog-filter-option catalog-filter-option-radio flex min-h-[36px] w-full items-center rounded-[var(--radius-xs)] px-2 text-left text-sm font-[600] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] ${
                    active ? "catalog-filter-option-active text-[var(--color-action)]" : "text-[var(--color-primary)] hover:bg-[var(--color-surface-subtle)]"
                  }`}
                  onClick={() => toggleArray("type", t.id)}
                  aria-pressed={active}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Purpose */}
        <fieldset className="border-t border-[var(--color-border)] pt-5">
          <legend className="text-xs font-[750] uppercase tracking-[0.08em] text-[var(--color-text)]">用途</legend>
          <div className="mt-3 space-y-1">
            {purposes.map((p) => {
              const active = currentPurposes.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`catalog-filter-option flex min-h-[36px] w-full items-center rounded-[var(--radius-xs)] px-2 text-left text-sm font-[600] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] ${
                    active ? "catalog-filter-option-active text-[var(--color-action)]" : "text-[var(--color-primary)] hover:bg-[var(--color-surface-subtle)]"
                  }`}
                  onClick={() => toggleArray("purpose", p.id)}
                  aria-pressed={active}
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
                  <button type="button" onClick={() => setBrand(null)} className="ml-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--color-on-action)]/70 hover:text-[var(--color-on-action)]" aria-label="移除品牌條件">✕</button>
                </span>
              )}
              {currentTypes.map((tid) => (
                <span key={tid} className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2 py-1 text-xs text-[var(--color-primary)]">
                  {pumpTypes.find((t) => t.id === tid)?.name || tid}
                  <button type="button" onClick={() => toggleArray("type", tid)} className="ml-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center hover:text-[var(--color-action)]" aria-label="移除泵浦類型條件">✕</button>
                </span>
              ))}
              {currentPurposes.map((pid) => (
                <span key={pid} className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] bg-[var(--color-surface-subtle)] px-2 py-1 text-xs text-[var(--color-primary)]">
                  {purposes.find((p) => p.id === pid)?.name || pid}
                  <button type="button" onClick={() => toggleArray("purpose", pid)} className="ml-1 inline-flex min-h-[44px] min-w-[44px] items-center justify-center hover:text-[var(--color-action)]" aria-label="移除用途條件">✕</button>
                </span>
              ))}
              <button type="button" onClick={clearAll} className="inline-flex min-h-[44px] items-center text-xs text-[var(--color-action)] hover:underline focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]">
                重設全部條件
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
