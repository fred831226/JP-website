---
name: "JP PUMP Website Experience"
status: final
created: 2026-07-21
updated: 2026-07-22
sources:
  - ../../prds/prd-JP-Website-2026-07-20/prd.md
  - ../../prds/prd-JP-Website-2026-07-20/addendum.md
  - ../../architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md
  - ../../architecture/architecture-JP-Website-2026-07-21/SOURCE-RECONCILIATION-LEAN-2026-07-22.md
  - reconcile-architecture-lean-2026-07-22.md
  - imports/competitor-navigation-about-us.png
  - imports/homepage-header-reference.png
  - imports/field-engineers-reference-01.png
  - imports/field-engineer-reference-02.png
  - imports/product-series-card-reference.png
  - imports/flowserve-product-catalog-reference-01.png
  - imports/flowserve-product-filter-reference-02.png
  - imports/flowserve-product-card-reference-03.png
  - imports/footer-brand-navigation-contact-reference-04.png
  - imports/contact-dark-one-page-reference-05.png
  - imports/flowserve-purpose-portfolio-reference-06.png
---

# JP PUMP — Experience Spine

> Responsive public website plus a designated-maintainer Git and Vercel release journey. `DESIGN.md` owns public visual identity; this file owns public information architecture, behavior, states, interaction, accessibility, and the operational release journey. The two spines win on conflict with mocks or imported references.

## Foundation

The primary surface is a Traditional Chinese responsive website under `/zh-tw/`. Mobile and desktop expose the same core content and actions. V1 is a public professional catalog and digital trust entry point: visitors find, understand, verify, and contact. It does not automate engineering selection, suitability guarantees, quotation, ordering, payment, CRM, or customer accounts.

V1 has no CMS, backend, database, sign-in, account recovery, content dashboard, editor, media picker, or management API. Project summaries/evidence, company/partner content, catalog data, redirects, and approved web media are maintained as version-controlled sources; News is not a V1 content type. The secondary journey uses existing Git, automated validation, and Vercel interfaces rather than a custom JP PUMP operational surface. V2 may add a CMS only after a validated self-service need and requires a new UX decision.

Implementation uses a clean Next.js App Router application under `/website`, with Tailwind CSS 4 composing the semantic tokens in `DESIGN.md`. The outer JP-Website repository is authoritative, `/zh-tw/` is the only generated V1 locale, and the promoted mock HTML remains a visual/behavioral reference rather than the runtime scaffold.

Product technical data is fully regenerated through a repeatable validated Excel intake. Stable IDs, slugs, taxonomy mappings, approved display copy, and image references remain manually governed outside the generated technical file and cannot be overwritten by the importer.

V1 scope precedence: Pump Type landing pages remain; Brand and Purpose are governed Series metadata and Product overview filters without standalone public pages. Services & projects owns complete in-place Project evidence; individual Project detail routes, Latest Information, analytics, attribution, consent, and RUM are outside V1. The later Source Reconciliation section records the full cross-document resolution.

`DESIGN.md` is the visual identity reference. Public-facing terminology uses **用途**; the governed data model and maintenance interface use **應用情境**. Both refer to the same controlled classification.

## Information Architecture

### Public website

| Surface | Reached from | Purpose | Journeys |
|---|---|---|---|
| Home | Logo, root URL, search | Establish trust, show positioning, explore products by Purpose, route to products/services/company/contact, and preview approved projects and partners; Project teasers lead to Services & projects or an in-page Project anchor | UJ-1, UJ-2 |
| Product overview | Header product menu, Home Hero filter, Pump Type pages | Orient through a short catalog Hero, then filter and compare published series | UJ-1, UJ-3 |
| Brand index/detail | Product overview, crawlable links | Explain an approved brand and show related series | UJ-1, UJ-3 |
| Pump-type index/detail | Product overview, crawlable links | Explain a governed pump type and show related series | UJ-1 |
| Use-case index/detail | Header use shortcut, search, product overview | Explain an important use and show related series | UJ-1 |
| Series detail | Product card, Pump Type page, Product overview filters, search | Review image, key ranges, introduction, models, uses, and contact path | UJ-1, UJ-3 |
| Image enlargement | Series product image | Inspect approved product media without losing page context | UJ-1, UJ-3 |
| Services & projects | Header direct link, Home Project teaser | Explain approved service capabilities and present the complete V1 Project evidence in place | UJ-2 |
| Company information | About menu | Verify legal/company facts and history | UJ-2 |
| Partners | About menu | Verify approved partner relationships and official links | UJ-2 |
| Contact | Header and contextual contact actions | Review service context, call, email, locate, and read approved QA in one direct page | UJ-1, UJ-2, UJ-3 |
| Not found/removed | Invalid or retired URL | Explain status and route to the nearest valid destination | All public |

