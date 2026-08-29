import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { CatalogSchema, type Brand, type PumpType, type Purpose, type Series } from "@/lib/validation/catalog";
import brandsRaw from "@/data/catalog-brands.json";
import typesRaw from "@/data/catalog-types.json";
import purposesRaw from "@/data/catalog-purposes.json";
import contentRaw from "@/data/catalog-content.json";
import governanceRaw from "../../../data/catalog-overview-governance.json";

type GeneratedSeries = {
  id: string;
  brandId: string;
  name: string;
  productName: string;
  pumpType: string;
  purposeTags: string[];
  modelCount: number;
  models: { id: string; name: string; specs: Record<string, string | null> }[];
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

type ReviewGovernance = {
  reviewer: string;
  reviewDate: string;
  publicLastUpdatedDate: string;
};

function readCatalogRelease() {
  const root = process.cwd();
  const indicatorPath = resolve(root, "catalog-current.json");
  const indicator = JSON.parse(readFileSync(indicatorPath, "utf8")) as { release?: string };
  if (!indicator.release || !/^releases\/[a-z0-9-]+$/i.test(indicator.release)) throw new Error("catalog-current.json: invalid release indicator");
  const releaseId = indicator.release.slice("releases/".length);
  const releasePath = resolve(root, "releases", releaseId);
  return {
    generated: JSON.parse(readFileSync(resolve(releasePath, "data/catalog.generated.json"), "utf8")) as { series: GeneratedSeries[] },
    overview: JSON.parse(readFileSync(resolve(releasePath, "data/catalog-overview.json"), "utf8")) as { series: OverviewSeries[] },
  };
}

const release = readCatalogRelease();
const generated = release.generated;
const content = contentRaw as { series: ContentSeries[] };
const overview = release.overview;
const governance = governanceRaw as { review: ReviewGovernance };

if (generated.series.length !== 22 || content.series.length !== 22 || overview.series.length !== 22) {
  throw new Error("catalog: generated, content, and overview must each contain exactly 22 canonical Series");
}

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

function uniqueMap<T extends { id: string }>(records: T[], source: string): Map<string, T> {
  const result = new Map<string, T>();
  for (const record of records) {
    if (result.has(record.id)) throw new Error(`${source}: duplicate Series id "${record.id}"`);
    result.set(record.id, record);
  }
  return result;
}

const contentMap = uniqueMap(content.series, "catalog-content.json");
const overviewMap = uniqueMap(overview.series, "catalog-overview.json");

const seriesList: Series[] = generated.series.map((gs) => {
  const c = contentMap.get(gs.id);
  const o = overviewMap.get(gs.id);
  if (!c) throw new Error(`catalog-content.json: missing Series id "${gs.id}"`);
  if (!o) throw new Error(`catalog-overview.json: missing Series id "${gs.id}"`);
  const ptId = pumpTypeIdFor(gs.id, gs.pumpType);
  const purposeTags = o.purposeTags;
  const purposeIds = purposeTags
    .map((t) => PURPOSE_TAG_TO_ID[t] ?? t.replace(/\s+/g, "-").replace(/[\/]/g, "-"))
    .filter((id, i, arr) => arr.indexOf(id) === i); // deduplicate

  return {
    id: gs.id,
    brandId: gs.brandId,
    name: gs.name,
    slug: c.slug,
    description: c.shortDescription,
    introduction: c.introduction,
    image: c.image ?? null,
    images: c.images?.length ? c.images : (c.image ? [c.image] : []),
    pumpTypeId: ptId,
    purposeIds,
    purposeTags,
    headMin: o.headMin,
    headMax: o.headMax,
    flowMin: o.flowMin,
    flowMax: o.flowMax,
    models: gs.models.map((m) => ({
      id: m.id,
      name: m.name,
      specs: m.specs,
    })),
    lastUpdatedDate: governance.review.publicLastUpdatedDate,
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

export function getPumpTypeBySlug(slug: string): PumpType | undefined {
  return catalog.pumpTypes.find((t) => t.slug === slug);
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
  return catalog.seriesList.filter((s) => s.pumpTypeId === typeId);
}
