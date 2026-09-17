import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import {
  ReleaseContractError,
  buildReleaseEvidence,
  classifyContentRecords,
  classifyRepositoryChanges,
  parseGitNameStatus,
  releaseEvidenceDigest,
  verifyPromotionPreconditions,
  verifyRollbackPreconditions,
} from "../../scripts/release-contract.mjs";
import { assertPreviewPolicy, runReleaseCli } from "../../scripts/release.mjs";

const COMMIT = "0123456789abcdef0123456789abcdef01234567";
const BASE_COMMIT = "89abcdef0123456789abcdef0123456789abcdef";
const ROLLBACK = "dpl_previousProduction123";
const PROJECT = "prj_jpPump123";
const ROUTE_INVENTORY = {
  all: [
    "/zh-tw/",
    "/zh-tw/company",
    "/zh-tw/contact",
    "/zh-tw/partners",
    "/zh-tw/products",
    "/zh-tw/series/gp",
    "/zh-tw/series/hs",
    "/zh-tw/services",
    "/zh-tw/types/horizontal-pump",
  ],
  catalog: [
    "/zh-tw/",
    "/zh-tw/products",
    "/zh-tw/series/hs",
    "/zh-tw/series/gp",
    "/zh-tw/types/horizontal-pump",
  ],
};

function validEvidence(overrides = {}) {
  return buildReleaseEvidence({
    sourceCommit: COMMIT,
    preview: {
      deploymentId: "dpl_candidateImmutable123",
      url: "https://jp-pump-a1b2c3d4e-team.vercel.app",
      sourceCommit: COMMIT,
      indexable: false,
      projectId: PROJECT,
      readyState: "READY",
      environment: "preview",
    },
    validation: {
      sourceCommit: COMMIT,
      passed: true,
      gates: [
        { name: "audit", passed: true },
        { name: "validate", passed: true },
        { name: "lint", passed: true },
        { name: "build", passed: true },
        { name: "test:release", passed: true },
        { name: "test", passed: true },
      ],
    },
    rollback: {
      deploymentId: ROLLBACK,
      sourceCommit: BASE_COMMIT,
      projectId: PROJECT,
      readyState: "READY",
      environment: "production",
    },
    changes: [
      { status: "A", path: "website/src/data/company.json" },
      { status: "M", path: "website/data/catalog-content.json" },
    ],
    redirects: [],
    routeInventory: ROUTE_INVENTORY,
    contentChanges: { added: [], changed: [], removed: [] },
    ...overrides,
  });
}

function validApproval(evidence = validEvidence()) {
  return {
    status: "approved",
    sourceCommit: evidence.sourceCommit,
    deploymentId: evidence.preview.deploymentId,
    approvedBy: "JP PUMP",
    approvedAt: "2026-08-28T15:30:00+08:00",
    approvalReference: "JP-PUMP-APPROVAL-2026-08-28-01",
    evidenceDigest: releaseEvidenceDigest(evidence),
  };
}

function validRollbackAuthorization(evidence = validEvidence()) {
  return {
    status: "approved",
    restoredDeploymentId: evidence.rollback.deploymentId,
    supersededDeploymentId: evidence.preview.deploymentId,
    projectId: evidence.projectId,
    evidenceDigest: releaseEvidenceDigest(evidence),
    authorizedBy: "JP PUMP release owner",
    authorizedAt: "2026-08-29T09:45:00+08:00",
    authorizationReference: "JP-PUMP-ROLLBACK-2026-08-29-01",
  };
}

