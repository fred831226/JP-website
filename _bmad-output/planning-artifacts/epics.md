---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/prd.md
  - _bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/architecture/architecture-JP-Website-2026-07-21/SOURCE-RECONCILIATION-LEAN-2026-07-22.md
  - _bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/EXPERIENCE.md
---

# JP-Website - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for JP-Website, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Professional buyers can use consistent desktop and mobile navigation to reach Product Overview, Services & Projects, Company Information, Partners, Contact, and Home, with click/keyboard-operated single-level menus and a three-group global footer.

FR2: Professional buyers can understand JP PUMP's positioning and approved trust evidence on Home, use a Brand/Purpose quick filter with optional default-all values, and reach the full catalog while the finite Hero media degrades safely to a static final frame.

FR3: Professional buyers can view approved company facts and a vertically ordered Partners page whose names, logos, relationship descriptions, official links, and claims remain traceable to approved sources and rights.

FR4: Professional buyers can view approved service capabilities and complete, rights-cleared Project summaries/evidence in place on one Services & Projects page without individual Project detail routes.

FR6: Professional buyers can browse every published Series on Product Overview through readable, responsive, whole-card links that show approved imagery, classification context, description, and reviewed head/flow summaries.

FR7: Professional buyers can filter Series by one Brand, multiple Pump Types, multiple Purposes, and search, using Brand exclusivity, Pump Type OR logic, Purpose AND logic, and AND across dimensions.

FR8: Professional buyers can see current filter conditions and result counts, remove individual conditions, clear all conditions, recover from an empty result, and restore the same valid state after reload or sharing.

FR9: Professional buyers and search engines can reach approved Pump Type landing pages that contain unique explanatory copy and relevant Series; Brand and Purpose remain Product Overview filters and Series metadata without standalone pages.

FR10: Each Series has exactly one canonical detail page containing an ordered image, four-field key-data block, approved introduction, complete Model table, non-interactive Purpose tags, and clearly separated Contact and return actions.

FR11: Professional buyers can inspect every approved Model and its aligned specifications in a semantic table that retains all information on mobile and represents missing values as `未提供`.

FR12: Professional buyers can read approved Series copy and governed, non-interactive Purpose tags; V1 does not add an extra performance section or PDF/technical-document download surface.

FR13: Cross-type Series such as VBSG remain one canonical Series page, are discoverable from every approved Pump Type, and show Model-level Pump Type only when supported by governed source data.

FR14: Public Series and Model data is technically reviewed and internally traceable to source, reviewer, and review date; public pages show the last-updated date and direct buyers to confirm final suitability with JP PUMP.

FR15: Professional buyers can use approved phone and Email actions and view approved address information on one direct Contact page; optional LINE, hours, FAQ, and map content appears only when approved, and no contact form or source attribution is used.

FR16: Company, Partners, Services & Projects, Pump Type, and Series surfaces provide keyboard-accessible contextual links to Contact without requiring a return to Home or obscuring content.

FR18: A designated maintainer can manage all V1 content, taxonomy, catalog, redirects, and public-media references through one version-controlled authority, with no CMS, admin login, management API, database write path, or authoritative JSX duplication.

FR20: A designated maintainer can create, update, preview, publish, remove, and roll back approved Project summaries/evidence on Services & Projects while fact, rights, and sensitive-information failures block Production.

FR21: A designated maintainer can publish only approved, optimized media derivatives with useful filenames and required alt, source, rights, and approval metadata while originals remain in an independently backed-up private archive.

FR22: A designated maintainer can govern Brands, Pump Types, Purposes, approximately 10 Series, approximately 603 Model rows, and product media through one versioned structured source with stable identity and source traceability.

FR23: A designated maintainer can review data differences, automated checks, affected pages, and a commit-bound Vercel Preview before an atomic Production promotion, and can restore a prior known-good deployment.

FR24: Product publication validates duplicate identities, required fields, numeric values and units, taxonomy relationships, source/rights metadata, and offline technical review; critical failures block release.

FR25: The initial catalog can be processed and published in reviewed batches, assigning each source record a reviewed, pending, insufficient, or excluded disposition without guessing missing values or creating individual Model pages or a permanent client upload UI.

FR26: Content, media, and routes support a future independently reviewed English edition while V1 generates only Traditional Chinese content under `/zh-tw/` and never creates empty or machine-translated `/en/` pages.

FR27: Every indexable Company, Partner, Pump Type, Series, and Services & Projects page is reachable through ordinary crawlable links from Home, Product Overview, or an approved Pump Type page.

FR28: Every indexable page has one stable, shareable, locale-prefixed URL; renamed or removed content receives a nearest-relevant permanent redirect when available, never a blanket Home redirect.

FR29: Every indexable page has a content-accurate, language-appropriate, distinct page title, primary heading, and summary rather than mass-produced name substitutions.

FR30: Filter URL state can be shared and restored but arbitrary combinations remain outside the sitemap and search index; only approved original Pump Type pages are indexable taxonomy pages, while Brand and Purpose never generate standalone pages.

FR31: The system produces a sitemap from the same promoted content state, containing only published canonical indexable routes and updating atomically with Production.

FR32: The system emits accurate basic Organization and Breadcrumb structured data that matches visible content and never invents price, availability, rating, or unsupported rich-result claims.

FR33: Visitors to invalid or retired URLs receive the correct redirect or useful not-found response with relevant recovery navigation instead of a false success page.

Deferred scope guard: FR5, FR17, FR19, and FR34-FR36 are traceability tombstones and must not produce V1 Epics or Stories. News, individual Project detail pages, analytics, contact attribution, consent tooling, and RUM require new product decisions before reactivation.

### NonFunctional Requirements

NFR1: Home, Product Overview, Series, and Contact target LCP <= 2.5 s, INP <= 200 ms, and CLS <= 0.1 in prelaunch lab testing with representative mobile devices and production-shaped media; V1 does not depend on RUM.

NFR2: Mobile and desktop provide equivalent core content and actions; at 320 CSS px there is no page-level horizontal scrolling or lost function, while only a clearly labelled Model-table container may scroll horizontally.

NFR3: Core public journeys meet WCAG 2.2 AA, including complete keyboard operation, visible focus, semantic headings and landmarks, useful alt text, labelled controls and errors, polite announcements, 44x44 CSS px targets, and at least 4.5:1 general-text contrast, verified manually as well as automatically.

NFR4: Home media and micro-interactions do not impair comprehension, performance, or accessibility; the photo sequence runs once for no more than five seconds and reduced-motion, data-saving, or failure conditions immediately show the final static frame.

NFR5: Production uses HTTPS, sensible security headers, least-privilege/MFA/recoverable Git, Vercel, and domain accounts, non-public secrets, unindexed or protected Previews, dependency checks, and release blocking for high-risk vulnerabilities.

NFR6: V1 sends no browser analytics or contact-attribution data, sets no nonessential analytics cookies, collects no mail body or extra personal data, and therefore requires no analytics consent interface.

NFR7: Availability follows Vercel best effort rather than a product SLA; recovery uses Git history, known-good Vercel deployments, documented domain/account ownership, and an off-device original-media backup, with no database recovery requirement.

NFR8: The interface supports Chrome 111+, Safari 16.4+, Firefox 128+, current Edge, iOS Safari, and Android Chrome; Internet Explorer is excluded and all actions remain usable by touch and keyboard without hover dependence.

NFR9: Operators can see deployment failures, broken-link results, and useful redacted Vercel diagnostics; Search Console may be connected after launch, while RUM, third-party uptime monitoring, and a frontend error service remain deferred.

NFR10: Every candidate release runs type, lint, build, schema, stable-ID/slug, rights/alt/source, relationship, link, and sitemap checks plus focused Chromium smoke tests and required manual mobile, keyboard/focus, reduced-motion, Preview-isolation, 404, and Safari checks; failed releases leave the previous deployment active.

NFR11: Missing technical values render as unavailable and are never inferred or zero-filled; product, partner, Project, media, claim, and specification records preserve source, rights, approval, and review integrity, and critical errors block release.

NFR12: V1 correctly marks Traditional Chinese language and keeps locale-explicit content, media, slugs, and URLs ready for a future separately reviewed English edition without fallback copies or machine-filled content.

NFR13: The public site presents a complete, modern, restrained, technically credible industrial B2B experience using verified evidence and readable specifications; visual structure relies on whitespace, tonal surfaces, typography, and restrained shadows, with Contact as the only dark page treatment and no misuse of AI imagery or the supplied logo.

### Additional Requirements

