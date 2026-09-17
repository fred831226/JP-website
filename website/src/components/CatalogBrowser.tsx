"use client";

import Link from "next/link";
import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import CatalogFilter from "@/components/CatalogFilter";
import { catalogHref, normalizeCatalogQuery, type CatalogFilterState } from "@/lib/catalog-query";

interface FilterOption { id: string; name: string }
interface SeriesMetadata {
  id: string; brandId: string; name: string; pumpTypeId: string; modelNames: string[];
}
interface CatalogBrowserProps {
  brands: FilterOption[]; pumpTypes: FilterOption[]; series: SeriesMetadata[]; children: ReactNode;
}

function sameCatalogState(a: CatalogFilterState, b: CatalogFilterState) {
  return a.brand === b.brand
    && a.type === b.type
    && a.q === b.q
}

export default function CatalogBrowser({ brands, pumpTypes, series, children }: CatalogBrowserProps) {
  const emptyState = normalizeCatalogQuery(new URLSearchParams(), {
    brandIds: brands.map(({ id }) => id), typeIds: pumpTypes.map(({ id }) => id),
  });
  const [state, setState] = useState(emptyState);
  const latestState = useRef(state);
  const [announcement, setAnnouncement] = useState("");
  const canonical = catalogHref(state);

  useEffect(() => {
    const syncFromLocation = () => {
      const next = normalizeCatalogQuery(new URLSearchParams(window.location.search), {
        brandIds: brands.map(({ id }) => id),
        typeIds: pumpTypes.map(({ id }) => id),
      });
      if (!sameCatalogState(latestState.current, next)) {
        latestState.current = next;
        setState(next);
      }
      const nextCanonical = catalogHref(next);
      const current = `/zh-tw/products${window.location.search}`;
      if (current !== nextCanonical) window.history.replaceState(window.history.state, "", nextCanonical);
    };
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    window.addEventListener("catalog-location-change", syncFromLocation);
    return () => {
      window.removeEventListener("popstate", syncFromLocation);
      window.removeEventListener("catalog-location-change", syncFromLocation);
    };
  }, [brands, pumpTypes]);

  const transition = useCallback((update: (previous: CatalogFilterState) => CatalogFilterState) => {
    const next = update(latestState.current);
    const href = catalogHref(next);
    latestState.current = next;
    setState(next);
    window.history.pushState(window.history.state, "", href);
  }, []);

  const query = state.q.toLowerCase();
  const filtered = series.filter((item) =>
    (!state.brand || item.brandId === state.brand)
    && (!state.type || item.pumpTypeId === state.type)
    && (!query || item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query) || item.modelNames.some((name) => name.toLowerCase().includes(query))),
  );
  const visibleIdsKey = filtered.map(({ id }) => id).join("\u0000");

  useLayoutEffect(() => {
    const visibleIds = new Set(visibleIdsKey ? visibleIdsKey.split("\u0000") : []);
    document.querySelectorAll<HTMLElement>("[data-catalog-series]").forEach((card) => {
      card.hidden = !visibleIds.has(card.dataset.catalogSeries ?? "");
    });
  }, [visibleIdsKey]);
  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(`目前顯示 ${filtered.length} 個產品系列`), 400);
    return () => window.clearTimeout(timer);
  }, [filtered.length, canonical]);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
        <CatalogFilter brands={brands} pumpTypes={pumpTypes} state={state} onChange={transition} />
      <div className="min-w-0 flex-1">
        <p data-testid="catalog-result-count" className="mb-4 text-sm font-[650] text-[var(--color-text)]">共 {filtered.length} 個產品系列</p>
        <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</p>
        {filtered.length === 0 && (
          <div data-testid="catalog-empty-state" className="mb-5 rounded-[var(--product-card-radius)] border border-dashed border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--product-card-shadow)]">
            <p className="text-lg font-[700] text-[var(--color-primary)]">沒有符合目前條件的產品。</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">目前條件會保留，您可個別移除條件、重設全部條件，或聯絡我們確認需求。</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => transition(() => ({ brand: null, type: null, q: "" }))} className="inline-flex min-h-[44px] items-center px-4 text-sm font-[650] text-[var(--color-action)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]">重設全部條件</button>
              <Link href="/zh-tw/contact" className="inline-flex min-h-[44px] items-center px-4 text-sm font-[650] text-[var(--color-action)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)]">聯絡我們</Link>
            </div>
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2">{children}</div>
      </div>
    </div>
  );
}