test("evidence records immutable Preview identity, gate results, A/C/D changes, routes, and rollback without content bodies", () => {
  const evidence = validEvidence();

  assert.deepEqual(evidence, {
    schemaVersion: 1,
    sourceCommit: COMMIT,
    preview: {
      deploymentId: "dpl_candidateImmutable123",
      url: "https://jp-pump-a1b2c3d4e-team.vercel.app",
      sourceCommit: COMMIT,
      indexable: false,
      projectId: PROJECT,
      readyState: "READY",
      environment: "preview",
    },
    validation: {
      sourceCommit: COMMIT,
      passed: true,
      gates: [
        { name: "audit", passed: true },
        { name: "validate", passed: true },
        { name: "lint", passed: true },
        { name: "build", passed: true },
        { name: "test:release", passed: true },
        { name: "test", passed: true },
      ],
    },
    changes: {
      added: ["website/src/data/company.json"],
      changed: ["website/data/catalog-content.json"],
      removed: [],
    },
    affectedRoutes: [
      "/zh-tw/",
      "/zh-tw/company",
      "/zh-tw/products",
      "/zh-tw/series/gp",
      "/zh-tw/series/hs",
      "/zh-tw/types/horizontal-pump",
    ],
    contentChanges: { added: [], changed: [], removed: [] },
    removals: [],
    rollback: {
      deploymentId: ROLLBACK,
      sourceCommit: BASE_COMMIT,
      projectId: PROJECT,
      readyState: "READY",
      environment: "production",
    },
    rollbackTarget: ROLLBACK,
    baseCommit: BASE_COMMIT,
    projectId: PROJECT,
  });
  assert.equal(JSON.stringify(evidence).includes("shortDescription"), false);
});

test("repository change classification covers atomic public surfaces and ignores non-public operations files", () => {
  assert.deepEqual(classifyRepositoryChanges([
    { status: "M", path: "website/src/data/site.json" },
    { status: "M", path: "website/src/data/partners.json" },
    { status: "M", path: "website/src/data/services.json" },
    { status: "M", path: "website/public/media/pump.png" },
    { status: "M", path: "website/src/app/robots.ts" },
    { status: "M", path: "website/docs/operations/release.md" },
  ], ROUTE_INVENTORY), {
    added: [],
    changed: [
      "website/docs/operations/release.md",
      "website/public/media/pump.png",
      "website/src/app/robots.ts",
      "website/src/data/partners.json",
      "website/src/data/services.json",
      "website/src/data/site.json",
    ],
    removed: [],
    affectedRoutes: ROUTE_INVENTORY.all,
  });
});

test("stable governed records are classified at content level and expose route-changing removals", () => {
  const baseSnapshots = {
    "website/data/catalog-content.json": {
      series: [
        { id: "series-1", slug: "old-slug", name: "Old" },
        { id: "series-2", slug: "removed", name: "Removed" },
      ],
    },
  };
  const currentSnapshots = {
    "website/data/catalog-content.json": {
      series: [
        { id: "series-1", slug: "new-slug", name: "Updated" },
        { id: "series-3", slug: "added", name: "Added" },
      ],
    },
  };

  assert.deepEqual(classifyContentRecords(baseSnapshots, currentSnapshots), {
    added: [{ sourceFile: "website/data/catalog-content.json", recordType: "series", id: "series-3", route: "/zh-tw/series/added" }],
    changed: [{ sourceFile: "website/data/catalog-content.json", recordType: "series", id: "series-1", route: "/zh-tw/series/new-slug", previousRoute: "/zh-tw/series/old-slug" }],
    removed: [{ sourceFile: "website/data/catalog-content.json", recordType: "series", id: "series-2", route: "/zh-tw/series/removed" }],
  });
});

test("content-level removal and slug retirement require governed route treatment", () => {
  const contentChanges = {
    added: [],
    changed: [{ sourceFile: "website/data/catalog-content.json", recordType: "series", id: "series-1", route: "/zh-tw/series/new", previousRoute: "/zh-tw/series/old" }],
    removed: [{ sourceFile: "website/data/catalog-content.json", recordType: "series", id: "series-2", route: "/zh-tw/series/removed" }],
  };
  assert.throws(() => validEvidence({ contentChanges }), /untreated public removal/i);

  const evidence = validEvidence({
    contentChanges,
    redirects: [
      { source: "/zh-tw/series/old", destination: "/zh-tw/series/new", permanent: true },
      { source: "/zh-tw/series/removed", destination: "/zh-tw/products", permanent: true },
    ],
  });
  assert.deepEqual(evidence.removals.map((entry) => entry.route), [
    "/zh-tw/series/old",
    "/zh-tw/series/removed",
  ]);
});

test("Git rename input preserves the old path as a removal and the new path as an addition", () => {
  assert.deepEqual(
    parseGitNameStatus("R100\0website/src/app/[locale]/old/page.tsx\0website/src/app/[locale]/new/page.tsx\0"),
    [
      { status: "D", path: "website/src/app/[locale]/old/page.tsx" },
      { status: "A", path: "website/src/app/[locale]/new/page.tsx" },
    ],
  );
});

