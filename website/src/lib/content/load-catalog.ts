import "server-only";

import { CatalogSchema, type Brand, type PumpType, type Purpose, type Series } from "@/lib/validation/catalog";
import brandsRaw from "@/data/catalog-brands.json";
import typesRaw from "@/data/catalog-types.json";
import purposesRaw from "@/data/catalog-purposes.json";
import seriesRaw from "@/data/catalog-series.json";

const catalog = CatalogSchema.parse({
  brands: brandsRaw,
  pumpTypes: typesRaw,
  purposes: purposesRaw,
  seriesList: seriesRaw,
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
