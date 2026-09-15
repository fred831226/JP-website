---
baseline_commit: 843dd1b51cee8757d282b9f42f7a9abb9197215e
---

# Story 2.8: Remediate Epic 2 Catalog Review Findings

Status: done

<!-- Story 2.8 is a fresh remediation work item. Historical commits, tests, and prior story/spec statuses are context only, not acceptance evidence. -->

## Story

As a professional buyer and designated maintainer,
I want the approved 22-Series catalog, filtering, specifications, media interaction, and validation behavior to conform to the reconciled requirements,
so that buyers receive complete and trustworthy product information and releases fail instead of silently losing or mislabelling data.

## Requirements Traceability

- Functional: FR6-FR14, FR16, FR21, FR24.
- Non-functional: NFR2, NFR3, NFR10, NFR11.
- UX: UX-DR14-UX-DR24, UX-DR31, UX-DR33, UX-DR35-UX-DR37.
- Change control: approved Direct Adjustment from the 2026-08-21 Sprint Change Proposal.
- Readiness: `READY WITH CONDITIONS`; Sprint Planning has already satisfied the prerequisite by adding Story 2.8 as `backlog`.

## Acceptance Criteria

1. **Given** the approved combined-Series governance  
   **When** Product Overview, Pump Type pages, Series routes, and sitemap entries are generated  
   **Then** exactly 22 canonical Series and 22 corresponding Product Overview cards are published  
   **And** the superseded 28-card split and split Series routes do not exist.

2. **Given** all source Models and the approved canonical-Series grouping  
   **When** import and reconciliation run  
   **Then** every source Model belongs to exactly one canonical Series group  
   **And** unassigned, multiply assigned, or unknown Series records report their source location and block publication rather than being silently lost.

3. **Given** the V1 Series classification contract  
   **When** Pump Type relationships are loaded  
   **Then** every Series belongs to exactly one approved Pump Type and VBSG belongs only to `臥式泵`  
   **And** no Series multi-type or Model-level Pump Type model is created.

4. **Given** the approved `2CR(I,N) Booster` content  
   **When** its Product Overview card and canonical Series page render  
   **Then** the short description is exactly `2CR(I,N) Booster 雙台變頻恆壓泵浦，採恆定壓力交替並列變頻供水，依據水量調整泵浦數量及變頻供水。`  
   **And** the introduction preserves these approved statements without invented claims:

   - `恆壓交替並列` — `恆定壓力交替並列變頻供水，依據水量調整泵浦數量及變頻供水`
   - `靜音` — `使用雙台變頻主副作交替並列及 PI 控制泵浦，無段變頻變速及軟啟動軟停止，無傳統加壓機頻繁啟停所造成噪音`
   - `防水鎚` — `變頻軟啟停，無傳統加壓機啟停造成水鎚效應確保管路及泵浦安全`
   - `無水保護` — `無水自動保護參數設定，亦可外接浮球感知保護，以確保泵浦不因乾轉損壞（軟硬體雙保護）`
   - `過載保護` — `可依馬達額定設定保護參數，確保馬達安全`
   - `異常交替` — `單台運轉跳脫，自動啟動另一台確保供水無慮`
   - `檢修方便` — `控制架構簡潔，檢修容易及方便`
   - `提供運轉及異常監視接點`
   - `節省能源`
   - `容易選型、安裝及試車`

5. **Given** the approved technical review baseline  
   **When** public and internal catalog data are produced  
   **Then** public Series pages show last-updated date `2026-08-21`  
   **And** reviewer `Fred` and review date `2026-08-21` remain only in internal governance data and never enter client output.

6. **Given** any canonical Series page  
   **When** its main content renders at any supported width  
   **Then** the reading order is suitability-confirmation note, image, four-field key-data block, approved introduction, Model table, non-interactive Purpose tags, and actions  
   **And** the four key-data values are minimum/maximum head in `m` and minimum/maximum flow in `L/min`, with missing values rendered as `未提供`.

7. **Given** a visitor types search text or changes Brand, Pump Type, Purpose, active-condition, or clear-all controls  
   **When** the value changes, including rapid consecutive changes  
   **Then** filtering applies immediately and uses the latest complete state without losing any still-valid prior condition  
   **And** input values, selected controls, active conditions, normalized URL, result cards, and result count agree through reload, sharing, and Browser Back.

8. **Given** repeated or invalid query values  
   **When** the shared query schema parses them  
   **Then** multiple or invalid Brand values reset Brand to `全部` and omit the Brand constraint while preserving unrelated valid state  
   **And** repeated Type/Purpose values deduplicate and invalid values are discarded without selecting replacements.

9. **Given** pointer, touch, keyboard, or assistive-technology use  
   **When** catalog conditions or results change  
   **Then** filter controls expose programmatic selected state, visible focus, visible labels, and effective 44 by 44 CSS px targets  
   **And** visible result count and polite live announcements communicate changes without moving focus or announcing every search keystroke individually.

10. **Given** no Series matches the active conditions  
    **When** the empty state renders  
    **Then** it preserves active conditions and offers individual removal, `重設全部條件`, and an operable Contact path  
    **And** it does not flash a blank list or clear unrelated state.

11. **Given** Product Overview or an approved Pump Type page  
    **When** shared Product cards render  
    **Then** each card includes approved imagery, a classification label, Series name, short approved description, reviewed head/flow summary, and one accessible canonical-Series link  
    **And** a Pump Type page with no published Series retains its approved introduction and offers Product Overview and Contact links.

12. **Given** an approved Series image enlargement trigger  
    **When** the dialog opens, fails to load, or closes  
    **Then** it provides an in-dialog labelled failure state, operable close path, focus trap, Escape support, and focus return to the trigger  
    **And** the trigger and close control have effective 44 by 44 CSS px targets, while a Series without approved media never opens an empty dialog.

