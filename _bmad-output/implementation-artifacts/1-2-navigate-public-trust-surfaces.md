---
baseline_commit: 95762987880cf7ecc49a9356c3cefad86a8f43f2
---

# Story 1.2: Navigate Public Trust Surfaces

Status: review

## Story

As a professional buyer,
I want consistent keyboard- and touch-friendly navigation,
So that I can reach JP PUMP's public information without getting lost.

## Acceptance Criteria

1. Header renders with JP PUMP logo linking to Home, and primary nav order: `產品總覽`, `服務與實績`, `關於傑平`, `聯絡我們`. Current location exposed visually and programmatically.
2. Product and About dropdowns open only by click/keyboard (not hover), show expanded state + directional cue. Second activation, outside click, or Escape closes and returns focus to trigger.
3. Product dropdown shows all approved Purposes (up to 8) followed by `全部產品`. About shows only Company and Partners. Services & Projects is a direct top-level link. News is absent.
4. Narrow viewport: labelled mobile-menu trigger exposes same items/order/destinations. Navigation is never hidden without operable replacement.
5. Footer contains company identity, primary navigation, and approved contact info in that order, stacking on narrow screens. Missing facts/legal links omitted. 44px targets, visible focus.

## Tasks / Subtasks

- [x] Create `src/data/site.json` with governed nav data (purposes, about children, contact info) (AC: 1, 3)
- [x] Create `src/components/Header.tsx` with desktop nav + logo (AC: 1, 3)
  - [x] Logo links to `/zh-tw`
  - [x] Nav order: 產品總覽, 服務與實績, 關於傑平, 聯絡我們
  - [x] Current page active state via `usePathname`
- [x] Create `src/components/DropdownMenu.tsx` — client component (AC: 2, 3)
  - [x] Click/keyboard toggle (no hover)
  - [x] Expanded state + directional cue (▾)
  - [x] Escape / outside click closes, focus returns to trigger
  - [x] Single-level menu only
  - [x] 44px targets, visible focus ring
- [x] Create `src/components/MobileMenu.tsx` — client component (AC: 4)
  - [x] Labelled menu trigger (☰ / ✕)
  - [x] Same items, order, destinations as desktop
  - [x] Escape closes, focus returns
  - [x] Nested expandable sections for Products and About
- [x] Create `src/components/Footer.tsx` with 3 groups (AC: 5)
  - [x] Company identity + brand name
  - [x] Primary navigation links
  - [x] Contact info (phone, email, address)
  - [x] 44px targets, visible focus
  - [x] Missing fields omitted
- [x] Integrate Header + Footer into `[locale]/layout.tsx` (AC: 1)
- [x] Verify lint + build pass

## Dev Notes

### Architecture Compliance
- **AD-1**: Header/Footer use Server Component layout with Client Component islands (DropdownMenu, MobileMenu)
- **AD-3**: Nav data sourced from `src/data/site.json` (governed JSON), not embedded in JSX
- **AD-8**: All routes are `/zh-tw/` prefixed
- **AD-16**: Custom small Client Components — no headless library added
- **FR-1, UX-DR6, UX-DR7, UX-DR30**: Full navigation contract satisfied

### Interaction Details
- Desktop nav: inline `<nav>` with dropdown menus
- Mobile nav: absolute-positioned panel below header
- Dropdown: `useRef` + `useEffect` for outside-click detection
- Focus ring: 3px `var(--color-focus-ring)` with 2px offset
- Active page: underline + `var(--color-action)` text color

### Files Created/Modified
- `src/data/site.json` — New: governed nav data
- `src/components/Header.tsx` — New: client component
- `src/components/DropdownMenu.tsx` — New: client component
- `src/components/MobileMenu.tsx` — New: client component
- `src/components/Footer.tsx` — New: server component
- `src/app/[locale]/layout.tsx` — Modified: add Header + Footer

## References
- [Source: epics.md#L341-L375] — Story 1.2 acceptance criteria
- [Source: epics.md#L156-L160] — UX-DR6, UX-DR7 design requirements
- [Source: epics.md#L206] — UX-DR30 footer requirements
- [Source: EXPERIENCE.md#L100-L103] — Global header behavioral rules
- [Source: EXPERIENCE.md#L113-L118] — Dropdown behavioral rules
- [Source: DESIGN.md#L228-L231] — Global header visual spec
- [Source: DESIGN.md#L249] — Footer visual spec

## Dev Agent Record

### Completion Notes
- [x] Full Header with desktop nav + dropdown menus
- [x] Mobile menu with labelled trigger and nested sections
- [x] Footer with 3 groups: identity, nav, contact
- [x] `npm run lint` passes
- [x] `npm run build` passes (SSG `/zh-tw`)
- [x] All 44px minimum touch targets
- [x] Visible focus indicators on all interactive elements
- [x] No hover-dependent interactions
- [x] Nav data in governed JSON file (not embedded in JSX)

### File List
- `website/src/data/site.json`
- `website/src/components/Header.tsx`
- `website/src/components/DropdownMenu.tsx`
- `website/src/components/MobileMenu.tsx`
- `website/src/components/Footer.tsx`
- `website/src/app/[locale]/layout.tsx`