test("NUL-delimited Git change parsing preserves tabs and newlines inside file names", () => {
  assert.deepEqual(
    parseGitNameStatus("M\0website/src/data/name\twith\nlines.json\0"),
    [{ status: "M", path: "website/src/data/name\twith\nlines.json" }],
  );
});

test("evidence rejects gate results produced for a different commit", () => {
  assert.throws(
    () => validEvidence({
      validation: {
        sourceCommit: "abcdefabcdefabcdefabcdefabcdefabcdefabcd",
        passed: true,
        gates: [{ name: "build", passed: true }],
      },
    }),
    /gate report commit/i,
  );
});

test("evidence rejects malformed, branch-only, indexable, or commit-mismatched Preview identity", () => {
  for (const preview of [
    { deploymentId: "", url: "https://candidate.vercel.app", sourceCommit: COMMIT, indexable: false },
    { deploymentId: "dpl_123", url: "https://jp-pump-git-feature-x-team.vercel.app", sourceCommit: COMMIT, indexable: false, projectId: PROJECT, readyState: "READY", environment: "preview" },
    { deploymentId: "dpl_123", url: "http://candidate.vercel.app", sourceCommit: COMMIT, indexable: false, projectId: PROJECT, readyState: "READY", environment: "preview" },
    { deploymentId: "dpl_123", url: "https://user:secret@candidate.vercel.app/?x=secret", sourceCommit: COMMIT, indexable: false, projectId: PROJECT, readyState: "READY", environment: "preview" },
    { deploymentId: "dpl_123", url: "https://candidate.vercel.app", sourceCommit: COMMIT, indexable: true, projectId: PROJECT, readyState: "READY", environment: "preview" },
    { deploymentId: "dpl_123", url: "https://candidate.vercel.app", sourceCommit: "abcdefabcdefabcdefabcdefabcdefabcdefabcd", indexable: false, projectId: PROJECT, readyState: "READY", environment: "preview" },
    { deploymentId: "dpl_123", url: "https://candidate.vercel.app", sourceCommit: COMMIT, indexable: false, projectId: PROJECT, readyState: "ERROR", environment: "preview" },
    { deploymentId: "dpl_123", url: "https://candidate.vercel.app", sourceCommit: COMMIT, indexable: false, projectId: PROJECT, readyState: "READY", environment: "production" },
  ]) {
    assert.throws(() => validEvidence({ preview }), ReleaseContractError);
  }
});

test("evidence requires the exact unique release gate set", () => {
  for (const gates of [
    [{ name: "build", passed: true }],
    [
      { name: "audit", passed: true },
      { name: "validate", passed: true },
      { name: "lint", passed: true },
      { name: "build", passed: true },
      { name: "test:release", passed: true },
      { name: "test:release", passed: true },
    ],
    [
      { name: "audit", passed: true },
      { name: "validate", passed: true },
      { name: "lint", passed: true },
      { name: "build", passed: true },
      { name: "test:release", passed: true },
      { name: "test", passed: true },
      { name: "anything", passed: true },
    ],
  ]) {
    assert.throws(() => validEvidence({
      validation: { sourceCommit: COMMIT, passed: true, gates },
    }), /exact required release gates/i);
  }
});

test("rollback evidence must be a different ready Production deployment from the same project", () => {
  for (const rollback of [
    { deploymentId: "dpl_candidateImmutable123", sourceCommit: BASE_COMMIT, projectId: PROJECT, readyState: "READY", environment: "production" },
    { deploymentId: ROLLBACK, sourceCommit: BASE_COMMIT, projectId: "prj_other", readyState: "READY", environment: "production" },
    { deploymentId: ROLLBACK, sourceCommit: BASE_COMMIT, projectId: PROJECT, readyState: "ERROR", environment: "production" },
    { deploymentId: ROLLBACK, sourceCommit: BASE_COMMIT, projectId: PROJECT, readyState: "READY", environment: "preview" },
  ]) {
    assert.throws(() => validEvidence({ rollback }), /rollback/i);
  }
});

