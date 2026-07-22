# Architecture Review — Current Technology and Lean V1

- Review date: 2026-07-22
- Scope: `ARCHITECTURE-SPINE.md`
- Lens: Next.js-first, no database/backend, Vercel deployment, proportionate rigor for a small family-company public website
- Source policy: current technology and platform claims were checked against official project documentation, official package registry entries, or official Vercel documentation.

## Verdict

**REVISE — the platform direction is sound, but the implementation and governance model is materially over-engineered for this V1.**

Keep Next.js App Router, statically generated public routes, repository-owned product/content files, Vercel Preview/Production, URL-restorable catalog filters, basic SEO, explicit units/missing values, and a small set of launch checks. Remove the speculative CMS boundary, hexagonal ports/adapters, release-manifest machinery, heavyweight media workflow, mandatory three-browser test matrix, telemetry abstraction, and quarterly recovery drills.

The target should be a conventional Next.js application with a small number of typed data modules, reusable UI components, static routes, and a few focused checks. It should not be designed as a content platform before one exists.

## Executive classification

| Classification | Architecture items | Recommendation |
| --- | --- | --- |
| **MUST KEEP** | AD-1 core, AD-2, URL filter state from AD-9, semantic series/model rendering from AD-11, basic Vercel delivery from AD-12, essential parts of AD-15/16 | These directly protect searchability, accessibility, product-data accuracy, and low-maintenance deployment. |
| **SIMPLIFY** | AD-3, AD-6, AD-7, AD-8, AD-10, AD-12, AD-14, AD-15, AD-17; Stack and Structural Seeds | Keep the useful outcome, remove enterprise-grade process and abstractions. |
| **DELETE / DEFER** | “hexagonal modular frontend,” repository ports/adapters/DTO layers, AD-4 release manifests/hashes/dispositions, AD-5 as a standalone rule, AD-13 future CMS adapters, GA4 `TelemetryPort`, full media manifest/checksum system, mandatory multi-engine E2E and quarterly recovery drill | These add code and operating work without a present V1 requirement. Reconsider only after an observed need. |
| **USER DECISION** | Vercel Pro budget/ownership, Tailwind, Zod, `/zh-tw/` route prefix, minimal Playwright/axe use, analytics, News/Projects content format | Each has a real trade-off but should not be imposed by architecture. Recommended defaults are below. |

## Current technology verification

All versions named in the Stack Seed exist and were current stable releases at review time. Version correctness does not mean every package is necessary.

