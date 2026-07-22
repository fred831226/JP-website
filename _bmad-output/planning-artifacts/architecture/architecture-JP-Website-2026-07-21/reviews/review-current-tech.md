# Current-technology review — static-first V1

## Verdict

PASS. Sequential fallback review performed because independent reviewer agents were unavailable under the active collaboration policy.

## Evidence

- Next.js supports build-time static route generation and documents that strict static export excludes redirects, headers, ISR and default image optimization; the spine deliberately uses normal Vercel Next.js deployment while keeping V1 content static.
- `generateStaticParams` supports the approximately 10 known Series routes at build time.
- Vercel supports Git-generated Preview deployments, production promotion and deployment rollback.
- The named Node, Next.js, React, pnpm, Tailwind, Zod, Playwright and axe seed versions were reality-checked on 2026-07-21 and remain seed rather than architectural invariants.
- Payload, WordPress, Wix, Neon, ORM, authentication and SMTP are explicitly absent from V1 and therefore require no V1 compatibility proof.

## Findings

- No critical or high finding.
- Exact TypeScript and Markdown parser versions correctly remain deferred until the project is scaffolded and proven in CI.