test("removed public content requires a governed nearest redirect or explicit not-found treatment", () => {
  const removed = [{ status: "D", path: "website/src/app/[locale]/series/old-pump/page.tsx" }];

  assert.throws(() => validEvidence({ changes: removed }), /untreated public removal/i);

  const redirected = validEvidence({
    changes: removed,
    redirects: [{ source: "/zh-tw/series/old-pump", destination: "/zh-tw/products", permanent: true }],
  });
  assert.deepEqual(redirected.removals, [{
    route: "/zh-tw/series/old-pump",
    treatment: "redirect",
    destination: "/zh-tw/products",
  }]);

  const notFound = validEvidence({ changes: removed, notFoundRoutes: ["/zh-tw/series/old-pump"] });
  assert.deepEqual(notFound.removals, [{ route: "/zh-tw/series/old-pump", treatment: "not-found" }]);

  for (const notFoundRoutes of [
    ["relative-route"],
    ["//external.example/path"],
    ["/zh-tw/series/old-pump?secret=value"],
    ["/zh-tw/series/old-pump", "/zh-tw/series/old-pump"],
  ]) {
    assert.throws(() => validEvidence({ changes: removed, notFoundRoutes }), /not-found authority/i);
  }
});

test("removing a dynamic catalog route requires treatment for every concrete public route", () => {
  const removed = [{ status: "D", path: "website/src/app/[locale]/series/[slug]/page.tsx" }];

  assert.throws(() => validEvidence({ changes: removed }), /untreated public removal/i);

  const evidence = validEvidence({
    changes: removed,
    redirects: [
      { source: "/zh-tw/series/gp", destination: "/zh-tw/products", permanent: true },
      { source: "/zh-tw/series/hs", destination: "/zh-tw/products", permanent: true },
    ],
  });
  assert.deepEqual(evidence.removals.map((entry) => entry.route), [
    "/zh-tw/series/gp",
    "/zh-tw/series/hs",
  ]);
});

test("governed redirects reject duplicate sources, chains, loops, and missing destinations", () => {
  const removed = [{ status: "D", path: "website/src/app/[locale]/series/old-pump/page.tsx" }];
  for (const redirects of [
    [
      { source: "/zh-tw/series/old-pump", destination: "/zh-tw/products", permanent: true },
      { source: "/zh-tw/series/old-pump", destination: "/zh-tw/", permanent: true },
    ],
    [
      { source: "/zh-tw/series/old-pump", destination: "/zh-tw/company", permanent: true },
      { source: "/zh-tw/company", destination: "/zh-tw/series/old-pump", permanent: true },
    ],
    [{ source: "/zh-tw/series/old-pump", destination: "/zh-tw/does-not-exist", permanent: true }],
  ]) {
    assert.throws(() => validEvidence({ changes: removed, redirects }), /redirect/i);
  }
});

test("promotion preconditions require approval, Preview, clean HEAD, passed gates, and rollback target to agree", () => {
  const evidence = validEvidence();
  const approval = validApproval(evidence);

  assert.deepEqual(verifyPromotionPreconditions({ evidence, approval, currentCommit: COMMIT, workingTreeClean: true }), {
    deploymentId: "dpl_candidateImmutable123",
    rollbackTarget: ROLLBACK,
    sourceCommit: COMMIT,
  });

  const failures = [
    { approval: { ...approval, status: "rejected" } },
    { approval: { ...approval, sourceCommit: "abcdefabcdefabcdefabcdefabcdefabcdefabcd" } },
    { approval: { ...approval, deploymentId: "dpl_other" } },
    { approval: { ...approval, evidenceDigest: "sha256:wrong" } },
    { approval: { ...approval, approvedBy: "" } },
    { approval: { ...approval, approvedAt: "yesterday" } },
    { approval: { ...approval, approvalReference: "" } },
    { currentCommit: "abcdefabcdefabcdefabcdefabcdefabcdefabcd" },
    { workingTreeClean: false },
    { evidence: { ...evidence, validation: { passed: false, gates: [{ name: "build", passed: false }] } } },
    { evidence: { ...evidence, rollbackTarget: "" } },
  ];
  for (const override of failures) {
    assert.throws(() => verifyPromotionPreconditions({ evidence, approval, currentCommit: COMMIT, workingTreeClean: true, ...override }), ReleaseContractError);
  }
});