13. **Given** a Model table wider than its available region  
    **When** it renders at a narrow viewport  
    **Then** only a clearly labelled bounded table container scrolls horizontally and provides a visible scroll cue  
    **And** the page does not scroll horizontally and all approved Models remain semantic server HTML.

14. **Given** a catalog import containing an unknown Brand or Series, a non-numeric range, a unit mismatch, or invalid canonical grouping  
    **When** import or validation runs  
    **Then** the current generated catalog remains unchanged and the report identifies file, sheet, row, field, and violated rule  
    **And** no record is silently skipped, no partial output is produced, and an HP value is never published under `功率 (kW)`; an unconfirmed corrected value remains `null` and renders as `未提供`.

15. **Given** the public image set confirmed by the project owner on 2026-08-21  
    **When** release validation evaluates that existing set  
    **Then** it does not require an additional per-image approval register or block solely for missing additional source/rights/approval metadata  
    **And** alt text, file existence, loadability, content relationships, and accessibility still pass, while future additions or replacements follow the normal governance rule.

## Tasks / Subtasks

- [x] 1. Establish fresh Story 2.8 regression evidence before remediation (AC: 1-15)
  - [x] Add failing focused tests/fixtures for the unresolved findings before changing production behavior; do not treat existing green checks as the RED phase.
  - [x] Cover exactly 22 canonical Series/routes/cards, one-group-per-Model, one Pump Type per Series, VBSG classification, exact Booster copy, review privacy, and Series reading order/key data.
  - [x] Cover immediate and rapid filter changes, query normalization, URL/reload/share/Back synchronization, result count/live-region behavior, empty-state actions, and 44x44 selected controls.
  - [x] Cover Product/Pump Type shared cards, dialog success/failure/focus return, 320 CSS px table containment, semantic 491-row HTML, unit integrity, importer non-overwrite, and the scoped media exception.

- [x] 2. Reconcile catalog identity, grouping, classification, approved content, and review metadata (AC: 1-6, 14)
  - [x] Make the schema and page-ready type express exactly one `pumpTypeId` per Series; remove Series multi-type and Model-level Pump Type fields rather than retaining compatibility aliases.
  - [x] Validate exactly 22 unique canonical Series, 22 unique slugs/routes/cards, complete source-Model assignment, and no duplicate or orphaned stable keys.
  - [x] Bind VBSG only to `臥式泵`; keep stable IDs independent from labels/slugs and do not derive identity from mutable display copy.
  - [x] Store the approved Booster copy exactly once in governed content and the review facts in internal governance data; expose only `lastUpdatedDate: 2026-08-21` in public page-ready data.
  - [x] Preserve `null` for unconfirmed values and explicit decimal-string/unit contracts; never infer, convert, zero-fill, or silently relabel a value.

- [x] 3. Repair canonical Series presentation and Model specification integrity (AC: 5, 6, 13, 14)
  - [x] Render the required cross-width order: suitability note, image, exactly four key-data fields, approved introduction, Model table, non-interactive Purpose tags, actions.
  - [x] Render min/max head only in `m`, min/max flow only in `L/min`, and every unavailable value as `未提供`.
  - [x] Render the approved public update date without reviewer identity/evidence in HTML, RSC payload, serialized props, metadata, or other client output.
  - [x] Keep every reviewed Model as semantic, non-hydrated server HTML; label the bounded horizontal-scroll region and provide a persistent visible scroll cue without page-level horizontal overflow at 320 CSS px.
  - [x] Keep power units honest: kW values may appear under `功率 (kW)`; HP values must have an HP-labelled presentation or remain unavailable until a reviewed kW value exists.

- [x] 4. Make catalog filtering immediate, normalized, race-safe, and accessible (AC: 7-10)
  - [x] Use one complete state transition path for search, Brand, Type, Purpose, condition removal, and clear-all so rapid updates cannot be based on stale props or overwrite valid conditions.
  - [x] Apply trimmed search changes immediately with an intentional coalescing/debounce strategy; live announcements must not fire for every keystroke.
  - [x] Keep the shared query contract: zero/one Brand, repeated Type/Purpose, optional `q`; reset invalid/multiple Brand to all, deduplicate valid Type/Purpose, discard invalid values, and preserve unrelated valid state.
  - [x] Keep URL state authoritative across reload/share/Back, use history semantics deliberately, avoid focus movement, and keep the Server Page independent of `searchParams` with the Client island under `Suspense`.
  - [x] Expose selected state programmatically (`aria-pressed`, native checked semantics, or an equivalently correct pattern), visible labels/focus, 44x44 targets including remove/clear controls, visible result count, and a polite coalesced live region.
  - [x] Preserve active conditions in the no-results state and provide individual removal, `重設全部條件`, and a normal Contact link without a blank-list flash.

- [x] 5. Reuse one complete Product card language on Product Overview and Pump Type pages (AC: 1, 11)
  - [x] Reuse a shared card implementation instead of maintaining divergent markup; include approved image/fallback, classification label, name, approved description, head/flow summary with units or `未提供`, and one whole-card canonical link.
  - [x] Do not add nested actions, `規格`/`尺寸範圍` buttons, Brand/Purpose routes, split-Series routes, or combinatorial query pages.
  - [x] Preserve original approved Pump Type introduction copy; when no Series is published, render factual recovery links to Product Overview and Contact.

- [x] 6. Complete the image enlargement state machine and focus contract (AC: 12)
  - [x] Preserve the native modal dialog or an equally accessible local primitive; do not add a component/headless UI library for this story.
  - [x] Provide focus containment, suitable initial focus, Escape/cancel handling, an explicit 44x44 close control, and deterministic focus return to the exact invoking image trigger.
  - [x] Handle image load/render failure inside the open dialog with a labelled unavailable state and working close path; a no-media Series must render a labelled static fallback and no trigger/dialog.
  - [x] Keep gallery controls and thumbnails keyboard/touch operable with effective 44x44 targets and programmatically clear current selection.