| Technology named in spine | Verification | Classification | Lean recommendation |
| --- | --- | --- | --- |
| Node.js `24.17.0 LTS` | Verified as an official Node.js 24 LTS security release. Vercel supports Node 24 for builds/functions, but explicitly guarantees only the `24.x` major and automatically updates minor/patch versions. [Node 24.17.0 release](https://nodejs.org/en/blog/release/v24.17.0) · [Vercel Node 24 support](https://vercel.com/changelog/node-js-24-lts-is-now-generally-available-for-builds-and-functions) | **SIMPLIFY** | Specify Node `24.x` in the project/Vercel settings. Let the lockfile pin packages; do not claim Vercel will run exactly `24.17.0`. |
| pnpm `11.15.1` | Verified in the official npm registry. [pnpm package](https://www.npmjs.com/package/pnpm?activeTab=versions) | **USER DECISION** | Prefer the package manager already present in the implementation repository. If none exists, npm bundled with Node is the lowest-decision option; pnpm is acceptable but not architecturally required. Use exactly one lockfile. |
| Next.js `16.2.10` | Verified current stable. Next.js 16.2 is an official stable line. [Next package](https://www.npmjs.com/package/next?activeTab=versions) · [Next.js 16.2 announcement](https://nextjs.org/blog/next-16-2) | **MUST KEEP** | Use the current stable scaffolded Next.js version and commit the lockfile. Do not manually keep a version table synchronized after scaffolding. |
| React / React DOM `19.2.7` | Verified current stable. [React package](https://www.npmjs.com/package/react?activeTab=versions) · [React 19.2 release](https://react.dev/blog/2025/10/01/react-19-2) | **MUST KEEP** | Accept the compatible versions selected by the Next.js scaffold; do not manage React independently unless a compatibility issue requires it. |
| Tailwind CSS `4.3.3` | Verified current stable. [Tailwind package](https://www.npmjs.com/package/tailwindcss?activeTab=versions) | **DELETE / DEFER** by default | The approved UX already has semantic CSS tokens and custom visual behavior. Use CSS Modules/global CSS plus custom properties unless the implementation repository already uses Tailwind or the developer can show it materially reduces work. Do not add it merely because it is common. |
| Zod `4.4.3` | Verified current stable and has no runtime dependencies. [Zod package](https://www.npmjs.com/package/zod?activeTab=versions) | **USER DECISION; recommended KEEP in a narrow role** | One runtime schema library is justified for imported Excel-derived catalog data and contact/company facts. Restrict it to validating build-time data; do not create a domain framework around it. If all data is authored as TypeScript and checked manually, it may be deferred. |
| Playwright `1.61.1` | Verified current stable; Playwright supports Chromium, Firefox, and WebKit. [Playwright package](https://www.npmjs.com/package/playwright) · [browser support](https://playwright.dev/docs/browsers) | **SIMPLIFY** | Keep a small Chromium smoke suite only if automated testing is desired: home, catalog filtering, series page, contact links, and one mobile viewport. Defer Firefox/WebKit CI to pre-launch or until a browser-specific defect appears. |
| `@axe-core/playwright` `4.12.1` | Verified current stable. [axe Playwright package](https://www.npmjs.com/package/%40axe-core/playwright) | **DELETE / DEFER** initially, or attach to the small smoke suite | It is useful but not a substitute for manual review. Add one scan per key template near launch rather than making a full accessibility matrix mandatory from day one. |
| Vercel | Git pushes/PRs create Preview deployments; the production branch creates Production deployments. Preview, Production, and Development are distinct environments. Instant Rollback is supported. [Git deployments](https://vercel.com/docs/git) · [environments](https://vercel.com/docs/deployments/environments) · [rollback](https://vercel.com/docs/instant-rollback) | **MUST KEEP** | Connect GitHub, use Preview URLs for review, deploy `main` to Production, and document one rollback procedure. No custom CI/CD platform is needed. |
| Vercel Pro candidate | Vercel states Hobby is for personal, non-commercial use; Pro is for professional/business use and currently carries a monthly platform fee. [pricing](https://vercel.com/pricing) · [Hobby restrictions](https://vercel.com/docs/plans/hobby) · [Pro plan](https://vercel.com/docs/plans/pro-plan) | **USER DECISION, but launch blocker if using Vercel** | This is a company website, so budget and company ownership for Pro must be confirmed before production. Do not assume Hobby is eligible because traffic is small. |
| GA4 + Search Console | These are optional product decisions, not Next.js/Vercel requirements. | **DELETE / DEFER GA4; KEEP Search Console** | Search Console has direct indexing value and no site-side analytics framework. Add GA4 only if the owner identifies questions they will actually use the data to answer and accepts consent/privacy work. |

## Verified Next.js and Vercel claims

### MUST KEEP — regular Next.js deployment on Vercel, not `output: 'export'`

The spine is correct to avoid forcing a static export. Next.js can statically render routes at build time while retaining normal platform support. App Router pages/layouts are Server Components by default, and Client Components are appropriate only for browser state or event handlers. [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) · [production checklist](https://nextjs.org/docs/app/guides/production-checklist)

`output: 'export'` would remove built-in redirects, headers, and default image optimization; the official static-export guide lists them as unsupported. Normal Vercel deployment allows `next/image` to use Vercel's optimization pipeline and allows custom response headers. [static export limitations](https://nextjs.org/docs/pages/guides/static-exports) · [Vercel image optimization](https://vercel.com/docs/image-optimization) · [Next.js headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)

**Lean wording:** “Use normal Next.js deployment on Vercel. All content pages are generated from repository data at build time; no runtime database, API, form handler, or server-side content mutation is used.” This is enough. “Static-first content-as-code hexagonal modular frontend” is unnecessary terminology.

### MUST CORRECT — Preview approval is approval of a commit, not necessarily the identical artifact

AD-4 says Production changes by “promoting an approved build.” Vercel's current guide states that promoting a Preview deployment to Production triggers a production rebuild using Production environment variables. Preview and Production are separate environments. [Preview promotion guide](https://vercel.com/docs/deployments/promote-preview-to-production) · [environment variables](https://vercel.com/docs/environment-variables)

For this no-backend site the distinction should have little practical effect, but the architecture must not promise bit-for-bit Preview/Production artifact identity. The lean and accurate rule is: approve the commit on Preview, merge/promote that source revision, then smoke-check Production.

### MUST KEEP — static route generation and simple SEO

`generateStaticParams` can generate dynamic series routes during `next build`. [generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)

Next.js already provides built-in metadata, sitemap, and robots file conventions. A small site needs one sitemap and simple route metadata, not a separate SEO subsystem. [metadata files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) · [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

## Rule-by-rule lean disposition

### MUST KEEP

1. **AD-1 core:** App Router; Server Components by default; Client Components limited to the catalog filters, mobile navigation, image viewer, disclosures, and other real interactions. No Redux/Zustand/React Query or second frontend framework.
2. **AD-2:** no CMS, database, authentication, management API, SMTP, server form, cron, or runtime writes.
3. **AD-9 core:** keep catalog state in URL query parameters so the approved home/catalog behavior survives share, refresh, and back/forward navigation. Keep OR within a dimension and AND across dimensions.
4. **AD-11:** keep one page per series and semantic model rows. Rendering roughly 491 rows as server HTML is reasonable; do not add virtualization unless measurements show a problem.
5. **AD-12 core:** Vercel + GitHub Preview/Production + rollback. Use the commercial plan required by Vercel's terms.
6. **AD-15 essentials:** HTTPS, MFA on GitHub/Vercel/domain accounts, no secrets in client code, basic security headers, no personal/contact values in analytics.
7. **AD-16 core:** semantic CSS variables and reusable accessible components. Native HTML first.

### SIMPLIFY

1. **AD-3 publication authority:** repository files should be the website source of truth, but do not require “repository adapters,” DTO projection, or release snapshots. Keep product data in a small `data/` module and editorial text in plain files. Raw Excel/PDF remains source material, not runtime input.
2. **AD-6 media:** keep originals outside the public repository, confirm permission to publish, and copy approved compressed derivatives into `public/media/`. A spreadsheet/checklist is enough; stable IDs, checksums, immutable paths, and a custom promotion tool are not mandatory.
3. **AD-7 identity/data:** use stable, human-readable keys already present in the business data, such as series/model codes. Keep explicit units and `null` for missing data. Opaque IDs, ISO timestamps on every boundary, decimal-string wrappers, and separate public DTOs are excessive without APIs or a database.
4. **AD-8 locale:** a locale prefix is cheap only if English is a credible next phase. Otherwise a Chinese-only `/` route is simpler. See USER DECISION.
5. **AD-10 SEO:** use Next.js metadata, one sitemap, `robots.ts`, a useful 404, and a short redirect list. Defer elaborate JSON-LD and a separate SEO module until content is stable.
6. **AD-12 operations:** use Vercel's standard Git integration. Do not create a custom promotion pipeline. Preview review → merge to `main` → Production smoke check is sufficient.
7. **AD-14 recovery:** keep Git history, Vercel rollback, domain ownership/recovery notes, and an off-device copy of original assets. Replace quarterly drills with one launch handoff check and repeat only after ownership/infrastructure changes.
8. **AD-15 privacy:** if GA4 is removed, delete the `TelemetryPort`, consent adapter, analytics event schema, and cross-environment analytics isolation work. Contact links must remain ordinary `tel:`, `mailto:`, and approved LINE links.
9. **AD-17 checks:** require type check, lint, production build, catalog/schema validation, broken-link check, and a short launch checklist. Run focused interaction/accessibility checks on the key templates; do not make every rare fixture and every browser a release blocker.

### DELETE / DEFER

1. **Hexagonal architecture and provider-neutral ports:** delete `ContentRepository`, `CatalogRepository`, `MediaRepository`, file adapters, composition root, and public DTO mapping layers. Direct imports from validated repository data are clearer and easier to maintain.
2. **AD-4 release package machinery:** delete schema-versioned catalog releases, `active-release.json`, content hashes, dispositions, maintainer/reviewer state, and custom atomic-release tooling. Git commits plus Vercel deployments already provide versioned releases and rollback.
3. **AD-5 standalone admin prohibition:** fold one sentence into AD-2; it does not need a separate architecture rule.
4. **AD-13 future CMS neutrality:** defer entirely. If a CMS is ever approved, refactor around the real provider and requirements then. A speculative adapter boundary today creates maintenance without protecting a demonstrated migration.
5. **Full media toolchain:** defer checksum/optimization/approval CLI tools and a machine media manifest. Use a documented filename convention and an owner-reviewed asset checklist.
6. **Mandatory GA4 and telemetry module:** defer until the company names a business question that requires analytics.
7. **Mandatory three-browser Playwright on each candidate:** defer. A Chromium smoke suite plus manual launch checks is proportionate; add cross-browser coverage for proven risk areas.
8. **Mandatory screen-reader review on every candidate and quarterly recovery drills:** replace with pre-launch review and review after substantial navigation/component changes.
9. **Markdown parser by default:** if News is not in V1 and Projects are few, use typed TypeScript/JSON content or simple page modules. Add Markdown/frontmatter only when a non-code editorial workflow actually benefits from it.

## User decisions

### D1 — Vercel account and cost

**Recommended:** Vercel Pro owned by the company or clearly transferable to it; one deploying seat is enough initially. Confirm who owns billing, GitHub, domain, MFA recovery, and handoff.

Why this cannot be silently simplified: Hobby is expressly non-commercial, regardless of traffic.

### D2 — Tailwind

**Recommended:** do not add Tailwind. Use CSS custom properties plus CSS Modules/global CSS because the mockups already depend on custom visual rules and the project explicitly prefers fewer frameworks.

Choose Tailwind only if the developer already works substantially faster with it and agrees that `DESIGN.md` tokens remain authoritative.

### D3 — Runtime validation

**Recommended:** keep Zod as the only non-framework data dependency. Validate catalog/company/contact data during build and fail with readable errors. This is valuable because the source includes Excel/PDF-derived technical data, where wrong types or missing units are more important than framework purity.

Alternative: use TypeScript data files and a small custom assertion module; this saves one dependency but requires more handwritten validation.

### D4 — URL language prefix

**Recommended if English is genuinely planned:** retain `/zh-tw/` now and add `/en/` later.

**Recommended if English is only hypothetical:** serve Chinese pages at `/` and defer locale routing. Adding a locale segment later will require redirects, but avoids carrying locale records and routing through V1.

### D5 — Testing level

**Recommended:** one small Playwright Chromium smoke suite after the main templates exist; attach axe checks to the same key pages shortly before launch. Manual mobile Safari/Chrome, keyboard, and responsive checks remain on the launch checklist. Do not require Firefox/WebKit CI on every commit.

### D6 — Analytics

**Recommended:** launch with Search Console only and no GA4. Add analytics later if someone will review it and can state the decisions it should inform. This removes consent UI, `TelemetryPort`, event schema, redaction conventions, analytics environments, and related tests.

### D7 — Editorial file format

**Recommended:** typed TypeScript or JSON for products, company/contact facts, partners, and a small number of projects. Add Markdown/frontmatter only if News or frequent project publishing enters V1.

## Recommended lean stack

| Area | Recommendation |
| --- | --- |
| Runtime | Node `24.x`; package versions locked by one committed lockfile |
| Framework | Next.js App Router + scaffold-compatible React/TypeScript |
| Styling | CSS custom properties + CSS Modules/global CSS; no Tailwind by default |
| Data | Repository-owned TypeScript/JSON; optional narrow Zod build-time validation |
| Content | Plain route/components or typed files; Markdown parser deferred |
| Interaction | React Client Components only where the approved UX needs browser state |
| Testing | type/lint/build; data and links; small Chromium smoke suite; focused launch accessibility review |
| Hosting | Vercel Pro, GitHub-connected Preview and Production deployments |
| Media | Approved optimized files in `public/media`; originals backed up outside the repo |
| SEO | Next.js metadata, one sitemap, robots, 404, and short redirects list |
| Analytics | Search Console; GA4 deferred |
| Explicitly absent | database, CMS, API, auth, admin, SMTP, state store, client-fetch cache, object storage, custom release platform |

## Recommended lean structure

```text
src/
  app/
    (public routes, layouts, metadata, sitemap, robots, 404)
  components/
    (shared header, footer, cards, filters, table, image viewer)
  data/
    products.ts-or-json
    company.ts-or-json
    projects.ts-or-json
  lib/
    catalog-filter.ts
    validation.ts        # only if needed
    seo.ts               # small helpers only
  styles/
    tokens.css
    globals.css
public/
  media/
tests/                    # only when the focused smoke suite is added
```

Avoid `modules/*/ports`, `adapters/files`, release pointers, repository interfaces, telemetry ports, media promotion tools, and future-CMS scaffolding until a real requirement makes one of them necessary.

## Proposed acceptance bar for V1

### Required before every production deploy

- Next.js production build succeeds.
- Type/lint checks succeed.
- Product data validates: unique series/model keys, required units, valid media paths, and deliberate missing values.
- Internal links and core contact links are valid.
- Preview is visually reviewed, then the same source revision is deployed to Production.

### Required once before launch, then after relevant changes

- Keyboard navigation and visible focus on each key template.
- One common mobile width and one desktop width.
- Chrome/Chromium flows: homepage filter → catalog → series, product image enlargement, contact links, and 404.
- Accessibility scan plus manual checks for headings, landmarks, alt text, table semantics, reduced motion, and mobile navigation.
- Production rollback and ownership/handoff notes are verified once.

### Not a V1 release blocker

- Three-browser automated matrix on every change.
- Quarterly recovery drills.
- Full screen-reader audit for every deployment.
- Immutable catalog release manifests and content hashes.
- CMS migration adapters.
- GA4, RUM, external uptime provider, or telemetry abstraction.

## Bottom line

The existing Architecture protects many legitimate concerns, but it converts lightweight operational needs into permanent software layers. For this site, rigor should concentrate on only four areas:

1. published technical data must be accurate and carry units;
2. navigation, filtering, tables, and contact paths must work accessibly;
3. images and company claims must be approved for public use;
4. the company must own the GitHub/Vercel/domain accounts and be able to roll back.

Everything else should default to ordinary Next.js code and Vercel's built-in workflow until the project demonstrates a need for more.