- Starter requirement for Epic 1 Story 1: replace the current `/website` Vinext/Vite/Cloudflare/Drizzle starter and nested repository boundary with a clean official Next.js App Router scaffold in the authoritative outer `JP-Website` repository; preserve approved mockup behavior as a reference rather than runtime code.
- Establish `/website` as the Vercel Root Directory and use a commercially eligible Vercel plan; branch changes create non-indexable Previews and only an approved named commit/deployment serves the purchased Production domain.
- Seed the clean scaffold with Node.js 24 LTS, pnpm 11.15.1, Next.js 16.2.10, React/React DOM 19.2.7, the scaffold-compatible TypeScript compiler, Tailwind CSS 4.3.3, Zod 4.4.3, and Playwright 1.61.1, locking exact versions during scaffolding.
- Configure Tailwind through `@tailwindcss/postcss`, one global `@import "tailwindcss"`, and CSS-first semantic tokens; do not add legacy Tailwind v3 directives, a JavaScript Tailwind config, separate autoprefixer, Sass/Less/Stylus, another component framework, a general state store, or a headless library by default.
- Use Next.js App Router Server Components and static generation by default; restrict Client Components to actual browser-state interactions and do not create a parallel SPA, client data-fetch cache, or client-only content delivery.
- Use normal Next.js deployment on Vercel rather than forcing `output: 'export'`, retaining platform redirects, security headers, image optimization, Preview, and rollback capabilities without introducing an application backend.
- V1 must contain only public routes, typed server-only content loaders, validation/import scripts, tests, and release tooling; it must not introduce a CMS, database, ORM, authentication, admin surface, management API, job queue, SMTP, server-side form, runtime writes, analytics, or RUM.
- Store Company, Services/Projects, taxonomy, Partners, Contact, redirects, catalog, and media metadata as schema-validated JSON; allow non-executable Markdown only for explicitly long editorial prose, with no MDX requirement.
- Keep loaders small, typed, server-only, and direct; do not prebuild provider-neutral repositories, adapters, or CMS ports until a real second provider or runtime-write path is approved.
- Split catalog governance between importer-owned `catalog.generated.json` technical Series/Model fields and manually governed `catalog-content.json` stable IDs, slugs, taxonomy mappings, approved copy, and image references.
- Provide a repeatable validated Excel intake that fully regenerates only importer-owned data, reports file/sheet/row/field failures, leaves the current generated catalog unchanged on failure, and never overwrites manually governed fields.
- Join generated and manual catalog sources by stable Series/Model keys and fail validation on duplicate, missing, or orphaned records; the initial Pump Type mapping uses source Excel main-sheet column G but still requires JP PUMP technical review.
- Use stable string IDs independent of display names and slugs; relationships store IDs, locales own mutable slugs, retired slugs require redirect/404 treatment, boundary timestamps use ISO 8601 UTC, and date-only content uses `YYYY-MM-DD`.
- Represent technical numbers as reviewed decimal strings plus governed unit enums; use `null` for unavailable data and render `未提供`; zero is valid only when explicitly reviewed.
- Parse `brand`, repeated `type`, repeated `purpose`, and optional `q` through one shared query schema; normalize/deduplicate values, reset invalid/multiple Brand to all, preserve valid unrelated conditions, and omit sorting.
- Keep the statically generated Product Overview server page independent of `searchParams`; place the small URL-driven filter Client Component under `Suspense` and give it validated Series-level metadata rather than full Model specifications.
- Render all reviewed Model rows as semantic non-hydrated server HTML, using the approximately 491-row SB/SBI/SBN fixture as the extreme baseline; pagination or virtualization requires a new UX/architecture decision.
- Generate only `/zh-tw/` in V1, permanently redirect root requests to it, and do not generate `/en/` until independently reviewed locale records exist.
- Derive metadata, canonical URLs, Organization/Breadcrumb JSON-LD, internal links, redirects, robots directives, and sitemap entries from the same validated promoted repository state; Preview and Development remain `noindex`.
- Keep originals and rights evidence in an independently backed-up transferable archive; place only approved optimized derivatives in `public/media`, and defer object storage/CDN until measured repository, build, or cache constraints justify it.
- Make each publication immutable and atomic: validated Git commit -> Vercel Preview -> JP PUMP approval -> Production promotion; archive/removal is another reviewed commit and rollback restores a named known-good deployment.
- Validation and release evidence must expose source commit, affected pages, validation outcome, Preview URL, approval state, Production result, and rollback target without creating a custom JP PUMP admin interface.
- Focused Chromium smoke coverage must include navigation, filters, image enlargement, and the approximately 491-row Series fixture; prelaunch and major-UI-change review must cover mobile, keyboard/focus, reduced motion, useful 404s, Preview isolation, and Safari.
- Provide operations documentation for content/catalog updates, deployment, rollback, domain/account recovery, Production ownership, and maintainer handoff; another qualified maintainer must be able to complete an update.
- Preserve Git history, known-good Vercel deployments, domain configuration documentation, and off-device source-media/rights backups; verify rollback and domain recovery before launch and after major ownership changes.
- Treat approved foreign-brand content/rights, governed taxonomy and Model fields, corporate/contact facts, partner claims, Project evidence, public media rights, Vercel commercial/account ownership, domain setup, and original-media archive selection as release dependencies rather than architecture gaps.
- Do not implement News, individual Project detail routes, English publication, contact forms, accounts, CRM, engineering selection tools, pricing, inventory, commerce, analytics/attribution/consent/RUM, third-party uptime monitoring, or CMS/backend/database features in V1.

### UX Design Requirements

UX-DR1: Transcribe the complete `DESIGN.md` color, typography, radius, spacing, elevation, and component tokens into semantic CSS custom properties composed through Tailwind; `DESIGN.md` remains the single visual authority.

UX-DR2: Use the Technical Blueprint palette: Blueprint Gray page canvas, white content surfaces, Technical Navy identity fields, Action Blue for actions/links/focus, Slate for secondary text, and Identity Gold only as one small optional identity detail; reserve error/warning colors for real states.

UX-DR3: Use the Traditional Chinese system sans stack and documented responsive type scale, keep units adjacent to values, use tabular numerals where available, and avoid decorative fonts or long all-caps English labels.

UX-DR4: Use the 8 px spacing rhythm, 1200 px content maximum, 720 px prose maximum, 32 px desktop and 20 px mobile gutters, 6 px control radius, and no more than 8 px radius for ordinary panels/cards.

UX-DR5: Build hierarchy through whitespace, tonal surfaces, typography, and restrained ambient shadows; avoid obvious outer outlines on ordinary cards/panels while retaining functional borders for tables, insufficient-contrast controls, errors, and focus.

UX-DR6: Implement a consistent global Header with linked logo, invariant navigation order/destinations, visible and programmatic current location, minimum 44 px targets, and a labelled mobile menu trigger.

UX-DR7: Implement Product and About dropdowns that open only by click/keyboard, expose expanded state and a directional cue, close on second activation/outside click/Escape, return focus to the trigger, and never exceed one menu level.

UX-DR8: Implement the Home Hero as approved media plus a readable navy-overlaid copy/filter panel; its finite photo sequence runs once for at most five seconds and all reduced-motion, data-saving, or media-failure paths show the usable final static frame.

UX-DR9: Implement the Home quick filter with permanently visible Brand and Purpose labels, both defaulting to `全部`, no required-field error, one submit action, stacked mobile controls, and normalized restorable Product Overview URL state.

UX-DR10: Implement the Home company summary as concise approved context plus optional approved facts; omit missing facts and collapse the fact surface when empty, while any pipe/water decoration remains non-semantic and cannot appear as evidence.

UX-DR11: Implement Home Purpose cards with approved large imagery, Purpose title, two short sentences, one translucent arrow, and one whole-card link that applies Brand=all plus exactly one Purpose; hover/focus zoom must not move or obscure the card.

UX-DR12: Implement three Home gateway blocks for Product Overview, Services & Projects, and Contact; wide pointer/focus interaction may expand the active block and contract siblings without revealing new content, while touch/narrow layouts remain fixed and stacked.

UX-DR13: Reuse Project and Partner destination components for Home teasers, route Project teasers only to Services & Projects or stable in-page anchors, and remove the entire optional teaser section when no approved content exists.

UX-DR14: Implement Product Overview with a compact technical Hero followed by an always-visible cool-gray filter rail containing series/model search, exclusive segmented Brand options, multi-select Pump Type chips, multi-select Purpose chips, removable active tags, and one clear-all action; no dropdown/apply/sort pattern is used.

UX-DR15: Make every filter apply immediately with equivalent pointer, touch, and keyboard behavior, programmatic selected state, effective 44 px targets, polite result-count announcements, no focus movement, and no remote loading or empty-list flash.