- [x] 7. Make import and release validation atomic, actionable, and fail closed (AC: 1-3, 14, 15)
  - [x] Validate the complete candidate in memory or staged temporary files before replacing any tracked generated output; on any error, all current generated/public copies must remain byte-for-byte unchanged and no partial output may exist.
  - [x] Treat unknown Brand/Series, missing or duplicate grouping, non-numeric ranges, unit mismatch, duplicate Model identity, and incomplete 22-Series grouping as blocking errors rather than `continue`, fallback, warning, or ignored aggregation cells.
  - [x] Report actionable file, sheet, row, field, record, and violated rule without logging source documents, secrets, or unnecessary content bodies.
  - [x] Validate paired generated/manual stable-key joins, sitemap/card/route cardinality, exact single Pump Type, public/private review boundaries, and HP/kW integrity.
  - [x] Encode the 2026-08-21 media exception narrowly: do not require a new register for the existing set, but still block missing/invalid alt, file, loadability, relationship, or accessibility; require normal provenance/rights/approval governance for additions/replacements.
  - [x] Test importer failures with isolated temporary fixtures/copies; never corrupt or rewrite the checked-in source workbook while proving failure behavior.

- [x] 8. Complete verification and prepare fresh review evidence (AC: 1-15)
  - [x] Run `npm --prefix website run validate`, `npm --prefix website run lint`, `npm --prefix website run build`, and the full `npm --prefix website test` suite; record actual outcomes.
  - [x] Run focused Story 2.8 tests for all changed risk cases, including the 491-row fixture and JavaScript-disabled crawlable 22-Series links.
  - [x] Manually verify 320 CSS px containment, keyboard/focus order and return, live announcements, dialog failure, 44x44 targets, reload/share/Back, rapid filter changes, and supported Safari behavior where available; record anything not verified.
  - [x] Inspect production build output/client payloads to confirm internal reviewer data is absent and exactly 22 canonical Series routes/sitemap entries are generated.
  - [x] Update only the permitted Dev Agent Record, task checkboxes, File List, Change Log, and story/status fields during `bmad-dev-story`; do not backfill Stories 2.2-2.6.

### Review Findings

- [x] [Review][Patch][2026-08-28] Candidate activation validated only cardinality/identity/Pump Type and could activate incomplete Series or Models — `catalog-candidate.mjs` now requires the complete generated candidate shape, a `models` array, required Series/Model fields, every consumed technical key (with `null` for unknowns), and an exact `modelCount`/Models join before the release indicator can switch. Regression coverage includes missing `models`, missing `specs`, missing required fields, and mismatched `modelCount`.
- [x] [Review][Patch][2026-08-28] Standalone validation could fall back to legacy root outputs and did not require every consumed technical key — it now treats a missing, malformed, or dangling `catalog-current.json` as a blocking release error, reads only the selected versioned release, and rejects missing or empty technical values (unknown is `null` only).
- [x] [Review][Patch][2026-08-28] Import technical-value diagnostics could report a later malformed source row as row 4 — numeric technical values now validate while reading each main-sheet row and retain the workbook sheet, Excel column, and actual row in the failure message.
- [x] [Review][Patch][2026-08-28] Activation failure evidence compared only the release indicator — the fault-injection regression now compares byte-for-byte the old selected release's four generated/overview outputs before and after a failed activation.
- [x] [Review][Patch][2026-08-28] Publisher accepted activation without a canonical identity contract, and Overview shape validation accepted consumer-invalid values — activation now requires the governed 22-Series ID set and validates Overview ranges, publication state, and purpose tags before switching the indicator.
- [x] [Review][Patch][2026-08-28] Whitespace-only technical values could bypass the null-only unknown contract — candidate and standalone validation now reject whitespace-only technical text.
- [x] [Review][Patch][2026-08-28] Import and standalone range diagnostics did not consistently expose workbook and Excel cell coordinates — main, Overview, and filter-tag range failures now report `source-catalog.xlsx`, sheet, actual column, row, field, and violated rule.
- [x] [Review][Patch][2026-08-28] Importer failure tests checked stale root copies rather than the selected versioned release — failure fixtures now compare the active indicator-selected four output files byte-for-byte.

