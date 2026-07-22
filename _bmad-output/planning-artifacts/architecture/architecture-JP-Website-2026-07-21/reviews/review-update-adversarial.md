# Updated Architecture Spine — Adversarial Re-review

**Verdict: ACTIONABLE FINDINGS**

The updated spine is substantially leaner and now fits the confirmed Next.js/Tailwind, no-database, Vercel-only direction. Five residual issues can still make compliant units diverge.

## 1. MUST FIX — Brand cardinality still contradicts the approved filter UI

`ARCHITECTURE-SPINE.md:116` says repeated values are accepted and that Brand selections use OR. The approved UX defines Brand as one **exclusive segmented group** (`DESIGN.md:232`, `EXPERIENCE.md:104`). A URL containing two `brand` keys therefore represents a state the UI cannot display faithfully.

**Required clarification:** Brand cardinality is zero or one. The shared parser must define what happens to repeated Brand values: reject/remove the invalid filter, or choose one value using a documented deterministic rule and replace the URL. Pump Type remains repeated/OR; Purpose remains repeated/AND. The Home builder, Product overview parser, selected-state UI and result counter must import the same contract.

## 2. MUST FIX — “Query variants stay out of internal crawl links” conflicts with approved Home/Header links

`ARCHITECTURE-SPINE.md:116` prohibits query variants in internal crawl links. Approved PRD/UX behavior requires Home Purpose cards, Home quick filters and Header Purpose shortcuts to navigate to Product overview with restorable filter query state. Those are internal links, so both requirements cannot hold.

**Required clarification:** Query variants are allowed for the approved Home/Header/catalog interaction links, but are excluded from the sitemap and canonicalized to the clean Product overview. Standalone Brand, Pump Type and Purpose landing pages remain the crawlable SEO surfaces. Do not require filter controls themselves to become taxonomy links.

Also state where ordinary links to every retained taxonomy landing page live. The UX requires these pages to be crawlable from Product overview or relevant content (`EXPERIENCE.md:58`); merely generating routes does not make them discoverable.

## 3. MUST FIX — The ER model and capability map retain deleted architecture concepts

The Structural Seed defines one `data/catalog.json`, direct loaders and no release/DTO/media-manifest/design-system layers. However:

- lines 253–256 still model `CATALOG_RELEASE`;
- lines 255 and 259 call Purpose `APPLICATION`, while the adopted URL/schema language uses `purpose`;
- line 268 maps catalog code to nonexistent `data/catalog` instead of `data/catalog.json` / `features/catalog`;
- lines 275 and 277 still reference nonexistent `design-system`, domain DTO and media-manifest components.

Two implementers could follow different sections and create different entity names, paths and layers.

**Required correction:** Remove `CATALOG_RELEASE` unless release metadata genuinely exists in `catalog.json`; use one taxonomy noun (`PURPOSE`) across the ER model, data schema, URL query and UI; rewrite the Capability Map using only paths and concepts present in the Structural Seed.

## 4. MUST FIX — Product import is optional despite 603-row governed data being sourced from Excel

The spine says Excel is intake rather than authority, but `scripts/import-catalog.*` is marked optional (`line 232`). With approximately 603 model rows, manual transcription into `catalog.json` creates the largest realistic integrity risk in this project: dropped rows, stale updates, unit conversion mistakes and irreproducible corrections.

**Required lean contract:** Make one repeatable Excel-to-catalog import/validation command part of product updates. It should read the agreed workbook columns/sheets, normalize values without inventing data, fail with sheet/row/field diagnostics, and produce the single reviewable `data/catalog.json`. The generated JSON committed to Git remains the publication authority; no database, runtime Excel reader or general ETL framework is needed.

Define whether the importer overwrites the whole catalog or preserves manually maintained presentation fields. Without this, independent content and import units can overwrite each other while both obeying the spine.

## 5. SHOULD FIX — “JSON/TypeScript” undermines non-executable, runtime-validated content

The Stack Seed permits schema-validated JSON/**TypeScript** for editorial and governed data (`lines 194–195`), while the architecture describes non-executable repository content and Zod validation. TypeScript data can execute arbitrary code and can bypass runtime validation if imported directly. It also leaves maintainers unsure whether JSON schemas, TS types or Zod schemas are authoritative.

**Lean correction:** Use JSON for structured governed data and optional Markdown with validated frontmatter for genuinely long prose. Zod schemas are the runtime validation authority; inferred TypeScript types are generated/inferred from those schemas. Do not use executable `.ts` files as the content store.

## Acceptance after correction

No further architecture layer is recommended. After the five clarifications above, the implementation can remain one clean Next.js App Router application with Tailwind, local components, static routes, small client islands, repository JSON/Markdown, deterministic Excel intake, focused validation and Vercel Preview/Production deployment.

## Final recheck

**REMAINING BLOCKER — two small contract details are still unspecified.**

- Brand is now explicitly zero-or-one; Pump Type remains repeated/OR and Purpose repeated/AND. However, the parser still does not define what happens when an external URL supplies repeated Brand keys. Choose one deterministic behavior—reject/remove the Brand filter or retain one documented value—so restoration, selected state and counts cannot diverge.
- Approved Home/Header/catalog query links are allowed, while combinatorial link grids and sitemap inclusion are prohibited; clean Product overview remains canonical.
- The ER model and Capability Map now use the lean `CATALOG`, `PURPOSE`, `features/catalog`, `data/catalog.json`, shared components/styles and media-metadata terms; stale release/DTO/design-system/media-manifest terms are removed from those contracts.
- Excel intake is now a required repeatable `Excel → catalog.json` process with sheet/row/field diagnostics. The spine still does not define whether it overwrites the whole catalog or which fields it owns. Define the generated/curated boundary so a later import cannot silently erase manually maintained slugs, classifications or presentation copy.
- Governed structured content is JSON validated by Zod; TypeScript is explicitly not a content authority, with non-executable Markdown allowed only where long prose warrants it.

**Final confirmation: PASS — both remaining blockers are resolved by deterministic invalid/multiple-Brand fallback to `全部` and the explicit `catalog.generated.json` importer ownership plus validated `catalog-content.json` join boundary.**
