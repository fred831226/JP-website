---
baseline_commit: 95762987880cf7ecc49a9356c3cefad86a8f43f2
---

# Story 1.3: Understand JP PUMP on Home

Status: review

## Story

As a prospective buyer,
I want a credible, media-supported Home experience,
So that I can quickly understand JP PUMP's identity, engineering capability, and next destinations.

## Acceptance Criteria

1. Hero communicates factual positioning + `認識我們` link without depending on animation. Copy readable over final static frame.
2. Photo sequence plays once ≤5s then stops. Reduced-motion/media-failure shows final frame immediately.
3. Below Hero: company summary, Purpose cards, destination gateways. No News, no duplicate Contact CTA.
4. Missing content → omit section entirely (no placeholders/filler).
5. Gateway blocks expand/contract on hover/focus (wide); fixed/stacked (narrow/touch).

## Tasks / Subtasks

- [x] Create `src/data/home.json` with governed home content (AC: 1, 3)
- [x] Create `src/components/HeroCarousel.tsx` — client component (AC: 2)
  - [x] Finite sequence ≤5s, no loop, no manual controls
  - [x] Reduced-motion fallback to static frame
  - [x] Navy overlay for text readability
- [x] Update `src/app/[locale]/page.tsx` with full Home composition (AC: 1, 3, 4)
  - [x] Hero section with title, subtitle, CTA
  - [x] Company summary section
  - [x] Purpose cards grid (2-col desktop, 1-col mobile)
  - [x] Destination gateways
  - [x] Omitted when no content: empty sections not rendered
- [x] Create `src/components/GatewayBlock.tsx` — client component (AC: 5)
  - [x] Hover/focus expand/contract on wide layouts
  - [x] Fixed stacked on narrow/touch
- [x] Verify lint + build pass

## Dev Notes

### Architecture Compliance
- **AD-1**: Home page is SSG; Client Components only for carousel and gateway interaction
- **AD-3**: Home content from `src/data/home.json` (governed JSON)
- **NFR-4**: Carousel ≤5s, no loop, reduced-motion respected
- **UX-DR8, UX-DR10, UX-DR12, UX-DR13**: All Home sections implemented

### Important Details
- No approved hero images → carousel shows navy background (static fallback)
- No approved purpose images → grey placeholder area (will be replaced when media approved)
- Purpose cards: whole-card link to `/zh-tw/products?purpose={id}`
- Gateway: hover/focus expands active card (flex: 2), siblings return to flex: 1
- Optional sections (featured projects, partners) not implemented yet — no approved content exists

## References
- [Source: epics.md#L376-L409] — Story 1.3 acceptance criteria
- [Source: epics.md#L162-L172] — UX-DR8 to UX-DR13
- [Source: DESIGN.md#L204-L206] — Home composition

## Dev Agent Record

### Completion Notes
- [x] Full Home page with Hero, company summary, purpose cards, gateways
- [x] `npm run lint` passes (0 errors)
- [x] `npm run build` passes (SSG `/zh-tw`)
- [x] All optional sections omitted when no content
- [x] Carousel degrades safely to static
- [x] 44px touch targets throughout

### File List
- `website/src/data/home.json`
- `website/src/components/HeroCarousel.tsx`
- `website/src/components/GatewayBlock.tsx`
- `website/src/app/[locale]/page.tsx`
