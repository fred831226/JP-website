---
name: "JP PUMP UX — Lean Architecture Reconciliation"
type: source-reconciliation
status: applied
created: 2026-07-22
architecture: "../../architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md"
architecture_reconciliation: "../../architecture/architecture-JP-Website-2026-07-21/SOURCE-RECONCILIATION-LEAN-2026-07-22.md"
ux_contracts:
  - "DESIGN.md"
  - "EXPERIENCE.md"
---

# UX Reconciliation — Confirmed Lean V1 Architecture

## Outcome

The approved visual direction and all five promoted public key-screen mockups remain usable. No new public mockup is required for this scope change. The synchronization is primarily a behavioral-contract edit in `EXPERIENCE.md`, plus two narrow implementation notes in `DESIGN.md`.

The architecture decisions that now control V1 are:

- Latest Information/News is removed from V1.
- Brand, Pump Type, and Purpose index/detail pages remain in V1 under `/zh-tw/`.
- Project evidence remains inside Services & Projects; V1 has no individual Project detail route.
- GA4, source attribution, consent tooling, RUM, and third-party uptime monitoring are deferred.
- The approved visual work is implemented in a clean Next.js App Router application with Tailwind CSS; the HTML mockups are visual references, not implementation source.
- Catalog JSON is governed build input produced by a repeatable Excel intake with sheet/row/field error reporting; manual IDs, slugs, mappings, copy, and image references remain separate from importer-owned technical values.

## Conflict summary

| UX contract area | Current statement | Required V1 result |
|---|---|---|
| IA | `Project detail` and `News list/detail` are public surfaces | Remove both surfaces; retain category pages and Services & Projects |
| Header/About | About contains `最新資訊` | About contains only `公司資訊` and `合作夥伴` |
| Project interaction | Each Project evidence block links to a Project detail | Evidence is read in place on Services & Projects; no implied detail destination |
| Analytics | Contact source, product/filter events, and opt-out behavior are specified | Remove all V1 tracking, attribution, and consent behavior |
| UJ-4 | Publishes a standalone Project route and sitemap entry | Publishes or updates an approved Project evidence block inside Services & Projects |
| Maintainer sources | News and standalone Project records share the release path | News is absent; Project summaries/evidence remain governed release content |
| Catalog intake | Spreadsheet intake is mentioned but under-specified | Specify repeatable full technical-data regeneration, exact validation locations, and separation from manual fields |
| Visual implementation | Approved mockups are the visual contract, but implementation substrate is not stated | State clean Next.js App Router + Tailwind implementation while preserving DESIGN tokens and mock appearance |

## Required `DESIGN.md` edits

`DESIGN.md` has no News or analytics component contract that needs removal. Its Home sequence already says there is no News preview, its Catalog sidebar already excludes sorting and a separate apply action, and its five-screen reference list remains valid.

Apply only these focused edits:

1. **Brand & Style — implementation note**
   - Add that semantic tokens in this file remain the visual authority.
   - State that implementation transcribes those tokens to CSS custom properties and composes them with Tailwind CSS in a clean Next.js App Router project.
   - State that promoted HTML mockups demonstrate composition and behavior but are not copied as the application framework or runtime architecture.
   - Do not introduce a component framework, headless UI library, or alternate token authority.

2. **Project evidence block — remove the detail-route affordance**
   - Replace “one linked block per project” with one semantic evidence section per approved Project on Services & Projects.
   - The evidence section itself is not a whole-block link in V1.
   - A separately labelled related-Series link or Contact action may appear only when approved and must not imply that a Project detail page exists.
   - Keep the existing requirements for rights-cleared real media, title/type, concise scope/outcome, optional related-product context, and the prohibition on AI/stock evidence.

3. **Optional clarification in Components**
   - For category pages, explicitly state that Brand, Pump Type, and Purpose pages reuse the Product overview card/result language while presenting a crawlable approved introduction above related Series.
   - This does not require new tokens or a new mockup.

No palette, typography, spacing, elevation, Product card, Series, Contact, Footer, or responsive visual rule changes are required.

## Required `EXPERIENCE.md` edits

### Foundation

- Replace “All News, Projects…” with “Project summaries/evidence, company/partner content…”; News is not a V1 governed type.
- Add the implementation boundary: a clean Next.js App Router project under `/website`, Tailwind CSS using `DESIGN.md` semantic tokens, no database/backend, and `/zh-tw/` as the only generated locale.
- Keep the no-CMS/no-custom-admin boundary.
- Add that Product technical data is generated from a repeatable validated Excel intake, while stable IDs, slugs, taxonomy mappings, approved display copy, and image references remain manually governed outside the generated technical file.

### Information Architecture — public website

- Delete the `Project detail` row.
- Delete the `News list/detail` row.
- Keep `Brand index/detail`, `Pump-type index/detail`, and `Use-case index/detail` as explicit V1 surfaces.
- Revise `Services & projects` purpose to include the complete approved Project evidence required in V1, not merely a list that leads elsewhere.
- Revise Home only if necessary to say Project teasers lead to Services & Projects or an in-page Project anchor; they never lead to a Project detail route.
- Preserve `/zh-tw/` and root-to-`/zh-tw/` routing semantics.

