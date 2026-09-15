---
name: 'JP-Website Epic 2 Review Reconciliation'
type: source-reconciliation
status: resolved
created: '2026-08-21'
architecture: './ARCHITECTURE-SPINE.md'
---

# Source Reconciliation — Epic 2 Review Corrections

This record preserves project-owner decisions made after Code Review of Epic 2 Stories 2.2–2.6 and commits `a53d701`, `9b2422e`, and `843dd1b`. It supplements rather than rewrites the resolved 2026-07-22 reconciliation.

## Approved requirement corrections

1. V1 publishes exactly 22 combined canonical Series pages and one Product Overview card for each canonical Series. The superseded 28-card/split-page assumption must not return.
2. Every V1 Series belongs to exactly one approved Pump Type. VBSG belongs only to `臥式泵`; V1 has no Series multi-type or Model-level Pump Type model.
3. `2CR(I,N) Booster` uses the project-owner-approved introduction and short description recorded in the PRD addendum.
4. The approved catalog baseline has internal reviewer `Fred`, internal review date `2026-08-21`, and public last-updated date `2026-08-21`. Public page data exposes only the last-updated date.

## Approved governance exception

The project owner confirmed that the public image set current on 2026-08-21 was licensed and approved and declined an additional per-image approval register. The existing set is not blocked solely for missing additional source/rights/approval metadata. Alt text, file existence, loadability, content relationships, and accessibility remain release requirements. Future additions or replacements follow the normal media-governance rule.

## Planning and implementation effect

- The PRD, addendum, Architecture Spine, Experience spine, canonical product-series SPEC, and Epic requirements apply these corrections.
- Epic 2 Story 2.8 owns the unresolved Code Review remediation. Existing Story 2.2–2.6 records are not backfilled or treated as accepted.
- Unknown Brand or Series values, non-numeric ranges, unit mismatches, and incomplete or duplicate canonical-Series grouping fail closed and report the exact source location.
- Epic 2 remains in progress; related Stories must not become done before remediation implementation and a new passing Code Review.
- No website code, product data, tests, Preview evidence, or Sprint status is changed by this reconciliation.
