import type { Metadata } from "next";
import { getBrands, getPumpTypes, getPurposes, getSeriesList } from "@/lib/content/load-catalog";
import CatalogBrowser from "@/components/CatalogBrowser";
import RevealSection from "@/components/RevealSection";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "產品總覽",
  description: "傑平有限公司全系列泵浦產品，依品牌、泵浦類型、用途快速瀏覽。",
  alternates: {
    canonical: "/zh-tw/products",
  },
};

export default function ProductsPage() {
  const brands = getBrands();
  const pumpTypes = getPumpTypes();
  const purposes = getPurposes();
  const series = getSeriesList();
  const pumpTypeNames = new Map(pumpTypes.map(({ id, name }) => [id, name]));
  const browserSeries = series.map((item) => ({
    id: item.id,
    brandId: item.brandId,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    pumpTypeId: item.pumpTypeId,
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
          <CatalogBrowser
              brands={brands.map(({ id, name }) => ({ id, name }))}
              pumpTypes={pumpTypes.map(({ id, name }) => ({ id, name }))}
              purposes={purposes.map(({ id, name }) => ({ id, name }))}
              series={browserSeries.map(({ id, brandId, name, pumpTypeId, purposeIds, modelNames }) => ({
                id,
                brandId,
                name,
                pumpTypeId,
                purposeIds,
                modelNames,
              }))}
            >
              {series.map((item) => <ProductCard key={item.id} series={item} pumpTypeName={pumpTypeNames.get(item.pumpTypeId) ?? "未提供"} filterable />)}
          </CatalogBrowser>
      </section>
    </>
  );
}
