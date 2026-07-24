import type { Metadata } from "next";
import { Suspense } from "react";
import { getBrands, getPumpTypes, getPurposes, getSeriesList } from "@/lib/content/load-catalog";
import CatalogFilter from "@/features/catalog/CatalogFilter";
import ProductCard from "@/features/catalog/ProductCard";
import RevealSection from "@/components/RevealSection";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "產品總覽",
  description: "傑平有限公司全系列泵浦產品，依品牌、泵浦類型、用途快速瀏覽。",
};

function ProductGridFallback() {
  return <div className="text-sm text-[var(--color-text-muted)]">載入中...</div>;
}

interface FilterParams {
  brand?: string;
  types: string[];
  purposes: string[];
  q?: string;
}

function ProductGridContent({ filters }: { filters: FilterParams }) {
  const allBrands = getBrands();
  const allPumpTypes = getPumpTypes();
  const allPurposes = getPurposes();
  const allSeries = getSeriesList();

  let filtered = allSeries;
  if (filters.brand) {
    filtered = filtered.filter((s) => s.brandId === filters.brand);
  }
  if (filters.types.length > 0) {
    filtered = filtered.filter((s) => s.pumpTypeIds.some((tid) => filters.types.includes(tid)));
  }
  if (filters.purposes.length > 0) {
    filtered = filtered.filter((s) => filters.purposes.every((pid) => s.purposeIds.includes(pid)));
  }
  if (filters.q) {
    const lower = filters.q.toLowerCase();
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(lower) || s.id.toLowerCase().includes(lower));
  }

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <CatalogFilter
        brands={allBrands.map((b) => ({ id: b.id, name: b.name }))}
        pumpTypes={allPumpTypes.map((t) => ({ id: t.id, name: t.name }))}
        purposes={allPurposes.map((p) => ({ id: p.id, name: p.name }))}
      />
      <div className="flex-1">
        {filtered.length === 0 ? (
          <EmptyState
            title="沒有符合目前條件的產品。"
            description="可調整側欄條件、個別移除標籤、重設全部條件，或直接聯絡我們確認需求。"
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((s, i) => (
              <ProductCard key={s.id} series={s} delay={i * 60} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;

  const brand = typeof sp.brand === "string" ? sp.brand : undefined;
  const types = toArray(sp.type);
  const purposes = toArray(sp.purpose);
  const q = typeof sp.q === "string" && sp.q.trim() ? sp.q.trim() : undefined;

  const filters: FilterParams = { brand, types, purposes, q };

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-background)]">
        <PageShell padding="md" className="relative z-10" as="div">
          <RevealSection>
            <SectionHeader
              title="產品總覽"
              description="瀏覽全系列泵浦產品，依品牌、泵浦類型或用途快速篩選。"
            />
          </RevealSection>
        </PageShell>
      </section>

      <PageShell padding="sm" as="section">
        <Suspense fallback={<ProductGridFallback />}>
          <ProductGridContent filters={filters} />
        </Suspense>
      </PageShell>
    </>
  );
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