- [ ] [Review][Patch] Duplicate valid Brand query does not reset to `全部` [website/src/lib/catalog-query.ts:32] — AC 8 requires every multiple Brand value, including `?brand=grundfos&brand=grundfos`, to omit the Brand constraint. Current de-duplication leaves one valid Brand selected; add raw-cardinality validation and regression coverage for duplicate, mixed, and invalid values.
- [ ] [Review][Patch] Filter transitions can discard a prior rapid Type/Purpose selection and remount the focused search input [website/src/components/CatalogFilter.tsx:35] — AC 7/9 require latest complete state and no focus movement. A second toggle before navigation re-renders derives from stale props, while `CatalogBrowser` keys the filter by canonical URL at line 65 and unmounts it on every immediate search update. Use an authoritative latest state for array toggles, preserve component identity, and test real keyboard typing plus rapid multi-condition input.
- [ ] [Review][Patch] Import accepts a unit-mismatched source column and can publish HP under the kW heading [website/scripts/import-catalog.mjs:26] — AC 14/Task 7.2 require unit mismatch to block publication. Fixed numeric column indexes are never checked against the source headers, so an exchanged/renamed HP and kW column remains numeric and passes candidate validation. Validate governed header/unit contracts with source sheet, row, and field evidence before output publication.
- [ ] [Review][Patch] Import candidate does not prove the approved canonical 22-Series identity set [website/scripts/catalog-candidate.mjs:11] — AC 2/14 require unknown Series to fail closed. The validator checks count and internal generated/overview joins only; a new Series replacing an approved one can retain 22 records and publish. Join candidate stable IDs to the governed canonical set/content and report the originating record on mismatch.
- [ ] [Review][Patch] Overview/filter-sheet malformed records evade complete fail-closed validation [website/scripts/import-catalog.mjs:288] — AC 2/14 require non-numeric ranges and unknown Series to block. Overview head/flow values are copied without decimal validation; filter-tag Series keys are not required to match the main sheet; and standalone validation silently skips a filter-tag row with unknown/missing Brand or Series at `website/scripts/validate-content.mjs:192-208`. Validate all four range fields and all source joins with file/sheet/row/field/rule diagnostics, then add isolated non-overwrite fixtures.
- [ ] [Review][Patch] Four-output publisher is not transactionally atomic under replacement failure [website/scripts/catalog-candidate.mjs:45] — AC 14/Task 7.1 promise all generated/public copies remain byte-for-byte unchanged on any failure, but targets are exposed via sequential renames at line 51. Use a single atomically switched release artifact/manifest or a recoverable transaction, and fault-inject failures during both replacement and rollback.
- [ ] [Review][Patch] Scoped media exception omits required loadability, relationship, and accessibility checks [website/scripts/validate-content.mjs:342] — AC 15 allows the 2026-08-21 set to omit a new approval register, not the remaining media gates. Validation checks existence only; ProductCard emits an empty alt at `website/src/components/ProductCard.tsx:15`, and neither the existing-set exception nor additions/replacements have enforceable relationship/alt/loadability rules. Encode those distinct contracts and test both paths.
- [ ] [Review][Patch] Image failure state leaks from one gallery image to another [website/src/app/[locale]/series/[slug]/SeriesActions.tsx:9] — AC 12 requires each approved image enlargement state to work. A global `imageFailed` boolean is passed to the dialog at line 83 and is never reset when `activeIndex` changes, so a later valid image opens as failed. Track failure by source/index and test failure then selection of a valid image.
- [ ] [Review][Patch] Pump Type route resolution assumes mutable slug equals stable ID [website/src/app/[locale]/types/[slug]/page.tsx:20] — Task 2 requires stable IDs independent from mutable slugs. `getPumpType` only resolves IDs (`website/src/lib/content/load-catalog.ts:143`), so any future approved slug change turns its route into 404. Resolve by slug in the route and retain ID lookups separately.
- [ ] [Review][Patch] Fresh RED evidence and claimed AC coverage are not independently demonstrable [website/tests/story-2.8/catalog-contract.test.mjs:11] — Task 1/8 and the Dev Agent Record claim RED-first proof and coverage of all changed risks, but the untracked final suites contain no preserved pre-remediation failing invocation and omit repeated/invalid query variants, real rapid concurrent transitions, overview unit mismatch, canonical replacement, atomic replacement failure, and the scoped media exception. Add isolated RED fixtures/tests that fail on the defective behavior and GREEN tests that assert the corrected behavior before retaining the completion claims.
- [ ] [Review][Patch] Story File List and working-tree scope are inconsistent with the Story boundary [_bmad-output/implementation-artifacts/2-8-remediate-epic-2-catalog-review-findings.md:345] — the actual working tree also modifies finalized PRD, architecture, UX, epics, SPEC, historical implementation context, and non-Epic-2 sprint entries, none of which appear in the File List and several of which violate the Story's no-planning-artifact constraint. Preserve unrelated work, but separate it from Story 2.8 and make the Story record complete before acceptance.

## Dev Notes

### Developer Context and Non-Negotiable Boundaries

- This is remediation, not a completion declaration. New implementation evidence and a new Code Review are required for every AC.
- Epic 2 remains `in-progress`. Stories 2.2-2.6 remain `review`; this story must not rewrite their historical acceptance files or mark them done.
- Commits `a53d701`, `9b2422e`, and `843dd1b`, current tests, and the historical four-pump-type spec's `done` status are context only.
- Keep the approved 22 combined canonical Series. Never restore the superseded 28-card/split-route design.
- Do not create a new change proposal. The proposal has no remaining product decisions.
- Do not defer explicit Story 2.8 validation/import/media ACs to Epic 3. The contracts overlap, but Story 2.8 owns the remediation required for Epic 2 acceptance.
- Sitemap work is limited to the 22 canonical Series/no-split contract. Do not expand into unrelated Epic 4 SEO work.
- V1 remains static-first and Traditional Chinese only. Do not add CMS, database, ORM, auth, admin/API/runtime writes, analytics/RUM, English pages, Model routes, Brand/Purpose routes, PDFs, pricing, inventory, or selection guarantees.
- Preserve all unrelated working-tree and untracked files. Do not modify planning artifacts during implementation.

### Current Implementation Intelligence (UPDATE Files)

The following is the current state observed when this story was created. The dev agent must re-read every file before editing and adjust the final file list if the implementation chooses a smaller or different bounded solution.

- `website/src/lib/validation/catalog.ts`
  - Current: `SeriesSchema` exposes `pumpTypeIds: string[]`, while every Model redundantly exposes `pumpType: string`; model specs are untyped string records.
  - Change: express one Series Pump Type and governed unit/value boundaries; remove Model-level Pump Type.
  - Preserve: stable Series/Model IDs, nullable reviewed decimal behavior, and Zod as the validation boundary.
- `website/src/lib/content/load-catalog.ts`
- `website/src/lib/catalog-query.ts`
  - Current: joins generated/content/overview records and maps one source Pump Type into a public one-element array; returns page-ready catalog data but has no review-date/public-update contract.
  - Change: enforce unique complete joins, singular Pump Type, approved review privacy, exact public update date, and no fallback that hides invalid records.
  - Preserve: `server-only`, small direct loader functions, stable-ID joins, and no raw Excel/internal evidence in route components.
- `website/src/lib/catalog-query.ts`
  - Current: correctly normalizes invalid/multiple Brand to no constraint and deduplicates Type/Purpose, but it must remain the single shared query schema while state updates become race-safe.
  - Change: retain normalization semantics and expose helpers needed for atomic complete-state transitions/tests without adding a state library.