test("rollback preconditions bind authorization to immutable restored and superseded deployments", () => {
  const evidence = validEvidence();
  const authorization = validRollbackAuthorization(evidence);

  assert.deepEqual(verifyRollbackPreconditions({ evidence, authorization }), {
    restoredDeploymentId: ROLLBACK,
    supersededDeploymentId: "dpl_candidateImmutable123",
    projectId: PROJECT,
    restoredSourceCommit: BASE_COMMIT,
    supersededSourceCommit: COMMIT,
  });

  for (const invalid of [
    { ...authorization, status: "rejected" },
    { ...authorization, restoredDeploymentId: "dpl_other" },
    { ...authorization, supersededDeploymentId: ROLLBACK },
    { ...authorization, projectId: "prj_other" },
    { ...authorization, evidenceDigest: "sha256:wrong" },
    { ...authorization, authorizedBy: "" },
    { ...authorization, authorizedAt: "later" },
    { ...authorization, authorizationReference: "" },
  ]) {
    assert.throws(() => verifyRollbackPreconditions({ evidence, authorization: invalid }), ReleaseContractError);
  }
});

test("rollback defaults to dry-run and executes only the immutable known-good deployment", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-rollback-"));
  const evidencePath = join(fixtureDir, "evidence.json");
  const authorizationPath = join(fixtureDir, "authorization.json");
  const evidence = validEvidence();
  await writeFile(evidencePath, JSON.stringify(evidence));
  await writeFile(authorizationPath, JSON.stringify(validRollbackAuthorization(evidence)));
  const calls = [];
  const output = [];
  const dependencies = {
    getVercelVersion: async () => "56.5.0",
    execute: async (command, args) => calls.push([command, args]),
    stdout: { write: (value) => output.push(String(value)) },
    stderr: { write() {} },
  };

  assert.equal(await runReleaseCli(["rollback", "--evidence", evidencePath, "--authorization", authorizationPath], dependencies), 0);
  assert.equal(calls.length, 0);
  assert.match(output.join(""), /DRY RUN/);
  assert.match(output.join(""), /vercel rollback dpl_previousProduction123 --yes/);
  assert.match(output.join(""), /superseded.*dpl_candidateImmutable123/i);

  assert.equal(await runReleaseCli(["rollback", "--evidence", evidencePath, "--authorization", authorizationPath, "--execute"], dependencies), 0);
  assert.deepEqual(calls, [["vercel", ["rollback", ROLLBACK, "--yes"]]]);
  assert.match(output.join(""), /not complete until/i);
  assert.match(output.join(""), /domain assignment/i);
});

test("explicit rollback blocks on CLI mismatch and every invalid precondition performs zero provider calls", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-rollback-blocked-"));
  const evidencePath = join(fixtureDir, "evidence.json");
  const authorizationPath = join(fixtureDir, "authorization.json");
  const evidence = validEvidence();
  const baseline = validRollbackAuthorization(evidence);
  await writeFile(evidencePath, JSON.stringify(evidence));

  for (const authorization of [baseline, { ...baseline, status: "rejected" }, { ...baseline, evidenceDigest: "sha256:wrong" }]) {
    await writeFile(authorizationPath, JSON.stringify(authorization));
    const calls = [];
    const errors = [];
    const exitCode = await runReleaseCli(["rollback", "--evidence", evidencePath, "--authorization", authorizationPath, "--execute"], {
      getVercelVersion: async () => authorization === baseline ? "99.0.0" : "56.5.0",
      execute: async (...args) => calls.push(args),
      stdout: { write() {} },
      stderr: { write: (value) => errors.push(String(value)) },
    });
    assert.equal(exitCode, 1);
    assert.equal(calls.length, 0);
    assert.match(errors.join(""), /required|approval|digest/i);
  }
});

test("rollback provider failure is redacted, not retried, and never claims Production is unchanged", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-rollback-provider-"));
  const evidencePath = join(fixtureDir, "evidence.json");
  const authorizationPath = join(fixtureDir, "authorization.json");
  const evidence = validEvidence();
  await writeFile(evidencePath, JSON.stringify(evidence));
  await writeFile(authorizationPath, JSON.stringify(validRollbackAuthorization(evidence)));
  const calls = [];
  const errors = [];

  const exitCode = await runReleaseCli(["rollback", "--evidence", evidencePath, "--authorization", authorizationPath, "--execute"], {
    getVercelVersion: async () => "56.5.0",
    execute: async (...args) => {
      calls.push(args);
      throw new Error("provider failure token=secret");
    },
    stdout: { write() {} },
    stderr: { write: (value) => errors.push(String(value)) },
  });

  assert.equal(exitCode, 1);
  assert.equal(calls.length, 1);
  assert.doesNotMatch(errors.join(""), /token=secret/);
  assert.match(errors.join(""), /indeterminate/i);
  assert.doesNotMatch(errors.join(""), /Production (?:was not|is un)changed/i);
});

