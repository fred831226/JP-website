---
name: "JP PUMP Website Experience"
status: final
created: 2026-07-21
updated: 2026-07-21
sources:
  - ../../prds/prd-JP-Website-2026-07-20/prd.md
  - ../../prds/prd-JP-Website-2026-07-20/addendum.md
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

> Responsive public website, single-administrator content workspace, and controlled product-data maintenance flow. `DESIGN.md` owns visual identity; this file owns information architecture, behavior, states, interaction, accessibility, and journeys. The two spines win on conflict with mocks or imported references.

## Foundation

The primary surface is a Traditional Chinese responsive website under `/zh-tw/`. Mobile and desktop expose the same core content and actions. V1 is a public professional catalog and digital trust entry point: visitors find, understand, verify, and contact. It does not automate engineering selection, suitability guarantees, quotation, ordering, payment, CRM, or customer accounts.

The secondary surface is a platform-neutral, single-administrator content workspace for news and case studies. A separate controlled maintenance flow handles partners and product data. The final CMS and backend are intentionally undecided; this contract describes required behavior without prescribing Sanity, Decap, Payload, or another vendor.

`DESIGN.md` is the visual identity reference. Public-facing terminology uses **用途**; the governed data model and maintenance interface use **應用情境**. Both refer to the same controlled classification.

## Information Architecture

### Public website

| Surface | Reached from | Purpose | Journeys |
|---|---|---|---|
| Home | Logo, root URL, search | Establish trust, show positioning, explore products by Purpose, route to products/services/company/contact, and preview approved projects and partners | UJ-1, UJ-2 |
| Product overview | Header product menu, Home Hero filter, category pages | Orient through a short catalog Hero, then filter and compare published series | UJ-1, UJ-3 |
| Brand index/detail | Product overview, crawlable links | Explain an approved brand and show related series | UJ-1, UJ-3 |
| Pump-type index/detail | Product overview, crawlable links | Explain a governed pump type and show related series | UJ-1 |
| Use-case index/detail | Header use shortcut, search, product overview | Explain an important use and show related series | UJ-1 |
| Series detail | Product card, category page, search | Review image, key ranges, introduction, models, uses, and contact path | UJ-1, UJ-3 |
| Image enlargement | Series product image | Inspect approved product media without losing page context | UJ-1, UJ-3 |
| Services & projects | Header direct link | Explain approved service capabilities and present real project evidence | UJ-2 |
| Project detail | Project card, search | Present approved scope, outcome, media, and related products | UJ-2 |
| Company information | About menu | Verify legal/company facts and history | UJ-2 |
| Partners | About menu | Verify approved partner relationships and official links | UJ-2 |
| News list/detail | About menu | Browse published updates | UJ-2 |
| Contact | Header and contextual contact actions | Review service context, call, email, locate, and read approved QA in one direct page | UJ-1, UJ-2, UJ-3 |
| Not found/removed | Invalid or retired URL | Explain status and route to the nearest valid destination | All public |

Header order: `產品總覽`, `服務與實績`, `關於傑平`, `聯絡我們`. Logo returns Home. `產品總覽` opens a single-level list of all approved uses, maximum eight, followed by `全部產品`. `服務與實績` is a direct link. `關於傑平` opens `公司資訊`, `合作夥伴`, and `最新資訊`. Desktop does not require a separate Home item; mobile may include it.

Brand, pump-type, and use-case pages remain crawlable through ordinary links in the Product overview and relevant content. They are not hidden inside filter-only state.

### Content workspace

| Surface | Purpose | Journey |
|---|---|---|
| Sign in / account recovery | Secure access for the single administrator | UJ-4 |
| Content dashboard | Reach News, Projects, drafts, published, unpublished, and archived items | UJ-4 |
| News editor | Create, validate, publish, unpublish, and archive news | UJ-4 |
| Project editor | Maintain approved project facts, scope, outcome, images, and related products | UJ-4 |
| Media picker | Upload/select case and news images with alt text, source, and rights metadata | UJ-4 |
| Publish result | Confirm success and open the public page | UJ-4 |

The client workspace does not manage products, partners, or Home hero media.

### Controlled product maintenance

| Surface | Purpose | Journey |
|---|---|---|
| Change intake | Import or enter a new controlled product-data version | UJ-5 |
| Difference review | Show added, changed, duplicate, missing, excluded data, and affected pages | UJ-5 |
| Validation report | Block critical errors; classify records as reviewed, pending, insufficient, or excluded | UJ-5 |
| Release preview | Review the complete public impact before publishing | UJ-5 |
| Versions & rollback | Publish an identifiable version or restore the last usable version | UJ-5 |

