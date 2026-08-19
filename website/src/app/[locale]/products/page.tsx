import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBrands, getPumpTypes, getPurposes, getSeriesList } from "@/lib/content/load-catalog";
import CatalogBrowser from "@/components/CatalogBrowser";
import RevealSection from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "產品總覽",
  description: "傑平有限公司全系列泵浦產品，依品牌、泵浦類型、用途快速瀏覽。",
};

export default function ProductsPage() {
  const brands = getBrands();
  const pumpTypes = getPumpTypes();
  const purposes = getPurposes();
  const series = getSeriesList();
  const browserSeries = series.map((item) => ({
    id: item.id,
    brandId: item.brandId,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    pumpTypeIds: item.pumpTypeIds,
    purposeIds: item.purposeIds,
    headMin: item.headMin,
    headMax: item.headMax,
    flowMin: item.flowMin,
    flowMax: item.flowMax,
    modelNames: item.models.map((model) => model.name),
  }));

  return (
    <>
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

      <section className="mx-auto max-w-[var(--content-max)] px-[var(--page-gutter-desktop)] py-8 max-md:px-[var(--page-gutter-mobile)]">
        <div className="flex flex-col gap-6 md:flex-row">
          <Suspense fallback={null}>
            <CatalogBrowser
              brands={brands.map(({ id, name }) => ({ id, name }))}
              pumpTypes={pumpTypes.map(({ id, name }) => ({ id, name }))}
              purposes={purposes.map(({ id, name }) => ({ id, name }))}
              series={browserSeries.map(({ id, brandId, name, pumpTypeIds, purposeIds, modelNames }) => ({
                id,
                brandId,
                name,
                pumpTypeIds,
                purposeIds,
                modelNames,
              }))}
            />
          </Suspense>
          <div className="flex-1">
            <div id="catalog-empty-state" hidden className="rounded-[var(--product-card-radius)] border border-dashed border-[var(--color-border)] bg-white p-8 text-center shadow-[var(--product-card-shadow)]">
              <p className="text-lg font-[700] text-[var(--color-primary)]">沒有符合目前條件的產品。</p>
              <p className="mt-2 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                可調整側欄條件、個別移除標籤、重設全部條件，或直接聯絡我們確認需求。
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
            {browserSeries.map((item) => (
              <Link
                key={item.id}
                href={`/zh-tw/series/${item.slug}`}
                data-catalog-series={item.id}
                className="pcat-card flex flex-col overflow-hidden rounded-[var(--product-card-radius)] border border-transparent bg-white shadow-[var(--product-card-shadow)] focus-visible:outline-[3px] focus-visible:outline-[var(--color-focus-ring)] focus-visible:outline-offset-2"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-surface-subtle)]">
                  {item.image ? (
                    <Image src={item.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-[var(--color-text-muted)]">
                      圖片未提供
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-[var(--font-heading-sm-size)] font-[var(--font-heading-sm-weight)] leading-[var(--font-heading-sm-line-height)] text-[var(--color-primary)]">
                    {item.name}
                  </span>
                  <p className="flex-1 text-sm leading-[var(--font-body-line-height)] text-[var(--color-text-muted)]">
                    {item.description}
                  </p>
                  <div className="flex items-end justify-between gap-2">
                    <div className="text-xs text-[var(--color-text-muted)]">
                      <span>揚程範圍（m）{item.headMin !== null && item.headMax !== null ? `${item.headMin}–${item.headMax}` : "未提供"}</span>
                      {item.flowMin !== null && item.flowMax !== null && <span className="ml-2">揚水量範圍（L/min）{item.flowMin}–{item.flowMax}</span>}
                    </div>
                    <span className="pcat-arrow text-sm font-[650] text-[var(--color-text-muted)] transition-colors duration-300">看更多 →</span>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
