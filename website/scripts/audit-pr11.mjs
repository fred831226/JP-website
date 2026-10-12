#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const advisory = "GHSA-vfj7-8cjw-p6xm";
const expectedLockHash = "c9a2ba644e991237bb64c8e4eafb5371c8540342cdd19372c77b299277af53ca";
const expectedChain = {
  "braces": advisory,
  "micromatch": "braces",
  "fast-glob": "micromatch",
  "@next/eslint-plugin-next": "fast-glob",
  "eslint-config-next": "@next/eslint-plugin-next",
};
const candidateBranch = "codex/home-gallery-release";
const candidateExpiresAt = "2026-10-16T23:59:59+08:00";
const candidateLockHash = "c9a2ba644e991237bb64c8e4eafb5371c8540342cdd19372c77b299277af53ca";
const candidateFiles = {
  "website/src/app/[locale]/company/page.tsx": "90fd5489b14a612ba839c9a5cdb7d861e15c946d23a9182741f7cf66ab73f069",
  "website/src/app/[locale]/page.tsx": "6ab66127a514ad8a27602255c6437a19fa6d6449fc451c28764da3aa6fc36872",
  "website/src/data/en.json": "85ad9fd0db62e247da5fdceb66554b2bdde0875f012d150a5c35ccbe17563ae7",
  "website/src/data/home.json": "1850082f45bee44619a047db8da2d8507a11ba64cd9b1d5cb157478e29e79340",
  "website/src/lib/content/en.ts": "5d765690386d265621a2a5a8359ea125a96c0d2efaeaf74b0201dfe292e49e72",
  "website/src/components/ProjectGalleryDescription.tsx": "a4aa4f1181a261ba5b444e010e6183a57534a62c7644f1b2e1265a7a3e438862",
  "website/tests/e2e/smoke.spec.ts": "8b53e6641c6d5ba437b12b6346483cc0c120cf2388b6fa0720f7171c0be35c79",
};
const candidateChangedPaths = [
  ...Object.keys(candidateFiles),
  "website/scripts/audit-pr11.mjs",
  "website/scripts/release-contract.mjs",
  "website/tests/release/release-contract.test.mjs",
  "website/docs/operations/codex-release-flow.md",
].sort();

function candidateContentHash() {
  const actual = Object.keys(candidateFiles).map((path) => {
    const normalized = readFileSync(resolve(websiteRoot, "..", path), "utf8").replaceAll("\r\n", "\n");
    const hash = createHash("sha256").update(normalized).digest("hex");
    if (hash !== candidateFiles[path]) throw new Error(`Candidate file changed: ${path}`);
    return `${path}:${hash}`;
  }).join("\n");
  return createHash("sha256").update(actual).digest("hex");
}

export function lockedDependencyHash() {
  const normalized = readFileSync(resolve(websiteRoot, "package-lock.json"), "utf8").replaceAll("\r\n", "\n");
  return createHash("sha256").update(normalized).digest("hex");
}

function hasExactCandidateChanges() {
  const result = spawnSync("git", ["diff", "--name-only", "origin/main...HEAD"], {
    cwd: resolve(websiteRoot, ".."), encoding: "utf8",
  });
  if (result.status !== 0) return false;
  const paths = result.stdout.trim().split(/\r?\n/).filter(Boolean).sort();
  return JSON.stringify(paths) === JSON.stringify(candidateChangedPaths);
}

function runAudit(args) {
  const result = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["audit", "--json", "--audit-level=high", ...args], {
    cwd: websiteRoot,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    shell: process.platform === "win32",
  });
  if (result.error || ![0, 1].includes(result.status)) throw new Error("npm audit could not complete");
  try {
    const report = JSON.parse(result.stdout);
    if (!report.metadata?.vulnerabilities || !report.vulnerabilities) throw new Error("Incomplete audit report");
    return { status: result.status, report };
  } catch {
    throw new Error("npm audit did not return a valid JSON report");
  }
}

export function isOnlyApprovedAdvisory(report) {
  const vulnerabilities = report?.vulnerabilities;
  if (!vulnerabilities || JSON.stringify(Object.keys(vulnerabilities).sort()) !== JSON.stringify(Object.keys(expectedChain).sort())) return false;
  if (report.metadata?.vulnerabilities?.high !== 5 || report.metadata?.vulnerabilities?.total !== 5) return false;
  for (const [name, source] of Object.entries(expectedChain)) {
    const item = vulnerabilities[name];
    if (item?.severity !== "high" || !Array.isArray(item.via) || item.via.length !== 1) return false;
    if (name === "braces") {
      if (item.via[0]?.url !== `https://github.com/advisories/${advisory}`) return false;
    } else if (item.via[0] !== source) return false;
  }
  return true;
}

