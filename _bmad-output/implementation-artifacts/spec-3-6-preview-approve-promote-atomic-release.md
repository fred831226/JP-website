---
title: 'Story 3.6 Preview, Approve, and Promote One Atomic Release'
type: 'feature'
created: '2026-08-28'
status: 'done'
review_loop_iteration: 1
baseline_commit: '843dd1b51cee8757d282b9f42f7a9abb9197215e'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repository can validate and build the site, but it does not yet bind a Preview, approval, and Production promotion to one named commit or expose safe, reviewable release evidence. Preview deployments are also indistinguishable from Production and currently remain indexable.

**Approach:** Add a repository-owned release contract and guarded CLI that records commit-bound evidence, rejects mismatched or failed approvals before any Vercel command, and promotes only on an explicit execute flag. Add Preview isolation/identity, removal treatment, CI gates, and a maintainer runbook while leaving Vercel account settings and live deployment actions human-controlled.

## Boundaries & Constraints

**Always:** Preserve the complete repository commit as the atomic unit; require all gates to pass; tie Preview deployment, approval, and promotion to the same source commit; keep Preview non-indexable and visibly distinct; leave Production unchanged on local validation or promotion-precondition failure; produce redacted actionable evidence; preserve existing Story 2.8 release-pointer work.

**Ask First:** Any real Vercel promotion, rollback, GitHub/Vercel account configuration, branch-protection change, commit, push, or production-domain action.

**Never:** Add CMS/backend/database/auth/runtime writes; expose tokens, contact data, source content bodies, or approval secrets; publish from a dirty working tree; auto-promote merely because a build passed; treat a branch URL as immutable approval evidence; create News, Project-detail, Brand, or Purpose routes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Evidence ready | Clean commit, passed gates, immutable Preview URL/deployment | JSON records source commit, A/C/D changes, affected routes, gates, Preview and rollback target | Reject missing, malformed, indexable, or branch-only Preview identity |
| Approval valid | Evidence commit equals approved commit and current HEAD | Promotion is eligible; dry-run prints the exact Vercel target | No Vercel call unless explicit execute flag is supplied |
| Approval/gate mismatch | Commit mismatch, dirty tree, failed gate, rejected approval, or missing rollback target | Exit nonzero with retry/escalation guidance | Production command is never invoked |
| Content removed | Removed/archived public route | Evidence requires governed nearest-target redirect or explicit not-found treatment | Untreated removal blocks promotion |
| Preview request | `VERCEL_ENV=preview` | Visible Preview banner plus robots/header `noindex, nofollow`; no Production sitemap declaration | Unknown/development environment fails safe as non-indexable |

</frozen-after-approval>

## Code Map

- `website/scripts/release-contract.mjs` -- pure evidence, change classification, removal, approval, and promotion-precondition rules.
- `website/scripts/release.mjs` -- CLI for evidence generation and guarded dry-run/explicit Vercel promotion.
- `website/tests/release/release-contract.test.mjs` -- real fixture-based contract tests, including zero external calls on failure.
- `website/src/lib/deployment-environment.ts` -- server-only Preview/Production classification.
- `website/src/components/PreviewBanner.tsx` -- accessible non-Production identity banner.
- `website/src/app/[locale]/layout.tsx` -- renders the environment banner.
- `website/src/app/robots.ts` and `website/next.config.ts` -- fail-safe Preview indexing controls and governed redirects.
- `website/data/redirects.json` -- version-controlled removal redirect authority.
- `website/data/not-found-routes.json` -- version-controlled explicit not-found authority for reviewed route removals.
- `website/playwright.config.ts` and `website/tests/e2e/story-3-6.spec.ts` -- built-artifact CI behavior and non-Production indexing checks.
- `.github/workflows/release-gates.yml` -- commit-bound validation/build/test gate and evidence artifact.
- `website/docs/operations/release.md` -- Preview protection, approval, promotion, failure, removal, and escalation procedure.
- `website/package.json` -- focused release contract/evidence/promotion commands.

