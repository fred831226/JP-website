---
name: "JP PUMP Technical Blueprint"
description: "A restrained industrial B2B visual system for trustworthy product discovery, evidence-led company credibility, and direct contact."
status: final
created: 2026-07-21
updated: 2026-07-22
sources:
  - ../../prds/prd-JP-Website-2026-07-20/prd.md
  - ../../prds/prd-JP-Website-2026-07-20/addendum.md
  - ../../architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md
  - imports/company-sign-original.jpg
  - imports/company-sign-ai-enhanced.png
  - imports/jp-pump-logo-source.png
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
colors:
  background: '#F4F7F8'
  surface: '#FFFFFF'
  surface-subtle: '#EAF0F2'
  text: '#111B22'
  text-muted: '#4B5D68'
  primary: '#0B2A3D'
  primary-muted: '#3B6477'
  on-primary: '#FFFFFF'
  action: '#006D8F'
  on-action: '#FFFFFF'
  border: '#C9D3D8'
  border-strong: '#7D929E'
  focus-ring: '#006D8F'
  identity-detail: '#A87A24'
  error: '#A32D2D'
  on-error: '#FFFFFF'
  warning-surface: '#FFF4D6'
  warning-text: '#5C4200'
  contact-surface: '#06141B'
  contact-surface-raised: '#102C37'
  contact-text-muted: '#B8C9CF'
typography:
  display:
    fontFamily: 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif'
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.14'
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif'
    fontSize: 34px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.015em
  heading-lg:
    fontFamily: 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif'
    fontSize: 32px
    fontWeight: '750'
    lineHeight: '1.25'
  heading-md:
    fontFamily: 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif'
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.35'
  heading-sm:
    fontFamily: 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif'
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1.4'
  body:
    fontFamily: 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
  body-sm:
    fontFamily: 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  label:
    fontFamily: 'Noto Sans TC, PingFang TC, Microsoft JhengHei, sans-serif'
    fontSize: 14px
    fontWeight: '650'
    lineHeight: '1.4'
rounded:
  none: 0px
  xs: 2px
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 40px
  '8': 48px
  '9': 64px
  '10': 80px
  content-max: 1200px
  text-max: 720px
  page-gutter-desktop: 32px
  page-gutter-mobile: 20px
components:
  button-primary:
    background: '{colors.action}'
    foreground: '{colors.on-action}'
    radius: '{rounded.md}'
    minHeight: 44px
    paddingInline: '{spacing.4}'
  button-secondary:
    background: '{colors.surface}'
    foreground: '{colors.primary}'
    border: 'none'
    radius: '{rounded.md}'
    minHeight: 44px
    shadow: '0 3px 10px rgba(11, 42, 61, 0.10)'
  form-control:
    background: '{colors.surface}'
    foreground: '{colors.text}'
    border: 'none'
    radius: '{rounded.md}'
    minHeight: 44px
    shadow: '0 3px 10px rgba(11, 42, 61, 0.10)'
  product-card:
    background: '{colors.surface}'
    foreground: '{colors.text}'
    border: 'none'
    radius: '{rounded.lg}'
    shadow: '0 12px 32px rgba(11, 42, 61, 0.12)'
  category-tag:
    background: '{colors.surface-subtle}'
    foreground: '{colors.primary}'
    border: 'none'
    radius: '{rounded.xs}'
  data-table:
    background: '{colors.surface}'
    foreground: '{colors.text}'
    border: '{colors.border}'
    headerBackground: '{colors.surface-subtle}'
  floating-layer:
    background: '{colors.surface}'
    foreground: '{colors.text}'
    radius: '{rounded.lg}'
    shadow: '0 18px 48px rgba(11, 42, 61, 0.18)'
  contact-information-block:
    background: '{colors.contact-surface-raised}'
    foreground: '{colors.on-primary}'
    radius: '{rounded.lg}'
    shadow: '0 16px 34px rgba(0, 0, 0, 0.14)'
  footer:
    background: '{colors.contact-surface}'
    foreground: '{colors.on-primary}'
    radius: '{rounded.none}'
---

## Brand & Style

JP PUMP is presented as a dependable industrial partner and a source of verifiable product information. The current production direction combines the latest **Technical Blueprint** palette with the previously selected **Balanced Engineering** density and geometry. Deep technical blue establishes authority; cool neutrals keep specifications readable; cyan-blue marks actions. The experience should feel maintained, precise, and direct rather than luxurious, playful, or promotional.