test("promotion defaults to dry-run and executes only the exact immutable deployment with --execute", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-release-"));
  const evidencePath = join(fixtureDir, "evidence.json");
  const approvalPath = join(fixtureDir, "approval.json");
  const evidence = validEvidence();
  await writeFile(evidencePath, JSON.stringify(evidence));
  await writeFile(approvalPath, JSON.stringify(validApproval(evidence)));
  const calls = [];
  const output = [];
  const dependencies = {
    getCurrentCommit: async () => COMMIT,
    isWorkingTreeClean: async () => true,
    getVercelVersion: async () => "56.5.0",
    execute: async (command, args) => calls.push([command, args]),
    stdout: { write: (value) => output.push(String(value)) },
    stderr: { write() {} },
  };

  assert.equal(await runReleaseCli(["promote", "--evidence", evidencePath, "--approval", approvalPath], dependencies), 0);
  assert.equal(calls.length, 0);
  assert.match(output.join(""), /DRY RUN/);
  assert.match(output.join(""), /vercel promote dpl_candidateImmutable123 --yes/);

  assert.equal(await runReleaseCli(["promote", "--evidence", evidencePath, "--approval", approvalPath, "--execute"], dependencies), 0);
  assert.deepEqual(calls, [["vercel", ["promote", "dpl_candidateImmutable123", "--yes"]]]);
});

test("explicit promotion blocks before provider mutation when the Vercel CLI version differs", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-release-version-"));
  const evidencePath = join(fixtureDir, "evidence.json");
  const approvalPath = join(fixtureDir, "approval.json");
  const evidence = validEvidence();
  await writeFile(evidencePath, JSON.stringify(evidence));
  await writeFile(approvalPath, JSON.stringify(validApproval(evidence)));
  const calls = [];
  const errors = [];
  const exitCode = await runReleaseCli(["promote", "--evidence", evidencePath, "--approval", approvalPath, "--execute"], {
    getCurrentCommit: async () => COMMIT,
    isWorkingTreeClean: async () => true,
    getVercelVersion: async () => "99.0.0",
    execute: async (...args) => calls.push(args),
    stdout: { write() {} },
    stderr: { write: (value) => errors.push(String(value)) },
  });
  assert.equal(exitCode, 1);
  assert.equal(calls.length, 0);
  assert.match(errors.join(""), /Vercel CLI 56\.5\.0 is required/i);
});

test("digest CLI prints the exact approval digest for an evidence artifact", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-release-digest-"));
  const evidencePath = join(fixtureDir, "evidence.json");
  const evidence = validEvidence();
  await writeFile(evidencePath, JSON.stringify(evidence));
  const output = [];
  const exitCode = await runReleaseCli(["digest", "--evidence", evidencePath], {
    stdout: { write: (value) => output.push(String(value)) },
    stderr: { write() {} },
  });
  assert.equal(exitCode, 0);
  assert.equal(output.join("").trim(), releaseEvidenceDigest(evidence));
});

test("release CLI rejects unknown or command-inappropriate options before any external work", async () => {
  for (const args of [
    ["evidence", "--preview-url", "https://moving-alias.vercel.app"],
    ["digest", "--execute"],
    ["promote", "--source-commit", COMMIT],
  ]) {
    const calls = [];
    const errors = [];
    const exitCode = await runReleaseCli(args, {
      getCurrentCommit: async () => calls.push("git"),
      stdout: { write() {} },
      stderr: { write: (value) => errors.push(String(value)) },
    });
    assert.equal(exitCode, 1);
    assert.equal(calls.length, 0);
    assert.match(errors.join(""), /unsupported option/i);
  }
});

