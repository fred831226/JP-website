---
baseline_commit: 95762987880cf7ecc49a9356c3cefad86a8f43f2
---

# Story 1.6: Contact JP PUMP Directly

Status: review

## Story

As a professional buyer,
I want one direct Contact page with approved communication details,
So that I can call or email JP PUMP without submitting tracked personal data.

## Acceptance Criteria

1. Deep-dark composition: Hero/service summary → contact info → optional FAQ → optional map → Footer.
2. No source identifier, return-to-product action, attribution state, or contact form.
3. Phone → native `tel:`, Email → native `mailto:`, 44px target height.
4. Missing data → rows/sections omitted, no placeholders.
5. FAQ: native disclosure, independent open/close, plus/minus cue, keyboard operable.
6. 320px: all regions stack, operable, WCAG 2.2 AA.

## Tasks / Subtasks

- [x] Create `src/data/contact.json` with governed contact data (AC: 4)
- [x] Create `src/components/FaqDisclosure.tsx` — client component (AC: 5)
- [x] Create `src/app/[locale]/contact/page.tsx` — Contact page (AC: 1, 2, 3, 6)
- [x] Verify lint + build pass

## Dev Notes

- Contact is the only deep-dark page in V1 (DESIGN.md)
- All `null` values in data → omitted from render
- No form, no analytics, no source tracking
- Footer already handled by layout

## References
- [Source: epics.md#L486-L522] — Story 1.6 acceptance criteria
- [Source: DESIGN.md#L244-L246] — Contact component spec

## Dev Agent Record

### Completion Notes
- [x] `/zh-tw/contact` statically generated
- [x] Deep-dark composition with hero, info, FAQ
- [x] Native tel:/mailto: actions
- [x] Missing data omitted entirely
- [x] FAQ disclosure with plus/minus, keyboard support
- [x] `npm run build` passes

### File List
- `website/src/data/contact.json`
- `website/src/components/FaqDisclosure.tsx`
- `website/src/app/[locale]/contact/page.tsx`
