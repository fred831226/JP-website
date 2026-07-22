# Updated Architecture Review — Current Technology and Lean Scaffold

- Review date: 2026-07-22
- Reviewed artifact: `ARCHITECTURE-SPINE.md`, updated 2026-07-22
- Scope: Next.js App Router, Tailwind CSS 4, Vercel, static repository content/data, clean scaffold coherence and lean proportionality
- User decision respected: Tailwind CSS is adopted for V1

## Verdict

**ACTIONABLE FINDINGS — technically sound and substantially leaner, with three consistency/implementation issues to resolve before scaffolding.**

The central design is coherent: a clean official Next.js App Router project, Tailwind 4, repository JSON/TypeScript validated at build time, static route generation, small client islands for interactions, and normal Vercel deployment without a database or application backend. No additional framework is needed.

## Findings

### 1. [P1] Protect static rendering from catalog query-state access

AD-1 says repository-backed public routes must be statically generated, while AD-9 makes query parameters the filter authority. In current Next.js App Router, reading the Page `searchParams` prop opts that route into dynamic rendering. If a statically rendered Client Component calls `useSearchParams`, it must sit below a `Suspense` boundary or the production build fails. [Next.js layouts/pages search-parameter behavior](https://nextjs.org/docs/app/getting-started/layouts-and-pages#rendering-with-search-params) · [Next.js `useSearchParams`](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

**Required correction:** state the chosen static pattern explicitly:

- the catalog Server Page renders the complete Series-level dataset from repository files and does not read the Page `searchParams` prop;
- a small Client Component reads and writes query state;
- if it uses `useSearchParams`, wrap that client island in `Suspense` with a stable unfiltered/filter-loading fallback;
- alternatively, read `window.location.search` in client event/effect code when reactive hook behavior is unnecessary;
- never move filtering to a Route Handler, Server Action, database, or request-time server render for V1.

This preserves the intended static HTML while keeping share/reload/back-forward filter behavior.

### 2. [P1] Remove stale enterprise-model names that contradict the lean structure

The Design Paradigm and Structural Seed correctly removed release snapshots, adapters, DTOs, media graphs, and a separate SEO/design-system layer, but later sections still describe those removed concepts:

- the ER diagram still contains `CATALOG_RELEASE`, even though the source is now one validated `data/catalog.json` and AD-4 uses ordinary Git/Vercel releases;
- the ER diagram uses `APPLICATION`, while the adopted query/data term is `Purpose` (`purpose`);
- the Capability Map still points to `data/catalog`, `seo`, `design-system`, “domain DTOs,” and “media manifest,” none of which exist in the Structural Seed;
- the Stack Seed still says Zod validates “release invariants,” although custom release-manifest machinery was removed;
- the Consistency Conventions call governed data “versioned structured data,” which can be misread as retained snapshot/version infrastructure rather than files versioned by Git.

**Required correction:** align the diagram/map/table with the actual lean scaffold:

- remove `CATALOG_RELEASE` or rename it to the actual catalog root object only if that object truly exists in `catalog.json`;
- use `PURPOSE` consistently;
- map capabilities to `features/catalog`, `features/content`, `lib/content`, `lib/validation`, `styles`, `data/*.json`, and `public/media`;
- replace “release invariants” with catalog schema and cross-record checks;
- say “Git-versioned structured files” rather than implying an application-level versioning system.

Until corrected, an implementer could recreate the layers the revision deliberately removed.

### 3. [P2] Record the Tailwind 4 integration contract so the clean scaffold does not regress to v3 setup

Tailwind 4 is compatible with the proposed Next.js scaffold and should remain adopted. Its official Next.js setup uses `tailwindcss`, `@tailwindcss/postcss`, and `postcss`, a `postcss.config.mjs` entry for `@tailwindcss/postcss`, and `@import "tailwindcss"` in the global stylesheet. Tailwind 4 no longer uses the v3 `@tailwind` directives, and `autoprefixer`/`postcss-import` are not required by the standard v4 pipeline. [Tailwind Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs) · [Tailwind 4 upgrade guide](https://tailwindcss.com/docs/upgrade-guide)

**Required correction:** add a short scaffold note or acceptance criterion:

- use the official Tailwind 4 PostCSS setup generated/proven by the clean scaffold;
- import Tailwind once from the root global stylesheet loaded by `src/app/layout.tsx`;
- keep approved semantic JP PUMP CSS custom properties in the same global token layer;
- do not add a component library, headless library, separate CSS-in-JS system, `autoprefixer`, or legacy v3 configuration unless a measured need appears.

Also confirm the supported browser floor. Tailwind 4 targets Safari 16.4+, Chrome 111+, and Firefox 128+. If the project requires materially older browsers, that becomes a product compatibility decision rather than an implementation surprise. [Tailwind 4 browser requirements](https://tailwindcss.com/docs/upgrade-guide#using-the-upgrade-tool)

## Confirmed coherent decisions

- **Next.js App Router:** correct. Pages/layouts are Server Components by default; Client Components are appropriate only for browser state and interactions. [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- **Static dynamic routes:** correct. `generateStaticParams` can generate locale, taxonomy, and Series routes at build time. Use `dynamicParams = false` for governed route sets so unknown slugs become 404s instead of on-demand routes. [Next.js `generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- **Normal Vercel deployment instead of `output: 'export'`:** correct and appropriately lean. It retains redirects, headers, and default image optimization, which static export does not provide. [Next.js static-export limitations](https://nextjs.org/docs/pages/guides/static-exports) · [Vercel image optimization](https://vercel.com/docs/image-optimization)
- **No backend/database:** coherent. Repository imports/loaders are executed while generating pages; no API, ORM, CMS, authentication, server form, or runtime write path is required.
- **Vercel Preview/Production flow:** correct. Git branches/PRs produce previews; the production branch produces Production. Preview deployments receive `X-Robots-Tag: noindex` by default unless a custom domain changes that behavior. [Vercel Git deployments](https://vercel.com/docs/git) · [Preview indexing behavior](https://vercel.com/kb/guide/are-vercel-preview-deployment-indexed-by-search-engines)
- **Media in `public/media`:** coherent for current volume; `next/image` can serve local public assets through Vercel optimization. [Next.js public folder](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder) · [Vercel image optimization](https://vercel.com/docs/image-optimization)
- **Lean dependency boundary:** coherent. Next.js/React, Tailwind/PostCSS, Zod, and focused Playwright are sufficient. Do not add a state store, client-fetch cache, component framework, Markdown parser, or spreadsheet runtime package until the relevant implementation need is present.

## Clean scaffold acceptance checklist

The scaffold is technically ready when it demonstrates all of the following without additional framework layers:

1. Official Next.js App Router + TypeScript + ESLint + `src/` layout.
2. Official Tailwind 4 PostCSS setup and one global stylesheet containing the approved semantic tokens.
3. `/` permanently redirects to `/zh-tw/` through Next.js/Vercel-supported configuration.
4. `/zh-tw/`, taxonomy landings, and all governed Series slugs are build-time routes; unknown locale/taxonomy/Series slugs return 404.
5. Server-only catalog/content loaders validate repository files with Zod and return small typed page-ready values.
6. Catalog query filtering stays inside a Suspense-bounded client island and does not make the route request-time rendered.
7. `next build`, type/lint, schema checks, and focused Chromium smoke tests pass.
8. No Vinext, Vite, Cloudflare/Wrangler, Drizzle, database, API, CMS, auth, analytics, state store, or component framework is present.

After the three findings above are reconciled, this Architecture is sufficiently lean and technically coherent for implementation.

## Final recheck — 2026-07-22

**REMAINING BLOCKER — three technical findings passed; one scaffold-root contradiction remains.**

### Passed

- **Static query handling:** AD-9 now explicitly keeps the Server Page static, prohibits reading Page `searchParams`, and assigns query state to a small Client Component under `Suspense`. This matches current App Router behavior.
- **Stale concept cleanup:** the data diagram now uses `CATALOG` and `PURPOSE`; the Capability Map points to the actual lean folders/files; removed DTO, media-manifest, standalone SEO/design-system and release-invariant concepts no longer drive implementation.
- **Tailwind 4 contract:** the Stack Seed now names `@tailwindcss/postcss`, `postcss.config.mjs`, one global `@import "tailwindcss"`, CSS-first tokens, removal of legacy v3/autoprefixer setup, and the Tailwind 4 modern browser floor.
- **Vercel deployment contract:** AD-12 correctly states that the outer repository is authoritative, the nested repository boundary is removed in a reviewed migration, and Vercel Root Directory is configured as `website`.

### Remaining blocker

The **Structural Seed still starts at `JP-Website/src/`, `JP-Website/content/`, `JP-Website/data/`, and `JP-Website/public/`**, which contradicts AD-12's explicit implementation location and Vercel Root Directory of `website`.

Change the tree root to either:

```text
JP-Website/
  website/                 # Vercel Root Directory
    src/
    content/
    data/
    public/
    scripts/
    tests/
    docs/
```

or label the displayed tree as `JP-Website/website/` if only the application subtree is intended. This is not cosmetic: `package.json`, `next.config.*`, `postcss.config.mjs`, and the lockfile must live inside the directory Vercel builds. Once the tree matches AD-12, this review is **PASS**.

**Final confirmation — PASS:** Structural Seed now nests the clean Next.js application under `JP-Website/website/`, matching the Vercel Root Directory contract; no remaining blocker from this review.
