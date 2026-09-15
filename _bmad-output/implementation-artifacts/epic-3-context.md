# Epic 3 Context: Govern and Release Trustworthy Content

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Enable a designated maintainer to update every V1 public content type through one traceable, repeatable, version-controlled workflow. Content, catalog data, media, routes, metadata, and sitemap must be validated as one repository state, reviewed in a commit-bound Vercel Preview, approved by JP PUMP, promoted atomically, and recoverable to a prior known-good deployment. This protects the site's central trust promise: public claims, technical specifications, relationships, and evidence are approved, consistent, and reproducible rather than copied across pages or published piecemeal.

## Stories

- Story 3.1: Maintain One Authoritative Content Source
- Story 3.2: Promote Approved Media Safely
- Story 3.3: Import and Reconcile the Excel Catalog
- Story 3.4: Validate Content and Technical Release Readiness
- Story 3.5: Verify Public Release Quality
- Story 3.6: Preview, Approve, and Promote One Atomic Release
- Story 3.7: Recover Releases and Hand Off Maintenance

## Requirements & Constraints

- Git is the sole V1 publication authority for Company, Services/Projects, Partners, Contact, Hero, taxonomy, catalog, redirects, media references, routes, and SEO state. JSX, raw spreadsheets, source documents, local folders, external drives, and Preview deployments are inputs or views, never parallel public authorities.
- V1 uses existing Git and Vercel interfaces. Do not create a CMS, database, ORM, authentication, admin UI, content editor, media picker, management API, runtime write path, job queue, or permanent browser-based Excel intake.
- Public content is Traditional Chinese under `/zh-tw/`. News and individual Project detail routes are absent. Projects remain approved evidence within Services & Projects; Brand and Purpose remain catalog metadata/filters rather than standalone pages.
- Structured public content uses schema-validated JSON by default; non-executable Markdown is allowed only for explicitly useful long prose. Invalid records fail closed with actionable source locations. Unpublished, internal, sensitive, unsupported, or technically unreviewed fields must not reach public page data.
- Every candidate release must validate types, lint, build, schemas, required fields, stable ID and slug uniqueness, technical values and units, relationships, media, links, redirects, sitemap, and environment configuration. Reports identify source file, record, field, rule, and affected public surface where applicable, while logs exclude secrets, source documents, content bodies, and contact data.
- Public quality gates cover core navigation, catalog filter normalization and empty states, image enlargement, missing-value rendering, and the approximately 491-row Series risk fixture. Launch and major UI changes additionally require mobile and 320px containment, keyboard/focus, screen-reader essentials, reduced motion, useful 404, Preview isolation, Safari, production-shaped performance, dependency risk, and security-header review. Mandatory failures block promotion.
- Preview evidence identifies the source commit/deployment, validation outcome, added/changed/removed content, affected pages, and non-indexable URL. Preview must be visibly distinct from Production and access-protected when it contains unapproved evidence. Approval is tied to a named source commit.
- Promotion replaces Production with one complete approved deployment; content, catalog, media, routes, redirects, metadata, and sitemap change together. A failed validation, build, or promotion leaves the previous Production deployment active. Removal or archival requires another reviewed commit plus an explicit nearest-target redirect or correct not-found handling.
- Preserve Git history, known-good Vercel deployments, domain/account recovery information, and an independently backed-up private archive of original media and rights evidence. Rollback restores a complete deployment, never selected files or a partial content state.

## Technical Decisions

- The public application is a static-first Next.js App Router site deployed normally on Vercel with Root Directory `website`. Server Components and static generation are the default. Small typed server-only loaders validate repository files and return explicit page-ready data; routes never parse raw Excel or unpublished evidence.
- Governed data uses stable string IDs independent of labels and locale slugs. Relationships store IDs. Missing technical values remain `null` and render as `未提供`; zero must be reviewed. Decimal values are strings paired with governed unit enums. Internal reviewer identity, evidence, disposition, and publication state do not enter public projections.
- The Excel importer fully regenerates only importer-owned technical fields in `catalog.generated.json`. Manual stable IDs, slugs, taxonomy mappings, approved copy, and image references remain in `catalog-content.json`. Reconciliation joins both sources by stable Series/Model keys and fails on duplicates, missing/orphaned keys, unknown Brand/Series values, invalid ranges, unit mismatches, or incomplete canonical grouping. Failure leaves the current generated file unchanged; a no-change import is a no-op.
- The catalog contains exactly 22 canonical Series; every source Model belongs to exactly one Series and is rendered as a row, not a detail route. Reviewed batches may publish independently. Pump Type intake initially uses Excel main-sheet column G, never the old `用途` column, and still requires technical review.
- Only approved, optimized derivatives enter `public/media`; originals remain private. New media requires useful filenames plus applicable alt, source, rights, approval, and content-relationship metadata. The public image set confirmed on 2026-08-21 is exempt only from an additional per-image source/rights/approval inventory; alt, existence, loadability, relationship, and accessibility checks still apply. AI atmosphere cannot serve as Project evidence, and AI product imagery requires specification review.
- Production is an immutable deployment tied to one reviewed commit. Environment secrets are isolated, browser-exposed variables use an allowlist, Preview and Development are non-indexable, and release logs are structured and redacted. No runtime revalidation or database recovery exists in V1.

## UX & Interaction Patterns

- Operational work remains in Git, validation output, and Vercel; do not build or skin custom publishing controls as part of the public design system.
- Validation and intake feedback must be factual and actionable: distinguish added, changed, removed, duplicate, missing, insufficient, and excluded records; name the exact failure and affected page; preserve the previous valid source on failure.
- Preview, promotion, and rollback states must clearly identify the relevant commit/deployments and whether the surface is Preview or Production. Rejection creates a corrected, newly validated Preview; failed promotion or rollback presents a safe retry/escalation path without changing the active public deployment.

## Cross-Story Dependencies

The authoritative source model and media-promotion rules establish what can be released. Excel intake depends on stable catalog identities and manual/generated ownership boundaries. Readiness validation consumes all governed sources and blocks creation of an invalid Preview; public-quality verification then exercises the built candidate. Atomic promotion requires both gate sets plus JP PUMP approval tied to the exact commit. Recovery and handoff depend on preserved Git/deployment history, documented account/domain ownership, media backup, and evidence that a second qualified maintainer can execute the same workflow.