- `website/src/components/CatalogFilter.tsx`
  - Current: search updates local text but only applies on Enter; navigation is derived from render-time props; filter buttons lack explicit programmatic selected state; remove and clear controls do not guarantee 44x44 targets.
  - Change: immediate/coalesced search, latest-state transitions, selected semantics, full-size controls, visible labels/focus, and synchronization on Back/Forward.
  - Preserve: visible filter groups, Brand exclusivity, Type OR, Purpose AND, removable conditions, and no Apply/Sort controls.
- `website/src/components/CatalogBrowser.tsx`
  - Current: derives state from `useSearchParams`, normalizes with `router.replace`, filters Series, and hides server-rendered cards through a DOM effect. It has no visible result count or polite live region, and separate navigation/visibility effects can expose stale intermediate state.
  - Change: one coherent latest-state result/update path, count/live communication, no blank flash, and agreement among URL/controls/cards/count.
  - Preserve: static server HTML links, Series-level client metadata only, `Suspense`, no full Model specs in the Client Component, and no remote request.
- `website/src/app/[locale]/products/page.tsx`
  - Current: server-renders 22 card links and mounts the filter island, but cards omit the required classification label; head/flow fallback behavior is inconsistent; the hidden empty state has no actual reset or Contact links and no result summary.
  - Change: use the shared complete card, accessible result summary/empty recovery, and exact 22-card output.
  - Preserve: Server Page does not read `searchParams`, cards remain crawlable without JavaScript, one/two-column responsive contract, and whole-card links.
- `website/src/app/[locale]/types/[slug]/page.tsx`
  - Current: renders approved type description and simple text-only Series cards; the no-Series state is plain text without Product Overview/Contact recovery.
  - Change: reuse the complete shared Product card and actionable empty state.
  - Preserve: substantive Pump Type route/copy and one canonical link per related Series; never generate Brand/Purpose pages.
- `website/src/app/[locale]/series/[slug]/page.tsx`
  - Current: image and introduction appear before the suitability note; there is no four-field key-data block or public last-updated date. The Model table has an unlabelled scroll wrapper/no visible cue. Its `功率 (kW)` column can display an HP fallback, which violates AC14.
  - Change: exact reading order, key data, public date/privacy, bounded labelled table, visible cue, and honest units.
  - Preserve: static params, canonical single route, semantic server-rendered Model rows, `未提供`, complete 491-row fixture, non-interactive Purpose tags, Contact then return actions, and no Model routes/downloads.
- `website/src/app/[locale]/series/[slug]/SeriesActions.tsx` and `website/src/components/ImageDialog.tsx`
  - Current: native `<dialog>` opens and Escape closes, but there is no image-error state or explicit trigger ref/focus return; close and carousel controls are 40px; selection semantics are incomplete.
  - Change: complete open/load-failure/close/focus state machine and minimum targets.
  - Preserve: local component approach, no nested modal, no dialog when media is absent, and approved-media-only rendering.
- `website/scripts/import-catalog.mjs`
  - Current: reads the governed workbook and directly writes both generated and overview copies after processing. Some non-numeric filter-range cells are skipped rather than reported, and direct multi-file writes cannot guarantee all-or-nothing output.
  - Change: validate/stage the complete candidate first, fail on required bad values/grouping/units, and replace outputs only after all checks pass.
  - Preserve: workbook as intake rather than runtime authority, Excel-owned/manual-owned field split, exact source locations, and no overwrite of stable IDs/slugs/taxonomy/copy/images.
- `website/scripts/validate-content.mjs`
  - Current: checks source/generated relationships, IDs, Pump Types, media existence, operational facts, and emits structured errors/warnings; some invalid numeric aggregation paths are ignored and the full Story 2.8 cardinality/unit/privacy/media-exception contract is not proven.
  - Change: make all AC14 risks blocking/actionable and add cross-output 22-Series/single-type/review/privacy/media checks.
  - Preserve: redacted structured reporting and nonzero exit on blocking errors.
- `website/src/app/sitemap.ts`
  - Current: derives Series entries from the loader.
  - Change: prove it emits exactly the same 22 canonical Series and no split/Brand/Purpose/Model routes; implementation changes may be unnecessary if strengthened upstream validation guarantees this.
  - Preserve: same promoted validated state and locale-prefixed canonical routes.
- `website/tests/e2e/smoke.spec.ts`
  - Current: covers 22 JavaScript-disabled links, query cleanup, Back/Forward search, Type OR/Brand AND, selected Series rows, the 491-row fixture, and Brand/Purpose route absence. It does not prove all Story 2.8 accessibility, failure, race, unit, card, empty-state, or ordering contracts.
  - Change: retain useful tests and add fresh targeted coverage; do not merely rename old tests as Story 2.8 evidence.

Likely supporting updates include governed catalog JSON pairs, a shared Product card component, and narrowly scoped CSS/test fixtures. Do not edit `website/data/source-catalog.xlsx` unless implementation truly requires an approved source correction; importer failure tests must use isolated copies.

### Architecture Compliance

- Stack remains the exact project lock: Next.js 16.2.10, React/React DOM 19.2.7, TypeScript 5.9.3, Tailwind CSS 4.3.3, Zod 4.4.3, Playwright 1.61.1, Node `>=22.13.0` (architecture seed targets Node 24 LTS).
- Use App Router Server Components and static generation by default. Limit Client Components to filter and media interaction state.
- Do not force `output: 'export'`; keep normal Vercel Next.js behavior.
- Do not add dependencies. Native HTML and small local components are sufficient for this story.
- Keep semantic CSS tokens from `DESIGN.md`; do not create a second visual/token system or Tailwind JavaScript config.
- Keep all public content/data in governed repository sources validated before build; route components must not become another content authority.
- Keep logs actionable but redacted; never serialize reviewer identity or source evidence to the browser.

