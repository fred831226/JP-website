# PRD reconciliation — later UX overrides

Status: pending upstream PRD update before Architecture

The PRD and addendum remain authoritative for product scope, approved data, integrity, accessibility, and behavior. The user later changed presentation, Footer composition, and Contact routing decisions during the active UX run. The UX memlog records the changes in chronological override order; `DESIGN.md` and `EXPERIENCE.md` contain the current visual/behavior contract.

| Older source detail | Later confirmed UX decision | Unchanged requirement |
|---|---|---|
| Product cards use a wide-screen three-column grid | Wide screens use two columns; collapse to one when two cards no longer retain comfortable reading width | 320 CSS px has no page-level horizontal overflow; card content remains readable |
| Product cards use a thin outline and no shadow | Cards are borderless white surfaces with restrained ambient shadow; public surfaces minimize obvious outer outlines | Visible keyboard focus remains; structural table/form/error boundaries remain where needed |
| Cards show up to four full specification rows | Cards summarize head and flow as two compact lines with explicit units; Series detail retains the full four-value key-data block and full model table | Missing values say `未提供`; no value is inferred, copied, or represented as zero |
| Cards end after specifications | Lower-right `看更多` appears as a text-only cue inside the single whole-card link | No nested action; mouse, touch, and keyboard reach the same unique Series page |
| Footer primarily repeats destinations and may optionally show company/contact facts | Every public Footer uses three groups: company Logo/identity, `主導覽`, and approved `聯絡資訊`; narrow screens stack them | Footer does not create a second IA; missing or unapproved facts and legal links are omitted in production |
| Contact names source context and provides a deterministic return to Series or Product overview | Contact is a deep-dark one-page direct-contact surface and never shows a return-to-product or return-to-series action | V1 still has no contact form; phone, Email, address, LINE, QA, hours, and map publish only when approved |
| Contact is a short light sequence of explanation, contact blocks, address, and return | Contact uses a Hero/service summary, contact information, approved FAQ, and optional approved map; deep tones remain page-specific | Core contact intent, accessibility, and factual-source requirements remain unchanged |
| Home quick filter explicitly defaults Brand to `全部` but leaves Purpose without a confirmed default | Brand and Purpose both default to `全部`; submitting either or both untouched is valid and opens Product overview with the corresponding unrestricted state | Both controls remain single-select and the resulting state remains restorable from the Product overview URL |
| Home requirements specify the complete Hero but do not define the below-Hero composition | Home continues with concise Company, purpose cards, Product/service/contact gateways, featured approved projects, approved partners, Contact CTA, and Footer; Latest Information is intentionally not shown on Home | News remains in V1 through its dedicated list/detail surfaces; unapproved or unavailable Home content removes its whole optional section |
| No Home purpose-card visual/interaction is specified | Purpose cards use a large approved image with restrained zoom, medium Purpose title, two short sentences, and a translucent arrow only; the whole card links to Product overview with Brand=`全部` plus the selected Purpose | Purpose values remain governed and URL-restorable; there is no nested action or inferred product suitability |

No product identity, classification, filtering logic, technical-review rule, accessibility floor, or source/rights boundary changed. Any source attribution passed into Contact is analytics-only and is not exposed as a visible return route.

Recommended handoff: run `bmad-prd` in update mode after UX confirmation so FR-6, NFR-13, and the addendum presentation paragraphs match the final spine before `bmad-architecture`.