UX-DR16: Implement Product cards as borderless white top-image whole-card links in a two-column wide/one-column narrow grid, with approved image, tonal category tag, Series title, approved description, one or two unit-bearing key-data lines, and non-interactive `看更多` cue.

UX-DR17: Give Product cards restrained lift/shadow hover feedback and a 3 px Action Blue focus outline with 2 px surface offset; do not add nested buttons, hard image frames, category color strips, or a three-column grid.

UX-DR18: Implement Pump Type pages with one crawlable approved introduction followed by the shared Product Overview card/result language; empty Pump Types retain their introduction and offer Product Overview and Contact. Brand and Purpose stay in Product Overview filters without standalone page templates.

UX-DR19: Preserve the Series reading order: suitability-confirmation note, approved product image, exactly four key-data fields, approved introduction, complete Model table, non-interactive Purpose tags, and page actions.

UX-DR20: Implement Product image enlargement as a keyboard/touch/pointer trigger and focus-trapped dialog with labelled close control, Escape support, in-dialog loading/failure recovery, and focus restoration; unavailable imagery shows a labelled surface and does not open an empty dialog.

UX-DR21: Implement the four-field key-data block for min/max head in `m` and min/max flow in `L/min`, using clear alignment and `未提供` for missing approved values.

UX-DR22: Implement the Model table with semantic programmatic header/Model relationships, all approved rows, tabular numerals, explicit units, `未提供` missing cells, optional useful sticky visual header, visible horizontal-scroll cue, and scrolling confined to the labelled table region.

UX-DR23: Implement Purpose/Use tags as neutral non-interactive labels with no focus, click, link, filter, or hover affordance.

UX-DR24: Implement contextual `前往聯絡頁` actions without sticky overlays or origin storage; on Series pages place Contact and return actions together, horizontal on medium/wide layouts and full-width Contact-first stacking on narrow layouts.

UX-DR25: Implement Contact as the only deep-dark one-page composition, ordered as Hero/service summary, approved contact information, approved FAQ, conditional map, and Footer; never show a source-specific message or return-to-product/Series action.

UX-DR26: Implement Contact information as labelled rows for approved address, phone, Email, and optional official LINE, with native `tel:`/`mailto:` actions and minimum 44 px action height; omit each unapproved or missing row.

UX-DR27: Implement approved Contact FAQs as independent keyboard-operable native disclosures with visible plus/minus cues and 44 px targets; omit the whole section and expand Contact information when no approved QA exists.

UX-DR28: Implement Partners as one centered vertical sequence of horizontal blocks with approved Logo, 3-4 sentence description, and optional labelled official external link; stack and center each block on narrow layouts and never convert to a multi-column card grid.

UX-DR29: Implement Services & Projects with a deep-navy service Hero and an evidence-led vertical list; every Project is a semantic in-place section pairing rights-cleared media with approved facts and optional separately labelled Series/Contact links, never a whole-block link or individual detail route.

UX-DR30: Implement the global Footer with company Logo/identity, primary navigation, and approved contact information in that order, stacked identically on narrow screens, with 44 px keyboard-reachable links and no duplicate IA, placeholders, or unapproved legal links.

UX-DR31: Implement public empty/error states with factual plain language, preserved recoverable state, one primary recovery action, optional Contact path, tonal surface, and no fake success content, filler cards, or misleading illustration.

UX-DR32: Ensure statically generated public content is present in initial HTML rather than hidden behind client-only loading skeletons; individual media failures use labelled fallbacks without fabricating content.

UX-DR33: Preserve Browser Back filter state, result position, and source-page position where practical; reload/share restores filters, and there is no infinite scroll, drag-only operation, hidden filter submission, autoplay loop, sticky contact overlay, or nested modal.

UX-DR34: Use factual, calm, direct Traditional Chinese microcopy and approved nouns consistently; never imply suitability, measured contact attribution, unsupported quality claims, or guessed specifications.

UX-DR35: Meet the accessibility floor across every component: real document outline and landmarks, visible labels and focus, accessible names, visual/programmatic selected and expanded states, logical tab order, useful alt text, empty alt for decoration, polite live regions, connected errors, 44x44 px targets, and manual keyboard/screen-reader review.

UX-DR36: Apply content-driven responsive behavior starting around >=1120 px, 720-1119 px, <720 px, and 320-399 px while keeping identical content/actions and adapting only layout and open/close mechanics.

UX-DR37: At 320 CSS px preserve 20 px gutters where possible, full-width controls/cards, no lost content or page-level horizontal scroll, and only the labelled Model-table region as a horizontal-scrolling exception.

UX-DR38: Honor `prefers-reduced-motion` by skipping Hero sequencing and nonessential transitions; hover remains enhancement only and all navigation/content is visible and usable without it.

UX-DR39: Preserve the supplied JP PUMP logo lettering and structure; cleaning/cropping/export requires approval, the original sign is historical evidence, and AI-enhanced sign or construction imagery is mood/atmosphere only.

UX-DR40: Use only approved rights-cleared real media as Project and product evidence, maintain useful alt/source/rights metadata, and never describe AI atmosphere as a real Project or rely on visual plausibility for product correctness.

UX-DR41: Use existing Git, CI, validation, Vercel Preview, Production, and rollback interfaces for the maintainer journey; do not create custom branded operational screens or publishing controls.

### FR Coverage Map

FR1: Epic 1 - Visitors can navigate all completed public trust and contact surfaces consistently.
FR2: Epic 2 - Visitors can understand the Home proposition and begin product discovery through the quick filter.
FR3: Epic 1 - Visitors can verify approved company and partner information.
FR4: Epic 1 - Visitors can review approved service capabilities and Project evidence in place.
FR6: Epic 2 - Visitors can browse all published Series on Product Overview.
FR7: Epic 2 - Visitors can combine governed Brand, Pump Type, Purpose, and search conditions.
FR8: Epic 2 - Visitors can inspect, remove, reset, share, and recover filter state and empty results.
FR9: Epic 2 - Visitors can browse substantive Pump Type landing pages while using Brand and Purpose as Product Overview filters.
FR10: Epic 2 - Visitors can use one canonical, complete detail page per Series.
FR11: Epic 2 - Visitors can inspect all approved Model specifications accessibly.
FR12: Epic 2 - Visitors can read approved Series copy and identify governed Purposes.
FR13: Epic 2 - Visitors can find one cross-type Series from every approved Pump Type.
FR14: Epic 2 - Visitors can trust reviewed technical data and understand the suitability-confirmation boundary.
FR15: Epic 1 - Visitors can use approved direct Contact information without a form or attribution.
FR16: Epic 1 - Visitors can reach Contact contextually from public trust surfaces; Epic 2 reuses the same contract on catalog surfaces.
FR18: Epic 3 - Maintainers manage all V1 public sources through one version-controlled authority.
FR20: Epic 3 - Maintainers can safely version and publish Project evidence.
FR21: Epic 3 - Maintainers can promote only approved, rights-cleared optimized media.
FR22: Epic 3 - Maintainers govern the complete structured catalog through one authoritative model.
FR23: Epic 3 - Maintainers can preview, approve, promote, and roll back atomic releases.
FR24: Epic 3 - Maintainers block invalid or unreviewed product data before publication.
FR25: Epic 3 - Maintainers can process the initial Excel catalog in controlled reviewed batches.
FR26: Epic 4 - V1 publishes only Traditional Chinese while preserving an explicit future English foundation.
FR27: Epic 4 - Search engines and visitors can reach every indexable page through ordinary links.
FR28: Epic 4 - Visitors can rely on stable locale-prefixed URLs and relevant redirect behavior.
FR29: Epic 4 - Search results and browser surfaces receive distinct accurate titles and summaries.
FR30: Epic 4 - Shareable Brand/Purpose/filter state remains outside the index while substantive Pump Type pages remain discoverable.
FR31: Epic 4 - Search engines receive an atomic Production-derived canonical sitemap.
FR32: Epic 4 - Search engines receive accurate Organization and Breadcrumb structured data.
FR33: Epic 4 - Visitors recover safely from invalid, retired, or removed URLs.

## Epic List

### Epic 1: Verify JP PUMP and Make Direct Contact

Visitors can understand who JP PUMP is, verify approved company, partner, service, and Project evidence, navigate the public trust surfaces, and reach accurate phone or Email contact without tracking or a form.

**FRs covered:** FR1, FR3, FR4, FR15, FR16

**Implementation notes:** Establishes the clean application scaffold, semantic token foundation, shared Header/Footer, Home trust route, Company, Partners, Services & Projects, Contact, responsive/accessibility primitives, and approved-content omission states. Later catalog surfaces reuse these contracts without changing this Epic's complete trust-and-contact outcome.