Header order: `產品總覽`, `服務與實績`, `關於傑平`, `聯絡我們`. Logo returns Home. `產品總覽` opens a single-level list of all approved uses, maximum eight, followed by `全部產品`. `服務與實績` is a direct link. `關於傑平` opens `公司資訊` and `合作夥伴`; V1 has no Latest Information entry. Desktop does not require a separate Home item; mobile may include it.

Brand, pump-type, and use-case pages remain crawlable through ordinary links in the Product overview and relevant content. They are not hidden inside filter-only state.

### Maintainer release workflow

These are workflow stages supplied by repository, CI, and Vercel tooling, not custom JP PUMP screens.

| Stage | Purpose | Journeys |
|---|---|---|
| Source preparation | Update schema-governed Project summaries/evidence, company/partner content, catalog JSON, redirects, and approved media metadata | UJ-4, UJ-5 |
| Change review | Show the Git difference, affected content, stable IDs/slugs, additions, removals, duplicates, missing fields, and rights metadata | UJ-4, UJ-5 |
| Validation report | Block content, technical, rights, link, SEO, accessibility, or build failures without changing Production | UJ-4, UJ-5 |
| Vercel Preview | Review the complete public site at a non-indexable Preview URL | UJ-4, UJ-5 |
| Approval and Production promotion | Record JP PUMP confirmation and promote one named commit/deployment atomically | UJ-4, UJ-5 |
| Deployment rollback | Restore a named last-known-good deployment without partial content rollback | UJ-4, UJ-5 |

Project summaries/evidence, partners, and catalog content share this release path. Excel/CSV is evidence input, never public runtime authority or a custom upload UI. Import fully regenerates importer-owned technical Series/Model fields, reports file/sheet/row/field failures, and never overwrites stable IDs, slugs, taxonomy mappings, approved copy, or image references. Validation joins generated and manual catalog data by stable Series/Model keys and rejects duplicate, missing, or orphaned records.

## Voice and Tone

Microcopy is factual, calm, and direct. Brand posture lives in `DESIGN.md`.

| Do | Don't |
|---|---|
| `依品牌與用途找到產品系列` | `立即找到完美泵浦！` |
| `此規格未提供，請聯絡我們確認。` | `約為 20 m` when no approved value exists |
| `沒有符合目前條件的產品。` | Leave a blank result area |
| `重設全部條件` | `Oops!` |
| `發布前仍有 2 項資料需要確認。` | `差不多完成了！` |
| `此圖片的使用權尚未確認。` | Hide rights status behind a generic error |

Use approved nouns consistently: `產品系列`, `用途`, `品牌`, `泵浦類型`, `型號規格`, `服務與實績`, `合作夥伴`. Do not imply that a direct phone or email action has been measured or attributed in V1.

## Component Patterns

Behavioral rules below use the visual definitions in `DESIGN.md.Components`.

