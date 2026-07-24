import "server-only";

import { CatalogSchema, type Brand, type PumpType, type Purpose, type Series } from "@/lib/validation/catalog";
import { buildPumpTypeLabelMap, resolvePumpTypeId } from "@/lib/content/pump-type-labels";
import brandsRaw from "@content/taxonomy/catalog-brands.json";
import typesRaw from "@content/taxonomy/catalog-types.json";
import purposesRaw from "@content/taxonomy/catalog-purposes.json";
import overviewRaw from "@content/taxonomy/catalog-overview.json";
import generatedRaw from "@data/catalog.generated.json";
import contentRaw from "@data/catalog-content.json";

type GeneratedSeries = {
  id: string;
  name: string;
  productName: string;
  pumpType: string;
  purposeTags: string[];
  modelCount: number;
  models: { id: string; name: string; specs: Record<string, string> }[];
};

type ContentSeries = {
  id: string;
  slug: string;
  image?: string;
  shortDescription: string;
  introduction: string;
};

type OverviewSeries = {
  id: string;
  purposeTags: string[];
  headMin: string | null;
  headMax: string | null;
  flowMin: string | null;
  flowMax: string | null;
};

const generated = generatedRaw as { series: GeneratedSeries[] };
const content = contentRaw as { series: ContentSeries[] };
const overview = overviewRaw as { series: OverviewSeries[] };

const pumpTypesParsed = CatalogSchema.shape.pumpTypes.parse(typesRaw);
const pumpTypeLabelMap = buildPumpTypeLabelMap(pumpTypesParsed);

const contentMap = new Map<string, ContentSeries>();
for (const c of content.series) {
  contentMap.set(c.id, c);
}

const overviewMap = new Map<string, OverviewSeries>();
for (const o of overview.series) {
  overviewMap.set(o.id, o);
}

const unmappedPumpTypes = new Set<string>();

const seriesList: Series[] = generated.series.map((gs) => {
  const c = contentMap.get(gs.id);
  const o = overviewMap.get(gs.id);
  const ptId = resolvePumpTypeId(gs.pumpType, pumpTypeLabelMap);
  if (!ptId) {
    unmappedPumpTypes.add(gs.pumpType);
  }
  /* 用途標籤以網頁_產品總覽 sheet 為權威來源；無覆蓋時 fallback 到 generated */
  const purposeTags = o?.purposeTags ?? gs.purposeTags;
  return {
    id: gs.id,
    brandId: "jp-pump",
    name: gs.name,
    slug: c?.slug ?? gs.id,
    description: c?.shortDescription ?? gs.productName,
    introduction: c?.introduction ?? "",
    image: c?.image ?? null,
    pumpTypeIds: ptId ? [ptId] : [],
    purposeIds: purposeTags.map((t) => t.replace(/\s+/g, "-").replace(/[\/]/g, "-")),
    purposeTags,
    headMin: o?.headMin ?? null,
    headMax: o?.headMax ?? null,
    flowMin: o?.flowMin ?? null,
    flowMax: o?.flowMax ?? null,
    models: gs.models.map((m) => ({
      id: m.id,
      name: m.name,
      pumpType: gs.pumpType,
      specs: m.specs,
    })),
  };
});

if (unmappedPumpTypes.size > 0) {
  throw new Error(
    `Unmapped pump type label(s) in catalog.generated.json: ${[...unmappedPumpTypes].join(", ")}. ` +
      `Add them to content/taxonomy/catalog-types.json sourceLabels.`,
  );
}

const catalog = CatalogSchema.parse({
  brands: brandsRaw,
  pumpTypes: typesRaw,
  purposes: purposesRaw,
  seriesList,
});

export function getBrands(): Brand[] {
  return catalog.brands;
}

export function getBrand(id: string): Brand | undefined {
  return catalog.brands.find((b) => b.id === id);
}

export function getPumpTypes(): PumpType[] {
  return catalog.pumpTypes;
}

export function getPumpType(id: string): PumpType | undefined {
  return catalog.pumpTypes.find((t) => t.id === id);
}

export function getPurposes(): Purpose[] {
  return catalog.purposes;
}

export function getPurpose(id: string): Purpose | undefined {
  return catalog.purposes.find((p) => p.id === id);
}

export function getSeriesList(): Series[] {
  return catalog.seriesList;
}

export function getSeries(id: string): Series | undefined {
  return catalog.seriesList.find((s) => s.id === id);
}

export function getSeriesByBrand(brandId: string): Series[] {
  return catalog.seriesList.filter((s) => s.brandId === brandId);
}

export function getSeriesByPumpType(typeId: string): Series[] {
  return catalog.seriesList.filter((s) => s.pumpTypeIds.includes(typeId));
}

export function getSeriesByPurpose(purposeId: string): Series[] {
  return catalog.seriesList.filter((s) => s.purposeIds.includes(purposeId));
}