### Controlled partner maintenance

| Surface | Purpose | Journey |
|---|---|---|
| Partner change review | Let the designated maintainer verify approved partner name, relationship copy, Logo/trademark rights, and official URL before a controlled release | UJ-2 support |

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

Use approved nouns consistently: `產品系列`, `用途`, `品牌`, `泵浦類型`, `型號規格`, `服務與實績`, `合作夥伴`, `最新資訊`. Do not call a phone or email click an inquiry; it is a contact intent only.

## Component Patterns

Behavioral rules below use the visual definitions in `DESIGN.md.Components`.

| Component | Use | Behavioral rules |
|---|---|---|
| Global header | All public surfaces | Logo always returns Home. Primary order and destinations are invariant across widths. The current public location is exposed visually and programmatically. Narrow layouts expose a labelled menu trigger; navigation is never merely hidden. |
| Header dropdown | Product and About navigation | Opens only by click/keyboard, never hover. Trigger exposes expanded state. Second activation, outside click, or `Escape` closes; focus returns to trigger. Product items are one level deep only. |
| Hero media | Home | Plays one finite sequence only when motion/data conditions allow. The final static frame, copy, quick filter, and `認識我們` remain the complete fallback experience. |
| Home quick filter | Home Hero | Brand and Purpose are single-select and both default to `全部`. Submit always navigates to Product overview with the selected or default conditions represented in restorable URL state; untouched controls never create a validation error. |
| Home company summary | Home | Shows only concise approved company context and links to Company information. Each missing fact is omitted; the summary must not become a second full Company page. |
| Home purpose card | Home | Entire card navigates to Product overview with Brand=`全部` and exactly one governed Purpose applied in restorable URL/filter state. Image zoom is visual reinforcement only. Accessible name includes the Purpose and destination; there is no nested `Learn more` action. |
| Home gateway block | Home | Provides three whole-block links to Product overview, Services & projects, and Contact. It explains the routes and never duplicates or mutates the Hero filter state. |
| Home content teaser | Home | Featured projects and partners reuse their destination components. Each teaser has one destination and never exposes unapproved evidence. News remains on its dedicated list/detail surfaces. |
| Catalog sidebar | Product overview | Three accordion sections: `產品分類`, `產品搜尋`, and `產品篩選`. Category hierarchy appears as removable path tags. Search accepts a series/model term. Brand, pump type, and use use dropdown pickers that add visible removable selections; no checkbox list. `套用篩選` commits pending selections and `清除篩選` resets them. Within one dimension use OR; across dimensions use AND. Applied state is URL-backed. |
| Product card | Product overview and category pages | Entire card is one link to the unique series page. `看更多` is a text-only visual cue inside that link, never a nested action. Key data is summarized in one or two compact lines at the lower-left. Pointer, touch, and keyboard produce the same destination. Accessible name includes series and relevant category context. |
| Result summary | Product overview | Announces result count and filter changes. Shows `重設全部條件` whenever any filter is active. |
| Product image | Series detail | Click, touch, or keyboard opens one modal enlargement. Modal traps focus; clear close button and `Escape` close it; closing returns focus to the image trigger. |
| Key data block | Series detail | Exactly four values: min/max head in m and min/max flow in L/min. Missing approved data reads `未提供`. |
| Model table | Series detail | Contains every approved model. Header/model relationships remain programmatic. On narrow screens only the bounded table region scrolls horizontally. Provide a visible scroll cue and preserve the first model column when feasible. |
| Use tag | Series detail | Display only. Not focusable, clickable, filterable, or linked. |
| Contact action | Contextual public surfaces | Navigates to the one-page Contact surface. Optional source attribution may be recorded for privacy-safe analytics, but Contact does not expose origin copy or any return-to-product/series action. It never overlays content. |
| Contact information block | Contact | Approved phone and Email initiate `tel:` and `mailto:` behavior; address is informational; LINE appears only for a confirmed official account. Omit each unavailable row and action. V1 has no contact form. |
| FAQ disclosure | Contact | Publishes only approved QA pairs. Each native disclosure has a visible plus/minus cue, keyboard support, and independent open state. If no QA is approved, omit the whole section and expand Contact information. |
| Partner block | Partners | One partner per vertical block. `拜訪網站` appears only for a confirmed official URL and indicates an external destination. |
| Project evidence block | Services & projects, Project detail | Entire list block links to one Project detail. Only approved facts and rights-cleared real media appear. Scope, outcome, and related products are omitted individually when absent; the block does not imply missing achievements. |
| Footer | All public surfaces | Uses three content groups: company Logo/identity, primary navigation, and approved contact information. Narrow layouts stack in that order. It does not introduce a second IA; missing or unapproved facts and legal links are omitted. Footer navigation remains keyboard reachable with 44px targets. |
| Empty/error panel | Public lists, category pages, workspace, maintenance | Explains what happened, preserves recoverable state, and exposes one primary recovery plus an optional Contact path. It never substitutes generic success content for an error. |
| Publish action | Content workspace | Runs required-field and rights checks before publishing. Blocking errors receive focus and a summary; no partial public write. |
| Version release | Product maintenance | Shows full change impact and explicit version identity. Critical validation failures disable release. Rollback targets a named last-known-good version. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Home media active | Home | Plays once, total duration no more than 5 seconds, then holds on final frame. No manual controls because it does not loop and ends within 5 seconds. |
| Home media reduced/failed | Home | Reduced motion, data-saving/mobile degradation, or media failure shows the final static image immediately. Copy, filter, and links remain identical. |
| Home optional content absent | Home | Omit the entire featured-project or partner section when its source has no approved records. Purpose cards appear only for governed published purposes with approved imagery; preserve the remaining section order without empty cards or invented filler. |
| No published projects | Services & projects | Keep the approved service-capability Hero and explanation, state that no public project records are currently available, then offer Contact. Never substitute Home atmosphere or generic stock imagery. |
| Public content loading/failed | Category, Services & projects, Project, Company, Partners, News | Preserve the page heading and navigation. Loading uses stable content-shaped placeholders; failure explains that content could not load and offers retry plus the nearest stable parent. Never show fabricated fallback facts. |
| Category empty | Brand, pump-type, use-case | Keep the approved category introduction. State that no published series are currently available, then offer Product overview and Contact; do not hide the whole indexed page or manufacture cards. |
| Filter loading | Product overview | Stable card-shaped skeletons preserve layout. Existing filter controls remain visible; do not clear URL state. |
| Filter results | Product overview | Show count, active conditions, and matching cards. Announce count changes without moving focus. |
| Filter empty | Product overview | `沒有符合目前條件的產品。` Provide individual chip removal, `重設全部條件`, and a direct Contact path. |
| Missing specification | Card, series, table | Display `未提供`. Never substitute zero, dash-only, estimated range, or copied neighboring data. |
| Unreviewed product | Public website | Do not publish the record or value. Route visitors to Contact for confirmation when a known model has no approved public data. |
| Oversized model set | Series | Render the full approved set with usable table navigation; the SB/SBI/SBN approximately 491-model case is the validation baseline. Do not rely on a short demo series. |
| Product image unavailable | Series/Image enlargement | Series content remains available. Show a labelled unavailable-media surface; do not open an empty enlargement dialog. |
| Image enlargement open | Image enlargement | Trap focus inside the dialog, expose a labelled close control, support `Escape`, and return focus to the product image trigger. Loading or image failure stays inside the dialog with a close path. |
| Contact detail absent | Contact | Omit the field and its container. Do not show placeholder contact information. |
| Contact reached from any origin | Contact | Render the same direct one-page experience regardless of source. Privacy-safe attribution may retain a source identifier internally; no source name or return-to-product action is shown. |
| Contact FAQ absent | Contact | Omit the FAQ section and let Contact information use the available width. Never publish draft questions or invented answers. |
| Contact map unavailable | Contact | Omit the entire map section until the address and embedding method are approved. The working mock's labelled map is a conditional layout reference, not a public fallback. |
| Sign-in invalid/session expired | Sign in/workspace | Keep the entered account identifier when safe, explain the problem, focus the error summary, and offer recovery or re-authentication. Unsaved editor data must not be silently discarded on session expiry. |
| Account recovery requested/failed | Account recovery | Confirm that instructions were requested without revealing account existence. On failure provide retry and support guidance without exposing security detail. |
| Content draft | Workspace | Private, labelled `草稿`, editable. Opening a draft never changes public content. |
| Editor unsaved/upload failed | News editor, Project editor, Media picker | Preserve text and successful media metadata. Identify the failed file/field, expose retry/remove, and prevent publish while required rights/source data is unresolved. |
| Publish blocked | Workspace | Error summary names each missing/invalid/rights issue and links focus to the field. Preserve all entered data. |
| Published | Workspace | Confirm timestamp/status and offer `開啟公開頁確認`, `取消發布`, and edit. |
| Archived | Workspace | Removed from active lists and public access; recoverable according to CMS capability. |
| Product intake no changes/import failed | Change intake | A no-change version cannot proceed to release. Import failure names the file-level problem without partially replacing the current controlled source. |
| Difference review | Difference review | Separate added, changed, removed, duplicate, missing, insufficient, and excluded records; always show affected public pages and preserve review position. |
| Product validation blocked | Maintenance | Critical duplicate identity, required field, numeric/unit, relationship, or rights failure prevents release. |
| Release failed | Maintenance | Previous public version stays active. Show failure reason and retry path; never leave a partial catalog. |
| Rollback success/failed | Versions & rollback | Success identifies both restored and superseded versions. Failure leaves the current public version unchanged and exposes a safe retry/escalation path. |
| Not found/removed | Public | Explain that content is unavailable, link the closest valid category when known, then Product overview and Contact. Do not redirect every retired URL to Home. |