This is the active visual contract for the current mockups. Earlier A–E palettes, Graphite Fieldwork, and Deep Teal Engineering remain an exploration library only. They are not production tokens unless a later decision explicitly replaces this spine.

The supplied `imports/jp-pump-logo-source.png` is the identity master. It may be cleaned, cropped, and exported for the web, but its lettering and structure must not be redrawn. `imports/company-sign-original.jpg` is historical evidence; `imports/company-sign-ai-enhanced.png` is mood reference only.

The retained exploration library is `.working/color-themes-brand-01.html`, `.working/design-directions-a-01.html`, and `.working/uipro-color-comparison-01.html`. These files explain discarded/alternate palette and density directions; the tokens in this spine are the active contract.

## Colors

- **Technical Navy** `{colors.primary}` anchors the Header, hero text panels, major headings, and technical table emphasis. It is the primary identity field, not a default background for every section.
- **Action Blue** `{colors.action}` is reserved for primary actions, active navigation, links, and visible focus. It must not become decorative striping across product cards.
- **Blueprint Gray** `{colors.background}` is the page canvas. White `{colors.surface}` holds cards, controls, and tables.
- **Slate** `{colors.primary-muted}` and `{colors.text-muted}` support secondary copy, metadata, and quiet structural cues. Body content must not use low-contrast decorative gray.
- **Identity Gold** `{colors.identity-detail}` is optional and limited to one small identity detail in a composition, such as a short rule near a history statement. Never use it as a large fill, product-category color, or general CTA.
- Error and warning colors appear only when the corresponding state exists. They are never product-decoration colors.

Light mode remains the default for V1. Contact is the one approved deep-dark page treatment, using `{colors.contact-surface}` and `{colors.contact-surface-raised}` to create a focused professional direct-contact experience. This is a page-specific composition, not a site-wide dark mode.

## Typography

The interface uses a Traditional Chinese system sans stack so long-form company copy, dense specifications, and operating-system controls remain familiar and fast. No web font is required for the first release.

- `display` is restricted to the homepage hero and rare section openings; use `display-mobile` below the compact breakpoint.
- `heading-lg` and `heading-md` establish page and section hierarchy. Product names use `heading-sm`.
- `body` is the default prose and table-supporting text. `body-sm` is for metadata, helper text, and compact specifications, never for the primary reading path.
- Labels remain sentence case. Do not use long all-caps English labels in the Traditional Chinese interface.
- Numeric columns use tabular numerals when supported. Units remain adjacent to values and are never conveyed by position alone.

## Layout & Spacing

The system uses an 8px base rhythm with 4px available for precise alignment. Public content sits within `{spacing.content-max}` and uses `{spacing.page-gutter-desktop}`; narrow screens use `{spacing.page-gutter-mobile}`. Long prose stays within `{spacing.text-max}`.

Homepage hero composition, informed by `imports/homepage-header-reference.png`, `imports/field-engineers-reference-01.png`, and `imports/field-engineer-reference-02.png`, has two layers: an approved media field and a readable content/filter panel. Header is a separate surface above the hero. The media cannot be the only carrier of meaning; the field-engineer references are composition references, not project evidence.

Below the Hero, Home follows one complete trust-and-routing sequence: concise company summary and approved fact preview; a purpose-based product feature; three gateways for Product overview, Services & projects, and Contact; featured verified projects; approved partner preview; then Footer. Home has no separate Contact CTA and no News preview. Each section uses its destination page's established component language. Optional sections are omitted when no approved content exists rather than filled with generic marketing material.

Product overview begins with a compact technical page Hero directly below the Header. It contains the page title and a short, verifiable catalog introduction; approved media is optional and must never be replaced by unverified product or project evidence. Filtering begins in the content region below.

Product cards use the top-image composition studied in `imports/product-series-card-reference.png` and the later Flowserve references `imports/flowserve-product-catalog-reference-01.png`, `imports/flowserve-product-filter-reference-02.png`, and `imports/flowserve-product-card-reference-03.png`. The desktop catalog grid is two columns so images, titles, descriptions, and technical values retain comfortable width. It becomes one column when two cards would compress the reading path. Three-column product grids are not used.

Services & projects begins with a deep-navy service Hero and six approved capability labels, then shifts to the light content canvas for an evidence-led vertical project list. Every project block pairs a large rights-cleared media region with approved type/title, concise context, optional scope/outcome, related product context, and one whole-block link. AI atmosphere and generic stock media never enter this surface.

