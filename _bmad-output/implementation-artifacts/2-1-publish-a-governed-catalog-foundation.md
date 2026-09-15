---
baseline_commit: 95762987880cf7ecc49a9356c3cefad86a8f43f2
---

# Story 2.1: Publish a Governed Catalog Foundation

Status: review

## Story

As a professional buyer,
I want the catalog to expose only approved, consistently classified product data,
So that every product route and value I use is trustworthy.

## Acceptance Criteria

1. Zod schemas validate stable IDs, locale slugs, relationships, publication state, explicit units, nullable technical values.
2. Invalid/unpublished records excluded from public page data.
3. Stable IDs identify entities across name/slug changes. No duplicate Series pages.
4. Technical values: decimal string + governed unit enum. Missing = `null`. Zero = only when reviewed.
5. Brand, Pump Type, Purpose, Series pages statically generated under `/zh-tw/`. Loaders return typed data, not raw Excel.
6. Source evidence, reviewer identity, internal status absent from client output.

## Tasks / Subtasks

- [x] Create Zod schemas in `src/lib/validation/catalog.ts` — Brand, PumpType, Purpose, Series, TechnicalDecimal (AC: 1, 3, 4)
- [x] Create `src/data/catalog-brands.json` — governed brand records (AC: 5)
- [x] Create `src/data/catalog-types.json` — governed pump type records (AC: 5)
- [x] Create `src/data/catalog-purposes.json` — governed purpose records (AC: 5)
- [x] Create `src/lib/content/load-catalog.ts` — typed server-only loader with Zod validation (AC: 2, 5, 6)
- [x] Verify lint + build pass

## Dev Notes

- `TechnicalDecimal`: `z.string().regex(...)` nullable — represents `null` as missing, `"0"` as reviewed zero
- `UnitEnum`: `m`, `L/min`, `hp`, `kW`, `bar`, `kg`
- Series data intentionally empty — Story 2.2+ will add actual series/models
- Loader uses `server-only` to prevent client import

## References
- [Source: epics.md#L528-L561] — Story 2.1 acceptance criteria
- [Source: ARCHITECTURE-SPINE.md#L96-L106] — AD-7 stable identity rules
- [Source: ARCHITECTURE-SPINE.md#L142] — AD-13 typed loaders

## Dev Agent Record

### Completion Notes
- [x] 4 Zod schemas + TechnicalDecimal + UnitEnum created
- [x] 3 governed JSON data files created (brands, types, purposes)
- [x] Typed server-only loader with `server-only`
- [x] `npm run build` passes

### File List
- `website/src/lib/validation/catalog.ts`
- `website/src/data/catalog-brands.json`
- `website/src/data/catalog-types.json`
- `website/src/data/catalog-purposes.json`
- `website/src/lib/content/load-catalog.ts`