| Component | Use | Behavioral rules |
|---|---|---|
| Global header | All public surfaces | Logo always returns Home. Primary order and destinations are invariant across widths. The current public location is exposed visually and programmatically. Narrow layouts expose a labelled menu trigger; navigation is never merely hidden. |
| Header dropdown | Product and About navigation | Opens only by click/keyboard, never hover. Trigger exposes expanded state. Second activation, outside click, or `Escape` closes; focus returns to trigger. Product items are one level deep only. |
| Hero media | Home | Plays one finite sequence only when motion/data conditions allow. The final static frame, copy, quick filter, and `認識我們` remain the complete fallback experience. |
| Home quick filter | Home Hero | Brand and Purpose are single-select and both default to `全部`, meaning no constraint. Submit always navigates to Product overview with selected constraints in restorable URL state; unconstrained dimensions are omitted from the normalized query and never create validation errors or an indexable alternate page. |
| Home company summary | Home | Shows only concise approved company context and links to Company information. Each missing fact is omitted; the summary must not become a second full Company page. |
| Home purpose card | Home | Entire card navigates to Product overview with Brand=`全部` and exactly one governed Purpose applied in restorable URL/filter state. Image zoom is visual reinforcement only. Accessible name includes the Purpose and destination; there is no nested `Learn more` action. |
| Home gateway block | Home | Provides three whole-block links to Product overview, Services & projects, and Contact. Wide pointer layouts keep them equal at rest; hover or keyboard focus expands the active block and contracts its siblings, and leaving the group restores equal widths. The transition reveals no new content and never becomes the only route cue. Touch and narrow layouts stay fixed and stacked. The block never duplicates or mutates the Hero filter state. |
| Home content teaser | Home | Featured projects and partners reuse their destination components. A Project teaser routes to Services & projects or its stable in-page Project anchor, never to an individual detail route. Each teaser has one destination and never exposes unapproved evidence. |
| Catalog sidebar | Product overview | One always-visible filter rail contains series/model Search, an exclusive segmented Brand group, multi-select Pump type chips, multi-select Purpose chips, removable active-condition tags, and one clear-all action. Every selection filters immediately without a separate apply step. Multiple Pump type selections use OR; multiple Purpose selections narrow to Series carrying every selected Purpose. Brand, type, Purpose, and search dimensions combine with AND. Multiple or invalid Brand query values reset Brand to `全部`; repeated Type/Purpose values deduplicate; invalid values are discarded without selecting another category or clearing valid unrelated conditions. Every change updates restorable URL state, exposes programmatic selected state, and keeps pointer, touch, and keyboard behavior equivalent. |
| Product card | Product overview and Pump Type pages | Entire card is one link to the unique series page. `看更多` is a text-only visual cue inside that link, never a nested action. Key data is summarized in one or two compact lines at the lower-left. Pointer, touch, and keyboard produce the same destination. Accessible name includes series and relevant category context. |
| Result summary | Product overview | Announces result count and filter changes. Shows `重設全部條件` whenever any filter is active. |
| Product image | Series detail | Click, touch, or keyboard opens one modal enlargement. Modal traps focus; clear close button and `Escape` close it; closing returns focus to the image trigger. |
| Key data block | Series detail | Exactly four values: min/max head in m and min/max flow in L/min. Missing approved data reads `未提供`. |
| Model table | Series detail | Contains every approved model. Header/model relationships remain programmatic. On narrow screens only the bounded table region scrolls horizontally. Provide a visible scroll cue and preserve the first model column when feasible. |
| Use tag | Series detail | Display only. Not focusable, clickable, filterable, or linked. |
| Contact action | Contextual public surfaces | Navigates to the one-page Contact surface without storing or transmitting origin attribution. Contact does not expose origin copy or any return-to-product/series action. It never overlays content. |
| Contact information block | Contact | Approved phone and Email initiate `tel:` and `mailto:` behavior; address is informational; LINE appears only for a confirmed official account. Omit each unavailable row and action. V1 has no contact form. |
| FAQ disclosure | Contact | Publishes only approved QA pairs. Each native disclosure has a visible plus/minus cue, keyboard support, and independent open state. If no QA is approved, omit the whole section and expand Contact information. |
| Partner block | Partners | One partner per vertical block. `拜訪網站` appears only for a confirmed official URL and indicates an external destination. |
| Project evidence block | Services & projects | Render one semantic in-place evidence section using only approved facts and rights-cleared real media. It is not a whole-block link. Scope, outcome, and related products are omitted individually when absent; optional related-Series or Contact links are separate and explicitly labelled. |
| Footer | All public surfaces | Uses three content groups: company Logo/identity, primary navigation, and approved contact information. Narrow layouts stack in that order. It does not introduce a second IA; missing or unapproved facts and legal links are omitted. Footer navigation remains keyboard reachable with 44px targets. |
| Empty/error panel | Public lists and Pump Type pages | Explains what happened, preserves recoverable state, and exposes one primary recovery plus an optional Contact path. It never substitutes generic success content for an error. |
| Release evidence | Maintainer workflow | Git/CI/Vercel must expose the source commit, affected pages, validation outcome, Preview URL, approval state, Production result, and rollback target. Preview approval applies to that commit; Production may rebuild with Production environment values. These are operational evidence requirements, not a custom visual component. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Home media active | Home | Plays once, total duration no more than 5 seconds, then holds on final frame. No manual controls because it does not loop and ends within 5 seconds. |
| Home media reduced/failed | Home | Reduced motion, data-saving/mobile degradation, or media failure shows the final static image immediately. Copy, filter, and links remain identical. |
| Home optional content absent | Home | Omit the entire featured-project or partner section when its source has no approved records. Purpose cards appear only for governed published purposes with approved imagery; preserve the remaining section order without empty cards or invented filler. |
| No published projects | Services & projects | Keep the approved service-capability Hero and explanation, state that no public project records are currently available, then offer Contact. Never substitute Home atmosphere or generic stock imagery. |
| Public route and content delivery | Category, Services & projects, Company, Partners | Primary content arrives in the statically generated HTML; do not hide it behind client-only loading skeletons. Missing governed content is handled as an empty/omitted state, and an unavailable or retired legacy route follows the explicit 404/redirect contract. Individual media failure uses its labelled fallback without fabricating facts. |
| Category empty | Brand, pump-type, use-case | Keep the approved category introduction. State that no published series are currently available, then offer Product overview and Contact; do not hide the whole indexed page or manufacture cards. |
| Filter updating | Product overview | Each Brand, Pump type, Purpose, search, removal, or clear-all action immediately evaluates the embedded Series-level metadata and replaces the current URL state without a remote request. Keep controls and current results stable during state replacement; never clear unrelated URL state or flash an empty list. |
| Filter results | Product overview | Show count, active conditions, and matching cards. Announce count changes without moving focus. |
| Filter empty | Product overview | `沒有符合目前條件的產品。` Provide individual chip removal, `重設全部條件`, and a direct Contact path. |
| Filter URL invalid | Product overview | Normalize without crashing: multiple or invalid Brand values reset Brand to `全部`; discard invalid Type/Purpose values; deduplicate repeated values; preserve valid unrelated conditions; update visible tags, normalized URL and result count. |
| Missing specification | Card, series, table | Display `未提供`. Never substitute zero, dash-only, estimated range, or copied neighboring data. |
| Unreviewed product | Public website | Do not publish the record or value. Route visitors to Contact for confirmation when a known model has no approved public data. |
| Oversized model set | Series | Render the full approved set with usable table navigation; the SB/SBI/SBN approximately 491-model case is the validation baseline. Do not rely on a short demo series. |
| Product image unavailable | Series/Image enlargement | Series content remains available. Show a labelled unavailable-media surface; do not open an empty enlargement dialog. |
| Image enlargement open | Image enlargement | Trap focus inside the dialog, expose a labelled close control, support `Escape`, and return focus to the product image trigger. Loading or image failure stays inside the dialog with a close path. |
| Contact detail absent | Contact | Omit the field and its container. Do not show placeholder contact information. |
| Contact reached from any origin | Contact | Render the same direct one-page experience regardless of source. No source identifier is retained in V1, and no source name or return-to-product action is shown. |
| Contact FAQ absent | Contact | Omit the FAQ section and let Contact information use the available width. Never publish draft questions or invented answers. |
| Contact map unavailable | Contact | Omit the entire map section until the address and embedding method are approved. The working mock's labelled map is a conditional layout reference, not a public fallback. |
| Uncommitted or branch-only content | Git source | Not public. The change retains its file/commit identity and must not appear in sitemap, navigation, or Production. |
| Content/media validation blocked | Validation report | Name every missing/invalid field, duplicate ID/slug, unresolved rights/alt issue, broken relationship, link, unit, or technical error. Preserve sources and do not create a partial Preview/Production release. |
| Product intake no changes/import failed | Catalog intake | A no-change import ends as a clear no-op. Failure leaves the current generated catalog unchanged and reports the file, sheet, row, field and violated rule. Duplicate, missing or orphaned stable keys block Preview. The importer never overwrites manual IDs, slugs, taxonomy mappings, approved copy or images. |
| Difference review | Git/validation output | Separate added, changed, removed, duplicate, missing, insufficient, and excluded records; always identify affected public pages and the source version. |
| Preview ready | Vercel Preview | Identify commit/deployment, affected public pages, validation result, and non-indexable Preview URL. Preview must make it clear that it is not Production. |
| Preview rejected | Review | Record the reason outside public content; corrections create a new validated Preview. Production remains unchanged. |
| Production promotion success/failed | Vercel deployment | Success identifies the promoted commit/deployment and public URL. Failure leaves the previous Production deployment active and provides a retry/escalation path. |
| Rollback success/failed | Vercel deployment | Success identifies both restored and superseded deployments. Failure leaves the current public deployment unchanged and exposes a safe retry/escalation path. |
| Not found/removed | Public | Explain that content is unavailable, link the closest valid category when known, then Product overview and Contact. Do not redirect every retired URL to Home. |