### Epic 2: Find and Verify a Product Series

Professional buyers can begin from Home, Product Overview, or a substantive Pump Type page; combine and share filters; open one canonical Series page; inspect reviewed key ranges and every approved Model; and proceed to Contact with precise product context.

**FRs covered:** FR2, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14

**Implementation notes:** Combines catalog discovery and technical detail because both use the same governed Series metadata, filters, cards, category routes, and Series components. Must validate the approximately 491-row SB/SBI/SBN extreme fixture, URL normalization, missing-data behavior, image dialog, mobile table containment, and suitability boundary.

### Epic 3: Govern and Release Trustworthy Content

The designated maintainer can update public content, Projects, Partners, media, taxonomy, Series, and Model data through repeatable validated sources; review changes in a commit-bound Preview; obtain approval; promote atomically; and recover a prior known-good release.

**FRs covered:** FR18, FR20, FR21, FR22, FR23, FR24, FR25

**Implementation notes:** Delivers the generated/manual catalog split, repeatable Excel intake, Zod schemas, stable identities, rights and technical-review gates, affected-page reporting, Vercel Preview/Production flow, rollback, backups, and maintainer handoff documentation. It uses Git/CI/Vercel interfaces rather than a custom admin product.

### Epic 4: Make Published Content Discoverable and Resilient

Visitors and search engines can find every approved public page through stable locale-prefixed links, receive accurate metadata and structured data, share catalog state without creating index bloat, and recover correctly when content moves or disappears.

**FRs covered:** FR26, FR27, FR28, FR29, FR30, FR31, FR32, FR33

**Implementation notes:** Completes `/zh-tw/` route generation and root redirect behavior, locale-ready content contracts, canonical metadata, crawlable taxonomy paths, robots/Preview isolation, sitemap generation, Organization/Breadcrumb JSON-LD, redirects, and useful 404 handling from the same promoted repository state.

## Epic 1: Verify JP PUMP and Make Direct Contact

Visitors can understand who JP PUMP is, verify approved company, partner, service, and Project evidence, navigate the public trust surfaces, and reach accurate phone or Email contact without tracking or a form.

### Story 1.1: Set Up Initial Project from Starter Template

As a public visitor,
I want a fast, secure, responsive Traditional Chinese website shell,
So that I can access JP PUMP information consistently on my device.

**Requirements:** FR1; NFR2, NFR3, NFR5, NFR8, NFR12, NFR13; UX-DR1-UX-DR5, UX-DR35-UX-DR37.

**Acceptance Criteria:**

**Given** the authoritative outer `JP-Website` repository and the existing `/website` starter
**When** the public application is scaffolded
**Then** `/website` contains one clean official Next.js App Router application using Node.js 24 LTS, pnpm 11.15.1, Next.js 16.2.10, React/React DOM 19.2.7, the scaffold-compatible TypeScript compiler, Tailwind CSS 4.3.3, Zod 4.4.3, and Playwright 1.61.1
**And** the Vinext, Vite, Cloudflare, Drizzle, nested Git boundary, database, backend, CMS, authentication, and management API are absent.

**Given** the clean styling scaffold
**When** Tailwind is configured
**Then** it uses `@tailwindcss/postcss`, one global `@import "tailwindcss"`, and CSS-first semantic tokens
**And** legacy v3 directives, a JavaScript Tailwind config, separate autoprefixer, Sass, Less, and Stylus are absent by default.

**Given** the application shell
**When** `/zh-tw/` is built
**Then** primary public content is produced as statically generated semantic HTML using Server Components by default
**And** Client Components are limited to interactions that require browser state while normal Next.js Vercel deployment retains platform redirects, headers, image optimization, Preview, and rollback without forcing `output: 'export'`.

**Given** the final UX design contract
**When** global styles are loaded
**Then** all approved semantic color, typography, spacing, radius, elevation, focus, and component tokens are transcribed into CSS custom properties composed through Tailwind CSS 4
**And** no alternate token authority, component framework, general state store, or headless library is introduced by default.

**Given** a visitor at 320 CSS px or a supported modern browser
**When** the shell renders
**Then** the page has correct Traditional Chinese language metadata, semantic Header/main/Footer landmarks, visible focus behavior, and no page-level horizontal scrolling
**And** type, lint, build, and baseline accessibility checks pass.

**Given** available widths of at least 1120 px, 720-1119 px, below 720 px, or 320-399 px
**When** public components adapt
**Then** they follow the content-driven wide, compact, stacked, and narrow contracts while preserving the same content, destinations, current-location meaning, and actions
**And** no interaction depends on hover or drag alone.

### Story 1.2: Navigate Public Trust Surfaces

As a professional buyer,
I want consistent keyboard- and touch-friendly navigation,
So that I can reach JP PUMP's public information without getting lost.

**Requirements:** FR1; NFR2, NFR3, NFR8; UX-DR6, UX-DR7, UX-DR30, UX-DR35-UX-DR37.

**Acceptance Criteria:**

**Given** any completed public page
**When** the Header renders
**Then** the linked JP PUMP logo returns Home and the primary order is `產品總覽`, `服務與實績`, `關於傑平`, `聯絡我們`
**And** the current location is exposed visually and programmatically without relying on color alone.

**Given** the Product or About trigger
**When** a visitor uses click, touch, Enter, or Space
**Then** its single-level menu opens with an expanded state and directional cue
**And** second activation, outside click, or Escape closes it and returns focus to the trigger.

**Given** governed Purpose links are supplied to the Product menu
**When** the menu renders
**Then** it shows all approved Purposes up to eight followed by `全部產品`
**And** About shows only Company and Partners, while Services & Projects remains a direct top-level link and News is absent.

**Given** a narrow viewport
**When** the Header adapts
**Then** a labelled mobile-menu trigger exposes the same item order, destinations, and current-location semantics
**And** navigation is never hidden without an operable replacement.

**Given** any public page
**When** the Footer renders
**Then** it contains company identity, primary navigation, and approved contact information in that order, stacking in the same order on narrow screens
**And** missing facts or unapproved legal links are omitted while remaining links have visible focus and effective 44 px targets.

### Story 1.3: Understand JP PUMP on Home

As a prospective buyer,
I want a credible, media-supported Home experience,
So that I can quickly understand JP PUMP's identity, engineering capability, and next destinations.

**Requirements:** FR1; NFR1, NFR3, NFR4, NFR13; UX-DR8, UX-DR10, UX-DR12, UX-DR13, UX-DR34, UX-DR38.

**Acceptance Criteria:**

**Given** approved Home copy and media
**When** Home loads
**Then** the Hero communicates factual positioning, company context, and an operable `認識我們` link without depending on animation
**And** the copy remains readable over the final static media frame at the required contrast using factual, calm, direct Traditional Chinese and the approved product, Purpose, Brand, Pump Type, Services & Projects, and Partner terminology.

**Given** motion and data conditions allow sequencing
**When** Hero media starts
**Then** it plays one finite photo sequence for no more than five seconds and stops on the final frame without looping or manual controls
**And** reduced motion, data-saving degradation, or media failure shows that final frame immediately with identical copy and links.

**Given** approved Home content exists
**When** the page renders below the Hero
**Then** it follows the approved trust-and-routing order: concise company summary/facts, Purpose area, destination gateways, optional verified Projects, optional Partners, and Footer
**And** Home contains no News surface and no separate duplicate Contact CTA.

**Given** an approved fact, featured Project, or Partner is missing
**When** Home renders
**Then** the missing fact or entire optional section is omitted without a placeholder, generic claim, empty card, or invented evidence
**And** the remaining reading order stays intact.

**Given** the three destination gateways on a wide pointer layout
**When** one receives hover or keyboard focus
**Then** it may expand while siblings contract and all return to equal width when interaction leaves
**And** touch and narrow layouts remain fixed, stacked, fully labelled, and operable.

### Story 1.4: Verify Company and Partners

As a procurement decision-maker,
I want approved company and partner information,
So that I can verify JP PUMP's identity and commercial relationships.

**Requirements:** FR3; NFR2, NFR3, NFR11, NFR13; UX-DR28, UX-DR35-UX-DR37, UX-DR40.

**Acceptance Criteria:**

**Given** approved company records
**When** a visitor opens Company Information
**Then** the page presents only traceable legal name, founding year, history, approved facts, and formal contact details
**And** unavailable facts are omitted rather than represented by placeholders or unsupported claims.

**Given** approved Partner records
**When** a visitor opens Partners
**Then** each Partner appears in one centered vertical sequence with its approved logo and three-to-four-sentence relationship description
**And** wide layouts place logo beside content while narrow layouts stack and center the same information.

