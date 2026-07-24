---
baseline_commit: 95762987880cf7ecc49a9356c3cefad86a8f43f2
---

# Story 1.5: Review Services and Project Evidence

Status: review

## Story

As a procurement decision-maker,
I want approved service capabilities and real Project evidence in one place,
So that I can judge whether JP PUMP can support my work.

## Acceptance Criteria

1. Deep-navy Hero with 6 approved service capabilities + summary.
2. Each Project: semantic in-place section with media, title/type, context, optional scope/outcome. Absent fields omitted.
3. No whole-block links, no individual Project detail routes.
4. Unapproved media/claims excluded.
5. No projects → service Hero remains + "no projects" message + Contact link.
6. Wide: media paired with copy. Narrow: media before copy.

## Tasks / Subtasks

- [x] Create `src/data/services.json` with governed services + projects data
- [x] Create `src/app/[locale]/services/page.tsx` — Services & Projects page
- [x] Verify lint + build pass

## Dev Notes

- Services already linked in Header nav (site.json: `/zh-tw/services`)
- Projects array empty → shows fallback with Contact link
- UX-DR29: Project sections not whole-block links

## References
- [Source: epics.md#L446-L483] — Story 1.5 acceptance criteria
- [Source: DESIGN.md#L248] — Project evidence block spec

## Dev Agent Record

### Completion Notes
- [x] `/zh-tw/services` statically generated
- [x] Deep-navy service Hero with 6 capability tags
- [x] Empty projects fallback with Contact link
- [x] `npm run build` passes

### File List
- `website/src/data/services.json`
- `website/src/app/[locale]/services/page.tsx`
