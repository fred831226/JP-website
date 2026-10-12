#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const advisory = "GHSA-vfj7-8cjw-p6xm";
const expectedLockHash = "fdec693ac7881c0278c6792ec844709af101708d5b6a5a504b64800e8bee77b4";
const expectedChain = {
  "braces": advisory,
  "micromatch": "braces",
  "fast-glob": "micromatch",
  "@next/eslint-plugin-next": "fast-glob",
  "eslint-config-next": "@next/eslint-plugin-next",
};

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

  const lockHash = createHash("sha256").update(readFileSync(resolve(websiteRoot, "package-lock.json"))).digest("hex");
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

async function main() {
  if (!process.env.AUDIT_EXCEPTION_REPORT || !process.env.CANDIDATE_SHA) {
    throw new Error("Candidate identity and audit report path are required");
  }
  const complete = runAudit([]);
  if (complete.status === 0) {
    console.log("Complete locked dependency audit passed.");
    return;
  }
  if (!(await isThisPullRequest()) || !isOnlyApprovedAdvisory(complete.report)) {
    throw new Error("Complete dependency audit failed outside the exact PR #11 braces exception");
  }
  const production = runAudit(["--omit=dev"]);
  if (production.status !== 0 || production.report.metadata?.vulnerabilities?.total !== 0) {
    throw new Error("Production dependency audit failed; the development-only exception cannot apply");
  }
  const exception = { prNumber: 11, advisory, lockfileSha256: expectedLockHash, sourceCommit: process.env.CANDIDATE_SHA };
  writeFileSync(process.env.AUDIT_EXCEPTION_REPORT, JSON.stringify(exception));
  console.warn(`One-time PR #11 exception: ${advisory} is confined to development tooling; production dependencies have no audit findings.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