test("evidence CLI derives immutable Preview, rollback, base commit, and noindex proof from provider data", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-release-evidence-"));
  const gatesPath = join(fixtureDir, "gates.json");
  const outputPath = join(fixtureDir, "evidence.json");
  await writeFile(gatesPath, JSON.stringify(validEvidence().validation));
  const deploymentCalls = [];
  const gitCalls = [];
  const dependencies = {
    getCurrentCommit: async () => COMMIT,
    isWorkingTreeClean: async () => true,
    getExpectedProjectId: () => PROJECT,
    getDeployment: async (deploymentId) => {
      deploymentCalls.push(deploymentId);
      if (deploymentId === "dpl_candidateImmutable123") {
        return {
          id: deploymentId,
          url: "jp-pump-a1b2c3d4e-team.vercel.app",
          projectId: PROJECT,
          readyState: "READY",
          target: null,
          meta: { githubCommitSha: COMMIT },
        };
      }
      return {
        id: ROLLBACK,
        url: "jp-pump-production-team.vercel.app",
        projectId: PROJECT,
        readyState: "READY",
        target: "production",
        meta: { githubCommitSha: BASE_COMMIT },
      };
    },
    probePreview: async (url) => {
      assert.equal(url, "https://jp-pump-a1b2c3d4e-team.vercel.app");
      return {
        xRobotsTag: "noindex, nofollow",
        robotsText: "User-agent: *\nDisallow: /\n",
        sitemapText: '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      };
    },
    getContentSnapshots: async () => ({ base: {}, current: {} }),
    getRouteInventory: async () => ROUTE_INVENTORY,
    git: async (args) => {
      gitCalls.push(args);
      if (args[0] === "merge-base") return "";
      return "M\0website/src/data/company.json\0";
    },
    stdout: { write() {} },
    stderr: { write() {} },
  };

  const exitCode = await runReleaseCli([
    "evidence",
    "--preview-deployment", "dpl_candidateImmutable123",
    "--rollback-target", ROLLBACK,
    "--gates", gatesPath,
    "--output", outputPath,
  ], dependencies);

  assert.equal(exitCode, 0);
  assert.deepEqual(deploymentCalls, ["dpl_candidateImmutable123", ROLLBACK]);
  assert.deepEqual(gitCalls, [
    ["merge-base", "--is-ancestor", BASE_COMMIT, COMMIT],
    ["diff", "--name-status", "-z", `${BASE_COMMIT}...${COMMIT}`],
  ]);
  const evidence = JSON.parse(await readFile(outputPath, "utf8"));
  assert.equal(evidence.sourceCommit, COMMIT);
  assert.equal(evidence.preview.deploymentId, "dpl_candidateImmutable123");
  assert.equal(evidence.preview.indexable, false);
  assert.equal(evidence.rollback.deploymentId, ROLLBACK);
  assert.equal(evidence.baseCommit, BASE_COMMIT);
});

test("Preview policy rejects Production URLs in the Preview sitemap", () => {
  const policy = {
    xRobotsTag: "noindex, nofollow",
    robotsText: "User-agent: *\nDisallow: /\n",
    sitemapText: '<urlset><url><loc>https://jp-pump.com/zh-tw</loc></url></urlset>',
  };
  assert.throws(() => assertPreviewPolicy(policy), /sitemap isolation/i);
  assert.doesNotThrow(() => assertPreviewPolicy({ ...policy, sitemapText: "<urlset></urlset>" }));
});

test("evidence generation blocks when the rollback commit is not an ancestor of the candidate", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-release-ancestry-"));
  const gatesPath = join(fixtureDir, "gates.json");
  const outputPath = join(fixtureDir, "evidence.json");
  await writeFile(gatesPath, JSON.stringify(validEvidence().validation));
  const errors = [];
  const exitCode = await runReleaseCli([
    "evidence",
    "--preview-deployment", "dpl_candidateImmutable123",
    "--rollback-target", ROLLBACK,
    "--gates", gatesPath,
    "--output", outputPath,
  ], {
    getCurrentCommit: async () => COMMIT,
    isWorkingTreeClean: async () => true,
    getExpectedProjectId: () => PROJECT,
    getDeployment: async (deploymentId) => deploymentId === ROLLBACK
      ? { id: ROLLBACK, url: "jp-pump-production-team.vercel.app", projectId: PROJECT, readyState: "READY", target: "production", meta: { githubCommitSha: BASE_COMMIT } }
      : { id: deploymentId, url: "jp-pump-a1b2c3d4e-team.vercel.app", projectId: PROJECT, readyState: "READY", target: null, meta: { githubCommitSha: COMMIT } },
    probePreview: async () => ({ xRobotsTag: "noindex, nofollow", robotsText: "User-agent: *\nDisallow: /\n" }),
    git: async (args) => {
      if (args[0] === "merge-base") throw new Error("not an ancestor");
      throw new Error("diff must not run");
    },
    stdout: { write() {} },
    stderr: { write: (value) => errors.push(String(value)) },
  });
  assert.equal(exitCode, 1);
  assert.match(errors.join(""), /rollback commit is not an ancestor/i);
});

