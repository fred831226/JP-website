---
title: 'Epic 2 Stories 2.2–2.6 Sprint Change Proposal'
type: sprint-change-proposal
status: approved
created: '2026-08-21'
approved: '2026-08-21'
scope: moderate
approach: direct-adjustment
---

# Epic 2 Stories 2.2–2.6 Sprint Change Proposal

## 1. Issue Summary

Code Review of commits `a53d701`, `9b2422e`, and `843dd1b` found both superseded planning assumptions and incomplete implementation of existing Epic 2 acceptance criteria. The project owner approved 22 combined canonical Series instead of the feature spec's 28-card/split-page assumption, confirmed VBSG belongs only to `臥式泵`, supplied approved `2CR(I,N) Booster` copy and technical-review facts, and accepted a governance exception for the current public image set.

The same review found unresolved catalog interaction, accessibility, data-integrity, unit, grouping, Series-page, Pump-Type-page, image-dialog, and Model-table gaps. Commits, tests, a `done` feature spec, or currently passing checks do not independently prove acceptance.

## 2. Impact Analysis

### Epic and Story impact

- Epic 2 remains viable and in progress.
- Stories 2.2–2.6 must not be marked done from historical evidence.
- A new Story 2.8 owns the remediation and new acceptance evidence.
- Epic 3 import, validation, and media-governance contracts receive aligned clarification; no new Epic is required.

### Artifact conflicts

| Artifact | Old assumption | Approved correction |
| --- | --- | --- |
| PRD/Addendum | Approximately 10 Series; VBSG cross-type | 22 combined canonical Series; VBSG only `臥式泵` |
| Architecture | Series-to-Pump-Type many-to-many; approximately 10 canonical pages | Exactly one Pump Type per Series; exactly 22 canonical pages |
| Experience | VBSG reachable from every Pump Type with optional Model-level type | VBSG only from `臥式泵`; no multi-type model |
| Four-type implementation spec | 28 public cards created by splitting 22 source Series | 22 canonical cards and routes; no split pages |
| Media governance | Per-image source/rights/approval metadata blocks all missing records | Narrow exception for the public image set current on 2026-08-21 |

### MVP and technical impact

The V1 goal and route model remain unchanged. Required implementation work is moderate and concentrated in catalog completeness, filter state synchronization, unit integrity, accessibility, and release validation. No rollback, backend, CMS, database, or new data-model layer is justified.

## 3. Recommended Approach

Use **Direct Adjustment** with **Moderate** scope:

1. Reconcile authoritative planning artifacts.
2. Add Epic 2 Story 2.8 for all unresolved review findings.
3. Implement Story 2.8 without backfilling old Story evidence.
4. Run focused validation and a new Code Review.
5. Change Sprint status only after the actual acceptance result is known.

Potential rollback is rejected because the 22-Series merge is the approved product requirement. MVP review is unnecessary because the correction does not alter V1 goals.

## 4. Detailed Change Proposals

### Canonical Series model

**OLD:** approximately 10 Series in planning; 28 public cards in the four-type implementation spec; VBSG used as a cross-type example.

**NEW:** exactly 22 combined canonical Series, exactly one Product Overview card and route per canonical Series, exactly one Pump Type per Series, and VBSG only in `臥式泵`. Every source Model must belong to exactly one canonical group.

### Technical review and approved copy

- Public last-updated date: `2026-08-21`.
- Internal reviewer: `Fred`.
- Internal review date: `2026-08-21`.
- Public output excludes reviewer identity and internal review evidence.
- Approved `2CR(I,N) Booster` short description and introduction are recorded in the PRD addendum and bound by Story 2.8.

### Media exception

The public image set current on 2026-08-21 does not require an additional per-image approval register and is not blocked solely for missing additional source/rights/approval metadata. Alt text, file existence, loadability, content relationships, and accessibility still apply. Future additions and replacements follow the normal rule.

### Review remediation

Story 2.8 requires:

- four-field key data and the approved Series-page reading order;
- public update date and private reviewer data;
- immediate search with input/URL/result agreement;
- programmatic selected state, result count, and polite live announcements;
- actionable Contact empty states;
- image-dialog failure, focus-return, and 44×44 controls;
- fail-closed import and validation for unknown or non-numeric data;
- correct HP/kW unit handling;
- multiple Brand query reset to all;
- race-safe rapid filter changes;
- Product Overview classification labels;
- complete canonical grouping validation;
- complete shared Pump Type cards and recovery links;
- a labelled bounded horizontal Model-table region and visible scroll cue.

The complete Given/When/Then acceptance criteria live in `epics.md` Story 2.8.

## 5. Implementation Handoff

### Classification

**Moderate:** backlog reorganization and coordinated Product Owner/Developer/Reviewer handoff are required, but no fundamental replan or architecture replacement is needed.

### Responsibilities

- **Product Owner / PM:** owns this approved requirement correction and any future scope change.
- **Developer:** implements only the Story 2.8 scope after its formal work item is created.
- **Reviewer:** verifies each Story 2.8 AC against implementation and release evidence; historical commits or tests are insufficient by themselves.

### Success criteria

- Authoritative artifacts agree on 22 canonical Series and single Pump Type classification.
- Story 2.8 remediation is implemented without silent data loss or unit mislabelling.
- Focused checks and a new Code Review pass.
- Only then may related Sprint statuses be reconsidered.

## 6. Status Guidance

- Keep Epic 2 `in-progress`.
- Keep Stories 2.2–2.6 in `review`.
- Add Story 2.8 as `backlog` only through the normal Sprint-planning action; this proposal does not modify `sprint-status.yaml`.
- Do not create retrospective Story files, Preview approvals, acceptance records, or completion evidence for past work.

## 7. Remaining Decisions

None. The project owner approved this proposal on 2026-08-21. The current-media exception is intentionally limited to the public image set current on that date; future additions and replacements retain normal governance.
