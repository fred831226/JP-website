# Architecture Review — Adversarial Divergence / Lean V1

**Artifact reviewed:** `ARCHITECTURE-SPINE.md`  
**Review lens:** Can independently implemented units obey the written architecture and still diverge at integration? Which controls are essential for a static family-company website, and which add cost without reducing a material V1 risk?  
**Constraints applied:** Next.js; avoid additional frameworks unless essential; no database or application backend; deploy directly to Vercel; lower ceremony for low-stakes decisions while retaining correctness for public facts, product data, accessibility, security, URLs and recoverability.

## Verdict

**REVISE, THEN ACCEPT.** The core direction is sound: one Next.js application, static-first pages, repository-owned content, no database/backend/admin/forms, and Vercel deployment. The spine is currently more elaborate than this V1 needs, and it contains two integration-level contradictions that must be resolved before implementation:

1. AD-9 says all values within every filter dimension use OR, while the approved UX says multiple Purpose values use AND.
2. AD-9 requires query-dependent `noindex,follow`, but static generation plus client-side URL filtering cannot emit different metadata for each query without adding dynamic/server behavior.

The future-CMS hexagonal layer, immutable release machinery, checksum-heavy media promotion, quarterly recovery drills, and every-release three-browser/a11y matrix should be simplified or deferred. None of those are required to preserve the chosen visual design, filter interaction or Vercel deployment model.

## Classification Summary

| Classification | Keep / change |
| --- | --- |
| **MUST KEEP** | Next.js App Router; static public routes; no database/backend/admin/form; one authoritative product/content copy; validated product values and public claims; stable public URLs; accessible semantic HTML and keyboard operation; Vercel Preview/Production separation; HTTPS, MFA and secret hygiene; Git/Vercel rollback; full 491-row product-table proof before launch. |
| **SIMPLIFY** | Replace hexagonal ports/adapters/DTO ceremony with typed server-only loaders and pure mapping functions; use one current catalog dataset rather than immutable release snapshots plus active pointer; use lightweight content/media validation; reduce CI and browser matrices to risk-based gates; reduce operations documents to one concise handoff/runbook. |
| **DELETE / DEFER** | General CMS/provider-neutral repository abstraction; GA4 `TelemetryPort`; runtime analytics until explicitly selected; formal release manifests/content hashes/dispositions; quarterly recovery drills; separate original-media archive provider decision; event-version architecture; three-browser Playwright plus automated axe on every candidate; a governed `sort` query parameter; object storage and CMS migration scaffolding. |
| **USER DECISION** | Keep `/zh-tw/` from V1 versus launch Chinese at unprefixed routes; enable GA4 at launch versus defer; Vercel plan/account owner; how much editorial content is Markdown versus typed data; whether branch protection/approval promotion is worth the account/process overhead. |

## Findings

### F1 — MUST KEEP / CORRECT: Product Purpose semantics contradict the final UX

**Evidence:** AD-9 says values within a dimension use OR. `EXPERIENCE.md` says Brand is exclusive, Pump type multi-select uses OR, but multiple Purpose selections narrow to Series carrying **every** selected Purpose (AND).

**Adversarial build:**

- The Home unit creates `?use=wastewater` correctly.
- The Catalog URL parser normalizes repeated values correctly.
- The Catalog filter engine follows AD-9 and returns a Series matching *any* selected Purpose.
- The UI unit follows the approved UX copy and tells users that selecting two purposes narrows results.

Every unit can claim compliance, yet results are wrong.

**Required replacement:** Freeze one shared filter contract before stories are written:

- Brand: zero or one value.
- Pump type: repeated values, OR.
- Purpose: repeated values, AND.
- Dimensions: AND with one another.
- Search: AND with all selected dimensions.
- Remove `sort` from the schema because final UX explicitly removes sorting.

Use one exported parser/normalizer/evaluator module in both the Home link builder and Product overview. Add a small table-driven test for empty, one-value, multi-type and multi-purpose combinations. This is necessary rigor, not overengineering.

### F2 — MUST KEEP / SIMPLIFY: Static filtering and query-specific `noindex` cannot both be implemented as written

**Evidence:** AD-1 and AD-2 require static pages with no application backend. AD-9 requires filtered/search/sorted query URLs to emit `noindex,follow`. In Next.js, a statically generated page whose filter state is read client-side cannot vary server metadata according to `searchParams`. Reading query state on the server can make the route dynamic or require request-time behavior, contradicting the intended static-only envelope.

