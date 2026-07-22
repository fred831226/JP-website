# JP PUMP V1 Architecture Review — Lean Next.js / Vercel

Date: 2026-07-22  
Intent: Validate and lean-update the existing Architecture Spine.  
Verdict: **REVISED — PENDING SOURCE RECONCILIATION**

The static-first direction is correct: Next.js App Router, no application backend, no CMS, no database, and Vercel deployment. The current spine is nevertheless too rigorous and layered for a small family-company public site. Keep rigor where product facts, accessibility, public URLs, account ownership, and recoverability can create real harm; simplify the rest.

## Mechanical Gate

- `lint_spine.py`: PASS, zero findings.
- The problems are semantic scope and implementation weight, not document formatting.

## Must Fix Before Implementation

1. **Replace the current `website/` starter.** It is an independent Vinext/Vite/Cloudflare/Drizzle repository, not a normal Next.js/Vercel project. Preserve reusable visual code, but scaffold one clean Next.js App Router project in the authoritative Git repository. Do not carry Vinext, Vite, Wrangler, Cloudflare D1, Drizzle, authentication helpers, or database scripts forward.
2. **Fix the filter contract.** Pump Type multi-select is OR; Purpose multi-select is AND; Brand, Type, Purpose, and Search combine with AND. Remove the obsolete `sort` query from Architecture conventions.
3. **Keep query restoration without promising per-query server metadata.** A static client-filtered page cannot emit a unique server-generated `noindex` response for every query string. Keep one clean canonical Product overview URL, exclude filter combinations from sitemap/internal crawl links, and treat query parameters only as restorable UI state.
4. **Use a commercially eligible Vercel account.** Vercel Hobby is for personal/non-commercial use; this company website needs Pro or another commercially eligible arrangement. Company ownership, MFA, domain recovery, and delegated maintainer access remain launch requirements.
5. **Correct release language.** Preview approval identifies the approved source commit. Production may rebuild with Production environment values; do not claim Preview and Production are necessarily the identical artifact.

## Keep Strict

- Product values, units, missing values, series/model relationships, and technical approval.
- Real image rights, useful alt text, and no invented project evidence.
- One authoritative Git repository and one clear Production branch.
- `next build`, TypeScript/lint, catalog schema/duplicate/unit checks, broken-link checks, and a representative 491-row test.
- Mobile layout, keyboard use, visible focus, contrast, reduced motion, and usable tables.
- Stable public series URLs, titles/descriptions, sitemap, useful 404, and basic redirects.
- Git history, Vercel Preview, Production rollback, and an independent copy of original media.
- MFA and recovery ownership for GitHub, Vercel, and domain/DNS accounts actually used.

## Simplify by Default

| Current design | Lean replacement |
|---|---|
| Hexagonal modular frontend with repository ports, adapters, and public DTO layers | Feature folders, typed server-only loaders, Zod-validated data, and small pure mapping functions |
| Unbounded Tailwind conventions | Tailwind 4 is user-approved, but utilities compose semantic JP PUMP tokens and approved layout scales |
| Immutable catalog snapshots, active-release pointer, hashes, dispositions, and release state machinery | One reviewed catalog data set in Git, source/review metadata, Git history, Preview diff, and Vercel rollback |
| Formal media manifest with stable media entity graph and checksums | Predictable approved filenames/folders plus alt/source/rights fields in content data; originals archived separately |
| Mandatory Chromium/WebKit/Firefox Playwright + axe matrix on every release | Build/schema/link checks on every change; focused Chromium smoke test; manual mobile/keyboard/accessibility and Safari check before launch or major UI changes |
| 99.9% SLA, RTO 4h, quarterly restore drills, external uptime/RUM/error-provider architecture | Best-effort availability, Vercel deployment notifications and rollback instructions; manual recovery check before launch |
| Consent-aware TelemetryPort and versioned event architecture | Defer analytics; if later enabled, add a small GA4 wrapper with no personal/free-text data |
| Provider-neutral future CMS ports in V1 | Defer CMS abstraction until a real self-service requirement exists |
| Full structured-data program | Keep Organization and Breadcrumb where useful; defer Product/Article richness until content is stable |

## Confirmed V1 Scope Decisions

These product-scope decisions were confirmed by the user on 2026-07-22.

| Item | User decision | Architecture effect |
|---|---|---|
| Latest Information list/detail | **Delete from V1** | Removes article routes, dates, archive/removal rules, Article SEO and navigation entry |
| Separate Brand/Pump Type/Purpose content pages | **Keep in V1** | Maintain locale-prefixed landing routes and governed copy; they must not become thin auto-generated pages |
| Individual Project detail pages | **Defer**; keep approved project blocks on Services & Projects | Removes another content type, routes, relationship fields and redirect lifecycle |
| GA4 events, contact attribution, consent layer, RUM | **Defer beyond V1** | Removes analytics adapter, event schema, consent state, duplicate-event tests and privacy configuration |
| Search Console | **Keep after launch** | Low implementation cost and directly useful for indexing issues |
| `/zh-tw/` prefix from day one | **Keep** | V1 routes remain under `/zh-tw/`; root redirects there |
| Partner detail pages | **Defer** unless partners need more than a short approved block | Removes routes and separate SEO/content maintenance |
| FAQ and map on Contact | **Omit until approved content exists** | Already compatible with the conditional UX; no empty placeholders |
| Home motion and interactive catalog filtering | **Keep** | These are explicitly selected visual/interaction features and need no extra framework |
| Full model tables, including the large series | **Keep** | Core technical value; implement as server HTML without virtualization |

## Lean Stack Recommendation

- Next.js App Router + React + TypeScript.
- Use the versions generated and proven by the clean current `create-next-app` scaffold; document Node as Vercel-supported `24.x`, not an exact patch.
- Tailwind CSS 4 composing semantic CSS variables and approved scales from `DESIGN.md`; no additional UI framework by default.
- Native HTML first. No component framework, state store, client fetch cache, carousel library, or headless UI dependency by default.
- Zod is the one justified optional dependency because product data originates from spreadsheets and contains hundreds of technically sensitive rows.
- Static TypeScript/JSON data and public optimized images in the repository.
- Vercel Pro, Preview deployments, merge-to-main Production, and dashboard rollback.

## User Decisions Recorded

1. Latest Information is removed from V1.
2. Brand/Pump Type/Purpose content pages remain in V1.
3. Individual Project detail pages are deferred; projects remain inside Services & Projects.
4. GA4/contact attribution/consent/RUM are deferred beyond V1.
5. `/zh-tw/` remains.
6. The existing Vinext/Cloudflare starter will be replaced during implementation by a clean Next.js App Router project with Tailwind, while preserving approved visual results.

The Architecture Spine now reflects these decisions. `SOURCE-RECONCILIATION-LEAN-2026-07-22.md` lists the PRD and UX statements that must be aligned before implementation planning is authoritative.

## Reviewer Files

- `reviews/review-lean-rubric.md`
- `reviews/review-current-tech-lean.md`
- `reviews/review-adversarial-lean.md`
