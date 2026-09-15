#!/usr/bin/env node

import { execFile as execFileCallback } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

import {
  ReleaseContractError,
  buildReleaseEvidence,
  classifyContentRecords,
  parseGitNameStatus,
  releaseEvidenceDigest,
  verifyPromotionPreconditions,
  verifyRollbackPreconditions,
} from "./release-contract.mjs";

const execFile = promisify(execFileCallback);
const WEBSITE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPOSITORY_ROOT = resolve(WEBSITE_ROOT, "..");
const REQUIRED_VERCEL_CLI_VERSION = "56.5.0";
const GOVERNED_CONTENT_FILES = [
  "website/data/catalog-content.json",
  "website/data/catalog-overview.json",
  "website/data/catalog.generated.json",
  "website/src/data/catalog-brands.json",
  "website/src/data/catalog-purposes.json",
  "website/src/data/catalog-types.json",
  "website/src/data/company.json",
  "website/src/data/contact.json",
  "website/src/data/home.json",
  "website/src/data/navigation.json",
  "website/src/data/partners.json",
  "website/src/data/services.json",
  "website/src/data/site.json",
];

async function git(args) {
  const { stdout } = await execFile("git", args, { cwd: REPOSITORY_ROOT, encoding: "utf8" });
  return stdout.trim();
}

function requireEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new ReleaseContractError(`Missing required ${name} environment configuration`);
  return value;
}

async function getVercelDeployment(deploymentId) {
  const token = requireEnvironment("VERCEL_TOKEN");
  const teamId = requireEnvironment("VERCEL_TEAM_ID");
  const response = await fetch(`https://api.vercel.com/v13/deployments/${encodeURIComponent(deploymentId)}?teamId=${encodeURIComponent(teamId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new ReleaseContractError("Unable to verify the Vercel deployment identity");
  return response.json();
}

async function probePreview(url) {
  const bypassSecret = requireEnvironment("VERCEL_AUTOMATION_BYPASS_SECRET");
  const headers = { "x-vercel-protection-bypass": bypassSecret };
  const [page, robots] = await Promise.all([
    fetch(url, { headers, redirect: "error" }),
    fetch(`${url}/robots.txt`, { headers, redirect: "error" }),
  ]);
  if (!page.ok || !robots.ok) throw new ReleaseContractError("Unable to verify the protected Preview response");
  return {
    xRobotsTag: page.headers.get("x-robots-tag") ?? "",
    robotsText: await robots.text(),
  };
}

function providerDeploymentEvidence(deployment, expectedProjectId) {
  const projectId = deployment?.projectId ?? deployment?.project?.id;
  if (projectId !== expectedProjectId) throw new ReleaseContractError("Vercel deployment belongs to a different project");
  const sourceCommit = deployment?.meta?.githubCommitSha;
  const url = String(deployment?.url ?? "").replace(/^https?:\/\//, "");
  return {
    deploymentId: deployment?.id,
    url: `https://${url}`,
    sourceCommit,
    projectId,
    readyState: deployment?.readyState,
    environment: deployment?.target === "production" ? "production" : "preview",
  };
}

async function getContentSnapshots(baseCommit) {
  const base = {};
  const current = {};
  const versionedCatalogFiles = ["data/catalog.generated.json", "data/catalog-overview.json", "src/data/catalog.generated.json", "src/data/catalog-overview.json"];
  async function versionedSnapshot(commit, root) {
    const indicatorFile = "website/catalog-current.json";
    const indicator = commit
      ? JSON.parse(await git(["show", `${commit}:${indicatorFile}`]))
      : JSON.parse(await readFile(resolve(root, "catalog-current.json"), "utf8"));
    if (!/^releases\/[a-z0-9-]+$/i.test(indicator.release ?? "")) {
      throw new ReleaseContractError("Catalog release indicator is invalid");
    }
    const snapshot = {};
    for (const relativePath of versionedCatalogFiles) {
      const sourceFile = `website/${indicator.release}/${relativePath}`;
      const body = commit
        ? await git(["show", `${commit}:${sourceFile}`])
        : await readFile(resolve(root, indicator.release, relativePath), "utf8");
      snapshot[sourceFile] = JSON.parse(body);
    }
    return snapshot;
  }
  Object.assign(current, await versionedSnapshot(null, WEBSITE_ROOT));
  try {
    Object.assign(base, await versionedSnapshot(baseCommit, WEBSITE_ROOT));
  } catch {
    // A predecessor without the versioned catalog has no comparable catalog
    // records; the repository change list still records the migration.
  }
  for (const sourceFile of GOVERNED_CONTENT_FILES) {
    if (/catalog\.(?:generated|overview)\.json$/.test(sourceFile)) continue;
    try {
      current[sourceFile] = JSON.parse(await readFile(resolve(REPOSITORY_ROOT, sourceFile), "utf8"));
    } catch {
      continue;
    }
    try {
      base[sourceFile] = JSON.parse(await git(["show", `${baseCommit}:${sourceFile}`]));
    } catch {
      base[sourceFile] = null;
    }
  }
  return { base, current };
}

