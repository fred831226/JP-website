import "server-only";

import { CatalogSchema, type Brand, type PumpType, type Purpose, type Series } from "@/lib/validation/catalog";
import brandsRaw from "@/data/catalog-brands.json";
import typesRaw from "@/data/catalog-types.json";
import purposesRaw from "@/data/catalog-purposes.json";
import generatedRaw from "@/data/catalog.generated.json";
import contentRaw from "@/data/catalog-content.json";

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

const generated = generatedRaw as { series: GeneratedSeries[] };
const content = contentRaw as { series: ContentSeries[] };

const PUMP_TYPE_ID_MAP: Record<string, string> = {
  "沉水式揚水泵": "submersible-well-pump",
  "臥式泵": "horizontal-pump",
  "污水泵": "sewage-pump",
  "陸上式自吸式泵": "self-priming-pump",
  "電子穩壓加壓泵": "pressure-boosting-pump",
  "立式揚水泵": "vertical-multistage-pump",
};

const contentMap = new Map<string, ContentSeries>();
for (const c of content.series) {
  contentMap.set(c.id, c);
}

const seriesList: Series[] = generated.series.map((gs) => {
  const c = contentMap.get(gs.id);
  const ptId = PUMP_TYPE_ID_MAP[gs.pumpType];
  return {
    id: gs.id,
    brandId: "jp-pump",
    name: gs.name,
    slug: c?.slug ?? gs.id,
    description: c?.shortDescription ?? gs.productName,
    introduction: c?.introduction ?? "",
    image: c?.image ?? null,
    pumpTypeIds: ptId ? [ptId] : [],
    purposeIds: gs.purposeTags.map((t) => t.replace(/\s+/g, "-").replace(/[\/]/g, "-")),
    purposeTags: gs.purposeTags,
    headMin: null,
    headMax: null,
    flowMin: null,
    flowMax: null,
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