## Interaction Primitives

- Click/tap activates; keyboard activation uses native `Enter`/`Space` behavior.
- `Escape` closes the topmost dropdown or image dialog and returns focus to its trigger.
- Browser Back must preserve a visitor's product filters, result position, and source-page position when practical. Contact does not add a custom return-to-product control.
- Share or reload of a filtered Product overview restores the same visible conditions. Query variants use the clean Product overview as canonical, remain outside the sitemap, and are not separate IA surfaces; UX does not require a query-specific server-rendered `noindex` response.
- No hover-only navigation or content. Hover may reinforce an already visible affordance.
- No infinite scroll for product models. Series pages retain bounded semantic tables; operational Git/Vercel lists use provider behavior and are outside the JP PUMP interaction contract.
- No drag-only operation, hidden filter submission step, autoplay loop, sticky contact overlay, or nested modal. Product-overview filters intentionally update immediately because every active condition remains visible and removable.

## Accessibility Floor

- WCAG 2.2 AA is the release floor, including manual keyboard and screen-reader review.
- Every interactive element has a visible focus indicator and accessible name. Tab order follows visual reading order.
- General text contrast is at least 4.5:1; contrast ownership is in `DESIGN.md`.
- Touch targets are at least 44 by 44 CSS px; compact table controls must still meet the target.
- Heading levels form a real document outline. Landmarks identify Header/navigation, main content, and footer.
- Public form/filter controls retain visible labels. Public errors connect to their control and are summarized when multiple conditions fail; maintainer validation reports must identify the source file/record and actionable rule.
- Product result count and validation changes use polite live announcements. Do not announce every keystroke.
- Product and project images require useful alt text. Decorative atmosphere uses empty alt; AI atmosphere is not described as a real project.
- The 320 CSS px layout loses no core information or function and has no page-level horizontal scrolling. Only a labelled model-table container may scroll horizontally.
- `prefers-reduced-motion` skips Hero sequencing and nonessential transitions.

