import { z } from "zod";

export const UnitEnum = z.enum(["m", "L/min", "hp", "kW", "bar", "kg"]);
type Unit = z.infer<typeof UnitEnum>;

const TechnicalDecimal = z.string().regex(/^\d+(\.\d+)?$/, "Must be a decimal string").nullable();
const TechnicalText = z.string().min(1).nullable();

const ModelSpecsSchema = z.object({
  horsepower_hp: TechnicalDecimal.optional(),
  power_kw: TechnicalDecimal.optional(),
  inlet_inch: TechnicalText.optional(),
  outlet_inch: TechnicalText.optional(),
  rated_head_m: TechnicalDecimal.optional(),
  max_head_m: TechnicalDecimal.optional(),
  total_head_m: TechnicalDecimal.optional(),
  rated_flow_lmin: TechnicalDecimal.optional(),
  max_flow_lmin: TechnicalDecimal.optional(),
  power_source: TechnicalText.optional(),
  weight_kg: TechnicalDecimal.optional(),
}).strict();

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
  introduction: z.string(),
  image: z.string().nullable(),
  images: z.array(z.string()),
  pumpTypeId: z.string().min(1),
  purposeIds: z.array(z.string()),
  purposeTags: z.array(z.string()),
  headMin: TechnicalDecimal,
  headMax: TechnicalDecimal,
  flowMin: TechnicalDecimal,
  flowMax: TechnicalDecimal,
  lastUpdatedDate: z.iso.date(),
  models: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    specs: ModelSpecsSchema,
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