**Given** a Partner has a confirmed official URL
**When** its block renders
**Then** a labelled `拜訪網站` external action is shown
**And** no action is shown when the URL is absent or unconfirmed.

**Given** a Partner claim, logo right, or relationship description is unapproved
**When** content is prepared for public output
**Then** the affected Partner is not published
**And** no logo, relationship, or link is inferred from reference material.

**Given** keyboard, touch, and 320 CSS px use
**When** visitors read and navigate these pages
**Then** headings, landmarks, links, focus states, target sizes, image alt text, and reading order meet the accessibility and responsive contracts.

### Story 1.5: Review Services and Project Evidence

As a procurement decision-maker,
I want approved service capabilities and real Project evidence in one place,
So that I can judge whether JP PUMP can support my work.

**Requirements:** FR4; NFR2, NFR3, NFR11, NFR13; UX-DR13, UX-DR29, UX-DR31, UX-DR34-UX-DR37, UX-DR40.

**Acceptance Criteria:**

**Given** approved service facts
**When** Services & Projects opens
**Then** a deep-navy Hero explains the approved estimating, selection, supply, installation, maintenance, and consulting capabilities
**And** every claim is traceable and does not expand JP PUMP's approved commitments.

**Given** one or more approved Projects
**When** the Project list renders
**Then** every Project is a semantic in-place evidence section with rights-cleared real media, approved title/type, concise context, and optional scope, outcome, and related-product context
**And** absent optional fields are omitted individually.

**Given** a Project section
**When** a visitor interacts with it
**Then** the section is not a whole-block link and no individual Project detail route exists
**And** any approved related-Series or Contact link is a separate explicitly labelled action.

**Given** media is AI atmosphere, generic stock, rights-uncleared, sensitive, or factually unapproved
**When** the Project surface is built
**Then** that media or claim is excluded from evidence
**And** website copy never invents Project names, scope, outcomes, numbers, or responsibility.

**Given** no public Project is approved
**When** Services & Projects renders
**Then** the service Hero remains, the page states that no public Project record is available, and Contact is offered
**And** no generic imagery or fake Project fills the list.

**Given** wide and narrow layouts
**When** Project sections adapt
**Then** readable wide layouts may pair media and copy while narrow layouts place media before copy
**And** no core evidence or action is lost.

### Story 1.6: Contact JP PUMP Directly

As a professional buyer,
I want one direct Contact page with approved communication details,
So that I can call or email JP PUMP without submitting tracked personal data.

**Requirements:** FR15, FR16; NFR2, NFR3, NFR6, NFR13; UX-DR24-UX-DR27, UX-DR31, UX-DR35-UX-DR37.

**Acceptance Criteria:**

**Given** a visitor opens Contact from any source
**When** the page renders
**Then** it uses the approved deep-dark composition in the order Hero/service summary, contact information, optional FAQ, optional map, and Footer
**And** it shows no source identifier, return-to-product action, attribution state, or contact form.

**Given** approved phone and Email values
**When** their actions are activated
**Then** they use native `tel:` and `mailto:` behavior with clear labels and at least 44 px target height
**And** the site does not collect message content or extra personal data.

**Given** address, LINE, hours, FAQ, or map data is absent or unapproved
**When** Contact renders
**Then** each missing row or whole optional section is omitted without placeholder data
**And** the remaining layout uses the available space without an empty container.

**Given** approved FAQ pairs
**When** visitors use the FAQ
**Then** each native disclosure operates independently by pointer, touch, and keyboard with a visible plus/minus cue
**And** focus, names, state, and reading order remain programmatically clear.

**Given** Company, Partners, Services & Projects, or another completed trust surface
**When** a visitor activates its contextual Contact action
**Then** the visitor reaches the same direct Contact page without origin data in URL, storage, or analytics
**And** the action never overlays or obscures source content.

**Given** a 320 CSS px viewport or supported browser
**When** Contact is used
**Then** all regions stack in the approved reading order, actions remain fully operable, contrast and focus meet WCAG 2.2 AA, and no page-level horizontal scrolling occurs.

## Epic 2: Find and Verify a Product Series

Professional buyers can begin from Home, Product Overview, or a substantive Pump Type page; combine and share filters; open one canonical Series page; inspect reviewed key ranges and every approved Model; and proceed to Contact with precise product context.

### Story 2.1: Publish a Governed Catalog Foundation

As a professional buyer,
I want the catalog to expose only approved, consistently classified product data,
So that every product route and value I use is trustworthy.

**Requirements:** FR6, FR9, FR10, FR13, FR14; NFR11, NFR12; UX-DR18, UX-DR19, UX-DR21, UX-DR23, UX-DR32.

**Acceptance Criteria:**

**Given** approved Brand, Pump Type, Purpose, Series, Model, and media records
**When** catalog data is loaded for a build
**Then** Zod schemas validate stable IDs, locale slugs, relationships, reviewed publication state, explicit units, and nullable technical values
**And** invalid or unpublished records are excluded from public page data.

**Given** a display name or locale slug changes
**When** relationships are resolved
**Then** stable IDs continue to identify entities and relationships store IDs rather than labels or slugs
**And** no duplicate Series page is created.

**Given** a technical decimal is available
**When** it crosses the loader boundary
**Then** it is represented as a reviewed decimal string paired with a governed unit enum
**And** missing data is `null`, while zero is accepted only as an explicitly reviewed value.

**Given** approved catalog records
**When** Next.js builds public routes
**Then** Pump Type and Series pages are statically generated under `/zh-tw/`
**And** route components receive explicit typed page-ready data from small server-only loaders rather than raw Excel or internal review records.

**Given** approved Brand and Purpose records
**When** public routes and the sitemap are generated
**Then** those records remain available to Product Overview filters and Series content
**And** no Brand, Purpose, Product Name, or Model standalone page is generated.

**Given** catalog content is requested publicly
**When** a page renders
**Then** source evidence, reviewer identity, internal disposition, and unpublished records are absent from client output
**And** the public page includes only approved last-updated information where required.

### Story 2.2: Browse Product Overview and Pump Type Pages

As a professional buyer,
I want to compare published Series and browse meaningful classifications,
So that I can identify relevant products from a clear catalog entry point.

**Requirements:** FR6, FR9; NFR2, NFR3, NFR13; UX-DR16-UX-DR18, UX-DR31, UX-DR35-UX-DR37.

**Acceptance Criteria:**

**Given** published Series exist
**When** Product Overview opens
**Then** a compact technical Hero and result region present every published Series through the approved responsive card grid
**And** every Series is reachable through at least one ordinary public path.

**Given** a Product card
**When** it renders
**Then** it shows approved top imagery, a tonal classification tag, Series name, short approved description, and one or two reviewed head/flow summary lines with explicit units or `未提供`
**And** the whole card is one accessible link to the canonical Series route while `看更多` remains a non-interactive cue.

**Given** wide and narrow content widths
**When** cards lay out
**Then** the grid uses two columns only while both cards remain comfortably readable and otherwise switches to one column
**And** cards use a borderless white surface, restrained shadow, modest hover lift, and visible 3 px focus outline without nested actions or hard image frames.

**Given** an approved Pump Type
**When** its landing page opens
**Then** it contains unique crawlable approved explanatory copy and the related published Series using the shared card language
**And** it is not merely an auto-generated filter result.

**Given** an approved Pump Type page has no published Series
**When** it renders
**Then** the approved introduction remains and a factual empty state offers Product Overview and Contact
**And** no cards, values, or claims are manufactured.

**Given** approved Brand or Purpose values
**When** a visitor uses them
**Then** they update Product Overview filter state and relevant Series results
**And** they do not navigate to or generate standalone Brand or Purpose pages.

### Story 2.3: Filter and Share Product Results

As a professional buyer,
I want immediate, shareable catalog filtering,
So that I can narrow Series by my known product criteria and return to the same results.

**Requirements:** FR7, FR8; NFR2, NFR3, NFR8; UX-DR14, UX-DR15, UX-DR31, UX-DR33, UX-DR35-UX-DR37.

**Acceptance Criteria:**

**Given** Product Overview
**When** the filter interface renders
**Then** it provides series/model search, one exclusive segmented Brand group, multi-select Pump Type chips, multi-select Purpose chips, removable active-condition tags, and one clear-all action
**And** it shows no sorting control, separate apply button, or hidden submission step.

**Given** valid selected conditions
**When** filtering runs
**Then** multiple Pump Types use OR, multiple Purposes use AND, Brand/search/type/Purpose dimensions combine with AND, and each change applies immediately
**And** result cards, active conditions, and count update without a remote request or focus movement.