## Interaction Primitives

- Click/tap activates; keyboard activation uses native `Enter`/`Space` behavior.
- `Escape` closes the topmost dropdown or image dialog and returns focus to its trigger.
- Browser Back must preserve a visitor's product filters, result position, and source-page position when practical. Contact does not add a custom return-to-product control.
- Share or reload of a filtered Product overview restores the same visible conditions. Arbitrary filter URLs remain non-indexable.
- No hover-only navigation or content. Hover may reinforce an already visible affordance.
- No infinite scroll for product models or content management lists. Use bounded tables and explicit pagination where volume requires it.
- No drag-only operation, auto-submitting filter selection, autoplay loop, sticky contact overlay, or nested modal.
- Analytics records product-list views, series selections/views, filter use, and phone/email clicks without personal data or free text. Refusing non-essential analytics never blocks core actions.

## Accessibility Floor

- WCAG 2.2 AA is the release floor, including manual keyboard and screen-reader review.
- Every interactive element has a visible focus indicator and accessible name. Tab order follows visual reading order.
- General text contrast is at least 4.5:1; contrast ownership is in `DESIGN.md`.
- Touch targets are at least 44 by 44 CSS px; compact table controls must still meet the target.
- Heading levels form a real document outline. Landmarks identify Header/navigation, main content, and footer.
- Form controls retain visible labels. Errors are connected to fields and summarized at the top of a failed submission or publish attempt.
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
- Case-study editors may polish supplied language but cannot invent project names, scope, outcomes, numbers, or responsibility.
- Public product content shows only technically reviewed values and a last-updated date. Internal reviewer identities and documents stay private.
- Series pages always state that final selection, purchase, and suitability require confirmation with JP PUMP. V1 has no extra performance section and no PDF/technical-document download surface.
- Cross-type series such as VBSG retain one canonical Series page, are reachable from every approved pump type, and show model-level pump type only where the controlled source supports it.
- V1 is Traditional Chinese only. Do not create empty `/en/` pages or machine-translated public content. The data model and URL scheme must permit a future independent `/en/` edition.