## Tasks & Acceptance

**Execution:**
- [x] Write failing release-contract tests for evidence completeness, route classification, commit/approval equality, dirty/failed-gate blocking, explicit execution, and removal treatment.
- [x] Implement the pure release contract and guarded CLI; keep promotion dry-run by default and inject command execution for tests.
- [x] Add failing environment tests, then implement Preview banner and non-indexing behavior without exposing arbitrary environment values.
- [x] Add governed redirects, CI release gates, package commands, and the operational runbook.
- [x] Run focused tests, repository validation, lint, production build, and relevant Playwright coverage; record external Vercel checks that remain manual.

**Acceptance Criteria:**
- Given a passing candidate commit, when evidence is generated, then it identifies the immutable Preview/deployment, source commit, validation result, added/changed/removed content, affected public routes, and rollback target without sensitive content.
- Given Preview or Development, when the site is built, then it is visibly non-Production and sends fail-safe noindex controls; Production remains indexable.
- Given approval and promotion, when preconditions are checked, then approved commit, Preview source commit, current clean HEAD, passed gates, and rollback target must agree before the exact deployment can be promoted.
- Given any failed or mismatched precondition, when the CLI ends, then it exits nonzero, provides retry/escalation guidance, and performs zero promotion calls.
- Given removed or archived public content, when promotion is prepared, then a reviewed redirect or explicit correct-not-found treatment is mandatory and the prior Production deployment remains the rollback target.

## Verification

**Commands:**
- `npm --prefix website run test:release` -- 24 Story 3.6 contract cases pass.
- `npm --prefix website run validate` -- governed content and release inputs pass.
- `npm --prefix website run lint` -- no new lint errors.
- `VERCEL_ENV=preview npm --prefix website run build` -- Preview-shaped production build succeeds with 36 static pages.
- `npm --prefix website test` against that build -- 32 existing and Story 3.6 public checks pass.

**Manual checks (if no CLI):**
- In Vercel, confirm Root Directory `website`, Standard Deployment Protection for Preview, required Git checks, immutable commit Preview identity, Production branch/domain ownership, and a known-good rollback target before any live promotion.

## Suggested Review Order

**Atomic release contract**

- Start with provider-derived evidence and the guarded promotion entry points.
  [`release.mjs:186`](../../website/scripts/release.mjs#L186)

- Review approval, commit, gate, rollback, and evidence-digest binding.
  [`release-contract.mjs:316`](../../website/scripts/release-contract.mjs#L316)

- Confirm removed routes require governed redirect or explicit not-found treatment.
  [`release-contract.mjs:227`](../../website/scripts/release-contract.mjs#L227)

**Preview safety and crawlability**

- Verify unknown environments fail closed and Preview headers remain non-indexable.
  [`next.config.ts:4`](../../website/next.config.ts#L4)

- Confirm the visible non-Production identity is concise and accessible.
  [`PreviewBanner.tsx:3`](../../website/src/components/PreviewBanner.tsx#L3)

- Check catalog content remains server-rendered for crawlable release validation.
  [`CatalogBrowser.tsx:16`](../../website/src/components/CatalogBrowser.tsx#L16)

**Automation and operations**

- Follow the commit-bound GitHub gate and immutable evidence artifact flow.
  [`release-gates.yml:1`](../../.github/workflows/release-gates.yml#L1)

- Review human approval, dry-run, failure, and escalation instructions.
  [`release.md:17`](../../website/docs/operations/release.md#L17)

**Verification**

- Inspect contract coverage for zero-call failures and explicit promotion.
  [`release-contract.test.mjs:370`](../../website/tests/release/release-contract.test.mjs#L370)

- Confirm built Preview banner, header, and robots behavior end to end.
  [`story-3-6.spec.ts:8`](../../website/tests/e2e/story-3-6.spec.ts#L8)