**Given** URL query state
**When** `brand`, repeated `type`, repeated `purpose`, or optional `q` values are parsed
**Then** one shared schema normalizes and deduplicates values, resets multiple or invalid Brand to `全部`, discards invalid Type/Purpose values, and preserves valid unrelated conditions
**And** the visible controls, normalized URL, results, and count agree.

**Given** a valid filter state
**When** the page is reloaded, shared, or revisited with Browser Back
**Then** the same visible conditions and results are restored and source position is preserved where practical
**And** unconstrained dimensions are omitted from the normalized query.

**Given** no Series match
**When** results update
**Then** the page states `沒有符合目前條件的產品。`, preserves active conditions, and offers individual removal, `重設全部條件`, and Contact
**And** it never flashes a blank list or clears unrelated state.

**Given** assistive technology or touch use
**When** conditions change
**Then** each control has a visible label, programmatic selected state, visible focus, and effective 44 px target
**And** count changes use polite announcements without announcing every keystroke.

**Given** the statically generated Product Overview page
**When** URL-driven filtering is implemented
**Then** the Server Page does not read `searchParams`; a small Client Component under `Suspense` receives validated Series-level metadata and updates the query state
**And** full Model specifications are not sent to the filter component.

### Story 2.4: Review a Canonical Series Overview

As a professional buyer,
I want one complete overview for each Series,
So that I can understand its approved capabilities without conflicting duplicate pages.

**Requirements:** FR10, FR12, FR14; NFR2, NFR3, NFR11; UX-DR19, UX-DR21, UX-DR23, UX-DR35-UX-DR37.

**Acceptance Criteria:**

**Given** a published Series
**When** its canonical page opens from Product Overview Brand/Purpose filters, a Pump Type page, or search
**Then** every path resolves to the same locale-specific Series route
**And** the page is not duplicated by classification or entry route.

**Given** the Series page
**When** its main content renders
**Then** the reading order is suitability-confirmation note, product image, four-field key-data block, approved introduction, Model table region, non-interactive Purpose tags, and page actions
**And** the order remains consistent across widths.

**Given** the key-data block
**When** reviewed values are displayed
**Then** it contains exactly minimum/maximum head in `m` and minimum/maximum flow in `L/min`, with clear labels and alignment
**And** any missing value reads `未提供` rather than zero, a dash, an estimate, or a neighboring value.

**Given** approved Series copy and Purposes
**When** the page renders
**Then** the introduction uses only approved facts and Purpose tags match governed data
**And** Purpose tags are not focusable, clickable, linked, or styled as controls.

**Given** a visitor reviews technical content
**When** they reach the suitability note and last-updated information
**Then** the page clearly states that final selection, purchase, and suitability require JP PUMP confirmation
**And** internal reviewer names and evidence documents remain private.

**Given** V1 scope
**When** the Series page is inspected
**Then** no extra performance-data section, PDF download, technical-document download, individual Model route, price, inventory, or suitability guarantee exists.

### Story 2.5: Inspect Complete Model Specifications

As a maintenance professional,
I want every approved Model specification in an accessible table,
So that I can locate an exact Model and discuss it accurately with JP PUMP.

**Requirements:** FR11, FR13; NFR1, NFR2, NFR3, NFR10, NFR11; UX-DR22, UX-DR33, UX-DR35-UX-DR37.

**Acceptance Criteria:**

**Given** a published Series with approved Models
**When** its Model table renders
**Then** every approved Model appears as semantic non-hydrated server HTML with programmatic header-to-cell relationships, explicit units, and tabular numerals where supported
**And** missing cells say `未提供` rather than zero or a dash.

**Given** the approximately 491-row SB/SBI/SBN extreme fixture
**When** the Series page builds and loads
**Then** all reviewed rows remain available to browser find and assistive navigation without pagination, virtualization, infinite scroll, or client hydration of thousands of cells
**And** performance and accessibility gates remain satisfied.

**Given** a narrow viewport
**When** the Model table exceeds available width
**Then** only its clearly labelled bounded container scrolls horizontally, a visible scroll cue is provided, and the first Model column is preserved when feasible
**And** the page itself never scrolls horizontally.

**Given** a cross-type Series such as VBSG
**When** approved Pump Type relationships are loaded
**Then** the Series is discoverable from every approved Pump Type while retaining one canonical page
**And** Model-level Pump Type appears only where controlled source data supports it.

**Given** an unreviewed Model or value
**When** public output is generated
**Then** the unreviewed record or value is not published and no guessed row is shown
**And** visitors are directed to Contact for confirmation when appropriate.

### Story 2.6: Enlarge Product Media and Continue to Contact

As a professional buyer,
I want to inspect approved Series imagery and then contact JP PUMP,
So that I can confirm product context before discussing suitability.

**Requirements:** FR10, FR16; NFR2, NFR3; UX-DR20, UX-DR24, UX-DR35-UX-DR37.

**Acceptance Criteria:**

**Given** an approved Series image
**When** a visitor activates the image by pointer, touch, Enter, or Space
**Then** one enlargement dialog opens, traps focus, provides a clearly labelled close control, and supports Escape
**And** closing returns focus to the image trigger.

**Given** image loading or rendering fails inside the dialog
**When** failure occurs
**Then** a labelled unavailable-media state remains inside the dialog with an operable close path
**And** no false product evidence or empty inaccessible modal is shown.

**Given** a Series has no approved public image
**When** its page renders
**Then** a labelled unavailable-media surface preserves the rest of the Series content
**And** it does not open an enlargement dialog.

**Given** the Series action region
**When** it renders at medium or wide width
**Then** `前往聯絡頁` and `返回產品總覽` are clearly distinguished and aligned horizontally
**And** narrow layouts stack full-width Contact first and return second without compressed targets or text.

**Given** a visitor selects Contact
**When** navigation completes
**Then** the common direct Contact page opens without source attribution, source copy, URL identifiers, storage, or custom return action
**And** the Series page remains recoverable through normal browser navigation.

### Story 2.7: Begin Product Discovery from Home

As a prospective buyer,
I want to start product discovery from Home,
So that I can reach a relevant catalog state without first learning the full taxonomy.

**Requirements:** FR2; NFR1-NFR4, NFR13; UX-DR8, UX-DR9, UX-DR11, UX-DR12, UX-DR35-UX-DR38.

**Acceptance Criteria:**

**Given** the Home Hero
**When** the quick filter renders
**Then** Brand and Purpose are labelled single-select controls that both default to `全部`, plus one primary submit action
**And** default values are valid and never cause required-field errors.

**Given** any Brand/Purpose combination, including both unconstrained
**When** the visitor submits
**Then** Product Overview opens with only selected constraints encoded in normalized restorable URL state
**And** controls, active conditions, results, and count restore the same meaning.

**Given** approved published Purposes with imagery
**When** the Home Purpose section renders
**Then** each card shows an approved large image, Purpose title, two short sentences, and one translucent arrow, with the whole card as one accessible link
**And** it opens Product Overview with Brand unconstrained and exactly that Purpose selected.

**Given** hover or keyboard focus on a Purpose card
**When** visual feedback occurs
**Then** the image may zoom by about 1.06x without moving the card or covering text
**And** there is no nested `Learn more` action or hover-only information.

**Given** the Home destination gateways
**When** Product Overview is available
**Then** Product, Services & Projects, and Contact destinations are complete whole-block links with short visible cues
**And** gateway interaction neither duplicates nor mutates quick-filter state.

**Given** compact or 320 CSS px layouts
**When** Home discovery controls adapt
**Then** labels stay visible, controls and cards stack full-width with effective 44 px targets, and no information or function is lost
**And** the Hero media remains secondary to readable copy, filtering, and links.

## Epic 3: Govern and Release Trustworthy Content

The designated maintainer can update public content, Projects, Partners, media, taxonomy, Series, and Model data through repeatable validated sources; review changes in a commit-bound Preview; obtain approval; promote atomically; and recover a prior known-good release.

### Story 3.1: Maintain One Authoritative Content Source

As a designated website maintainer,
I want one validated version-controlled source for all public content,
So that updates remain traceable, reproducible, and free from competing copies.

**Requirements:** FR18; NFR5, NFR10-NFR12; UX-DR32, UX-DR41.

**Acceptance Criteria:**

**Given** Company, Services/Projects, Partners, Contact, Hero, taxonomy, catalog, redirect, or media-reference content
**When** its authority is defined
**Then** each content type has one documented repository location using schema-validated JSON by default and non-executable Markdown only for explicitly useful long prose
**And** JSX, spreadsheets, Preview deployments, local folders, or external drives are not parallel public authorities.