**Adversarial build:**

- The SEO unit statically emits the clean Product overview canonical and index metadata.
- The filter unit restores `?brand=...&use=...` in the browser.
- Both follow their local rules, but a crawler receives the same index metadata for the filtered URL.

**Lean replacement:** Keep a single statically generated Product overview route, restore filters client-side from `URLSearchParams`, omit query URLs from the sitemap, and emit a canonical URL pointing to the clean Product overview. Remove the promise of query-specific `noindex` unless the team explicitly accepts Vercel request-time middleware/dynamic rendering. Because the catalog is only about ten Series, client-side filtering over Series metadata is sufficient and introduces no additional data framework.

If strict `noindex` for every query combination is considered mandatory, record it as an explicit exception that introduces request-time Vercel behavior; do not let it arrive accidentally during implementation.

### F3 — SIMPLIFY: Hexagonal repositories and future-CMS neutrality create several valid but incompatible implementations

**Evidence:** The paradigm, AD-13 and Structural Seed prescribe three repositories, ports, adapters and public DTOs, while the exact file formats and mappings remain deferred. For a V1 with roughly ten Series, repository-owned content and no runtime data source, this creates abstraction choices without a current substitution need.

**Adversarial build:**

- Catalog defines `SeriesDTO` with localized objects and decimal strings.
- Identity defines flat locale fields.
- Content defines Markdown frontmatter dates and media references differently.
- Route teams import three repository interfaces with different error/missing-data rules.

All are provider-neutral, but integration and validation duplicate policy.

**Lean replacement:** Use one project-local `content/` and `data/` boundary with:

- schema-validated source files;
- server-only typed loaders (`loadCatalog`, `loadProjects`, `loadIdentity`);
- pure public projection functions where private/source fields actually exist;
- no generic repository interfaces or future CMS adapter contracts.

Pages still must not parse Excel or embed a second authoritative copy. If a CMS becomes real, refactor around the then-known API rather than paying for a hypothetical adapter today.

### F4 — SIMPLIFY: Release and media governance duplicates guarantees already supplied by Git and Vercel

**Evidence:** AD-4 requires schema version, content hash, source references, dispositions, maintainer and review state for every candidate; AD-6 requires stable IDs, checksums, rights and approval state in a media manifest; AD-14 adds release manifests, independent archives, recovery documentation and quarterly drills.

**Real risks to retain:** publishing inaccurate specifications, unlicensed images, losing original media, breaking production, and losing domain/account access.

**Ceremony to remove:** content hashes, disposition records, immutable release directories plus active pointer, per-asset checksum workflow, formal promotion state machines, and quarterly recovery exercises.

**Lean replacement:**

1. Store the current approved structured catalog and content in Git.
2. Keep simple source/rights/approved fields for externally sourced images and partner claims.
3. Keep originals in a company-controlled cloud folder with an ordinary backup.
4. Use pull/commit review when practical, Vercel Preview for visual approval, and Vercel rollback when a release fails.
5. Maintain one short handoff document listing GitHub, Vercel, registrar, analytics (if any), owners and recovery methods.

This preserves the actual business controls without building a miniature publishing platform.

### F5 — SIMPLIFY: The mandatory validation matrix is disproportionate to the site and will slow ordinary content releases

**Evidence:** AD-17 mandates Playwright in Chromium, WebKit and Firefox, axe, 320px, reduced motion, missing data, consent, 404/redirect, Preview isolation, rollback and the 491-row fixture for every candidate, plus manual keyboard and screen-reader review.

**Lean risk-based gates:**

- **Every change:** typecheck, lint, production build, schema validation, duplicate ID/slug detection, broken internal link check.
- **UI/component changes:** Chromium smoke flows and focused accessibility checks for affected screens.
- **Before launch and major navigation/filter/table changes:** keyboard pass, automated axe, mobile width, reduced motion, Chrome/Safari/Firefox spot checks.
- **Before launch and catalog-schema/table changes:** real approximately 491-row fixture, browser find, horizontal-table behavior and mobile performance.
- **Content-only releases:** schema, links, rights/approval fields and build; no full browser matrix unless shared layout is touched.

Do not add Playwright or axe merely to satisfy the architecture before there is an implemented UI to test. Native HTML and a small amount of component-level JavaScript remain the first defense.

### F6 — DELETE / DEFER: Analytics architecture is premature and can create privacy and consent work without a launch need

