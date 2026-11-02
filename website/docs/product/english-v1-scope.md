# V1 English publication scope and content approval

Date: 2026-11-02 (Asia/Taipei)
Decision: The project owner explicitly approved publishing the existing English pages and updating the V1 requirements and content approval for this release.

## Approved V1 scope

The public V1 site includes Traditional Chinese routes under `/zh-tw/` and these existing English routes under `/en/`: `/en`, `/en/company`, `/en/partners`, `/en/products`, and `/en/contact`. The existing English navigation, metadata, and sitemap entries for these routes are within this approval. The root route continues to direct visitors to `/zh-tw/`.

The owner approved publication of the English content currently supplied by `website/src/data/en.json` and the existing English copy rendered by those five routes. This is content publication approval for the current release candidate, not a standing approval for future translations or new English pages. Changes to factual claims, translations, images, or route coverage require separate review. English series/model detail, services, news, project detail, and arbitrary filter pages are outside this decision.

## Relationship to earlier V1 documents

This decision supersedes only the earlier Chinese-only and deferred-English statements in the historical PRD, architecture, UX, and epic documents. Their other product, accessibility, content governance, and technical requirements remain in force. Those historical planning documents are not present in the deployable repository's current `main` tree, so this tracked amendment is the current source of truth for the English V1 scope.

This content decision does not authorize a particular Git commit, Preview deployment, PR merge, or Production promotion. Those release approvals remain bound to the immutable deployment and its evidence under `website/docs/operations/codex-release-flow.md`.
