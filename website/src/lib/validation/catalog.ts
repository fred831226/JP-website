import { z } from "zod";

const UnitEnum = z.enum(["m", "L/min", "hp", "kW", "bar", "kg"]);
type Unit = z.infer<typeof UnitEnum>;

const TechnicalDecimal = z.string().regex(/^\d+(\.\d+)?$/, "Must be a decimal string").nullable();

export const BrandSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
});

export const PumpTypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
});

export const PurposeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
});

export const SeriesSchema = z.object({
  id: z.string().min(1),
  brandId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  image: z.string().nullable(),
  pumpTypeIds: z.array(z.string()),
  purposeIds: z.array(z.string()),
  headMin: TechnicalDecimal,
  headMax: TechnicalDecimal,
  flowMin: TechnicalDecimal,
  flowMax: TechnicalDecimal,
  models: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    specs: z.record(z.string(), TechnicalDecimal),
  })),
});

export const CatalogSchema = z.object({
  brands: z.array(BrandSchema),
  pumpTypes: z.array(PumpTypeSchema),
  purposes: z.array(PurposeSchema),
  seriesList: z.array(SeriesSchema),
});

export type Brand = z.infer<typeof BrandSchema>;
export type PumpType = z.infer<typeof PumpTypeSchema>;
export type Purpose = z.infer<typeof PurposeSchema>;
export type Series = z.infer<typeof SeriesSchema>;
export type Catalog = z.infer<typeof CatalogSchema>;
export type { Unit };
