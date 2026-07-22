# Final PRD / UX / Architecture Source-Sync Review

**Date:** 2026-07-22  
**Scope:** Cross-document consistency only. This is not a visual UX validation.  
**Reviewed sources:**

- `prds/prd-JP-Website-2026-07-20/prd.md`
- `prds/prd-JP-Website-2026-07-20/addendum.md`
- `ux-designs/ux-JP-website-2026-07-21/DESIGN.md`
- `ux-designs/ux-JP-website-2026-07-21/EXPERIENCE.md`
- `ux-designs/ux-JP-website-2026-07-21/key-screen-coverage.md`
- `architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md`

## Verdict

**PASS**

No actionable contradiction was found among the updated PRD, UX spines/coverage, and Architecture Spine for the confirmed V1 decisions.

## Decision consistency matrix

| Confirmed decision | PRD / addendum | UX | Architecture | Result |
| --- | --- | --- | --- | --- |
| Latest Information / News is absent from V1 | Removed from scope, IA, routes, sitemap, publishing and data model; FR-5 and FR-19 explicitly marked removed/deferred | No Home preview or navigation entry; explicitly absent from key-screen coverage and post-V1 list | Explicitly absent from V1 routes, model, repository authority and capability map | PASS |
| Brand, Pump Type and Purpose content pages remain in V1 | FR-9 retains crawlable formal category pages | Category page component contract retained; pages are spine-only V1 surfaces under `/zh-tw/` | Standalone taxonomy pages retained in route/content structure | PASS |
| Individual Project detail pages are deferred; evidence stays in place | FR-4 and FR-20 keep governed evidence on the single Services & Projects page and prohibit public Project-detail routes/slugs | Services & projects owns semantic in-place evidence; Home teasers target the page or stable anchor, never a detail route | `projects.json` supplies summaries for Services & Projects; no individual Project article/detail route in V1 | PASS |
| Browser analytics and attribution are deferred | FR-17 and FR-34..FR-36 defer GA4, client attribution, consent and RUM; core contact remains functional without them | Reconciliation and post-V1 sections explicitly defer analytics, attribution, consent and RUM | No analytics runtime/module; GA4, attribution, consent, RUM and third-party uptime monitoring are explicitly absent/deferred | PASS |
| `/zh-tw/` remains the V1 locale prefix | V1 publishes Traditional Chinese at `/zh-tw/` | Primary surface and spine-only category pages are under `/zh-tw/`; no empty `/en/` pages | All public routes are locale-prefixed; root permanently redirects to `/zh-tw/` | PASS |
| `/website` becomes a clean Next.js App Router + Tailwind application | PRD and addendum lock the outer repository, clean `/website` scaffold, Tailwind 4, Vercel Root Directory, and removal of the Vinext/Vite/Cloudflare/Drizzle starter | DESIGN makes semantic tokens authoritative and Tailwind compositional; EXPERIENCE treats mockups as references, not runtime scaffold | AD-1, AD-12 and AD-16 define the clean App Router project, Tailwind integration and replacement of the existing starter | PASS |
| Catalog filter rules are shared and sorting is absent | One Brand; multiple Pump Types use OR; multiple Purposes use AND; dimensions/search combine with AND; URL state is restorable and non-indexable | Same Brand normalization, Pump Type OR, Purpose all-match/AND, cross-dimension AND, immediate URL-backed filtering; no sort UI | AD-9 uses `brand`, repeated `type`/`purpose`, optional `q`; same normalization and OR/AND rules; no `sort` parameter | PASS |
| Excel-generated technical data is separated from manually governed content | PRD establishes one version-controlled authority, validated import/update workflow, stable identity and no customer-facing Excel import UI; addendum keeps Excel as governed intake | EXPERIENCE requires repeatable full regeneration of importer-owned technical fields and forbids overwriting stable IDs, slugs, taxonomy, approved copy or images | `catalog.generated.json` is importer-owned; `catalog-content.json` owns manual identity/taxonomy/copy/media; validation joins them and blocks duplicate, missing or orphaned keys | PASS |

## Notes

- The PRD phrase “no permanent customer Excel import interface” is compatible with the UX/Architecture requirement for a repeatable maintainer-side import script; it prohibits a customer-facing runtime tool, not controlled build-time intake.
- Search Console remains optional after launch and does not contradict the deferral of browser analytics or RUM.
- Existing approved HTML mockups remain visual references. This review did not validate their pixels, responsiveness or implementation fidelity.