## Responsive & Platform

Breakpoints are content-driven. The values below are starting contracts, not device labels.

| Available width | Behavior |
|---|---|
| `≥ 1120px` | Full Header navigation. Home Hero copy/filter may overlay media; Home purpose, gateway, and project previews may use three columns. Product overview uses a persistent left sidebar and a two-column product grid. Services project blocks pair media and content. Series actions align horizontally. Contact uses paired Hero/service-summary and Contact-information/FAQ columns. Footer uses three columns. |
| `720–1119px` | Compact Header. Product overview sidebar may narrow or become a top filter control; product grid remains two columns only while both cards retain comfortable reading width, otherwise one column. Home Hero controls and teaser grids may wrap. Services project blocks remain paired only while both regions retain readable width. Contact columns remain paired only while each retains readable width. |
| `< 720px` | Menu button opens a single mobile navigation panel. Hero copy/filter and all Home sections stack in reading order. Product grid is one column. Partner blocks center and stack. Services project media precedes project copy. Series actions are full-width with Contact first. Contact Hero, service summary, information, FAQ, conditional map, and Footer groups stack in reading order. |
| `320–399px` | Preserve 20px page gutters when possible; controls and cards remain full-width; model table scrolls only inside its labelled container. |

The same navigation items, order, destinations, current-location semantics, content, and actions exist across widths. Only presentation and open/close mechanics adapt.

