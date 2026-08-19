"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import CatalogFilter from "@/components/CatalogFilter";
import { catalogHref, normalizeCatalogQuery } from "@/lib/catalog-query";

interface FilterOption {
  id: string;
  name: string;
}

interface SeriesMetadata {
  id: string;
  brandId: string;
  name: string;
  pumpTypeIds: string[];
  purposeIds: string[];
  modelNames: string[];
}

interface CatalogBrowserProps {
  brands: FilterOption[];
  pumpTypes: FilterOption[];
  purposes: FilterOption[];
  series: SeriesMetadata[];
}

export default function CatalogBrowser({ brands, pumpTypes, purposes, series }: CatalogBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = normalizeCatalogQuery(searchParams, {
    brandIds: brands.map((item) => item.id),
    typeIds: pumpTypes.map((item) => item.id),
    purposeIds: purposes.map((item) => item.id),
  });
  const canonical = catalogHref(state);
  const current = `/zh-tw/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const query = state.q.toLowerCase();

  useEffect(() => {
    if (current !== canonical) router.replace(canonical, { scroll: false });
  }, [canonical, current, router]);

  let filtered = series;
  if (state.brand) filtered = filtered.filter((item) => item.brandId === state.brand);
  if (state.types.length > 0) {
    filtered = filtered.filter((item) => item.pumpTypeIds.some((id) => state.types.includes(id)));
  }
  if (state.purposes.length > 0) {
    filtered = filtered.filter((item) => state.purposes.every((id) => item.purposeIds.includes(id)));
  }
  if (query) {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(query)
      || item.id.toLowerCase().includes(query)
      || item.modelNames.some((name) => name.toLowerCase().includes(query)),
    );
  }
  const visibleIdsKey = filtered.map((item) => item.id).join("\u0000");

  useEffect(() => {
    const visibleIds = new Set(visibleIdsKey ? visibleIdsKey.split("\u0000") : []);
    document.querySelectorAll<HTMLElement>("[data-catalog-series]").forEach((card) => {
      card.hidden = !visibleIds.has(card.dataset.catalogSeries ?? "");
    });
    const emptyState = document.getElementById("catalog-empty-state");
    if (emptyState) emptyState.hidden = visibleIds.size > 0;
  }, [visibleIdsKey]);

  return <CatalogFilter key={state.q} brands={brands} pumpTypes={pumpTypes} purposes={purposes} state={state} />;
}
