# PRD Quality Review — JP-Website Architecture Sync

## Overall verdict

**REVISE, THEN ACCEPT.** The updated `prd.md` and `addendum.md` now express the approved lean V1 architecture clearly: clean Next.js App Router + Tailwind in `/website`, Vercel deployment, no V1 backend/CMS/database, `/zh-tw/`, formal Brand/Pump Type/Purpose pages, and Project evidence retained on one Services & Projects page. Requirement IDs are stable and contiguous, but the six removed/deferred slots are still formatted as ordinary functional requirements with V1 acceptance blocks, and one Search Discovery purpose statement still promises measurement that the same PRD explicitly defers; those two issues can leak excluded work back into story generation.

## Decision-readiness — adequate

The decision summary (§0), architecture dependency (§8.1), and addendum technical status are specific enough for implementation planning. They name both the chosen path and what is deliberately absent, including the replacement of the prior Vinext/Vite/Cloudflare/Drizzle starter, the outer-repository boundary, Vercel Root Directory, Tailwind 4, and the absence of a runtime write path. The Project-page, News, analytics, attribution, consent, RUM, and monitoring decisions are repeated consistently in the executive boundary and addendum.

The remaining weakness is disposition syntax. FR-5, FR-17, FR-19, and FR-34..FR-36 appear in the same hierarchy and use the same “可驗收結果” template as V1 work. A downstream extractor that selects all `FR-*` headings can therefore create V1 stories for capabilities intentionally removed or deferred, despite their parenthetical labels.

### Findings

- **high** Deferred IDs still look executable (§6, FR-5, FR-17, FR-19, FR-34..FR-36) — The reconciliation required stable traceability tombstones labelled `DEFERRED — NOT V1` with no V1 acceptance criteria. The PRD instead gives all six records ordinary requirement prose and `可驗收結果` blocks. This is the largest remaining route for News/analytics/attribution work to re-enter V1. *Fix:* keep every ID in place, rename each heading to `[DEFERRED — NOT V1]`, replace its body with a short non-V1 traceability note and revisit trigger, and move any V1 guarantees such as untracked `tel:`/`mailto:` operation into FR-15/NFR-6.

## Substance over theater — strong

The PRD is unusually concrete for a small B2B catalog site. It names the actual product scale (about 10 Series and 603 Model rows), the 491-row extreme fixture, publication authority, technical review, media-rights gates, exact filter semantics, and explicit no-backend/no-CMS trade-off. Personas, metrics, NFRs, and UX detail all drive real product or implementation decisions rather than filling a template.

No material finding.

## Strategic coherence — strong

The thesis—help professional buyers find, understand, trust, and contact JP PUMP without automating engineering selection or commerce—is consistent from §0 through the journeys, FRs, metrics, and non-goals. Keeping crawlable Brand/Pump Type/Purpose pages supports the search-discovery goal; keeping Project evidence on the Services & Projects page supports trust without the cost of a detail-page system; manual inquiry recording coheres with the decision to defer client-side analytics.

### Findings

- **high** Search Discovery still promises deferred contact-intent measurement (§6.6 purpose, line 480) — “量測產品探索與聯絡意圖” conflicts with FR-34..FR-36, NFR-6, and §3.6, which deliberately exclude browser analytics and contact attribution. Because this sentence defines the purpose of the entire section, it can be used to justify event instrumentation even though that work is out of scope. *Fix:* change the purpose to discoverability and index governance only, for example: “讓正式內容可穩定被發現，同時排除草稿、重複內容與任意篩選組合的索引。”

## Done-ness clarity — strong

Active FRs generally include observable outcomes: exact navigation behavior, filter Boolean rules, responsive card behavior, product-data validation, route/index rules, and publication checks. NFRs use measurable thresholds or named verification procedures, including Core Web Vitals goals, WCAG 2.2 AA, 320 CSS px behavior, browser floors, focused Chromium smoke coverage, and the maximum Series table fixture.

The deferred-record formatting issue noted above is not a lack of criteria; it is the opposite—criteria are attached to non-V1 slots and therefore blur what must be built.