## Content Integrity & Trust Boundaries

- Company details, partner claims, project facts, product specifications, contact information, and media rights must remain traceable to approved sources.
- AI construction scenes may appear only as Home atmosphere. Project evidence uses verified real media. AI product images require specification review and cannot become evidence by visual plausibility alone.
- Website maintainers may polish supplied case-study language but cannot invent project names, scope, outcomes, numbers, or responsibility.
- Public product content shows only technically reviewed values and a last-updated date. Internal reviewer identities and documents stay private.
- Series pages always state that final selection, purchase, and suitability require confirmation with JP PUMP. V1 has no extra performance section and no PDF/technical-document download surface.
- Cross-type series such as VBSG retain one canonical Series page, are reachable from every approved pump type, and show model-level pump type only where the controlled source supports it.
- V1 is Traditional Chinese only. Do not create empty `/en/` pages or machine-translated public content. The data model and URL scheme must permit a future independent `/en/` edition.

## Inspiration & Anti-patterns

- **Lifted from `imports/competitor-navigation-about-us.png`:** explicit parent/child location cues. JP PUMP rejects hiding core services inside About and keeps Services & projects at the top level.
- **Lifted from `imports/homepage-header-reference.png`:** Header above a media-led Hero with a prominent discovery entry. Replaced broad search with the approved brand/use selects. `imports/field-engineers-reference-01.png` and `imports/field-engineer-reference-02.png` inform atmosphere/composition only and cannot become project evidence.
- **Lifted from `imports/flowserve-purpose-portfolio-reference-06.png`:** large-image purpose cards, medium category title, compact descriptive copy, and an image-led grid. JP PUMP replaces `Learn more` with a translucent arrow and keeps the whole card as the only link to Product overview with Brand=`全部` plus the selected Purpose.
- **Lifted from `imports/product-series-card-reference.png` and `imports/flowserve-product-card-reference-03.png`:** top-image composition, compact category label, series title, short description, borderless white surface with ambient shadow, compact lower-left key data, and a lower-right text cue. Image media blends into card content without a hard frame or divider; later decisions supersede the older reference's outline and four-row data treatment.
- **Lifted from `imports/flowserve-product-catalog-reference-01.png` and `imports/flowserve-product-filter-reference-02.png`:** compact page Hero below Header, a persistent left filter rail, visible active conditions, a compact result summary, and a spacious two-column card grid. JP PUMP replaces the reference dropdown/apply/sort pattern with its selected segmented Brand and multi-select chip interaction while retaining its own colors, copy, data rules, and whole-card link behavior.
- **Rejected from that card reference:** nested `規格` and `尺寸範圍` buttons. JP PUMP uses one whole-card link.
- **Rejected from earlier working HTML:** side-by-side image/content product cards, hard card outlines, framed image placeholders, heavy internal separators, and four-row specification blocks. The current contract uses top-image cards, a two-column desktop/one-column narrow grid, restrained card shadow, and no obvious outer outline.
- **Rejected:** autoplay loops, decorative category colors, unsupported slogans, AI case-study evidence, hover-only menus, and fake contact or technical data.