test("every promotion precondition failure exits nonzero with guidance and zero external calls", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-release-failure-"));
  const evidencePath = join(fixtureDir, "evidence.json");
  const approvalPath = join(fixtureDir, "approval.json");
  const baselineEvidence = validEvidence();
  await writeFile(evidencePath, JSON.stringify(baselineEvidence));
  await writeFile(approvalPath, JSON.stringify(validApproval(baselineEvidence)));

  for (const mismatch of [
    { evidence: baselineEvidence, approval: validApproval(baselineEvidence), currentCommit: "abcdefabcdefabcdefabcdefabcdefabcdefabcd", clean: true },
    { evidence: baselineEvidence, approval: validApproval(baselineEvidence), currentCommit: COMMIT, clean: false },
    { evidence: baselineEvidence, approval: { ...validApproval(baselineEvidence), status: "rejected" }, currentCommit: COMMIT, clean: true },
    { evidence: baselineEvidence, approval: { ...validApproval(baselineEvidence), sourceCommit: "abcdefabcdefabcdefabcdefabcdefabcdefabcd" }, currentCommit: COMMIT, clean: true },
    { evidence: { ...baselineEvidence, validation: { passed: false, gates: [{ name: "build", passed: false }] } }, approval: validApproval(baselineEvidence), currentCommit: COMMIT, clean: true },
    { evidence: { ...baselineEvidence, rollbackTarget: "" }, approval: validApproval(baselineEvidence), currentCommit: COMMIT, clean: true },
    { evidence: { ...baselineEvidence, preview: { ...baselineEvidence.preview, sourceCommit: "abcdefabcdefabcdefabcdefabcdefabcdefabcd" } }, approval: validApproval(baselineEvidence), currentCommit: COMMIT, clean: true },
  ]) {
    await writeFile(evidencePath, JSON.stringify(mismatch.evidence));
    await writeFile(approvalPath, JSON.stringify(mismatch.approval));
    const calls = [];
    const errors = [];
    const exitCode = await runReleaseCli(["promote", "--evidence", evidencePath, "--approval", approvalPath, "--execute"], {
      getCurrentCommit: async () => mismatch.currentCommit,
      isWorkingTreeClean: async () => mismatch.clean,
      execute: async (...args) => calls.push(args),
      stdout: { write() {} },
      stderr: { write: (value) => errors.push(String(value)) },
    });
    assert.equal(exitCode, 1);
    assert.equal(calls.length, 0);
    assert.match(errors.join(""), /retry|escalate/i);
  }
});

test("an external provider error is redacted and performs no automatic retry", async () => {
  const fixtureDir = await mkdtemp(join(tmpdir(), "jp-release-provider-"));
  const evidencePath = join(fixtureDir, "evidence.json");
  const approvalPath = join(fixtureDir, "approval.json");
  const evidence = validEvidence();
  await writeFile(evidencePath, JSON.stringify(evidence));
  await writeFile(approvalPath, JSON.stringify(validApproval(evidence)));

  const calls = [];
  const errors = [];
  const exitCode = await runReleaseCli(["promote", "--evidence", evidencePath, "--approval", approvalPath, "--execute"], {
    getCurrentCommit: async () => COMMIT,
    isWorkingTreeClean: async () => true,
    getVercelVersion: async () => "56.5.0",
    execute: async (...args) => {
      calls.push(args);
      throw new Error("provider unavailable token=secret");
    },
    stdout: { write() {} },
    stderr: { write: (value) => errors.push(String(value)) },
  });
  assert.equal(exitCode, 1);
  assert.equal(calls.length, 1);
  assert.doesNotMatch(errors.join(""), /token=secret/);
  assert.match(errors.join(""), /indeterminate/i);
  assert.doesNotMatch(errors.join(""), /Production was not changed/i);
});
