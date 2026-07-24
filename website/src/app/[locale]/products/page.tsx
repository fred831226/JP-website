import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getBrands, getPumpTypes, getPurposes, getSeriesList } from "@/lib/content/load-catalog";
import CatalogFilter from "@/components/CatalogFilter";

export const metadata: Metadata = {
  title: "產品總覽",
  description: "傑平有限公司全系列泵浦產品，依品牌、泵浦類型、用途快速瀏覽。",
};

function ProductCard({ series }: { series: { id: string; name: string; slug: string; description: string; image: string | null; headMin: string | null; headMax: string | null; flowMin: string | null; flowMax: string | null } }) {
  return (
    <Link
      href={`/zh-tw/series/${series.slug}`}
      className="flex flex-col overflow-hidden rounded-[var(--product-card-radius)] bg-white shadow-[var(--product-card-shadow)] transition-shadow duration-300 hover:shadow-lg focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
    >
      <div className="aspect-[16/9] bg-[var(--color-surface-subtle)]">
        {series.image && <img src={series.image} alt="" className="h-full w-full object-cover" />}
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
            {series.headMin !== null && series.headMax !== null && (
              <span>揚程 {series.headMin}–{series.headMax} m</span>
            )}
            {series.flowMin !== null && series.flowMax !== null && (
              <span className="ml-2">揚水量 {series.flowMin}–{series.flowMax} L/min</span>
            )}
          </div>
          <span className="text-sm font-[650] text-[var(--color-action)]">看更多 →</span>
        </div>
      </div>
    </Link>
  );
}

function ProductGridFallback() {
  return (
    <div className="text-sm text-[var(--color-text-muted)]">
      載入中...
    </div>
  );
}

function ProductGridContent() {
  const brands = getBrands();
  const pumpTypes = getPumpTypes();
  const purposes = getPurposes();
  const seriesList = getSeriesList();

  const noSeries = seriesList.length === 0;

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <CatalogFilter
        brands={brands.map((b) => ({ id: b.id, name: b.name }))}
        pumpTypes={pumpTypes.map((t) => ({ id: t.id, name: t.name }))}
        purposes={purposes.map((p) => ({ id: p.id, name: p.name }))}
      />
      <div className="flex-1">
        {noSeries ? (
          <div className="rounded-[var(--product-card-radius)] bg-white p-8 shadow-[var(--product-card-shadow)]">
            <p className="leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
              沒有符合目前條件的產品。
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {seriesList.map((s) => (
              <ProductCard key={s.id} series={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-8 max-md:px-[var(--page-gutter-mobile)]">
      <h1 className="text-[var(--font-heading-lg-size)] font-[var(--font-heading-lg-weight)] leading-[var(--font-heading-lg-line-height)] text-[var(--color-primary)]">
        產品總覽
      </h1>
      <p className="mt-2 max-w-[var(--text-max)] leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
        瀏覽全系列泵浦產品，依品牌、泵浦類型或用途快速篩選。
      </p>
      <div className="mt-6">
        <Suspense fallback={<ProductGridFallback />}>
          <ProductGridContent />
        </Suspense>
      </div>
    </div>
  );
}
