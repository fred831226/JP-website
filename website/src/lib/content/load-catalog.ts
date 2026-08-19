import "server-only";

import { CatalogSchema, type Brand, type PumpType, type Purpose, type Series } from "@/lib/validation/catalog";
import brandsRaw from "@/data/catalog-brands.json";
import typesRaw from "@/data/catalog-types.json";
import purposesRaw from "@/data/catalog-purposes.json";
import generatedRaw from "@/data/catalog.generated.json";
import contentRaw from "@/data/catalog-content.json";
import overviewRaw from "@/data/catalog-overview.json";

type GeneratedSeries = {
  id: string;
  brandId: string;
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
  images?: string[];
  shortDescription: string;
  introduction: string;
};

type OverviewSeries = {
  id: string;
  brandId: string;
  purposeTags: string[];
  headMin: string | null;
  headMax: string | null;
  flowMin: string | null;
  flowMax: string | null;
  modelCount: number | null;
  published: string | null;
};

const generated = generatedRaw as { series: GeneratedSeries[] };
const content = contentRaw as { series: ContentSeries[] };
const overview = overviewRaw as { series: OverviewSeries[] };

const PUMP_TYPE_ID_MAP = {
  "臥式泵": "horizontal-pump",
  "沉水式揚水泵": "submersible-well-pump",
  "沉水式污水泵": "sewage-pump",
  "立式楊水泵": "vertical-multistage-pump",
} as const;

function pumpTypeIdFor(seriesId: string, pumpType: string): string {
  const id = PUMP_TYPE_ID_MAP[pumpType as keyof typeof PUMP_TYPE_ID_MAP];
  if (!id) {
    throw new Error(`catalog.generated.json: series "${seriesId}" has unknown pumpType "${pumpType}"`);
  }
  return id;
}

// Map purpose tags from overview to governed purpose IDs
const PURPOSE_TAG_TO_ID: Record<string, string> = {
  "船舶": "船舶-礦山排水",
  "礦山排水": "船舶-礦山排水",
};

const contentMap = new Map<string, ContentSeries>();
for (const c of content.series) {
  contentMap.set(c.id, c);
}

const overviewMap = new Map<string, OverviewSeries>();
for (const o of overview.series) {
  overviewMap.set(o.id, o);
}

const seriesList: Series[] = generated.series.map((gs) => {
  const c = contentMap.get(gs.id);
  const o = overviewMap.get(gs.id);
  const ptId = pumpTypeIdFor(gs.id, gs.pumpType);
  /* 用途標籤以網頁_產品總覽 sheet 為權威來源；無覆蓋時 fallback 到 generated */
  const purposeTags = o?.purposeTags?.length ? o.purposeTags : gs.purposeTags;
  const purposeIds = purposeTags
    .map((t) => PURPOSE_TAG_TO_ID[t] ?? t.replace(/\s+/g, "-").replace(/[\/]/g, "-"))
    .filter((id, i, arr) => arr.indexOf(id) === i); // deduplicate

  return {
    id: gs.id,
    brandId: gs.brandId,
    name: gs.name,
    slug: c?.slug ?? gs.id,
    description: c?.shortDescription ?? gs.productName,
    introduction: c?.introduction ?? "",
    image: c?.image ?? null,
    images: c?.images?.length ? c.images : (c?.image ? [c.image] : []),
    pumpTypeIds: [ptId],
    purposeIds,
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

const catalog = CatalogSchema.parse({
  brands: brandsRaw,
  pumpTypes: typesRaw,
  purposes: purposesRaw,
  seriesList,
});

export function getBrands(): Brand[] {
  return catalog.brands;
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

export function getSeriesList(): Series[] {
  return catalog.seriesList;
}

export function getSeries(idOrSlug: string): Series | undefined {
  return catalog.seriesList.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
}

export function getSeriesByPumpType(typeId: string): Series[] {
  return catalog.seriesList.filter((s) => s.pumpTypeIds.includes(typeId));
}