### UX and Accessibility Guardrails

- Product cards: borderless white surface, restrained shadow, top approved image/fallback, tonal classification tag, readable name/copy, explicit head/flow units, text-only non-interactive `看更多`, one whole-card link, 3px focus outline.
- Layout: two columns only while cards remain readable, otherwise one; 20px mobile gutters where possible; no page horizontal scroll at 320 CSS px.
- Filters: seamless rail/top adaptation, visible labels, current conditions, count, no hidden Apply and no Sort. Selected state cannot rely on color alone.
- Empty states: factual, no invented card/data, ordinary Contact/Product links, and preserved conditions.
- Dialog: modal focus stays inside, Escape closes, visible close button exists, and focus returns to the invoker.
- Model table: headers/cells retain programmatic association; sticky first Model column is optional only when it does not break containment; browser find and assistive navigation must still reach all rows.
- Purpose tags remain neutral, non-focusable, non-clickable labels with no hover-control styling.

### Testing Requirements

- Follow RED-GREEN-REFACTOR per task. Capture a genuine failing test for each defect class before the fix.
- Use unit-level coverage for pure query normalization/state merging and candidate validation. If no unit runner exists, prefer Node built-in tests or another already-available mechanism; adding a new test dependency requires approval.
- Use Playwright for user-visible navigation, state, semantics, focus, dialog, 320px overflow, no-JS links, and 491-row behavior. Targeted locators/assertions should verify roles, accessible names/states, values, URLs, counts, focus, and DOM containment rather than only screenshots.
- Importer tests must operate in temporary locations and compare pre/post bytes on failure. Do not run a destructive failure test against tracked outputs.
- Full completion gate: validate + lint + production build + full Playwright suite + documented manual checks. A skipped/unavailable check must be reported, not called passed.

### Previous Story and Git Intelligence

- The closest formal implementation artifact is Story 2.1, currently `review`. It established Zod schemas, governed taxonomy JSON, a `server-only` loader, decimal strings, explicit units, and `null` for missing values. Preserve those patterns but correct its older array/Model Pump Type shape to the reconciled single-type contract.
- Story 2.1's old note that Series data was intentionally empty is obsolete; do not use it to weaken complete catalog validation.
- Recent catalog commits are `843dd1b fix(catalog): restore combined Grundfos series`, `9b2422e feat(catalog): publish four pump categories`, and `a53d701 feat-series-shared-product-detail-template`. Inspect their diffs for intent and regressions, but never use commit existence as AC evidence.
- The historical four-pump-type spec explicitly says its `done` state does not prove Epic 2 acceptance. Its useful code map/test patterns may be reused, not its completion claim.

### Latest Official Technical Guidance

- Next.js: `useSearchParams` on a statically rendered App Router route must remain inside the closest `Suspense` boundary; keep the rest of Product Overview prerendered. `router.push` adds browser history while `router.replace` does not, so choose semantics deliberately for filter changes versus URL normalization.  
  [Next.js `useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) · [Next.js `useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router)
