---
title: JP-Website PRD × Lean Architecture Reconciliation
type: input-reconciliation
status: applied
created: 2026-07-22
source:
  - ../../architecture/architecture-JP-Website-2026-07-21/SOURCE-RECONCILIATION-LEAN-2026-07-22.md
  - ../../architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md
target:
  - prd.md
  - addendum.md
---

# PRD Reconciliation — Confirmed Lean V1 Architecture

## Verdict

The PRD already agrees with the architecture on static-first Next.js, Vercel, Git-governed content, no V1 backend/CMS/database, and the `/zh-tw/` prefix. It still conflicts on News, individual Project routes, analytics/attribution/consent/RUM, formal availability targets, test breadth, media abstractions, and the exact application scaffold. Apply the edits below before treating Architecture as final.

## Stable-ID rule

- Do **not** renumber FR-1..FR-36, NFR-1..NFR-13, or UJ-1..UJ-5. Existing UX, architecture, reviews, and history cite those IDs.
- Preserve removed capability slots as `DEFERRED — NOT V1` records with no V1 acceptance criteria: FR-5, FR-17, FR-19, FR-34, FR-35, FR-36.
- Amend FR-4, FR-18, FR-20, FR-21, FR-27, FR-32 and NFR-1, NFR-5..NFR-10 in place; do not create replacement IDs.
- Keep UJ-4 but change its outcome from publishing a separately routed Project article to adding/updating an approved Project summary/evidence record inside Services & Projects.
- `.memlog.md` already contains the 2026-07-22 Architecture Review override covering all scope decisions. Do not append a duplicate decision. After edits, append one `change` line summarizing PRD/addendum reconciliation and one `event` line recording completion through `memlog.py`.

## Required `prd.md` edits

### 0. Decision summary and V1 boundary

| Location | Conflict | Required edit |
| --- | --- | --- |
| 0.1 Scope in | News, GA4, attributable contact measurement remain V1 commitments. | Remove Latest Information/News and GA4/contact attribution/consent from V1. Retain Brand, Pump Type and Purpose content pages, direct phone/Email, Search Console only as an optional postlaunch connection, and approved Project summaries/evidence inside Services & Projects. |
| 0.1 Scope out | Does not explicitly exclude individual Project routes or analytics runtime. | Add individual Project detail routes, GA4, contact attribution, consent manager, RUM and third-party uptime monitoring to deferred/out-of-scope. |
| 0.2 Success summary | “Website-attributable” growth implies the deferred tracking stack. | Keep business outcome targets only if attribution is collected manually during inquiry handling. Remove browser-event-dependent claims from V1. |
| 0.3 Technical direction | Says only static-first Next.js; exact approved scaffold is absent. | State: clean official Next.js App Router application in outer repo `/website`, Tailwind CSS, Vercel Root Directory `website`, no nested repository, database or backend. Preserve approved mockups as visual references. |
| 0.3 Pending decisions | Analysis-consent method is still a V1 open item. | Remove it from V1 blockers; record analytics/consent as deferred. |

### 1–5. Narrative, metrics, glossary and journeys

- **1.2 Core problem #4, Goal 5, SM-5, glossary “designated maintainer,” and 5.1 maintainer job:** remove every News/Latest Information reference; retain company, partner, project-summary, catalog, redirect and approved-media maintenance.
- **Goal 3 and Core problem #3:** keep indexable Brand, Pump Type, Purpose and Series pages. Replace “case pages” with the Services & Projects page as the indexable Project evidence surface.
- **SM-1 and SM-2:** manual inquiry records may remain the source for qualified-inquiry and trust/product-help outcomes. Do not require client-side attribution.
- **SM-3:** retain only as a postlaunch Search Console metric when connected; it is not a launch blocker.
- **SM-4:** defer it with analytics; remove telephone/Email click-growth acceptance from V1.
- **3.6 Measurement responsibility:** delete GA4 and consent obligations. Keep manual qualified-inquiry records; optionally add Search Console after launch. Do not promise monthly client-event dashboards.
- **V2 content manager glossary:** replace `News, Projects` with a provider-neutral statement about future non-engineer editorial publishing; it is not a V1 role.
- **UJ-4:** keep the ID and governance flow, but the maintainer adds or updates a Project record displayed on Services & Projects. Remove assumptions of a standalone slug, detail page, per-article SEO fields, or item route.