## Inspiration & Anti-patterns

- **Lifted from `imports/competitor-navigation-about-us.png`:** explicit parent/child location cues. JP PUMP rejects hiding core services inside About and keeps Services & projects at the top level.
- **Lifted from `imports/homepage-header-reference.png`:** Header above a media-led Hero with a prominent discovery entry. Replaced broad search with the approved brand/use selects. `imports/field-engineers-reference-01.png` and `imports/field-engineer-reference-02.png` inform atmosphere/composition only and cannot become project evidence.
- **Lifted from `imports/flowserve-purpose-portfolio-reference-06.png`:** large-image purpose cards, medium category title, compact descriptive copy, and an image-led grid. JP PUMP replaces `Learn more` with a translucent arrow and keeps the whole card as the only link to Product overview with Brand=`全部` plus the selected Purpose.
- **Lifted from `imports/product-series-card-reference.png` and `imports/flowserve-product-card-reference-03.png`:** top-image composition, compact category label, series title, short description, borderless white surface with ambient shadow, compact lower-left key data, and a lower-right text cue. Image media blends into card content without a hard frame or divider; later decisions supersede the older reference's outline and four-row data treatment.
- **Lifted from `imports/flowserve-product-catalog-reference-01.png` and `imports/flowserve-product-filter-reference-02.png`:** compact page Hero below Header, a left accordion sidebar for category/search/filter, removable category-path tags, results-and-sort header, and a spacious two-column card grid. JP PUMP retains its own colors, copy, data rules, and whole-card link behavior.
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
6. He selects `前往聯絡頁`; the source may be retained only for privacy-safe analytics.
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

1. 黃建國, a building maintenance supervisor holding an equipment nameplate, reaches a relevant Series page from search or a Brand page.
2. He uses the model table's browser find or table navigation to locate the model.
3. He checks the row's approved values and the public last-updated date.
4. **Climax:** he opens the direct Contact page and can quote the exact model to JP PUMP; the page does not add a route back to Product pages.

