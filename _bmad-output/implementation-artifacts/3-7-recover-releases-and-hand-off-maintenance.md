---
baseline_commit: 843dd1b51cee8757d282b9f42f7a9abb9197215e
---

# Story 3.7: Recover Releases and Hand Off Maintenance

Status: in-progress

## Story

As a designated website maintainer,
I want documented rollback, recovery, and handoff procedures,
so that another qualified maintainer can safely operate the website and restore service.

## Acceptance Criteria

1. Given a known-good prior Vercel deployment, when an authorized rollback is performed, then the Production domain is restored atomically to that deployment, evidence identifies both restored and superseded deployments, and no database or partial-content restoration is attempted.
2. Given a rollback failure, when Vercel reports failure or an indeterminate result, then the current public state is not guessed, a safe verification/retry/escalation path is documented, and destructive Git operations are never used as a substitute.
3. Given Production readiness, when operations documentation is completed, then it covers content/catalog updates, validation, Preview, approval, promotion, rollback, domain/DNS, account ownership, MFA, recovery, environment isolation, media archive/rights backup, upgrades, and escalation; maintenance response times remain outside product behavior.
4. Given a maintainer handoff exercise, when a second qualified maintainer follows the documentation, then they can complete one non-product content update through Preview and identify Production and rollback steps without private relationships or undocumented local knowledge.
5. Given launch or a major ownership change, when recovery readiness is verified, then Git history, known-good Vercel deployments, domain configuration, account recovery ownership, off-device original-media/rights backup, commercially eligible Vercel plan, billing owner, Root Directory `website`, and purchased-domain ownership have verifiable records or explicit blocking gaps.

## Tasks / Subtasks

- [x] Add a guarded rollback contract and tests (AC: 1, 2)
  - [x] Write failing tests for authorization binding, immutable restored/superseded deployment identities, dry-run default, exact Vercel rollback command, CLI-version blocking, zero provider calls on precondition failure, and redacted indeterminate failure handling.
  - [x] Implement minimal rollback precondition validation and CLI/package entry point by extending the existing Story 3.6 release tooling; do not add a second release system.
  - [x] Require post-command provider/domain verification before a rollback can be recorded as successful; never claim an unchanged Production state from a provider error alone.
- [x] Complete the maintenance and recovery runbook (AC: 2, 3, 5)
  - [x] Document content and catalog update paths, validation, commit-bound Preview, JP PUMP approval, promotion, rollback, safe retry/escalation, and upgrade flow.
  - [x] Document domain/DNS, Vercel/Git/domain ownership, billing, MFA, account recovery, least privilege, Root Directory, Preview/Production isolation, and original-media/rights backup verification using evidence references or explicit blockers only.
  - [x] Record the current local/provider observations without treating repository configuration or architecture candidates as proof of external ownership, approval, backup, or account security.
- [x] Provide and evaluate the qualified-maintainer handoff exercise (AC: 4)
  - [x] Supply a transferable exercise record that captures maintainer qualification, non-product change, source commit, validation, immutable Preview, noindex/protection checks, approval/promotion/rollback identification, independent observations, and result.
  - [x] Record actual exercise evidence if a second qualified maintainer and required access are available; otherwise mark the acceptance criterion blocked without fabrication.
- [ ] Validate delivery and close only if every acceptance criterion is evidenced (AC: 1-5)
  - [x] Run focused release tests, documentation contract tests, governed content validation, lint, Next.js build, release tests, and the complete Playwright suite.
  - [x] Re-check Story-owned files against the pre-existing dirty-tree baseline and exclude all unapproved planning/specification changes from any commit.
  - [x] Update Story/Sprint to `done`, commit, push, create a commit-bound Preview, obtain JP PUMP approval, and promote/deploy only if all external evidence and authorization gates are satisfied; otherwise stop before commit/push/deploy and list blockers.

## Dev Notes

- Extend `website/scripts/release-contract.mjs`, `website/scripts/release.mjs`, and `website/tests/release/` rather than introducing a custom operational UI or unrelated provider abstraction.
- Keep rollback provider-native and deployment-wide. V1 has no database and no partial content restore path. Never use `git reset --hard`, checkout of selected files, force-push, or history rewriting as a deployment rollback.
- Vercel Instant Rollback points Production domains to an eligible prior Production deployment. Pro/Enterprise can choose among eligible deployments; rollback disables automatic Production-domain assignment until a later promotion exits rollback state. Treat environment/configuration drift as a verification concern because rollback restores a prior build rather than rebuilding with current settings.
- The current worktree already contains extensive uncommitted Story 2.8/3.6 delivery and authoritative planning changes. Preserve every existing change. Story 3.7 begins from `843dd1b51cee8757d282b9f42f7a9abb9197215e`; commit boundaries must be proven from the initial status inventory plus explicit Story file ownership.
- Locally observed on 2026-08-29: `.vercel/project.json` links project `prj_i5wRQZCh0hmNqt8Pxks1no8t7reh` in team `team_9rJVBUqJcVxwBsRvup30GTHx`; Vercel CLI 56.5.0 can authenticate as `fred831226`; project inspection reports Root Directory `.` rather than required `website`; no custom domains or environment variables were listed; two Ready Production deployments exist, but neither is proven known-good by commit-bound validation and JP PUMP approval. These observations are blockers/evidence inputs, not authorization to mutate Vercel.
- GitHub CLI authentication is invalid in this environment. Push and GitHub release evidence cannot be claimed until access is repaired.

