# JP-Website Agent Guide

This file is the shared project instruction for coding and review agents. It applies to the entire repository unless a deeper `AGENTS.md` adds directory-specific rules.

## Mission

Build JP PUMP's public, Traditional Chinese, industrial B2B website. The V1 experience must help professional buyers find, understand, trust, and contact JP PUMP through approved evidence and readable product specifications.

Communicate with the project owner in Traditional Chinese unless another language is requested. Keep code identifiers and established technical terms in English.

## Sources of truth

Read the documents relevant to the task before making decisions:

- Product scope and requirements: `_bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/prd.md` and `_bmad-output/planning-artifacts/prds/prd-JP-Website-2026-07-20/addendum.md`
- Technical decisions: `_bmad-output/planning-artifacts/architecture/architecture-JP-Website-2026-07-21/ARCHITECTURE-SPINE.md`
- Reconciled scope: `_bmad-output/planning-artifacts/architecture/architecture-JP-Website-2026-07-21/SOURCE-RECONCILIATION-LEAN-2026-07-22.md`
- Visual contract: `_bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/DESIGN.md`
- Interaction and responsive behavior: `_bmad-output/planning-artifacts/ux-designs/ux-JP-website-2026-07-21/EXPERIENCE.md`
- Delivery order and acceptance criteria: `_bmad-output/planning-artifacts/epics.md`

Finalized PRD, architecture, reconciliation, UX, and epic documents are authoritative. Files under review or polish folders are supporting evidence, not replacement decisions. If authoritative documents genuinely conflict, report the exact conflict instead of inventing a resolution.

Treat planning artifacts as read-only during implementation or validation unless the task explicitly asks to change requirements or planning.

## Repository boundaries

- The repository root is the sole Git repository.
- `website/` is the deployable application and the intended Vercel Root Directory.
- `_bmad-output/planning-artifacts/` contains product, architecture, UX, and delivery contracts.
- Do not create a nested Git repository or commit generated build output, credentials, local environment files, or private source media.
- Preserve unrelated working-tree changes. Never discard or rewrite another agent's work without explicit approval.

## Current transition state

`website/` is still a Vinext/Vite/Cloudflare/Drizzle starter with an approved visual prototype. It is legacy transition code, not the target architecture.

Epic 1, Story 1 replaces that runtime with a clean official Next.js App Router application in the same `website/` directory. Preserve approved visual and interaction behavior as reference, but do not extend or reintroduce Vinext, Vite, Cloudflare/Wrangler, Drizzle, a database, or starter authentication features.

Until that migration is completed, distinguish planned architecture gaps from new regressions in every review.

## Locked V1 boundaries

- Use Next.js App Router, TypeScript, React, Tailwind CSS 4, and normal Vercel deployment.
- Prefer Server Components and static generation. Use small Client Components only for real browser state or interaction.
- Keep public content and governed data in version-controlled, schema-validated repository files.
- V1 has no CMS, database, ORM, authentication, admin UI, management API, runtime writes, server-side contact form, analytics, RUM, or application backend.
- Publish only Traditional Chinese routes under `/zh-tw/`; do not create placeholder or machine-translated `/en/` pages.
- Do not add News, individual Project detail routes, arbitrary indexable filter pages, or Model detail pages.
- Contact uses approved `tel:` and `mailto:` actions. Optional LINE, hours, FAQ, or map content appears only when approved.
- Never invent product values, claims, partner relationships, project evidence, contact details, translations, images, rights, or approvals.
- Missing technical values remain `null` in governed data and render as `未提供`; never infer or zero-fill them.
- Keep stable IDs independent from mutable display names and slugs.
- Maintain accessibility, keyboard operation, responsive behavior, crawlable links, canonical routes, metadata, and performance requirements from the PRD and UX contracts.
- Add dependencies or architectural layers only for a demonstrated requirement. Do not introduce a second UI framework, state store, client-fetch cache, or speculative provider abstraction.

## Implementation workflow

1. Read this file and the task's acceptance criteria in `epics.md`.
2. Inspect the current code and Git status before editing.
3. Implement the smallest complete story-aligned change.
4. Validate content/schema boundaries before rendering changes.
5. Run focused checks, then lint, build, and relevant tests.
6. Report the commands run, their actual outcomes, known baseline debt, and any remaining risks.

Do not claim a check passed when it was skipped, unavailable, or failed. Do not commit or push unless the user explicitly requests it.

## Current commands

Run from the repository root:

```powershell
npm --prefix website run lint
npm --prefix website run build
npm --prefix website test
```

The current `test` script builds and then checks rendered HTML from the old starter. Its two skeleton assertions are stale after the approved prototype replacement and are known to fail. This is baseline debt, not permission to ignore new failures. Replace or update these tests as part of the clean scaffold migration, then update this section to the final package-manager and verification commands.

## Validation and review mode

When asked to validate or review:

- Default to read-only analysis; do not edit, commit, or push unless explicitly asked.
- Review requirements and architecture alignment before style preferences.
- Present findings first, ordered by severity, with exact file and line evidence plus the violated requirement.
- Separate known planned migration gaps from regressions introduced by the reviewed change.
- Check scope creep, invented content, data integrity, accessibility, responsive behavior, SEO/indexing, security/privacy, and release checks.
- State clearly when no actionable findings are found, and list any tests or environments that were not verified.

## Maintaining this guide

Keep this file concise and project-specific. Update it whenever the application boundary, package manager, commands, target architecture, or verification baseline changes. Add nested `AGENTS.md` files only when a subtree needs genuinely different rules; do not duplicate this file wholesale.