## Key Flows

### UJ-1 — 陳志豪 finds a series from an application need

1. 陳志豪, a mechanical/electrical consultant on a high-rise project, lands on an important use-case page from mobile search.
2. He reads approved context and opens the related Product overview with the use already visible as an active condition.
3. He adds brand and pump-type conditions; the result count updates and the URL retains all conditions.
4. He opens one whole-card series link.
5. He reviews the key ranges, introduction, and model table; missing data is plainly `未提供`.
6. He selects `前往聯絡頁`; no source attribution is retained in V1.
7. **Climax:** the direct Contact surface offers approved phone and email actions plus approved preparation guidance, so he can ask a precise question without the site claiming suitability or forcing a return route.

Failure: no matches → show the empty-state explanation, removable conditions, `重設全部條件`, and Contact. He never encounters a blank page.

### UJ-2 — 林雅婷 verifies whether JP PUMP is credible

1. 林雅婷, a construction-company procurement manager, opens Home on her phone after receiving a sales introduction.
2. The static-capable Hero prioritizes approved evidence of history/reliability, engineering capability, and sincere/fast response, then offers `認識我們`; animation is not required to understand it.
3. She opens `關於傑平` and visits Company information and Partners.
4. She opens `服務與實績`, reads approved service capabilities, and examines rights-cleared project evidence.
5. She reaches Contact and checks the approved address, phone, and email.
6. **Climax:** company facts, approved relationships, service scope, and real evidence agree across surfaces, giving her a defensible basis to continue the business conversation.

Failure: an unapproved partner or project is absent rather than padded with placeholder claims.

### UJ-3 — 黃建國 locates an existing model for maintenance

1. 黃建國, a building maintenance supervisor holding an equipment nameplate, reaches a relevant Series page from search or a Product overview Brand filter.
2. He uses the model table's browser find or table navigation to locate the model.
3. He checks the row's approved values and the public last-updated date.
4. **Climax:** he opens the direct Contact page and can quote the exact model to JP PUMP; the page does not add a route back to Product pages.

Failure: the model is not approved/published → no guessed row appears; the page routes him to Contact for confirmation.

### UJ-4 — 阿哲 publishes approved Project evidence on Services & projects

1. 阿哲, the designated website maintainer, receives approved source copy and photos from JP PUMP.
2. He creates or updates a governed Project summary/evidence record for Services & projects, recording a stable internal ID, approved name/type, concise context, optional scope/outcome, optional related-Series IDs, media alt/source/rights, and an optional stable in-page anchor. No public detail-route slug is required.
3. He reviews the Git difference and runs fact, relationship, rights, link, media, and build validation.
4. Vercel creates a non-indexable Preview showing the changed Services & projects page and any Home teaser; no Project-detail page or Project sitemap entry is expected.
5. JP PUMP approves the Preview tied to its source commit; Production may rebuild with Production environment settings.
6. **Climax:** Services & projects evidence, optional Home teaser, approved links, and media change atomically, with the previous Production deployment still available for rollback.

Failure: rights, facts, links, or build checks fail → Production remains unchanged, the report identifies the source file/record, and a corrected change produces a new Preview.

### UJ-5 — 阿哲 completes the annual product update

1. 阿哲, the designated maintainer, runs the repeatable Excel importer for approximately 10 Series pages; it fully regenerates importer-owned technical Series/Model fields while approximately 603 Models remain specification rows rather than individual pages.
2. The importer reports file/sheet/row/field errors and never overwrites manually governed stable IDs, slugs, taxonomy mappings, approved copy, or image references. Validation joins both sources and blocks duplicate, missing, or orphaned keys.
3. He assigns the four governed dispositions—reviewed, pending, insufficient, or excluded—and records the offline technical reviewer and review date.
4. Validation stress-tests HS at approximately 12 rows and the largest combined SB/SBI/SBN Series page at approximately 491 rows.
5. He reviews the complete public impact in Vercel Preview and obtains JP PUMP confirmation.
6. **Climax:** he promotes the named deployment, the public catalog changes atomically, the prior usable deployment remains recoverable, and another maintainer can follow the operating document.