async function getRouteInventory() {
  const [catalog, types] = await Promise.all([
    readJson(resolve(WEBSITE_ROOT, "data", "catalog-content.json"), "Catalog content"),
    readJson(resolve(WEBSITE_ROOT, "src", "data", "catalog-types.json"), "Catalog types"),
  ]);
  const catalogRoutes = new Set(["/zh-tw/", "/zh-tw/products"]);
  for (const series of catalog.series ?? []) if (series?.slug) catalogRoutes.add(`/zh-tw/series/${series.slug}`);
  for (const type of types ?? []) if (type?.slug) catalogRoutes.add(`/zh-tw/types/${type.slug}`);
  const all = new Set([
    ...catalogRoutes,
    "/zh-tw/company",
    "/zh-tw/contact",
    "/zh-tw/partners",
    "/zh-tw/services",
  ]);
  return { all: [...all].sort(), catalog: [...catalogRoutes].sort() };
}

const defaults = {
  getCurrentCommit: () => git(["rev-parse", "HEAD"]),
  isWorkingTreeClean: async () => (await git(["status", "--porcelain"])) === "",
  git,
  getExpectedProjectId: () => requireEnvironment("VERCEL_PROJECT_ID"),
  getDeployment: getVercelDeployment,
  probePreview,
  getContentSnapshots,
  getRouteInventory,
  getVercelVersion: async () => {
    const { stdout } = await execFile("vercel", ["--version"], { cwd: WEBSITE_ROOT, encoding: "utf8" });
    return stdout.trim().split(/\s+/).at(-1);
  },
  execute: (command, args) => execFile(command, args, { cwd: WEBSITE_ROOT, encoding: "utf8" }),
  stdout: process.stdout,
  stderr: process.stderr,
};

function parseArguments(args) {
  const command = args[0];
  const options = {};
  for (let index = 1; index < args.length; index += 1) {
    const token = args[index];
    if (token === "--execute") {
      options.execute = true;
      continue;
    }
    if (!token.startsWith("--") || index + 1 >= args.length || args[index + 1].startsWith("--")) {
      throw new ReleaseContractError(`Missing value for ${token}`);
    }
    options[token.slice(2)] = args[index + 1];
    index += 1;
  }
  return { command, options };
}

function validateOptions(command, options) {
  const allowedByCommand = {
    evidence: new Set(["preview-deployment", "rollback-target", "gates", "output", "redirects"]),
    digest: new Set(["evidence"]),
    promote: new Set(["evidence", "approval", "execute"]),
    rollback: new Set(["evidence", "authorization", "execute"]),
  };
  const allowed = allowedByCommand[command];
  if (!allowed) throw new ReleaseContractError("Usage: release.mjs evidence|digest|promote|rollback [options]");
  for (const name of Object.keys(options)) {
    if (!allowed.has(name)) throw new ReleaseContractError(`Unsupported option --${name} for ${command}`);
  }
}

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(resolve(path), "utf8"));
  } catch {
    throw new ReleaseContractError(`${label} must be a readable JSON file`);
  }
}

function requireOption(options, name) {
  if (!options[name]) throw new ReleaseContractError(`Missing required --${name}`);
  return options[name];
}

