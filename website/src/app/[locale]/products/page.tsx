import { getBrands, getPumpTypes, getPurposes, getSeriesList } from "@/lib/content/load-catalog";
import CatalogBrowser from "@/components/CatalogBrowser";
import ProductCard from "@/components/ProductCard";
import PageBanner from "@/components/PageBanner";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "產品總覽",
  description: "傑平有限公司全系列泵浦產品，依品牌、泵浦類型、用途快速瀏覽。",
  pathname: "/zh-tw/products",
});

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
      <PageBanner title="產品總覽" summary="瀏覽全系列泵浦產品，依品牌、泵浦類型或用途快速篩選。" />

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
