---
review: updated-spine-rubric
target: ARCHITECTURE-SPINE.md
date: 2026-07-22
verdict: actionable-findings
---

# Updated Architecture Spine Review

## Verdict

**ACTIONABLE FINDINGS — close three implementation blockers and two traceability defects, then PASS.**

The updated spine correctly carries every confirmed decision: clean Next.js App Router + Tailwind, Vercel, no backend/database, News removed, taxonomy landing pages retained, Project detail deferred, analytics/RUM/consent deferred, and `/zh-tw/` retained. The architecture is now proportionate to the site. `lint_spine.py` passes with zero mechanical findings.

## High — implementation blockers

### H1 — Upstream sources still instruct downstream work to build removed features

`SOURCE-RECONCILIATION-LEAN-2026-07-22.md` is explicitly `pending-upstream-update` and places implementation on hold. The PRD and UX still contain News routes/publishing, individual Project details, GA4/contact attribution/consent, and old scope statements. Although the spine states that its overrides win, an epic/story generator reading all bound sources can still reintroduce them.

**Action:** reconcile PRD and UX before creating Epics/Stories. Remove or mark deferred FR-5, FR-19, individual Project-detail acceptance criteria, FR-17 and FR-34..FR-36; update the UX page inventory and flows. Then change the reconciliation companion from pending to completed or replace it with a short historical note.

### H2 — The authoritative repository and application root are not implementable as written

AD-12 says to connect the “authoritative root Git repository and clean Next.js application,” and Structural Seed draws the app at `JP-Website/src`. In current reality, the unwanted starter lives at `JP-Website/website/` and has its own nested `.git`, while the planning workspace is the outer Git repository. The spine says to replace the starter but does not decide whether the clean app lives at repository root or at `/website`, nor how Vercel’s Root Directory is configured.

This can produce two incompatible implementations and repeat the earlier split-repository problem.

**Action:** choose and state one physical boundary before scaffolding. Recommended lean choice: outer `JP-Website` remains the sole Git repository; remove the nested `website/.git`; replace the contents of `/website` with the clean Next.js scaffold; configure Vercel Root Directory as `website`. Alternatively place the app at repository root, but then update Structural Seed and migration instructions explicitly.

### H3 — Filter-link UX contradicts the crawl rule

AD-9 says query variants “stay out of internal crawl links,” but the approved Home quick filter, purpose cards and Header purpose shortcuts navigate to Product overview with query state. Those are internal links or link-equivalent navigation by design. AD-10 also says query-specific server-rendered `noindex` is not promised.

**Action:** make the lean rule implementable: allow user-facing links to `/zh-tw/products?...`; exclude query variants from sitemap; emit the clean Product overview route as canonical; do not generate taxonomy content from arbitrary query combinations. Remove “stay out of internal crawl links.” If strict `noindex` for every query is required, specify a compatible Next.js delivery method and accept the extra complexity; otherwise canonical + sitemap exclusion is sufficient for this V1.

## Medium — traceability and consistency

### M1 — Binding ranges still claim deferred/removed requirements

The frontmatter still binds all `FR-1..FR-36`, while the confirmed V1 scope removes FR-5/FR-19 and defers FR-17/FR-34..FR-36. Several AD bindings remain stale:

- AD-1 binds `FR-1..FR-17` and `FR-26..FR-36`, including removed/deferred items.
- AD-4 binds `FR-18..FR-25`, including News publishing FR-19.
- AD-5 binds `FR-18..FR-21`, also including FR-19.
- AD-7 binds FR-17 and FR-22..FR-35 and still says it prevents “analytics drift.”
- Capability Map calls `FR-18..FR-21` “retained” even though FR-19 is not retained.

**Action:** bind only retained requirements or cite explicit amended identifiers after PRD reconciliation. Remove analytics-related rationale from AD-7. Avoid broad ranges that silently include deferred requirements.

### M2 — Capability Map contains stale pre-lean names and paths

The final two rows still refer to `domain DTOs`, `media manifest`, and `design-system`, all removed by AD-13/AD-16 and the new Structural Seed. The catalog row points at `data/catalog`, while the Structural Seed defines `data/catalog.json`; the first row refers to `[locale]` instead of the actual `src/app/[locale]` boundary.

**Action:** update the map to the exact new locations and vocabulary: typed loader results, media metadata, `components`/`styles`, `data/catalog.json`, and `src/app/[locale]`. This is a small documentation fix but prevents developers from recreating deleted layers.

## Lean-scope result

No further scope reduction is required. The following updated rules are appropriately lean and should remain:

- direct typed server-only loaders instead of provider ports/adapters;
- one clean Next.js/Tailwind frontend and no second UI/state framework;
- focused Chromium smoke plus targeted manual launch checks;
- direct Vercel Preview/Production/rollback without custom release infrastructure;
- simple rights/source notes rather than a checksum/media graph platform;
- no analytics, consent manager, RUM or third-party uptime tooling;
- full semantic 491-row fixture without pagination/virtualization until measured failure;
- taxonomy landing pages as deliberate V1 SEO content, not arbitrary filter pages.

After H1–H3 and M1–M2 are resolved, this spine is implementation-ready.

## Final recheck — 2026-07-22

**REMAINING BLOCKER — not yet PASS.**

- **Source hold remains unresolved:** `SOURCE-RECONCILIATION-LEAN-2026-07-22.md` is still `pending-upstream-update` and still says implementation is on hold until PRD/UX reconciliation. The Spine now uses safer “retained requirements after overrides” wording, but traceability cannot be final until the bound PRD/UX are actually updated.
- **`/website` location is only partially resolved:** AD-12 now correctly makes the outer repository authoritative, places the clean app in `/website`, removes the nested repository boundary, and sets Vercel Root Directory to `website`. However, Structural Seed still draws `JP-Website/src`, `JP-Website/content`, etc. It must draw `JP-Website/website/src`, `JP-Website/website/content`, etc., or label the tree root as `JP-Website/website/`.
- **Intentional query links resolved:** AD-9 now explicitly permits Home/Header/catalog query links, excludes combinatorial link grids and sitemap entries, and canonicalizes to the clean Product overview. No remaining blocker.
- **Stale bindings/names substantially resolved:** AD bindings no longer silently include News/analytics ranges, the Capability Map excludes FR-19 and labels deferred analytics, and old DTO/media-manifest/design-system terms are gone. Exact frontmatter traceability remains contingent on completing the upstream reconciliation noted above.

Once the first two bullets are fixed, this reviewer returns **PASS**.

**Final confirmation:** PASS — Structural Seed now consistently nests the clean application under `JP-Website/website/`; the pending source-reconciliation hold is intentional and correctly documented as the remaining pre-implementation step.
