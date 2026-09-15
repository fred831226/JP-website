---
baseline_commit: 95762987880cf7ecc49a9356c3cefad86a8f43f2
---

# Story 1.4: Verify Company and Partners

Status: review

## Story

As a procurement decision-maker,
I want approved company and partner information,
So that I can verify JP PUMP's identity and commercial relationships.

## Acceptance Criteria

1. Company Information page shows traceable legal name, founding year, history, approved facts, and contact details. Unavailable facts omitted.
2. Partners page shows each partner in vertical sequence with logo + 3-4 sentence description. Wide: logo beside content. Narrow: stacked center.
3. Confirmed official URL → labelled `拜訪網站` button. No URL or unconfirmed → no button.
4. Unapproved partner claims/logos → partner not published.
5. Keyboard, touch, 320px: headings, landmarks, links, focus, targets, alt text meet WCAG 2.2 AA.

## Tasks / Subtasks

- [x] Create `src/data/company.json` with governed company data (AC: 1)
- [x] Create `src/data/partners.json` with governed partner records (AC: 2, 4)
- [x] Create `src/app/[locale]/company/page.tsx` — Company Information page (AC: 1)
- [x] Create `src/app/[locale]/partners/page.tsx` — Partners page (AC: 2, 3)
- [x] Verify lint + build pass

## Dev Notes

- Company data is `null` for unapproved values → omitted from render
- Partners data is empty array → shows "尚無已核准的合作夥伴資訊。" fallback
- UX-DR28: Partners are single vertical sequence, wide=horizontal, narrow=stacked
- All company/partner values must come from JP PUMP approval before production

## References
- [Source: epics.md#L411-L443] — Story 1.4 acceptance criteria
- [Source: epics.md#L203-L204] — UX-DR28 partner block
- [Source: DESIGN.md#L247] — Partner block component spec

## Dev Agent Record

### Completion Notes
- [x] `/zh-tw/company` statically generated
- [x] `/zh-tw/partners` statically generated
- [x] Missing data omitted (null → not rendered)
- [x] `npm run build` passes (SSG all routes)

### File List
- `website/src/data/company.json`
- `website/src/data/partners.json`
- `website/src/app/[locale]/company/page.tsx`
- `website/src/app/[locale]/partners/page.tsx`