Series pages use a single reading path: suitability-confirmation note, image, key data, introduction, model table, non-interactive use tags, then actions. The model table may scroll horizontally inside a clearly bounded region; the page itself must not scroll sideways at 320 CSS px.

Contact is a deep-dark one-page composition informed by `imports/contact-dark-one-page-reference-05.png`: direct-contact Hero and service summary, contact information and approved FAQ content in two columns, then an optional approved map. Narrow layouts stack these regions in the same reading order. The page never displays a return-to-product or return-to-series action.

## Elevation & Depth

Public-page hierarchy comes from whitespace, tonal surfaces, typography, and restrained ambient elevation. Avoid obvious outer-outline traces around cards, content panels, sidebars, and empty states. Product cards sit on the canvas with the `product-card` shadow; hover may add only a 2px lift and a modest shadow increase. Stronger shadows remain reserved for literal floating layers such as navigation menus and image dialogs. Structural borders remain available where they communicate relationships or state—model tables, form controls when surface contrast is insufficient, errors, and keyboard focus—but they must stay low-contrast and purposeful.

## Shapes

Controls use `{rounded.md}`; general panels and product cards do not exceed `{rounded.lg}`. Tags use `{rounded.xs}` rather than pills. Full pills are reserved for compact status labels whose shape communicates a bounded status, never for navigation or decorative chips.

## Components