**Evidence:** AD-15 and the Stack Seed prescribe a consent-aware `TelemetryPort`, GA4 event conventions, isolated analytics environments and monitoring/provider decisions. This is substantial for a brochure/catalog site, particularly when no inquiry form or personal account exists.

**Lean replacement:** Make analytics a launch toggle. If the owner wants GA4, load it through one small consent-aware component and record only page/filter/phone/email click events without free text or contact values. If analytics is deferred, omit GA4, consent UI, telemetry ports and event-version infrastructure; Search Console can still be connected for indexing. Core navigation and contact links must never depend on analytics in either case.

### F7 — USER DECISION: `/zh-tw/` is defensible but adds visible V1 complexity

**Evidence:** AD-8 and the PRD require locale-prefixed routes now to avoid a future migration. This is not a correctness requirement for a Chinese-only launch; it is a tradeoff between near-term simplicity and future URL stability.

**Option A — keep `/zh-tw/`:** Recommended if English is likely. Preserve the current rule, generate no `/en/`, and keep locale handling minimal without adding an i18n framework.

**Option B — use unprefixed Chinese routes:** Simpler V1. When English is funded, move Chinese to `/zh-tw/` and add permanent redirects. This creates a future migration but removes locale routing/data ceremony now.

Either option can use plain Next.js route segments and typed content; no i18n library is necessary in V1.

### F8 — MUST KEEP: A few controls deserve strictness despite the lower-risk project context

The following are not optional polish because failure would create public misinformation, inaccessible core paths or account loss:

- Technical specifications, company facts, contact details, partner claims and project evidence must be explicitly approved.
- Product IDs/slugs and redirects must prevent broken shared/search links.
- Filter URLs must restore the visible state and use the frozen semantics in F1.
- The 491-row specification page must remain usable, searchable in-browser and horizontally contained.
- Navigation, filters, product cards, image enlargement and contact links must work with keyboard and mobile layouts.
- GitHub, Vercel and registrar must use MFA with recoverable company-controlled ownership.
- Production must be roll-backable to a known working Vercel deployment.
- No database, authentication, admin UI, contact form, SMTP, CMS or server API should be added in V1.

## Minimal Target Architecture

```text
Next.js App Router
├─ static public routes and metadata
├─ Server Components by default
├─ small Client Components only for menu, filters, image enlargement and approved motion
├─ content/            # approved Markdown only where long-form editing benefits
├─ data/               # current typed catalog, identity, partner and redirect records
├─ lib/content/        # schema validation + simple server-only loaders
├─ components/         # project components and CSS tokens; no new UI framework
├─ public/media/       # approved optimized web assets
└─ tests/              # small contract tests + risk-based browser checks

GitHub → Vercel Preview → owner approval → Vercel Production
```

Recommended initial dependencies are Next.js, React, TypeScript and the minimum validation package selected during scaffold. Tailwind should be used only if it is already present in the chosen scaffold or clearly reduces implementation effort; otherwise CSS Modules/global semantic tokens are enough. Do not add a state store, client-fetch library, CMS SDK, ORM, component framework, headless UI library, analytics SDK or testing matrix until a concrete requirement demonstrates the need.

## Proposed Architecture Decision Edits

1. Keep AD-1, AD-2, AD-5, AD-11, AD-12 and the essential parts of AD-15/16.
2. Rewrite AD-9 with the exact final UX semantics and remove `sort`.
3. Replace query-specific `noindex` with static canonical + sitemap exclusion, unless request-time behavior is deliberately approved.
4. Merge AD-3 and AD-4 into a lean rule: Git-tracked validated sources produce one Vercel deployment; Preview is approved before Production.
5. Reduce AD-6 to approval/source/rights fields and an ordinary backed-up original-media folder.
6. Replace AD-13 ports/adapters with typed server-only loaders; defer CMS abstraction.
7. Reduce AD-14 to Vercel rollback plus an account/domain/media handoff checklist; delete quarterly drill language.
8. Rewrite AD-17 as risk-based validation tiers rather than an every-release exhaustive matrix.
9. Make analytics and `/zh-tw/` explicit owner decisions before implementation planning.

## Conclusion

The project does not need more architecture; it needs fewer, clearer contracts. Freeze filter semantics, choose the query-indexing approach, choose the V1 URL locale shape, and decide whether analytics launches at all. After those decisions, a single Next.js application with typed repository files, simple loaders, project CSS, focused validation and Vercel Preview/rollback is sufficient.
