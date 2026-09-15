---
name: 'JP-Website Architecture Source Reconciliation'
type: source-reconciliation
status: resolved
created: '2026-07-22'
architecture: './ARCHITECTURE-SPINE.md'
---

# Source Reconciliation — Confirmed Lean V1 Scope

This file records user-confirmed decisions made during Architecture Review on 2026-07-22. The Architecture Spine, PRD/addendum, UX spines, and key-screen coverage now apply these decisions consistently.

## PRD changes required

| Existing area | Required reconciliation |
| --- | --- |
| FR-5 and FR-19 — Latest Information/News | Remove from V1, including listing/detail, publishing and home-page references. Record as deferred rather than silently deleting product history. |
| FR-4 and FR-20 — Project content | Amend V1 to show approved Project summaries/evidence within Services & Projects. Remove the requirement for individual Project detail routes and per-item publishing. |
| FR-9 — taxonomy landing pages | Keep Pump Type landing pages in V1. Brand and Purpose remain governed metadata and Product overview filters, but no longer have standalone public routes. |
| FR-17 and FR-34..FR-36 — attribution, analytics and consent | Defer GA4, contact attribution, consent tooling and related analytics acceptance criteria beyond V1. Direct contact links remain. |
| FR-18 and FR-21 — authority/media wording | Remove News references and simplify media governance to approved optimized files plus alt/source/rights metadata; no media entity graph is required. |
| NFR-1 — real-user measurement wording | Keep the Core Web Vitals targets as launch-quality goals, but remove the V1 dependency on RUM/GA4. Use prelaunch lab checks and Vercel data only if available without adding the deferred analytics stack. |
| NFR-5 and NFR-6 — analytics accounts/consent | Remove GA4 account, cookie and non-essential analytics obligations from V1 while keeping HTTPS, MFA, least privilege and privacy-safe direct contact behavior. |
| NFR-7 — SLA/RTO | Replace the formal 99.9%/4-hour product guarantee with best-effort Vercel availability, documented rollback and clear account/domain recovery ownership. Any contractual response target belongs in a maintenance agreement. |
| NFR-8 and NFR-10 — release test breadth | Keep standards-based responsive/accessibility support, but require focused automated Chromium smoke plus manual mobile/keyboard/Safari checks before launch or major UI changes rather than a full browser matrix on every change. |
| NFR-9 — monitoring | Defer RUM, external uptime and major frontend-error providers. Keep deployment failure visibility, broken-link checks, useful Vercel diagnostics and postlaunch Search Console if connected. |
| Deployment assumptions | State clean Next.js App Router + Tailwind on Vercel, no database/backend, and `/zh-tw/` retained. |
| Repository/application location | State that the outer `JP-Website` repository is authoritative, the clean application lives in `/website`, the nested repository boundary is removed during implementation, and Vercel Root Directory is `website`. |

## UX changes required

- Remove Latest Information/News from information architecture, navigation, home-page modules and page inventory.
- Treat Project cards/evidence as content within Services & Projects; do not design a Project detail route for V1.
- Keep the Pump Type landing-page flow; route Brand and Purpose exploration through Product overview filters without standalone Brand or Purpose pages.
- Remove analytics/attribution/consent behavior from V1 interaction contracts.
- Remove Latest Information from navigation and revise any service/project interactions that imply a separate detail page.
- Preserve approved visual mockups as design references while documenting that implementation uses clean Next.js App Router components and Tailwind utilities.
- Treat catalog JSON as generated governed data: the Excel intake must be repeatable and report sheet/row/field validation errors rather than relying on manual copying.

## Resolution

Reconciliation completed on 2026-07-22. Implementation may replace the Vinext/Vite/Cloudflare/Drizzle starter under `/website` with a clean official Next.js App Router + Tailwind project and port the approved visual behavior. The five promoted mockups remain visual references; this resolution does not authorize a redesign.
