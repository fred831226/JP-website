# Test Automation Summary

**Project:** JP-Website  
**Date:** 2026-07-24  
**Framework:** Playwright 1.61.1 (`npm test`)  
**Scope:** Auto-discovered public UI against Epic 1–2 acceptance criteria (+ Epic 4 lean checks)  
**Command result:** `npx playwright test` → **48 passed** (13.1s), including 4 expected `test.fail` gaps

## Generated Tests

### API Tests
- [x] N/A — V1 has no public application API / management endpoints

### E2E Tests
- [x] `tests/e2e/smoke.spec.ts` — Locale shell, core routes, 404 status
- [x] `tests/e2e/navigation.spec.ts` — Story 1.2 header/menus/mobile/footer
- [x] `tests/e2e/home-trust.spec.ts` — Stories 1.3–1.6 / 2.7 Home + trust + contact
- [x] `tests/e2e/catalog-browse.spec.ts` — Stories 2.2–2.3 overview + filters
- [x] `tests/e2e/series-detail.spec.ts` — Stories 2.4–2.6 Series / models / media
- [x] `tests/e2e/discoverability.spec.ts` — Epic 4 robots / sitemap / JSON-LD / 404

## Coverage

| Area | Covered | Notes |
| --- | --- | --- |
| Public routes (Home, Products, Series, Company, Partners, Services, Contact, Brands, Types) | Yes | Smoke + story suites |
| Navigation AC (order, About children, mobile, footer) | Partial | Menu order gap tracked |
| Home discovery (CTA, quick filter, gateways, omit News/Projects) | Yes | |
| Contact (no form; omit null tel/mailto) | Yes | Approved phone/email still null in `contact.json` |
| Catalog filter / URL restore / empty state | Yes | |
| Series key data + suitability note | Yes | |
| Model table row counts (12 / 491) | Yes | Spec value mapping gap tracked |
| Image dialog + Contact continuation | Yes | |
| robots.txt / sitemap.xml / Organization JSON-LD | Yes | |
| Locale-shelled 404 copy | Gap | Default Next English 404 |
| API endpoints | 0/0 | None in V1 |
| UI story surfaces (Epic 1–2 primary) | ~12/14 interactive ACs exercised | 4 known gaps annotated |

**Approximate UI feature coverage:** core public workflows ~85%; remaining gaps are content approval (Partners/Projects/Contact facts) or tracked defects below.

## Requirement gaps found by tests (`test.fail`)

1. **Story 1.2** — Product menu puts `全部產品` first; AC requires it last.
2. **Story 2.1 / 2.4** — `/zh-tw/series/y-series` 404s because `getSeries()` matches `id` not locale `slug` (cards link to slug).
3. **Story 2.5** — Model table reads `specs.head|flow|power` but generated catalog provides `rated_head_m` / `rated_flow_lmin` → cells show `未提供`.
4. **Epic 4** — Unmatched `/zh-tw/*` paths use Next.js default English 404 without Header/Footer / `找不到此頁面`.

## Checklist

- [x] API tests generated (if applicable) — N/A
- [x] E2E tests generated
- [x] Standard Playwright APIs
- [x] Happy path covered
- [x] Critical error cases (404, empty filter, empty projects/partners)
- [x] All generated tests run successfully (expected fails annotated)
- [x] Semantic / accessible locators
- [x] Clear descriptions
- [x] No hardcoded sleeps
- [x] Independent tests
- [x] Summary created
- [x] Tests under `tests/e2e/`
- [x] Coverage metrics included

## Next Steps

- Fix the four annotated product gaps, then flip corresponding `test.fail` assertions to normal expects.
- After approved Contact phone/Email land in `contact.json`, add positive `tel:` / `mailto:` action tests.
- Add CI job running `npm test` against Preview.
- For risk-based / NFR depth, consider BMad Test Architect (TEA).