async function isThisPullRequest() {
  const candidate = process.env.CANDIDATE_SHA;
  if (!/^[a-f0-9]{40}$/.test(candidate ?? "")
    || process.env.GITHUB_REPOSITORY !== "fred831226/JP-website"
    || !["pull_request", "workflow_dispatch"].includes(process.env.GITHUB_EVENT_NAME ?? "")
    || new Date() > new Date("2026-10-31T23:59:59+08:00")) return false;

  const lockHash = lockedDependencyHash();
  if (lockHash !== expectedLockHash) return false;

  if (process.env.GITHUB_EVENT_NAME === "pull_request") {
    const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
    return event.number === 11
      && event.pull_request?.head?.sha === candidate
      && event.pull_request?.head?.ref === "codex/english-site-release"
      && event.pull_request?.base?.ref === "main";
  }

  if (process.env.GITHUB_REF_NAME !== "codex/english-site-release" || !process.env.GITHUB_TOKEN) return false;
  const response = await fetch("https://api.github.com/repos/fred831226/JP-website/pulls/11", {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (!response.ok) return false;
  const pr = await response.json();
  return pr.state === "open" && pr.head?.sha === candidate && pr.head?.ref === "codex/english-site-release" && pr.base?.ref === "main";
}

async function isThisCandidate() {
  const candidate = process.env.CANDIDATE_SHA;
  if (!/^[a-f0-9]{40}$/.test(candidate ?? "")
    || process.env.GITHUB_REPOSITORY !== "fred831226/JP-website"
    || !["pull_request", "workflow_dispatch"].includes(process.env.GITHUB_EVENT_NAME ?? "")
    || new Date() > new Date(candidateExpiresAt)) return false;
  const lockHash = lockedDependencyHash();
  if (lockHash !== candidateLockHash) return false;
  candidateContentHash();
  if (!hasExactCandidateChanges()) return false;
  if (process.env.GITHUB_EVENT_NAME === "pull_request") {
    const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
    return event.pull_request?.head?.sha === candidate
      && event.pull_request?.head?.ref === candidateBranch
      && event.pull_request?.base?.ref === "main"
      && event.pull_request?.state === "open";
  }
  if (process.env.GITHUB_REF_NAME !== candidateBranch || !process.env.GITHUB_TOKEN) return false;
  const response = await fetch(`https://api.github.com/repos/fred831226/JP-website/pulls?state=open&head=fred831226:${candidateBranch}&base=main`, {
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
  });
  if (!response.ok) return false;
  const prs = await response.json();
  return prs.some((pr) => pr.head?.sha === candidate && pr.head?.ref === candidateBranch && pr.base?.ref === "main");
}

async function main() {
  if (!process.env.AUDIT_EXCEPTION_REPORT || !process.env.CANDIDATE_SHA) {
    throw new Error("Candidate identity and audit report path are required");
  }
  const complete = runAudit([]);
  if (complete.status === 0) {
    console.log("Complete locked dependency audit passed.");
    return;
  }
  const pr11 = await isThisPullRequest();
  const scopedCandidate = !pr11 && await isThisCandidate();
  if ((!pr11 && !scopedCandidate) || !isOnlyApprovedAdvisory(complete.report))
    throw new Error("Complete dependency audit failed outside the exact approved braces exceptions");
  const production = runAudit(["--omit=dev"]);
  if (production.status !== 0 || production.report.metadata?.vulnerabilities?.total !== 0) {
    throw new Error("Production dependency audit failed; the development-only exception cannot apply");
  }
  const exception = pr11
    ? { prNumber: 11, advisory, lockfileSha256: expectedLockHash, sourceCommit: process.env.CANDIDATE_SHA }
    : { candidate: candidateBranch, advisory, lockfileSha256: candidateLockHash, contentSha256: candidateContentHash(), sourceCommit: process.env.CANDIDATE_SHA };
  writeFileSync(process.env.AUDIT_EXCEPTION_REPORT, JSON.stringify(exception));
  console.warn(`One-time ${pr11 ? "PR #11" : candidateBranch} exception: ${advisory} is confined to development tooling; production dependencies have no audit findings.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