### Information Architecture — global navigation

- Keep header order: `產品總覽`, `服務與實績`, `關於傑平`, `聯絡我們`.
- Change the About dropdown from `公司資訊`, `合作夥伴`, `最新資訊` to `公司資訊`, `合作夥伴`.
- Keep the Product dropdown as the single-level governed Purpose list, maximum eight, followed by `全部產品`.
- Keep Brand/Pump Type/Purpose pages reachable through ordinary crawlable links in Product overview and related content.

### Maintainer release workflow

- In `Source preparation`, remove News and replace generic Project publishing with approved Project summaries/evidence used by Services & Projects.
- Change “News, Projects, partners…” to “Project summaries/evidence, partners…” in the shared release-path paragraph.
- Add the catalog intake contract:
  - Excel/CSV is evidence input, never runtime/public authority.
  - Import fully regenerates importer-owned technical Series/Model fields rather than partially patching them.
  - Failures identify the source sheet, row, and field.
  - Import never overwrites stable IDs, slugs, taxonomy mappings, approved display copy, or image references.
  - Validation joins generated technical data and manual catalog content by stable Series/Model keys and rejects duplicate, missing, or orphaned records.

### Voice and Tone

- Remove `最新資訊` from the approved-noun list.
- No replacement noun is required.

### Component Patterns

- **Home content teaser:** remove the sentence that News remains on dedicated surfaces. State that a Project teaser routes to Services & Projects or its stable in-page Project anchor; Partner teaser behavior is unchanged.
- **Contact action:** remove optional source-attribution behavior. It simply routes to the same one-page Contact surface with no origin copy and no return-to-product/series control.
- **Project evidence block:** change use to `Services & projects` only. Remove the whole-block detail link. Render a semantic in-place evidence section; optional related-Series or Contact links must be separately labelled and approved.
- **Catalog sidebar:** retain the final segmented Brand, multi-select Pump Type/Purpose chips, immediate filtering, URL restoration, no sort, and no apply action. Add invalid-query normalization consistent with Architecture: invalid/multiple Brand values reset Brand to `全部`; repeated Type/Purpose values deduplicate; invalid values do not silently select another category.
- **Home quick filter:** clarify that `全部` means “no constraint.” URL generation should omit unconstrained dimensions unless the shared query schema intentionally defines an equivalent normalized token; it must not create an indexable alternate page.
- **Release evidence:** keep provider-owned Git/CI/Vercel behavior; Preview identifies the source commit, while Production may rebuild with Production environment settings.

### State Patterns

- Change `Public route and content delivery` surfaces from “Category, Services & projects, Project, Company, Partners, News” to “Category, Services & projects, Company, Partners.”
- Change `Contact reached from any origin` to remove the internally retained attribution state entirely.
- Change `Uncommitted or branch-only content` so it must not appear in sitemap, navigation, or Production; remove the analytics reference.
- Expand `Product intake no changes/import failed`:
  - Import failure leaves the current generated catalog unchanged.
  - Report file/sheet/row/field and actionable rule.
  - Duplicate/missing/orphaned stable keys block Preview.
  - Manual IDs, slugs, taxonomy mappings, approved copy, and images are never overwritten by the importer.
- Add or fold in a `Filter URL invalid` state: normalize invalid values without crashing, reset invalid Brand to `全部`, discard invalid Type/Purpose values, deduplicate repeated values, preserve valid unrelated conditions, and update the visible condition tags/result count.
- Remove no longer reachable Project-detail and News empty/loading/removed implications. A retired legacy News/Project URL follows the general redirect-or-useful-404 contract, but V1 does not expose those surfaces in navigation or sitemap.

### Interaction Primitives

- Delete the analytics paragraph in full.
- Keep share/reload restoration, Browser Back preservation, immediate filtering, no sort/apply step, accessible image dialog, and non-hover-only operation.
- Clarify that query variants use the clean Product overview as canonical and are not separate IA surfaces. UX need not promise a query-specific server-rendered `noindex` response.

### Key Flows

- **UJ-1:** remove “source may be retained for privacy-safe analytics.” The Contact transition carries no V1 attribution requirement.
- **UJ-2:** unchanged except Project evidence is examined entirely on Services & Projects. Do not add a Project-detail step.
- **UJ-3:** unchanged.
- **UJ-4:** rewrite from “publishes an approved project page” to “publishes or updates approved Project evidence on Services & Projects.” Required changes:
  1. Create/update the governed Project summary/evidence record; no public slug is required solely for a detail route.
  2. Record approved name/type, concise context, optional scope/outcome, optional related Series IDs, media alt/source/rights, stable record ID, and optional stable in-page anchor.
  3. Validate facts, relationships, rights, links, media, and build.
  4. Preview the changed Services & Projects page and any Home teaser; do not expect a Project sitemap entry or detail page.
  5. JP PUMP approves the Preview tied to the source commit.
  6. Climax: the Services & Projects evidence, optional Home teaser, links, and media change atomically while the prior deployment remains recoverable.
- **UJ-5:** retain the dense-data checks and add the exact importer split/error contract described above.