### Project Structure Notes

- Operations documentation belongs under `website/docs/operations/`.
- Release implementation remains in `website/scripts/release-contract.mjs` and `website/scripts/release.mjs`; focused Node tests remain under `website/tests/release/`.
- No new dependency, CMS, backend, database, authentication, custom admin surface, or runtime write path is required.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-37-Recover-Releases-and-Hand-Off-Maintenance]
- [Source: _bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/prd.md#NFR-5-Security]
- [Source: _bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/prd.md#NFR-7-Availability-and-Recovery]
- [Source: _bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/prd.md#NFR-10-Release-Safety-and-Maintainability]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md#AD-14-V1-recovery-is-release-based-and-media-aware]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/EXPERIENCE.md#Maintainer-release-workflow]
- [Source: website/docs/operations/release.md]
- [Vercel Instant Rollback](https://vercel.com/docs/instant-rollback)
- [Vercel CLI rollback](https://vercel.com/docs/cli/rollback)

## Dev Agent Record

### Agent Model Used

GPT-5.6

### Debug Log References

- 2026-08-29: Initial dirty-tree baseline captured at `843dd1b51cee8757d282b9f42f7a9abb9197215e`.
- 2026-08-29: Local and read-only Vercel inspection found a linked project but Root Directory/domain/environment gaps; GitHub CLI authentication is invalid.
- 2026-08-29: Rollback contract tests failed first on the missing export, then all 29 release tests passed after implementation.
- 2026-08-29: Operations documentation tests failed first on missing runbooks, then all 31 release tests passed after the maintenance and recovery-readiness records were added.
- 2026-08-29: Handoff documentation test failed first on the missing exercise record, then all 32 release tests passed; the actual second-maintainer exercise remains explicitly blocked.
- 2026-08-29: Full checks passed: content validation (0 errors, 1 build reminder), lint (0 errors, 9 existing image warnings), Next.js build (36 static pages), release tests (32/32), and Playwright (32/32).
- 2026-08-29: Commit boundary review confirmed Story 3.7 overlaps pre-existing untracked Story 3.6 release files and a pre-modified package/sprint file. With acceptance blocked and planning/specification governance unresolved, no files were staged, committed, pushed, previewed, promoted, rolled back, or deployed.

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added an approval-bound, dry-run-first Vercel rollback command that identifies restored and superseded deployments and treats provider errors as indeterminate pending provider/domain verification.
- Added a transferable maintenance runbook and evidence-first readiness ledger covering release, rollback, DNS/domain, account/MFA/recovery, environment isolation, media backup, upgrades, and escalation without inventing external facts.
- Added a qualified-maintainer exercise contract and evaluated the current evidence as BLOCKED because no independent maintainer, immutable Preview, sign-off, or provider ownership evidence is available.
- Repository implementation and automated documentation contracts pass, but Story acceptance remains incomplete: no authorized rollback exercise, qualified second-maintainer exercise, commercially eligible plan/billing ownership proof, correct Vercel Root Directory, purchased domain/DNS ownership, account/MFA/recovery evidence, Preview/Production provider isolation evidence, or transferable off-device media/rights backup proof exists.
- Sprint remains `3-7: in-progress` and `epic-3: in-progress`; completion, commit, push, Preview, JP PUMP approval, Production promotion, and deployment are intentionally blocked.

### File List

- _bmad-output/implementation-artifacts/3-7-recover-releases-and-hand-off-maintenance.md
- website/package.json
- website/scripts/release-contract.mjs
- website/scripts/release.mjs
- website/docs/operations/maintenance.md
- website/docs/operations/recovery-readiness.md
- website/docs/operations/handoff-exercise.md
- website/tests/release/operations-documentation.test.mjs
- website/tests/release/release-contract.test.mjs

### Change Log

- 2026-08-29: Created Story 3.7 implementation context from authoritative Epic, PRD, architecture, UX, and Story 3.6 release tooling.
- 2026-08-29: Added guarded rollback preconditions, CLI execution boundary, and focused release tests.
- 2026-08-29: Added complete maintenance/recovery documentation and a verified-versus-blocked external governance ledger.
- 2026-08-29: Added the second-maintainer handoff exercise record and preserved its genuine BLOCKED result.