Failure: the model is not approved/published → no guessed row appears; the page routes him to Contact for confirmation.

### UJ-4 — 王小姐 publishes an approved project

1. 王小姐 signs in to the single-administrator workspace.
2. She creates a Project draft and enters the approved project name/type, scope, outcome, and related products.
3. She uploads photos with alt text, source, and rights status.
4. She selects Publish; required-field and rights validation runs.
5. **Climax:** publication succeeds and `開啟公開頁確認` takes her to the exact public page.
6. If she detects a problem, she edits or unpublishes without developer assistance.

Failure: rights or required facts are missing → publish is blocked, data is preserved, and focus moves to the error summary.

### UJ-5 — 阿哲 completes the annual product update

1. 阿哲, the designated maintainer, creates a new controlled data version from the supplied spreadsheet and images.
2. Difference review identifies additions, changes, duplicates, missing fields, exclusions, and affected pages.
3. He assigns the four governed dispositions—reviewed, pending, insufficient, or excluded—and records the offline technical reviewer and review date.
4. Validation stress-tests the largest series, including the approximately 491-model SB/SBI/SBN case.
5. He reviews the complete public impact and publishes a named version.
6. **Climax:** the public catalog changes atomically, the prior usable version remains recoverable, and another maintainer can follow the operating document.

Failure: a critical validation or release step fails → the prior public version stays live and rollback/retry remains explicit.

## Source Reconciliation

Later user-confirmed UX decisions supersede older presentation and Contact-routing details still present in the PRD/addendum: Product overview uses a two-column wide grid rather than three columns; Product cards use a borderless elevated surface rather than a thin outlined/no-shadow surface; card key data is summarized as two explicit-unit range lines with a text-only `看更多` cue rather than four full specification rows; every Footer uses brand/navigation/contact groups; Contact is a deep-dark direct one-page experience with no visible return to Product or Series; and both Home quick-filter dimensions default to `全部`, so untouched submit is valid. Home also now includes approved-content previews below the originally specified Hero. Approved-data, no-form, accessibility, and integrity requirements remain unchanged. See `reconcile-prd-late-ux-overrides.md`; the upstream PRD should be updated before Architecture treats both documents as equal inputs.

## Mockup Coverage

- Approved mockup: [Home](mockups/key-screen-home-responsive-01.html) — complete Home Header, Hero/media fallback, default-to-all quick filter, company summary, purpose-card grid, three gateways, featured projects, partners, Contact CTA, Footer, and mobile adaptation. News is intentionally absent from Home.
- Approved mockup: [Product overview](mockups/key-screen-product-overview-responsive-01.html) — full filters, active state, result count, top-image cards, and empty/missing-data patterns.
- Approved mockup: [Series detail](mockups/key-screen-product-series-detail-responsive-01.html) — ordered Series content, dense model table, image-dialog reference state, and responsive actions.
- Approved mockup: [Services & projects](mockups/key-screen-services-projects-responsive-01.html) — service-capability Hero, verified-project integrity boundary, responsive whole-block evidence list, Contact CTA, and global Footer.
- Approved mockup: [Contact](mockups/key-screen-contact-responsive-01.html) — deep-dark direct Contact Hero, service summary, approved-field omission rule, phone/Email/address/conditional LINE, approved FAQ structure, conditional map, three-group Footer, and no return-to-product action.
- Spine-only by explicit closure: category pages, Project detail, Company, Partners, News, not-found, content workspace, controlled partner maintenance, and controlled product maintenance. Category layouts reuse the catalog/content patterns. Internal operational surfaces remain platform-neutral until Architecture selects CMS and maintenance tooling. Full rationale is recorded in `key-screen-coverage.md`.

The approved mockups instantiate the key compositions and responsive behavior defined by the two spines.

## Remaining Dependencies

- **Reviewer gate:** skipped by explicit user decision for this finalization round.
- **Content dependency, not a UX blocker:** approved company/contact facts, initial foreign brands, governed categories, product imagery/specifications, partners, and project evidence are still required before public-content acceptance.
- **Architecture dependency, not a UX blocker:** CMS/backend selection and the exact internal operational UI remain platform-neutral. If Architecture chooses a custom product-maintenance UI, Difference review becomes the next required operational key screen.
- **Technical dependency, not a UX blocker:** the exact public model-table fields beyond the four series key ranges require JP PUMP technical confirmation; the table contract supports additional approved columns without changing page structure.
- English product exploration remains deferred. V1 publishes Traditional Chinese only and must not create empty or machine-filled `/en/` pages.
