import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getBrands, getPumpTypes, getPurposes, getSeriesList } from "@/lib/content/load-catalog";
import CatalogFilter from "@/components/CatalogFilter";
import RevealSection from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "產品總覽",
  description: "傑平有限公司全系列泵浦產品，依品牌、泵浦類型、用途快速瀏覽。",
};

function ProductCard({ series, delay }: { series: { id: string; name: string; slug: string; description: string; image: string | null; headMin: string | null; headMax: string | null; flowMin: string | null; flowMax: string | null }; delay: number }) {
  return (
    <RevealSection delayMs={delay}>
      <Link
        href={`/zh-tw/series/${series.slug}`}
        className="pcat-card flex flex-col overflow-hidden rounded-[var(--product-card-radius)] border border-transparent bg-white shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
      >
        <div className="aspect-[16/9] overflow-hidden bg-[var(--color-surface-subtle)]">
          {series.image ? (
            <img src={series.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-[var(--color-text-muted)]">
              圖片未提供
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
            {series.name}
          </span>
          <p className="flex-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
            {series.description}
          </p>
          <div className="flex items-end justify-between gap-2">
            <div className="text-xs text-[var(--color-text-muted)]">
              <span>揚程範圍（m）{series.headMin !== null && series.headMax !== null ? `${series.headMin}–${series.headMax}` : "未提供"}</span>
              {series.flowMin !== null && series.flowMax !== null && (
                <span className="ml-2">揚水量範圍（L/min）{series.flowMin}–{series.flowMax}</span>
              )}
            </div>
            <span className="pcat-arrow text-sm font-[650] text-[var(--color-text-muted)] transition-colors duration-300">看更多 →</span>
          </div>
        </div>
      </Link>
    </RevealSection>
  );
}

function ProductGridFallback() {
  return (
    <div className="text-sm text-[var(--color-text-muted)]">載入中...</div>
  );
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

  /* ---- 品牌（單選互斥） ---- */
  let filtered = allSeries;
  if (filters.brand) {
    filtered = filtered.filter((s) => s.brandId === filters.brand);
  }
  /* ---- 泵浦類型（OR） ---- */
  if (filters.types.length > 0) {
    filtered = filtered.filter((s) => s.pumpTypeIds.some((tid) => filters.types.includes(tid)));
  }
  /* ---- 用途（AND；資料就緒前不會產生條件，保留邏輯） ---- */
  if (filters.purposes.length > 0) {
    filtered = filtered.filter((s) => filters.purposes.every((pid) => s.purposeIds.includes(pid)));
  }
  /* ---- 搜尋（系列名稱、ID 或型號名稱） ---- */
  if (filters.q) {
    const lower = filters.q.toLowerCase();
    filtered = filtered.filter((s) =>
      s.name.toLowerCase().includes(lower) ||
      s.id.toLowerCase().includes(lower) ||
      s.models.some((m) => m.name.toLowerCase().includes(lower))
    );
  }

  const noSeries = filtered.length === 0;

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <CatalogFilter
        brands={allBrands.map((b) => ({ id: b.id, name: b.name }))}
        pumpTypes={allPumpTypes.map((t) => ({ id: t.id, name: t.name }))}
        purposes={allPurposes.map((p) => ({ id: p.id, name: p.name }))}
      />
      <div className="flex-1">
        {noSeries ? (
          <div className="rounded-[var(--product-card-radius)] border border-dashed border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--product-card-shadow)]">
            <p className="text-lg font-[700] text-[var(--color-primary)]">沒有符合目前條件的產品。</p>
            <p className="mt-2 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              可調整側欄條件、個別移除標籤、重設全部條件，或直接聯絡我們確認需求。
            </p>
          </div>
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
      {/* Compact hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]" style={{
        background: "radial-gradient(ellipse 80% 80% at 15% 20%, rgba(0,109,143,.1), transparent 65%), linear-gradient(145deg, #F0F5F7, #F4F7F8 55%, #EAF1F4)",
      }}>
        <div className="pointer-events-none absolute right-[-100px] top-[-180px] z-0 h-[480px] w-[480px] rounded-full opacity-[.35] blur-[100px]" aria-hidden="true" style={{ background: "radial-gradient(circle, rgba(0,109,143,.3), transparent 68%)" }} />
        <div className="relative z-10 mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-10 max-md:px-[var(--page-gutter-mobile)]">
          <RevealSection>
            <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
              產品總覽
            </h1>
            <p className="mt-2 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              瀏覽全系列泵浦產品，依品牌、泵浦類型或用途快速篩選。
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Catalog */}
      <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-8 max-md:px-[var(--page-gutter-mobile)]">
        <Suspense fallback={<ProductGridFallback />}>
          <ProductGridContent filters={filters} />
        </Suspense>
      </section>
    </>
  );
}

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