### 6.1 Enterprise trust and public content

| ID/location | Required reconciliation |
| --- | --- |
| Section purpose | Remove “資訊” where it denotes News. State that Services & Projects is one public page containing service Hero plus approved Project summaries/evidence. |
| FR-1 | Remove Latest Information from the About submenu. About contains Company Information and Partners. Keep Services & Projects as a direct route. |
| FR-2 | Already says the home page does not show News; strengthen this to “V1 has no News module or route,” without changing the approved home composition. |
| FR-4 | Replace “list and individual content” with cards/sections on the same Services & Projects page. No Project card may imply or link to an individual Project route in V1. Keep approved facts, images, services, related-product references and evidence governance. |
| FR-5 | Rename heading to `FR-5：[DEFERRED — NOT V1] 最新資訊`. Replace description/acceptance bullets with one traceability note: no V1 News navigation, model, list, detail route or home module; reconsider only when editorial ownership and update frequency are validated. |

### 6.4 Contact handoff

- **FR-17:** retain ID as `DEFERRED — NOT V1`. V1 phone and Email links work normally but do not emit attribution events or source-context telemetry.
- The independent Contact page remains unchanged; no form is introduced.

### 6.5 Publication and governance

| ID | Required reconciliation |
| --- | --- |
| FR-18 | Remove News from authoritative sources. Name Project summaries/evidence as records owned by the Services & Projects content source. Keep Git as sole V1 publication authority. |
| FR-19 | Retain ID as `DEFERRED — NOT V1`; no News fields, route, publication state or sitemap behavior is required. |
| FR-20 | Keep version-controlled Project maintenance, but remove public Project slug/detail-route and per-item SEO requirements. Use stable internal Project IDs for relationships and a collection-level Preview/Production release. Project records remain fact/rights-gated. |
| FR-21 | Remove News references. Replace mandatory media entity graph/stable media ID wording with approved optimized files plus required alt, source, rights and approval metadata. Originals remain in an independent archive; checksums or a full relationship graph are optional, not V1 acceptance criteria. |

### 6.6 Search discovery and measurement

| ID/location | Required reconciliation |
| --- | --- |
| Section title/purpose | Rename to Search Discovery; remove “effect measurement” and event-measurement language. |
| FR-27 | Remove News. State that Project evidence is reachable within the Services & Projects page; do not imply Project detail URLs. Keep Company, Partners, Brand, Pump Type, Purpose and Series crawl paths. |
| FR-28 | Keep locale-prefixed stable URLs and explicitly retain `/zh-tw/`; no Project/News detail URL is generated. |
| FR-30 | Keep formal Brand, Pump Type and Purpose landing pages in V1. |
| FR-32 | Limit V1 structured data to accurate basic Organization and Breadcrumb data where applicable. Remove Article requirements and avoid promising rich Product eligibility beyond displayed facts. |
| FR-34..FR-36 | Preserve each ID as `DEFERRED — NOT V1`; no GA4 event model, measurement-integrity runtime, consent manager or analytics-degradation behavior is a launch requirement. Core browsing and direct links must not depend on tracking. |

### 7. NFR reconciliation

| ID | Required wording |
| --- | --- |
| NFR-1 | Keep LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1 as launch-quality goals checked with representative prelaunch lab tests. Remove the V1 requirement to judge them from real-user measurement; Vercel data may be used only if available without adding the deferred analytics/RUM stack. |
| NFR-5 | Keep HTTPS, security headers, MFA, least privilege, secret isolation, Preview `noindex`/protection and dependency review. Remove GA4 account obligations. |
| NFR-6 | State that V1 sends no browser analytics/contact-attribution data and introduces no non-essential analytics cookies, so no analytics consent tooling is required. Direct phone/Email remains privacy-safe and usable. |
| NFR-7 | Replace contractual 99.9% monthly availability and 4-hour RTO with best-effort Vercel availability, documented rollback, Git history, known-good deployments, domain/account recovery ownership and an off-device original-media backup. Put any SLA/response target in a maintenance agreement. |
| NFR-8 | Align the browser floor with Tailwind 4’s modern baseline and state the practical launch checks: current Chrome/Edge, Safari 16.4+, Firefox 128+, current mobile Safari/Chrome; no IE. Hover-only behavior remains enhancement. |
| NFR-9 | Require deployment-failure visibility, broken-link checks, useful Vercel diagnostics and optional postlaunch Search Console. Defer RUM, external uptime monitoring and major frontend-error providers. |
| NFR-10 | Each candidate passes type/lint/build, schemas, stable-ID/slug uniqueness, alt/source/rights, links and sitemap. Focused Chromium smoke covers navigation, catalog filters, image interaction and the ~491-row fixture. Manual mobile, keyboard/focus, reduced-motion and Safari checks occur before launch and after major UI changes—not a full matrix on every change. |