**Given** a route needs public content
**When** it loads data
**Then** a small typed server-only loader validates repository files and returns explicit page-ready data
**And** no CMS-neutral port, provider adapter, ORM, client fetch cache, or runtime write path is introduced.

**Given** missing, malformed, unpublished, or internally restricted content
**When** the build prepares public page data
**Then** invalid records fail with an actionable source location while unpublished/internal fields are excluded
**And** valid static content remains present in generated HTML rather than a client-only skeleton.

**Given** V1 operational boundaries
**When** a maintainer updates content
**Then** the update occurs through authorized Git files and existing Git/Vercel interfaces
**And** no custom admin page, editor, media picker, role system, login, management API, database, or private mutation endpoint exists.

### Story 3.2: Promote Approved Media Safely

As a designated website maintainer,
I want a controlled path from original media to public derivatives,
So that only accurate, licensed, accessible assets appear as evidence.

**Requirements:** FR21; NFR1, NFR4, NFR11, NFR13; UX-DR39, UX-DR40.

**Acceptance Criteria:**

**Given** original photos, RAW files, logos, rights evidence, or AI-assisted assets
**When** media is prepared
**Then** originals and rights evidence remain in an independently backed-up transferable private archive
**And** only approved web-optimized derivatives enter `public/media`.

**Given** a candidate public derivative
**When** it is validated
**Then** it has a useful filename and required alt, source, rights, approval, and content relationship metadata
**And** missing rights, approval, or required alt data blocks publication.

**Given** JP PUMP identity assets
**When** the supplied logo is cleaned, cropped, or exported
**Then** lettering and structure remain unchanged and the derivative requires JP PUMP approval
**And** the original sign remains historical evidence while the AI-enhanced sign remains mood reference only.

**Given** AI construction atmosphere or an AI product image
**When** content is classified
**Then** construction atmosphere may appear only in an approved Home mood context and never as Project evidence
**And** an AI product image cannot become product evidence without specification review.

**Given** measured Git, build, deployment, or cache growth stays within the documented threshold
**When** public media is released
**Then** optimized derivatives ship with the deployment
**And** object storage or a CDN is not introduced until measured need justifies a new decision.

### Story 3.3: Import and Reconcile the Excel Catalog

As a designated website maintainer,
I want a repeatable validated Excel intake,
So that annual technical updates can be processed without overwriting governed editorial decisions.

**Requirements:** FR22, FR25; NFR10, NFR11; UX-DR41.

**Acceptance Criteria:**

**Given** an approved Excel intake file
**When** the importer succeeds
**Then** it fully regenerates `catalog.generated.json` with only Excel-owned technical Series/Model fields
**And** it never writes stable IDs, locale slugs, taxonomy mappings, approved display copy, or image references owned by `catalog-content.json`.

**Given** the initial source workbook
**When** Pump Type mapping is prepared
**Then** main-sheet column G is used as the initial authority input and the old `用途` column is not reused as Pump Type or Purpose
**And** final mappings still require JP PUMP technical review.

**Given** generated and manual catalog files
**When** reconciliation runs
**Then** stable Series/Model keys join both sources and duplicate, missing, or orphaned keys fail validation
**And** every source record receives one governed disposition: reviewed, pending, insufficient, or excluded.

**Given** an import contains a file, sheet, row, field, format, unit, or rule error
**When** the importer fails
**Then** the current generated catalog remains unchanged and the report identifies the exact source location and violated rule
**And** no partial generated file or Preview is produced.

**Given** an import contains no effective changes
**When** processing completes
**Then** it reports a clear no-op with the source version
**And** no meaningless catalog rewrite or release is created.

**Given** the initial approximately 603 Models and 10 Series
**When** processing is staged
**Then** reviewed batches may publish independently, Models remain rows inside Series pages, and HS, SB/SBI/SBN, and VBSG risk cases are represented
**And** no permanent client-facing Excel upload interface is created.

### Story 3.4: Validate Content and Technical Release Readiness

As a designated website maintainer,
I want complete actionable validation before Preview,
So that invalid facts, specifications, relationships, rights, and routes cannot reach Production.

**Requirements:** FR24; NFR5, NFR9-NFR11; UX-DR41.

**Acceptance Criteria:**

**Given** a candidate repository state
**When** release validation runs
**Then** it checks type, lint, build, content/catalog schemas, stable ID and slug uniqueness, required fields, values and units, relationships, media rights/alt/source, links, redirects, and sitemap consistency
**And** any critical failure blocks Preview and Production.

**Given** a Product or Project record
**When** review gates run
**Then** technical or factual approval, reviewer/date evidence, publication state, sensitive-information review, and media rights are validated where required
**And** unreviewed values, unsupported claims, or rights-unclear media fail closed.

**Given** validation failures
**When** the report is produced
**Then** every issue names the source file, record, field, rule, and affected public page where applicable
**And** logs remain structured and redacted without contact data, content bodies, source documents, secrets, or tokens.

### Story 3.5: Verify Public Release Quality

As a designated website maintainer,
I want focused automated and manual public-quality gates,
So that performance, accessibility, compatibility, and security regressions cannot reach Production.

**Requirements:** FR1, FR2, FR6, FR7, FR8, FR10, FR11, FR24; NFR1-NFR5, NFR8-NFR11; UX-DR35-UX-DR38, UX-DR41.

**Acceptance Criteria:**

**Given** a catalog candidate
**When** focused automated tests run
**Then** Chromium smoke covers public navigation, filter normalization and empty states, image enlargement, and the approximately 491-row Series fixture
**And** tests verify that missing technical data renders `未提供` and invalid/unpublished data remains absent.

**Given** a launch or major UI change
**When** manual release review occurs
**Then** mobile layouts, 320 CSS px containment, keyboard/focus, screen-reader essentials, reduced motion, useful 404 behavior, Preview isolation, and Safari are checked
**And** failed checks prevent promotion.

**Given** production-shaped media and catalog data
**When** prelaunch lab performance tests run on Home, Product Overview, Series, and Contact using a representative mobile profile
**Then** each surface targets LCP <= 2.5 seconds, INP <= 200 milliseconds, and CLS <= 0.1
**And** a failed mandatory performance gate blocks promotion without requiring GA4 or RUM.

**Given** the supported browser floor
**When** compatibility is verified
**Then** Chrome 111+, Safari 16.4+, Firefox 128+, current Edge, iOS Safari, and Android Chrome retain core content and actions by touch and keyboard
**And** Internet Explorer is explicitly unsupported.

**Given** dependencies or deployment configuration
**When** security validation runs
**Then** high-risk vulnerabilities, exposed secrets, invalid browser-variable allowlists, or unsafe Preview indexing block release
**And** HTTPS, security headers, MFA, and least-privilege account requirements are recorded for Production readiness.

**Given** a candidate or Production deployment
**When** operational diagnostics are reviewed
**Then** deployment failures, broken-link results, and useful redacted Vercel records are visible to maintainers
**And** RUM, third-party uptime monitoring, and a separate frontend-error service remain outside V1.

### Story 3.6: Preview, Approve, and Promote One Atomic Release

As a designated website maintainer,
I want every release tied to a validated Preview and approved commit,
So that public content changes together without partial or unreviewed publication.

**Requirements:** FR20, FR23; NFR5, NFR7, NFR9-NFR11; UX-DR41.

**Acceptance Criteria:**

**Given** a candidate commit passes all release gates
**When** Vercel creates a Preview
**Then** release evidence identifies the source commit/deployment, added/changed/removed content, affected public pages, validation outcome, and non-indexable Preview URL
**And** Preview is visibly distinct from Production and access-protected when it contains unapproved evidence.

**Given** a Project, Partner, Company, Contact, catalog, redirect, or Hero change
**When** the Preview is reviewed
**Then** the complete affected public surfaces show the same atomic repository state
**And** no News route, individual Project route, unpublished content, or partial content source appears.

**Given** JP PUMP approves the Preview tied to a named source commit
**When** Production promotion runs
**Then** one approved commit/deployment becomes the complete Production release and may rebuild using Production environment values
**And** content, routes, media, metadata, and sitemap change together.

**Given** validation, build, or deployment promotion fails
**When** the release attempt ends
**Then** the previous Production deployment remains active and the failure exposes a safe retry or escalation path
**And** no partial content rollback or mixed release is visible.

**Given** content is removed or archived
**When** the change is promoted
**Then** removal occurs through another reviewed commit with an explicit nearest-target redirect or correct not-found treatment
**And** the prior Production deployment remains available as a rollback target.

### Story 3.7: Recover Releases and Hand Off Maintenance