Failure: a critical validation or release step fails → the prior public version stays live and rollback/retry remains explicit.

## Source Reconciliation

The PRD/addendum, this UX spine, and the Lean Architecture now agree with `reconcile-prd-late-ux-overrides.md`, `reconcile-architecture-lean-2026-07-22.md`, and the Architecture `SOURCE-RECONCILIATION-LEAN-2026-07-22.md`. Latest Information/News is absent from all V1 IA and publishing; individual Project detail pages are deferred and Services & projects owns complete Project evidence; Pump Type landing pages remain V1 while Brand and Purpose remain filters/metadata without standalone pages; analytics, attribution, consent and RUM are deferred. `/zh-tw/`, approved visual mockups, filter behavior, Contact rules, and Git → Preview → approval → Production remain. Implementation uses clean Next.js App Router + Tailwind; mockups remain references and the UX spines win on conflict.

## Mockup Coverage

- Approved mockup: [Home](mockups/key-screen-home-responsive-01.html) — complete Home Header, narrower Hero/media composition, default-to-all quick filter, decorated company summary, purpose-card grid, responsive three-gateway interaction, featured projects, partners, direct Footer transition, and mobile adaptation. Separate Contact CTA and News are intentionally absent from Home.
- Approved mockup: [Product overview](mockups/key-screen-product-overview-responsive-01.html) — full filters, active state, result count, top-image cards, and empty/missing-data patterns.
- Approved mockup: [Series detail](mockups/key-screen-product-series-detail-responsive-01.html) — ordered Series content, dense model table, image-dialog reference state, and responsive actions.
- Approved mockup: [Services & projects](mockups/key-screen-services-projects-responsive-01.html) — service-capability Hero, verified-project integrity boundary, responsive in-place evidence list, Contact CTA, and global Footer. Project sections do not imply individual detail routes.
- Approved mockup: [Contact](mockups/key-screen-contact-responsive-01.html) — deep-dark direct Contact Hero, service summary, approved-field omission rule, phone/Email/address/conditional LINE, approved FAQ structure, conditional map, three-group Footer, and no return-to-product action.
- Spine-only by explicit closure: Pump Type category pages, Company, Partners, and not-found. Brand and Purpose use the Product overview filter experience without separate key screens. Pump Type layouts reuse the catalog/content patterns; Project detail and News are deferred/absent rather than unmocked V1 surfaces. The five approved mockups require no redraw; implementation only reviews Home/Services Project-link semantics. The V1 maintainer journey uses existing Git, validation, and Vercel interfaces and therefore has no custom JP PUMP key-screen mock. Full rationale is recorded in `key-screen-coverage.md`.

The approved mockups instantiate the key compositions and responsive behavior defined by the two spines.

## Remaining Dependencies

- **Reviewer gate:** skipped by explicit user decision for this finalization round.
- **Content dependency, not a UX blocker:** approved company/contact facts, initial foreign brands, governed categories, product imagery/specifications, partners, and project evidence are still required before public-content acceptance.
- **V2 dependency, not a V1 UX blocker:** CMS/backend selection and any custom operational UI are deferred until a validated self-service or runtime-write need exists. Choosing a V2 CMS requires a new UX pass for authentication, editing, media, validation, preview, error, recovery, and accessibility states.
- **Technical dependency, not a UX blocker:** the exact public model-table fields beyond the four series key ranges require JP PUMP technical confirmation; the table contract supports additional approved columns without changing page structure.
- **Implementation dependency, not a UX blocker:** demonstrate the generated/manual catalog split, repeatable Excel intake, sheet/row/field error reporting, and non-overwrite behavior before implementation acceptance.
- **Post-V1 product decisions:** Latest Information, individual Project detail pages, GA4/contact attribution/consent/RUM, and third-party uptime monitoring are not missing V1 UX work.
- English product exploration remains deferred. V1 publishes Traditional Chinese only and must not create empty or machine-filled `/en/` pages.