### 8–9. Dependencies, risks and open items

- **8.1 architecture/implementation dependency:** specify the clean official Next.js App Router + Tailwind application in `/website`; outer `JP-Website` is the only repository; Vercel Root Directory is `website`; existing Vinext/Vite/Cloudflare/Drizzle starter is replaced during implementation while visual results are ported.
- **8.1 formal-operations dependency:** replace GA4/monitoring/consent setup with domain, commercially eligible Vercel account, account ownership/MFA/recovery, rollback verification, and optional postlaunch Search Console.
- **8.2 analytics risk:** replace “only tracking phone/Email clicks” with “V1 business outcomes rely on a small manual inquiry log; client-side attribution is intentionally deferred.”
- **8.2 content abstraction risk:** replace “CMS-neutral DTO” with small typed server-only loaders over validated repository files. A future CMS triggers a new architecture decision; do not build ports/adapters now.
- **Open item 1:** replace News/Projects CMS wording with generic future non-engineer editorial publishing and remove DTO compatibility as a V1 concern.
- **Open item 2:** record Vercel as confirmed but require a commercially eligible plan, billing/ownership/MFA/recovery confirmation, outer-repo deployment, and Root Directory `website` before attaching the domain.
- **Open item 6:** remove as a V1 open item. Add it to Deferred: revisit only if GA4 or another non-essential tracker is later proposed.

## Required `addendum.md` edits

| Section | Required edit |
| --- | --- |
| Decision status summary | Lock clean Next.js App Router + Tailwind CSS + Vercel; identify `/website` as application root inside the outer authoritative repository. State that Vinext, Vite, Cloudflare/Wrangler, Drizzle and a nested Git boundary are not retained. Analytics remains deliberately deferred. |
| Content responsibility | Remove News as a V1 content type. Describe Project summaries/evidence as governed records rendered on Services & Projects, not articles with individual routes. |
| Technical status | Add Tailwind as the adopted utility layer over semantic CSS tokens; native HTML and small local components are default; no additional UI framework/state store/headless library without demonstrated need. |
| V2 paragraph | Remove the requirement for CMS-neutral abstractions in V1. Say a real future provider or runtime write need triggers a new architecture decision and then an adapter/refactor if warranted. |
| Main navigation | Remove Latest Information from About. Keep Company Information and Partners; preserve Brand/Pump Type/Purpose landing-page flows. |
| Home content | Replace “News remains as a separate list/detail” with “News is absent from V1.” Keep the current approved home composition. |
| Services & Projects responsibility | State that cards/sections remain on the single page and do not link to individual Project routes. Keep fact, rights and evidence restrictions. |
| Contact page | Remove the statement that source context may be retained for internal analytics; V1 has no attribution runtime. |
| Media preparation | Keep approved optimized derivatives plus alt/source/rights/approval metadata and an external original archive. Do not require a full media entity graph or checksums. |

## No-change confirmations

- Keep `/zh-tw/` now and reserve independently reviewed `/en/` content for later.
- Keep Brand, Pump Type and Purpose landing pages and their crawlable original content.
- Keep approximately 10 Series pages and approximately 603 Model rows, including the ~491-row extreme fixture.
- Keep direct phone and Email handoff, no form, no pricing, no inventory, no commerce and no automated engineering selection.
- Keep approved UX mockups and DESIGN/EXPERIENCE contracts as visual references; implementation technology changes do not authorize visual redesign.

## Completion check

After applying these edits: search `prd.md` and `addendum.md` for `最新資訊`, `News`, `GA4`, `歸因`, `同意`, `RUM`, `99.9`, `RTO`, `個別內容`, `CMS-neutral`, and `DTO`. Every remaining occurrence must be either an explicitly labelled deferred-history note or a non-V1 revisit condition. Then verify FR-1..FR-36, NFR-1..NFR-13 and UJ-1..UJ-5 still have stable, unique IDs.