No additional material finding.

## Scope honesty — adequate

The V1 boundary is candid and repeated. Non-goals explicitly exclude automated selection, transactions, accounts, CRM, runtime content management, English launch, arbitrary SEO filter pages, forms, News, individual Project routes, and analytics infrastructure. Deferred capabilities have revisit conditions instead of implied commitments, and the PRD names real launch blockers such as data review and media rights.

### Findings

- **medium** Deferred decisions are filed under “未決事項” (§9.1 and §9.6) — CMS/backend and analytics are already decided as non-V1 and are not open launch questions. Keeping them inside a section titled only “未決事項” weakens the otherwise explicit distinction between launch blockers and future revisit triggers. *Fix:* rename the section to “未決事項與非 V1 重訪條件,” or split confirmed deferrals from unresolved V1 inputs.

## Downstream usability — thin

The document is otherwise highly extractable: UJ-1..UJ-5, FR-1..FR-36, and NFR-1..NFR-13 remain unique and contiguous; named protagonists are present; domain terms are defined; journeys and feature groups cross-reference one another; and the addendum aligns with the main PRD. The stable-ID choice correctly preserves existing UX and architecture references.

However, downstream safety depends on status being machine- and human-obvious. Parenthetical Chinese labels plus acceptance headings are weaker than the reconciliation contract’s exact deferred marker. Story-generation tools commonly key on `FR-*` headings, not narrative negation, so the six tombstones currently require special interpretation.

### Findings

- **high** No unambiguous active/deferred requirement registry (§6) — Stable IDs are preserved, but disposition is encoded only in individual titles and prose. This makes it easy for a later plan to count all 36 FRs as V1. *Fix:* in addition to converting the six records to `[DEFERRED — NOT V1]` tombstones, add a short authoritative registry before §6 stating `Active V1: FR-1..4, FR-6..16, FR-18, FR-20..33` and `Deferred/removed from V1: FR-5, FR-17, FR-19, FR-34..36`; require downstream plans to exclude the latter set.

## Shape fit — strong

This is an appropriate chain-top PRD for a public B2B content/catalog site. Buyer journeys cover product discovery, trust verification, and known-model support; maintainer journeys cover the real content-governance burden. The rigor is concentrated around technical accuracy, rights, navigation, static publishing, and large product tables rather than unnecessary enterprise workflows.

No material finding.

## Mechanical notes

- Heading IDs are stable, unique, and contiguous: UJ-1..UJ-5, FR-1..FR-36, and NFR-1..NFR-13 are all present exactly once as headings.
- SM-1..SM-5 and SM-C1..SM-C4 are unique. Counter-metric IDs intentionally use the `SM-C*` namespace.
- `prd.md` and `addendum.md` agree on `/zh-tw/`, clean Next.js App Router + Tailwind, Vercel, the single outer repository, no database/backend/CMS, no News, no individual Project route, and no V1 analytics runtime.
- The remaining `99.9%`, `4 小時 RTO`, `Article schema`, and `CMS-neutral` references are explicit negations or non-V1 boundaries, not surviving commitments.
- FR-10’s lightbox behavior mentions close, Escape, and focus return but not the addendum’s explicit focus trap. This is a minor cross-document completeness difference; the final UX contract can remain authoritative unless implementation stories are generated from the PRD alone.

## Final recheck — PASS

Rechecked after the architecture-sync corrections. The PRD now provides an authoritative Active V1 versus Deferred/removed registry, preserves all stable IDs, marks FR-5, FR-17, FR-19, and FR-34..FR-36 as exact `[DEFERRED — NOT V1]` traceability tombstones without V1 acceptance blocks, removes contact-intent measurement from the Search Discovery purpose, and distinguishes unresolved inputs from non-V1 revisit conditions in §9.

**Final verdict: PASS.** No remaining critical or high architecture-reconciliation finding was identified. Removed and deferred capabilities are now sufficiently explicit for downstream Epics, Stories, acceptance work, and implementation plans to exclude them from V1.