async function generateEvidence(options, dependencies) {
  const currentCommit = await dependencies.getCurrentCommit();
  if (!(await dependencies.isWorkingTreeClean())) {
    throw new ReleaseContractError("Working tree is dirty; evidence must describe one committed repository state");
  }
  const sourceCommit = currentCommit;
  const gatesFile = await readJson(requireOption(options, "gates"), "Gate report");
  const redirects = await readJson(options.redirects ?? resolve(WEBSITE_ROOT, "data", "redirects.json"), "Redirect authority");
  const notFoundRoutes = await readJson(resolve(WEBSITE_ROOT, "data", "not-found-routes.json"), "Not-found authority");
  const expectedProjectId = dependencies.getExpectedProjectId();
  const preview = providerDeploymentEvidence(
    await dependencies.getDeployment(requireOption(options, "preview-deployment")),
    expectedProjectId,
  );
  const rollback = providerDeploymentEvidence(
    await dependencies.getDeployment(requireOption(options, "rollback-target")),
    expectedProjectId,
  );
  try {
    await dependencies.git(["merge-base", "--is-ancestor", rollback.sourceCommit, sourceCommit]);
  } catch {
    throw new ReleaseContractError("Rollback commit is not an ancestor of the candidate commit");
  }
  const policy = await dependencies.probePreview(preview.url);
  if (!/\bnoindex\b/i.test(policy.xRobotsTag)
    || !/^\s*Disallow:\s*\/\s*$/im.test(policy.robotsText)
    || /^\s*Sitemap:/im.test(policy.robotsText)) {
    throw new ReleaseContractError("Preview live responses did not prove the required non-indexing policy");
  }
  const changes = parseGitNameStatus(await dependencies.git([
    "diff", "--name-status", "-z", `${rollback.sourceCommit}...${sourceCommit}`,
  ]));
  const snapshots = await dependencies.getContentSnapshots(rollback.sourceCommit);
  const contentChanges = classifyContentRecords(snapshots.base, snapshots.current);
  const routeInventory = await dependencies.getRouteInventory();
  const evidence = buildReleaseEvidence({
    sourceCommit,
    preview: {
      ...preview,
      indexable: false,
    },
    validation: gatesFile,
    rollback,
    changes,
    redirects,
    notFoundRoutes,
    routeInventory,
    contentChanges,
  });
  const output = resolve(requireOption(options, "output"));
  await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`, { flag: "wx" });
  dependencies.stdout.write(`Release evidence written: ${output}\n`);
  return 0;
}

async function promote(options, dependencies) {
  const evidence = await readJson(requireOption(options, "evidence"), "Release evidence");
  const approval = await readJson(requireOption(options, "approval"), "Approval record");
  const target = verifyPromotionPreconditions({
    evidence,
    approval,
    currentCommit: await dependencies.getCurrentCommit(),
    workingTreeClean: await dependencies.isWorkingTreeClean(),
  });
  const command = "vercel";
  const args = ["promote", target.deploymentId, "--yes"];
  if (!options.execute) {
    dependencies.stdout.write(`DRY RUN — no external command executed\n${command} ${args.join(" ")}\n`);
    return 0;
  }
  let vercelVersion;
  try {
    vercelVersion = await dependencies.getVercelVersion();
  } catch {
    throw new ReleaseContractError(`Vercel CLI ${REQUIRED_VERCEL_CLI_VERSION} is required before promotion`);
  }
  if (vercelVersion !== REQUIRED_VERCEL_CLI_VERSION) {
    throw new ReleaseContractError(`Vercel CLI ${REQUIRED_VERCEL_CLI_VERSION} is required; found ${vercelVersion || "unknown"}`);
  }
  try {
    await dependencies.execute(command, args);
  } catch {
    throw new ReleaseContractError("Vercel promotion result is indeterminate. Do not retry until the current Production deployment is verified in Vercel; escalate to the account owner if its state cannot be confirmed.");
  }
  dependencies.stdout.write(`Promotion command completed for ${target.deploymentId}. Verify the Production domain before closing the release.\n`);
  return 0;
}

async function rollback(options, dependencies) {
  const evidence = await readJson(requireOption(options, "evidence"), "Release evidence");
  const authorization = await readJson(requireOption(options, "authorization"), "Rollback authorization");
  const target = verifyRollbackPreconditions({ evidence, authorization });
  const command = "vercel";
  const args = ["rollback", target.restoredDeploymentId, "--yes"];
  if (!options.execute) {
    dependencies.stdout.write(
      `DRY RUN — no external command executed\n${command} ${args.join(" ")}\n`
      + `Restored deployment: ${target.restoredDeploymentId}\n`
      + `Superseded deployment: ${target.supersededDeploymentId}\n`,
    );
    return 0;
  }
  let vercelVersion;
  try {
    vercelVersion = await dependencies.getVercelVersion();
  } catch {
    throw new ReleaseContractError(`Vercel CLI ${REQUIRED_VERCEL_CLI_VERSION} is required before rollback`);
  }
  if (vercelVersion !== REQUIRED_VERCEL_CLI_VERSION) {
    throw new ReleaseContractError(`Vercel CLI ${REQUIRED_VERCEL_CLI_VERSION} is required; found ${vercelVersion || "unknown"}`);
  }
  try {
    await dependencies.execute(command, args);
  } catch {
    throw new ReleaseContractError(
      "Vercel rollback result is indeterminate. Do not retry until rollback status, the current Production deployment, and every Production domain assignment are verified in Vercel; escalate to the account and domain owners if state cannot be confirmed.",
    );
  }
  dependencies.stdout.write(
    `Rollback command completed for ${target.restoredDeploymentId}; superseded ${target.supersededDeploymentId}. `
    + "Recovery is not complete until Vercel rollback status, the active Production deployment, every Production domain assignment, and public smoke checks are independently verified and recorded.\n",
  );
  return 0;
}

async function printDigest(options, dependencies) {
  const evidence = await readJson(requireOption(options, "evidence"), "Release evidence");
  dependencies.stdout.write(`${releaseEvidenceDigest(evidence)}\n`);
  return 0;
}

export async function runReleaseCli(args, injected = {}) {
  const dependencies = { ...defaults, ...injected };
  try {
    const { command, options } = parseArguments(args);
    validateOptions(command, options);
    if (command === "evidence") return await generateEvidence(options, dependencies);
    if (command === "promote") return await promote(options, dependencies);
    if (command === "rollback") return await rollback(options, dependencies);
    if (command === "digest") return await printDigest(options, dependencies);
    throw new ReleaseContractError("Usage: release.mjs evidence|digest|promote|rollback [options]");
  } catch (error) {
    const message = error instanceof ReleaseContractError ? error.message : "Unexpected release tooling failure";
    dependencies.stderr.write(`Release blocked: ${message}\nRetry after correcting the evidence, or escalate to the repository and Vercel account owners.\n`);
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await runReleaseCli(process.argv.slice(2));
}