- **Global header** — White surface, linked logo at the start edge, primary navigation at the end edge, and the same order and destinations on every public surface. On wide layouts, the logo receives more visual scale while navigation labels use a slightly smaller compact type size; minimum targets remain 44px. Active-page state uses text weight plus an underline or left rule, never color alone. At narrow widths it exposes a labelled menu trigger rather than silently hiding navigation.
- **Header dropdown** — Product and About triggers show expanded state and a directional indicator. Menus use `floating-layer`; their links retain 44px targets and visible focus.
- **Hero media** — Full-width Home image field with a navy readability overlay. The wide-layout content/filter panel is approximately 30% narrower than the prior mock so more media remains visible; compact layouts restore a full-width stacked panel. AI-generated construction imagery must be labelled and used only as atmosphere; it cannot appear in a case-study or proof context. The static final frame must support all text contrast without depending on animation.
- **Home quick filter** — Two labelled `form-control` selects and one `button-primary`. Brand and Purpose both default to `全部`; no required placeholder or empty-submit error is used. Desktop may align them in a single row; narrow screens stack them. Labels stay visible above values.
- **Home company summary** — One concise editorial column and one approved-fact preview surface. Its background may use a low-contrast, semi-transparent 3D pipe with an abstract left-to-right water-flow ribbon. The effect is decorative, remains behind readable surfaces, carries no alt text or evidence meaning, and must not be mistaken for a real project. Facts without approved values are omitted in production; the whole preview may collapse to the editorial column.
- **Home purpose card** — Uses the proportion and hierarchy studied in `imports/flowserve-purpose-portfolio-reference-06.png` while retaining JP PUMP styling: a large approved use image, medium use title, two short descriptive sentences, and one translucent arrow at lower right. `Learn more` text is not shown. The entire card is one link; hover/focus may zoom the image up to roughly 1.06× without moving the card or obscuring text.
- **Home gateway block** — Three destination blocks for Product overview, Services & projects, and Contact. They are equal at rest; on hover or keyboard focus in wide pointer layouts, the active block expands while both siblings contract, then all return to equal width when interaction leaves. Each block remains one link with a short explanation and visible text cue; it does not duplicate the Hero filter. Touch and narrow layouts stay fixed and stacked.
- **Home content teaser** — Featured projects reuse `project-evidence-block`; partners reuse `partner-block`. Empty optional sources remove their entire section.
- **Catalog sidebar** — A seamless cool-gray rail holds a labelled series/model search field, one exclusive segmented Brand group, multi-select Pump type chips, multi-select Purpose chips, and removable active-condition tags. The selected states use the existing Technical Blueprint navy/action colors and restrained motion; checkbox lists, dropdown fields, sorting, and a separate apply button are not shown. Normal-state visual dimensions may remain compact, but each control provides an effective 44px touch target, visible keyboard focus, and programmatic selected state.
- **Result summary** — Page heading and a live result count form one compact responsive region. Active conditions appear as removable tags in the filter rail with one text-led clear-all action. No sorting control is shown in V1.
- **Product card** — One link wraps the full card. Anatomy: a compact approved image or explicitly labelled approval-pending media area that blends directly into the card without an inner frame or hard divider; a soft tonal category tag; series title; short approved description; one or two compact key-data lines at bottom-left with explicit units; and a text-only `看更多` cue at bottom-right. The cue is not a nested link or button. Avoid excessive blank image padding. Hover adds only a restrained lift/shadow; focus uses a 3px `{colors.focus-ring}` outline with a 2px surface offset.
- **Product image** — Approved series media sits on a borderless white surface with restrained elevation. The entire image surface is the enlargement trigger and keeps a 3px `{colors.focus-ring}` outline on keyboard focus.
- **Key data block** — Four fields only: minimum/maximum head in `m`, minimum/maximum flow in `L/min`. Missing values show `未提供`; do not gray them into illegibility.
- **Model table** — Sticky visual header within the table container when useful, clear model-to-column association, tabular numerals, and explicit units. Missing cells say `未提供`, never `0` or an em dash. Table borders are structural exceptions to the public no-outline direction.
- **Use tag** — Neutral, non-interactive label. It must not look clickable and has no hover state.
- **Contact action** — On source pages, primary `前往聯絡頁` uses the button token; nearby page-navigation actions may remain secondary. Contact itself has no return-to-product action. Within Contact, approved phone and Email actions use compact pill buttons and remain at least 44px high.
- **Contact information block** — Address, phone, Email, and approved official LINE appear as quiet labelled rows on the deep Contact surface; phone and Email provide native actions. Missing or unapproved data removes that row in production. Approved mockups may label approval dependencies but must not publish them as values.
- **FAQ block** — Approved questions use native disclosure rows with a visible plus/minus cue, 44px minimum targets, keyboard operation, and independent open state. If no QA copy is approved, omit the entire block and let Contact information use the available width.
- **Partner block** — One partner per wide horizontal block, centered in a single vertical sequence. Approved Logo sits left of 3–4 sentences and an optional secondary `拜訪網站` action; narrow layouts stack and center all content. It is not a multi-column card grid.
- **Project evidence block** — Rights-cleared project media and approved facts receive equal hierarchy. Use one linked block per project with a large media region, title/type, concise scope/outcome, and related-product context only when approved. Never use AI atmosphere or generic stock media as evidence.
- **Footer** — `{components.footer}` spans every public surface and follows `imports/footer-brand-navigation-contact-reference-04.png`: brand Logo/company identity at left, `主導覽` in the middle, and approved `聯絡資訊` at right. It stacks in that order on narrow screens. Navigation uses 44px links; unavailable facts and unapproved legal links are omitted in production rather than represented by placeholders.
- **Empty/error panel** — Plain language, reason, one recovery action, and an optional contact path. It uses a tonal surface, spacing, and optional restrained elevation rather than an obvious outer outline or an illustration that could be mistaken for content.
- **Operational tooling boundary** — Git, validation reports, Vercel Preview, Production promotion, and rollback use their provider/tool interfaces in V1. Do not skin those interfaces as JP PUMP product surfaces or add custom publish controls to the public design system.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Use real, rights-cleared field and product media as trust evidence | Present AI atmosphere as a real project or product proof |
| Show `未提供` when approved technical data is absent | Infer, interpolate, copy, or visually imply missing values |
| Keep product areas white, navy, and gray | Add category color strips, colored image grounds, or decorative status colors |
| Use one clear primary action per decision point | Place multiple competing buttons inside a product card |
| Use whitespace, tonal surfaces, type, and restrained card shadow to create hierarchy | Box every section with visible outlines, add glass effects, or use excessive motion |
| Preserve the supplied logo structure | Redraw, stretch, recolor, or manufacture a new formal mark |
| Validate desktop and 320px layouts with real dense data | Approve a layout using only one short sample series |

Approved composition references: [Home](mockups/key-screen-home-responsive-01.html), [Product overview](mockups/key-screen-product-overview-responsive-01.html), [Series detail](mockups/key-screen-product-series-detail-responsive-01.html), [Services & projects](mockups/key-screen-services-projects-responsive-01.html), and [Contact](mockups/key-screen-contact-responsive-01.html). These files illustrate this contract; this spine wins on conflict.
