# Adversarial convergence review — static-first V1

## Verdict

PASS. Two independently implemented feature units can converge on the same source ownership, DTO boundary, publication path, URL/filter state, media gate and recovery model.

## Attacks exercised

1. A News unit embeds copy in JSX while a Project unit reads Markdown: blocked by AD-3 and the editorial-content convention.
2. A catalog unit creates one route per Model while another creates one route per Series: blocked by AD-11.
3. A feature adds an API route or small database for convenience: blocked by AD-2 and AD-5.
4. A route reads filesystem layout directly while a future route reads CMS response records: blocked by AD-13 and the public DTO convention.
5. A maintainer copies raw/uncleared media into `public/`: blocked by AD-6 and AD-17.
6. One team deploys a content-only change without the catalog/SEO snapshot: blocked by AD-4 and AD-10.
7. One filter implementation stores state only in React while another uses the URL: blocked by AD-9.
8. One recovery plan restores Git while another expects a database restore: blocked by AD-14, which explicitly states that V1 has no database restore path.

## Findings

- No critical or high finding.
- The exact Markdown parser, public-asset threshold, analytics providers and V2 CMS remain deferred with explicit revisit conditions; none permits incompatible V1 ownership or mutation paths.