As a designated website maintainer,
I want documented rollback, recovery, and handoff procedures,
So that another qualified maintainer can safely operate the website and restore service.

**Requirements:** FR23; NFR5, NFR7, NFR9, NFR10; UX-DR41.

**Acceptance Criteria:**

**Given** a known-good prior Vercel deployment
**When** an authorized rollback is performed
**Then** the Production domain is restored atomically to that deployment and evidence identifies both restored and superseded deployments
**And** no database or partial content restoration is attempted.

**Given** rollback fails
**When** the provider reports failure
**Then** the current public deployment remains unchanged and a safe retry/escalation path is documented
**And** maintainers do not use destructive repository operations as a substitute.

**Given** Production readiness
**When** operations documentation is completed
**Then** it covers content and catalog updates, validation, Preview, approval, promotion, rollback, domain/DNS, account ownership, MFA, recovery, environment isolation, media archive, and escalation
**And** maintenance response times remain in a separate service agreement rather than product behavior.

**Given** a maintainer handoff exercise
**When** a second qualified maintainer follows the documentation
**Then** they can complete one non-product content update through Preview and identify the Production and rollback steps
**And** the workflow does not depend on private relationships or undocumented local knowledge.

**Given** launch or a major ownership change
**When** recovery readiness is verified
**Then** Git history, known-good Vercel deployments, domain configuration, account recovery ownership, and an off-device original-media/rights backup are confirmed
**And** the commercially eligible Vercel plan, billing owner, Root Directory `website`, and purchased domain ownership are documented.

## Epic 4: Make Published Content Discoverable and Resilient

Visitors and search engines can find every approved public page through stable locale-prefixed links, receive accurate metadata and structured data, share catalog state without creating index bloat, and recover correctly when content moves or disappears.

### Story 4.1: Publish Locale-Explicit Public Routes

As a Traditional Chinese visitor,
I want every public page under a stable locale path,
So that links remain consistent now and can support a future independent English edition.

**Requirements:** FR26, FR28; NFR12; UX-DR32, UX-DR34.

**Acceptance Criteria:**

**Given** a root request to the purchased domain
**When** routing resolves it
**Then** the request permanently redirects to `/zh-tw/`
**And** the redirect does not depend on browser language, analytics, or a client-side script.

**Given** V1 approved content
**When** public routes build
**Then** only `/zh-tw/` routes are generated with correct Traditional Chinese language metadata and locale-owned slugs
**And** no empty, fallback-copied, machine-translated, or auto-generated `/en/` page exists.

**Given** content and media schemas
**When** locale fields are validated
**Then** text, media references, metadata, and slugs are explicit per locale and relationships continue to use stable IDs
**And** a future English edition can add independently reviewed `/en/` records without changing existing Traditional Chinese URLs.

**Given** an unsupported locale route
**When** a visitor requests it
**Then** the site returns the correct not-found behavior rather than silently substituting Traditional Chinese content
**And** public content never implies that English product exploration is available in V1.

### Story 4.2: Provide Accurate Metadata and Crawlable Paths

As a search visitor,
I want search results and ordinary links to describe the actual JP PUMP page,
So that I can reach relevant trusted content directly.

**Requirements:** FR27, FR29, FR30; NFR1, NFR10-NFR12; UX-DR18, UX-DR31, UX-DR32, UX-DR34.

**Acceptance Criteria:**

**Given** a published Company, Partner, Services & Projects, Pump Type, or Series page
**When** a crawler or visitor explores the site
**Then** the page is reachable through an ordinary anchor from Home, Product Overview, or an approved Pump Type page
**And** primary content and the crawl path are present in statically generated HTML.

**Given** an indexable public page
**When** metadata is generated
**Then** it has a distinct content-accurate page title, primary heading, and summary in Traditional Chinese
**And** metadata is not produced by merely swapping a Brand, Series, or Model name into duplicated copy.

**Given** a clean indexable route
**When** canonical metadata is emitted
**Then** the page is self-canonical and locale-prefixed
**And** canonical, title, summary, route, and visible content derive from the same validated promoted record.

**Given** a filtered Product Overview URL
**When** it is shared or loaded
**Then** its state restores for the visitor but it remains outside the sitemap and is not treated as a separate information-architecture or indexable content page
**And** the clean Product Overview is canonical without requiring a query-specific server-rendered `noindex` response.

**Given** Pump Type content and governed Brand/Purpose filter data
**When** indexability is determined
**Then** only approved Pump Type pages with original explanatory content are indexable taxonomy pages
**And** no Brand page, Purpose page, combinatorial query-link grid, or thin auto-generated taxonomy page is created.

### Story 4.3: Generate Production Sitemap and Crawl Controls

As a search engine,
I want an accurate Production-derived sitemap and crawl policy,
So that I index only approved canonical JP PUMP content.

**Requirements:** FR30, FR31; NFR5, NFR6, NFR9, NFR10, NFR12; UX-DR41.

**Acceptance Criteria:**

**Given** a validated promoted repository state
**When** the sitemap is generated
**Then** it contains only published canonical indexable `/zh-tw/` URLs from that same state
**And** it excludes unpublished, Preview-only, filtered-query, duplicate, archived, News, individual Project, empty English, and not-found routes.

**Given** a Production content-state change
**When** a deployment is promoted
**Then** the sitemap updates within the same atomic deployment as pages, metadata, redirects, and media
**And** no runtime revalidation or separate mutable sitemap source is required.

**Given** Development or Vercel Preview
**When** robots directives and headers are evaluated
**Then** the environment is `noindex` and cannot appear in the Production sitemap
**And** sensitive unapproved Previews can additionally require access protection.

**Given** Production
**When** crawl controls render
**Then** approved canonical content remains crawlable and ordinary internal links are not blocked
**And** arbitrary filter combinations do not consume indexable crawl space.

**Given** postlaunch operations
**When** Google Search Console is connected
**Then** it may observe indexing and query issues without adding browser analytics, cookies, contact attribution, consent UI, or RUM
**And** Search Console connection is not a V1 launch blocker.

### Story 4.4: Describe Organization and Navigation with Structured Data

As a search engine,
I want structured data that matches visible JP PUMP content,
So that I can understand the organization and page hierarchy accurately.

**Requirements:** FR32; NFR10, NFR11, NFR12.

**Acceptance Criteria:**

**Given** approved company identity and contact facts
**When** Organization JSON-LD is generated
**Then** values match visible approved content and use stable Production URLs
**And** absent or unapproved facts are omitted rather than inferred.

**Given** an eligible nested public page
**When** Breadcrumb JSON-LD is generated
**Then** breadcrumb names and URLs match visible navigation hierarchy and canonical locale-prefixed routes
**And** no News or individual Project-detail level is represented in V1.

**Given** representative public pages
**When** structured-data validation runs
**Then** adopted Organization and Breadcrumb markup has no major format errors
**And** validation is included in release gates.

**Given** V1 product content
**When** structured data is emitted
**Then** it does not invent price, stock, rating, review, availability, or unsupported product rich-result claims
**And** Article schema and product-rich-result eligibility are not promised.

### Story 4.5: Recover from Renamed, Removed, and Invalid URLs

As a visitor following an old or incorrect link,
I want a relevant redirect or useful not-found page,
So that I can recover without being misled.

**Requirements:** FR28, FR33; NFR2, NFR3, NFR10, NFR12; UX-DR31, UX-DR34-UX-DR37.

**Acceptance Criteria:**

**Given** a published page is renamed or moved and a relevant replacement exists
**When** the old locale-prefixed URL is requested
**Then** a permanent redirect sends the visitor to the closest approved replacement
**And** redirects are governed by validated repository records and deployed atomically.

**Given** a retired URL has no relevant replacement
**When** it is requested
**Then** the server returns a correct not-found status with factual unavailable copy, the closest valid category when known, Product Overview, and Contact
**And** it does not return a false 200 page or redirect everything to Home.

**Given** an invalid Brand, Pump Type, Purpose, Series, News, Project-detail, locale, or arbitrary path
**When** routing resolves it
**Then** explicit redirect rules apply only when present and all other cases use the useful not-found contract
**And** no unpublished record or internal identifier is exposed.

**Given** keyboard, mobile, or assistive-technology use
**When** the not-found page renders
**Then** its heading, explanation, recovery links, focus order, targets, contrast, and landmarks meet the shared accessibility contract
**And** it has no page-level horizontal scrolling at 320 CSS px.

**Given** link and redirect validation
**When** a candidate release is checked
**Then** broken internal links, redirect loops, duplicate destinations, missing retirement treatment, and sitemap conflicts block promotion
**And** the report identifies the source record and affected public route.