- W3C modal dialog pattern: initial focus moves inside; Tab/Shift+Tab remain contained; Escape closes; an explicit close button is strongly recommended; focus normally returns to the invoking element. Native `<dialog>.showModal()` supplies modality but application code must still implement the complete failure/return contract.  
  [W3C APG Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) · [WCAG Technique H102](https://www.w3.org/WAI/WCAG22/Techniques/html/H102)
- Playwright supports direct URL/value/role/accessible-name/state assertions and ARIA snapshots. Prefer focused assertions for dynamic filter/dialog behavior and stable partial ARIA snapshots where they add regression value.  
  [Playwright Assertions](https://playwright.dev/docs/test-assertions) · [Playwright ARIA Snapshots](https://playwright.dev/docs/aria-snapshots)
- Keep the repository's exact locked versions; this story is not an upgrade task.

### Project Structure Notes

- Deployable application: `website/`; repository root remains the sole Git repository.
- Catalog UI: `website/src/components`, `website/src/app/[locale]/products`, `website/src/app/[locale]/types/[slug]`, `website/src/app/[locale]/series/[slug]`.
- Catalog contracts/loaders: `website/src/lib/validation`, `website/src/lib/content`, `website/src/lib/catalog-query.ts`.
- Governed/manual and generated data: `website/data` plus the current build-facing `website/src/data` copies. Do not add a third authority. Keep paired files synchronized where the existing build still requires them; broader authority consolidation is outside this story unless essential to an AC.
- Import/release validation: `website/scripts`; focused browser tests: `website/tests/e2e`; isolated risk fixtures belong under `website/tests/fixtures` or a comparably existing test-only location.

### References

- [Source: `_bmad-output/planning-artifacts/epics.md` — Epic 2 and Stories 2.1-2.8]
- [Source: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-08-27.md` — Findings Summary, Epic Coverage Validation, Epic Quality Review, Final Assessment]
- [Source: `_bmad-output/planning-artifacts/sprint-change-proposal-2026-08-21.md` — Impact Analysis, Detailed Change Proposals, Implementation Handoff, Status Guidance]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-JP-Website-2026-07-21/SOURCE-RECONCILIATION-EPIC2-2026-08-21.md` — Approved corrections, governance exception, planning/implementation effect]
- [Source: `_bmad-output/planning-artifacts/architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md` — AD-1, AD-3, AD-6-AD-13, AD-16-AD-17, Structural Seed]
- [Source: `_bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/prd.md` — FR6-FR14, FR16, FR21, FR24, NFR2, NFR3, NFR10, NFR11]
- [Source: `_bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/addendum.md` — Product data handoff facts, approved Booster copy/review facts, media exception]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/DESIGN.md` — Product Overview, Series page, Product card, Model table, dialog, tokens]
- [Source: `_bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/EXPERIENCE.md` — Catalog workflow, states, interaction primitives, accessibility floor, responsive behavior]
- [Source: `_bmad-output/specs/spec-product-series-pages/SPEC.md` — canonical 22-Series page model]
- [Source: `_bmad-output/implementation-artifacts/2-1-publish-a-governed-catalog-foundation.md` — previous formal Story patterns]
- [Source: `_bmad-output/implementation-artifacts/spec-update-product-filter-four-pump-types.md` — historical context and explicit non-acceptance warning]

## Story Creation Completion

- Target story was explicitly selected as `2-8-remediate-epic-2-catalog-review-findings`.
- Comprehensive artifact, architecture, UX, codebase, previous-story, Git, and current official-technology analysis completed.
- Status set to `ready-for-dev`.
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.
- No Story 2.8 implementation, AC completion, website code/data/test changes, historical evidence backfill, commit, push, or merge was performed during Create Story.

## Dev Agent Record

### Agent Model Used

OpenAI Codex (GPT-5)

### Debug Log References

- RED (2026-08-27, fresh): `node --test website/tests/story-2.8/catalog-contract.test.mjs` — publisher replacement and rollback fault-injection cases failed because the publisher had no failure seam; media relationship case failed because validation ignored the isolated `CATALOG_ROOT` fixture and did not enforce Series/media ownership.
- GREEN (2026-08-27, fresh): `node --test website/tests/story-2.8/catalog-contract.test.mjs` — 8/8 passed, including four-output replacement and rollback fault injection plus the scoped existing-media relationship case.
- RED (2026-08-27): `node --test tests/story-2.8/catalog-contract.test.mjs` — 3 failed / 1 passed, proving the singular Pump Type schema, approved Booster/review governance, and atomic candidate publisher defects.
- RED (2026-08-27): `npx playwright test tests/e2e/story-2-8.spec.ts --reporter=line` — 6 failed / 1 passed, proving shared-card, Series order/key-data, immediate filter/live count, empty recovery, dialog failure/focus, and labelled 320px table defects.
- GREEN/REFACTOR (2026-08-27): focused contract suite 5/5 and Story 2.8 Playwright suite 7/7 passed after remediation.
- RED (2026-08-28): `npm --prefix website test` — 28/30 passed; keyboard entry rendered `HS` without updating the query URL, and an immediate pre-hydration gallery click left no dialog image to exercise.
- GREEN (2026-08-28): `npx playwright test tests/e2e/story-2-8.spec.ts --grep "keyboard search|failed gallery" --reporter=line` — 2/2 passed after moving keyboard input to React `onChange` and making the gallery regression wait for hydration.

### Implementation Plan

- Establish fresh failing contract and browser evidence, then reconcile Series identity/classification and governed copy before changing presentation.
- Repair Series, filtering, shared-card, dialog, importer, and release-validation paths in Story task order while preserving static Server HTML and a small Client island.
- Re-run focused tests after each risk class, then validate, lint, build, full Playwright regression, sitemap cardinality, and client-output privacy checks.

### Completion Notes List

- Added fresh, isolated regression evidence for the currently remediated publisher and scoped-media findings. The four target outputs recover to their original bytes when injected replacement or rollback steps fail; the confirmed 2026-08-21 media paths remain exception-scoped while loadability signatures, non-empty alt derivation, Series ownership, and new/replacement governance are enforced.
- Replaced the public Series classification shape with singular `pumpTypeId`, removed Model-level Pump Type, enforced complete unique 22-Series joins, and kept VBSG exclusively under `臥式泵`.
- Governed the exact approved `2CR(I,N) Booster` copy and internal Fred/2026-08-21 review record while exposing only `lastUpdatedDate: 2026-08-21` publicly.
- Implemented the required Series reading order, four honest-unit key fields, labelled bounded Model tables, persistent scroll cue, 491-row semantic HTML, and no HP fallback beneath the kW heading.
- Unified filter transitions around the latest complete state, immediate trimmed search, URL normalization/history recovery, selected semantics, 44px controls, result count/live announcements, and actionable condition-preserving empty state.
- Reused one complete ProductCard on Product Overview and Pump Type pages; completed dialog failure, focus, Escape/cancel, focus-return, selection, and target-size behavior.
- Made catalog candidate validation fail closed and staged/rollback-safe across paired outputs; unknown/missing inputs and non-numeric ranges now block with source-located reports. An isolated mutated workbook fixture proved all four outputs remain unchanged on failure.
- Final automated evidence: contract 5/5; Story 2.8 Playwright 7/7; full Playwright 27/27; validate passed with 0 errors/1 build reminder; lint passed with 0 errors/9 existing `<img>` warnings; production build passed; sitemap contains exactly 22 Series URLs; `Fred` hits in static/client/public build outputs: 0.
- Automated Chromium covered 320 CSS px containment, keyboard focus return, live status, dialog failure, 44px close control, reload/share/Back, rapid changes, no-JS links, and 491 rows. Physical touch, screen-reader announcement quality, and Safari/WebKit were not available for manual/platform verification and remain explicitly unverified.
- Final fresh verification (2026-08-28): contract suite 12/12; `validate` passed with 0 errors/1 build reminder; `lint` passed with 0 errors/9 existing `<img>` warnings; production build passed; full Playwright suite 30/30 passed. No physical touch, screen-reader announcement quality, or Safari/WebKit manual verification was available.
- Follow-up remediation (2026-08-28): replaced the unsafe four-file rename publisher with a staged versioned release plus one atomically renamed `catalog-current.json` indicator; readers resolve one complete release, activation faults retain the previous indicator, and cleanup faults leave the selected release intact. Import now requires Overview identity columns, preserves blank technical values as `null`, and standalone validation checks the governed main-sheet row-3 header/unit contract with source location. Added isolated fixtures for every failure mode and a 44×44 CSS px search-input regression.
- Follow-up verification (2026-08-28): focused contract suite 16/16; focused 44×44 browser regression passed; `validate` passed with 0 errors/1 build reminder; `lint` passed with 0 errors/9 existing `<img>` warnings; production build passed (one Turbopack file-tracing warning from the server-only versioned-release reader); full Playwright suite 31/31 passed. Physical touch, screen-reader announcement quality, and Safari/WebKit remain unverified.

- RED (2026-08-28, follow-up): expanded contract suite to 21 cases. Before the remediation it failed for a missing main→Overview join, an ungoverned consumed `電源` header, an empty-string technical value accepted by standalone validation, and unremoved publisher staging.
- GREEN (2026-08-28, follow-up): `node --test tests/story-2.8/catalog-contract.test.mjs` — 23/23 passed, including isolated byte-for-byte importer failure fixtures, full consumed header/unit contract, activation-between-reads, staging/activation cleanup, and a second publish after cleanup fault.

- Follow-up remediation (2026-08-28): loader now snapshots `catalog-current.json` once and reads generated/overview from that one required versioned release, with no legacy fallback. Next output tracing includes the indicator and release tree. Import requires one unique Overview join per main-sheet Series with main-sheet source location; both import and standalone validation enforce every consumed main-sheet header/unit; generated technical unknowns are `null`, while standalone validation rejects empty strings. Failed stage/activation releases are removed without changing the active indicator.
- Final follow-up verification (2026-08-28): contract suite 23/23; `validate` 0 errors/1 build reminder; lint 0 errors/9 existing `<img>` warnings; production build passed; full Playwright 31/31; focused 44×44 search target 1/1. Build output tracing manifests contain the versioned release indicator and selected release. Physical touch, screen-reader announcement quality, and Safari/WebKit remain unverified.

### File List

- `_bmad-output/implementation-artifacts/2-8-remediate-epic-2-catalog-review-findings.md`
- `website/data/catalog-content.json`
- `website/data/catalog.generated.json`
- `website/data/catalog-overview.json`
- `website/data/catalog-overview-governance.json`
- `website/catalog-current.json`
- `website/releases/b323cdd4-3536-4927-859a-2370db9bbebb/` (retained previous release)
- `website/releases/64a6088c-3206-4509-bcf3-7817fad97d5d/` (active release selected by `website/catalog-current.json`)
- `website/next.config.ts`
- `website/scripts/catalog-candidate.mjs`
- `website/scripts/import-catalog.mjs`
- `website/scripts/validate-content.mjs`
- `website/src/app/[locale]/products/page.tsx`
- `website/src/app/[locale]/series/[slug]/page.tsx`
- `website/src/app/[locale]/series/[slug]/SeriesActions.tsx`
- `website/src/app/[locale]/types/[slug]/page.tsx`
- `website/src/components/CatalogBrowser.tsx`
- `website/src/components/CatalogFilter.tsx`
- `website/src/components/ImageDialog.tsx`
- `website/src/components/ProductCard.tsx`
- `website/src/data/catalog-content.json`
- `website/src/data/catalog.generated.json`
- `website/src/data/catalog-overview.json`
- `website/src/lib/content/load-catalog.ts`
- `website/src/lib/validation/catalog.ts`
- `website/tests/e2e/smoke.spec.ts`
- `website/tests/e2e/story-2-8.spec.ts`
- `website/tests/story-2.8/catalog-contract.test.mjs`

The finalized PRD, architecture, UX, epics, SPEC, historical implementation-context, and non-Epic-2 sprint changes visible in the working tree are pre-existing unrelated work. They are intentionally not Story 2.8 implementation files and were not modified by this follow-up.

## Change Log

- 2026-08-27: Created the formal Story 2.8 implementation guide and set it to `ready-for-dev`; no implementation evidence is claimed.
- 2026-08-27: Remediated Epic 2 catalog review findings through fresh RED-GREEN-REFACTOR evidence; all automated gates passed and Story 2.8 moved to `review` without changing historical Story 2.2-2.6 artifacts.
- 2026-08-27: Added fresh fault-injection and scoped-media regression evidence without changing planning artifacts, other Story records, or Epic 2 status.
- 2026-08-28: Re-ran the complete Story 2.8 verification gate. Corrected keyboard query synchronization and made the gallery failure regression wait for client hydration; moved only Story 2.8 to `review`.
- 2026-08-28: Follow-up remediation for atomic release switching, standalone governed header validation, mandatory Overview joins, null technical values, and search-input target sizing; Story remains `review`.
- 2026-08-28: Completed the requested Story 2.8 release-read/import/validation/publisher follow-up remediation and verification; Story remains `review`. No planning artifacts, other Story records, commits, or remote state were changed.
- 2026-08-28: Addressed the follow-up catalog contract findings: full candidate activation validation, indicator-only standalone release reads, required consumed technical keys, actual workbook row/column diagnostics, and byte-for-byte failed-activation preservation. Focused contract suite 27/27, validation, lint, build, Playwright, and Next output-tracing checks passed; Story remains `review` for an independent code review. No planning artifacts, sprint status, commits, pushes, resets, restores, merges, or unrelated files were changed by this follow-up.
- 2026-08-28: Addressed the independent Story 2.8 review findings: mandatory canonical identity contract at activation, typed Overview candidate fields, whitespace-only technical-value rejection, workbook/sheet/cell diagnostics for all technical ranges, and active-release byte preservation fixtures. Focused contract suite 32/32, validate, lint, production build, and full Playwright 31/31 passed; Story remains `review`. No planning artifacts, sprint status, commits, pushes, resets, restores, merges, or unrelated files were changed by this follow-up.
- 2026-08-28: Closed the standalone main-sheet numeric-validation gap: consumed numeric cells now fail closed with workbook, sheet, Excel cell, field, and decimal/unit-rule diagnostics; added the `H5` malformed-value regression. Focused Story 2.8 contract suite passed 33/33. No lint, build, Playwright, commit, or push was performed.