### Source Reconciliation section

Replace the current statement that PRD/addendum/Architecture already agree. Record this synchronization explicitly:

- Latest Information/News has been removed from V1, not merely removed from Home.
- Project detail has been deferred; Project evidence is complete in Services & Projects.
- Brand/Pump Type/Purpose landing pages remain V1.
- Analytics/attribution/consent behavior is deferred.
- `/zh-tw/`, visual mockups, filters, Contact rules, and Git → Preview → approval → Production remain.
- Clean Next.js App Router + Tailwind is the implementation substrate; mockups remain references and UX spines win on conflict.
- Link this reconciliation file and the Architecture source reconciliation.

### Mockup Coverage section

- Retain all five approved mockups:
  - `mockups/key-screen-home-responsive-01.html`
  - `mockups/key-screen-product-overview-responsive-01.html`
  - `mockups/key-screen-product-series-detail-responsive-01.html`
  - `mockups/key-screen-services-projects-responsive-01.html`
  - `mockups/key-screen-contact-responsive-01.html`
- Update the spine-only list to: Brand/Pump Type/Purpose category pages, Company, Partners, and not-found.
- Remove Project detail and News from the spine-only V1 list because they are deferred/absent, not unmocked V1 surfaces.
- State that no new mock is needed: category pages reuse catalog/content patterns, and Project evidence already has visual coverage in Services & Projects.
- Inspect the Services & Projects and Home mock links during implementation handoff. If a Project block currently points to a hypothetical detail URL, retarget it to Services & Projects/a stable in-page anchor or remove the block link. This is a link-semantic correction, not a visual redesign.

### Remaining Dependencies

- Keep content approval, technical table fields, English deferral, and future CMS notes.
- Add that News, individual Project detail pages, and analytics/consent/RUM are post-V1 product decisions, not missing V1 UX work.
- Add that the generated/manual catalog split and Excel error reporting must be demonstrated before implementation acceptance.

## `key-screen-coverage.md` reconciliation

- Remove Project detail and News from V1 spine-only coverage.
- Keep category pages, Company, Partners, and not-found as spine-only.
- Record Services & Projects as the complete Project-evidence surface for V1.
- Record that all five approved mockups are retained without redraw; only Project-link semantics require implementation review.

## Canonical memlog reconciliation

Do not delete historical entries. Append overrides/events that close the older decisions:

1. Architecture Review removes Latest Information/News from all V1 IA, navigation, content, publishing, and coverage—not only from Home.
2. Project detail routes are deferred; Services & Projects owns the complete V1 Project evidence, and Project blocks no longer imply a detail destination.
3. GA4, source attribution, consent, RUM, and third-party uptime interactions are deferred; Contact behavior carries no tracking contract.
4. Brand, Pump Type, and Purpose index/detail pages remain V1 spine-only surfaces under `/zh-tw/`.
5. Approved visual mockups are preserved and will be implemented in a clean Next.js App Router + Tailwind project; the mock HTML is not the application scaffold.
6. Excel intake repeatedly regenerates only technical catalog fields, reports sheet/row/field errors, and cannot overwrite manually governed IDs, slugs, taxonomy, copy, or images.
7. UX contracts and coverage were synchronized to `SOURCE-RECONCILIATION-LEAN-2026-07-22.md`; no key-screen redraw was required.

## Mock and screen disposition

| Surface/artifact | V1 disposition | Action |
|---|---|---|
| Home mock | Retain | No visual redraw; ensure any Project teaser targets Services & Projects/anchor, never a detail route |
| Product overview mock | Retain | No redraw; final no-sort/no-apply segmented/chip design already agrees |
| Series detail mock | Retain | No architecture reconciliation change |
| Services & projects mock | Retain | Treat evidence blocks as in-place content; correct hypothetical Project-detail links if present |
| Contact mock | Retain | No attribution or return-route behavior |
| Brand/Pump Type/Purpose pages | Retain as spine-only V1 | Build from Product overview/category contracts; no new mock required |
| Company, Partners, not-found | Retain as spine-only V1 | No new mock required |
| Project detail | Deferred | Remove from IA, flow, states, coverage, links, sitemap expectations |
| News list/detail | Removed from V1 | Remove from IA, About menu, terms, publishing, states, coverage, sitemap expectations |
| Git/CI/Vercel journey | Retain provider-owned | No custom public/admin mock |

## Closure criteria

UX synchronization is complete when:

- `DESIGN.md` contains the Tailwind/Next.js implementation note and non-linked Project evidence contract.
- `EXPERIENCE.md` contains no V1 News surface, Project detail route, analytics/attribution/consent interaction, or Project-detail link requirement.
- Category landing pages remain present and `/zh-tw/` remains the V1 locale route.
- UJ-4 ends at the Services & Projects evidence surface and its optional Home teaser.
- UJ-5 and Product intake states describe the generated/manual catalog split plus sheet/row/field error reporting.
- `key-screen-coverage.md` classifies only actual V1 surfaces.
- `.memlog.md` receives additive override/event entries; historical decisions remain intact.
- The five promoted mockups remain approved; no redraw is introduced solely for architecture synchronization.
