# Key-screen coverage — final

Status: final

This inventory closes visual coverage for the current UX scope. DESIGN.md and EXPERIENCE.md remain the governing contracts; approved HTML mockups illustrate load-bearing compositions.

## Independently mocked public surfaces

| Surface | Visual reference | Why it needs an independent mock |
|---|---|---|
| Home | [mockup](mockups/key-screen-home-responsive-01.html) | Establishes the global Header/Footer, brand Hero, quick product entry, decorated trust sequence, purpose-card grid, responsive gateway interaction, featured evidence, partner teaser, and direct Footer transition; separate Contact CTA and News are intentionally absent |
| Product overview | [mockup](mockups/key-screen-product-overview-responsive-01.html) | Owns the most complex public filtering, result, empty-state, and product-card behavior |
| Series detail + image enlargement | [mockup](mockups/key-screen-product-series-detail-responsive-01.html) | Owns dense technical data, long model tables, media enlargement, use tags, and Contact action hierarchy |
| Services & projects | [mockup](mockups/key-screen-services-projects-responsive-01.html) | Owns the service-capability Hero and verified project-evidence list; prevents project evidence from being styled like generic marketing cards |
| Contact | [mockup](mockups/key-screen-contact-responsive-01.html) | Owns the page-specific deep-dark treatment, direct contact actions, approved FAQ, conditional map, and no-return behavior |

## Public surfaces intentionally covered by the spines

| Surface | Reused contract | Reason no separate mock is needed |
|---|---|---|
| Brand, pump-type, and use-case index/detail | Product overview Hero/sidebar/card patterns plus governed category introduction and empty state | No new layout-driving interaction |
| Project detail | Services project-evidence block, editorial content rhythm, related-product link, Contact action | Uses already-mocked evidence and detail patterns |
| Company information | Home company-summary rhythm plus long-form content, approved fact blocks, and global navigation | Primarily editorial; no unique interaction |
| Partners | Partner block component: one wide partner per row, Logo/copy/optional official link | Fully specified component and responsive behavior |
| News list/detail | Published content list, date/summary/body, media rules, standard detail reading width | Conventional editorial surfaces with no new interaction |
| Not found/removed | Empty/error panel state with nearest valid destination, Product overview, and Contact | State behavior is already explicit |

## V1 maintainer workflow intentionally has no custom key screen

V1 has no sign-in, account recovery, CMS workspace, News/Project editor, media picker, custom product-maintenance UI, backend, or database. All content uses the external Git/validation/Vercel workflow defined in EXPERIENCE.md: source preparation, change review, validation report, Vercel Preview, JP PUMP approval, Production promotion, and named deployment rollback.

Those stages use provider/tool interfaces and do not inherit JP PUMP public-site styling. A new operational key screen becomes necessary only if V2 adopts a CMS or custom backend after a validated self-service/runtime need.

## Closed decisions

- Services & projects receives the sole additional public key screen.
- Home Brand and Purpose both default to 全部; submitting any untouched combination navigates directly to Product overview.
- Each Home Purpose card links to Product overview with Brand=全部 and its one selected Purpose; the card has a large image with restrained zoom, two-sentence copy, and a translucent arrow only.
- Home does not include Latest Information; News remains reachable from About and retains its separate list/detail surfaces.
- Optional UX validation/reviewer gate is skipped by user decision.
- Approved company facts, contact data, partners, news, product data, and project evidence remain content dependencies, not UX blockers.
- The user confirmed this final candidate on 2026-07-21; both UX spines and the five approved key-screen mockups are final.
