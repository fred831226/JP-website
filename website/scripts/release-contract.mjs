import { createHash } from "node:crypto";

const COMMIT_PATTERN = /^[0-9a-f]{40}$/i;
const DEPLOYMENT_PATTERN = /^dpl_[A-Za-z0-9_-]+$/;
const PROJECT_PATTERN = /^prj_[A-Za-z0-9_-]+$/;
const REQUIRED_GATES = ["audit", "build", "lint", "test", "test:release", "validate"];

export class ReleaseContractError extends Error {
  constructor(message) {
    super(message);
    this.name = "ReleaseContractError";
  }
}

export function releaseEvidenceDigest(evidence) {
  return `sha256:${createHash("sha256").update(JSON.stringify(evidence)).digest("hex")}`;
}

function requireCondition(condition, message) {
  if (!condition) throw new ReleaseContractError(message);
}

function normalizePath(value) {
  return String(value ?? "").replaceAll("\\", "/").replace(/^\.\//, "");
}

export function parseGitNameStatus(value) {
  const tokens = String(value ?? "").split("\0");
  if (tokens.at(-1) === "") tokens.pop();
  const changes = [];
  for (let index = 0; index < tokens.length;) {
    const rawStatus = tokens[index++];
    const status = rawStatus?.[0];
    requireCondition(status && index < tokens.length, "Malformed NUL-delimited Git change report");
    const firstPath = tokens[index++];
    if (status === "R" || status === "C") {
      requireCondition(index < tokens.length, "Malformed Git rename/copy change report");
      const secondPath = tokens[index++];
      if (status === "R") changes.push({ status: "D", path: firstPath });
      changes.push({ status: "A", path: secondPath });
    } else {
      changes.push({ status, path: firstPath });
    }
  }
  return changes;
}

function routeForAppPage(path) {
  const match = path.match(/^website\/src\/app\/\[locale\](?:\/(.*))?\/page\.tsx$/);
  if (!match) return null;
  const suffix = (match[1] ?? "")
    .split("/")
    .filter((part) => part && !part.startsWith("("))
    .join("/");
  if (suffix.includes("[")) return null;
  return `/zh-tw/${suffix}`;
}

export function publicRoutesForPath(inputPath, routeInventory = {}) {
  const path = normalizePath(inputPath);
  const appRoute = routeForAppPage(path);
  if (appRoute) return [appRoute];
  if (/\/src\/app\/\[locale\]\/layout\.tsx$/.test(path)
    || /\/src\/app\/(?:robots|sitemap)\.ts$/.test(path)
    || /\/src\/app\/globals\.css$/.test(path)
    || /\/src\/components\//.test(path)
    || /\/src\/data\/(?:navigation|site)\.json$/.test(path)
    || /\/public\/media\//.test(path)
    || /redirects\.json$/.test(path)) return [...(routeInventory.all ?? [])];
  if (/\/src\/data\/(?:company)\.json$/.test(path)) return ["/zh-tw/company"];
  if (/\/src\/data\/(?:contact)\.json$/.test(path)) return ["/zh-tw/contact"];
  if (/\/src\/data\/(?:partners)\.json$/.test(path)) return ["/zh-tw/partners"];
  if (/\/src\/data\/(?:services|projects)\.json$/.test(path)) return ["/zh-tw/services"];
  if (/\/src\/data\/(?:home|hero)\.json$/.test(path)) return ["/zh-tw/"];
  if (/(?:catalog|source-catalog)/.test(path)) return [...(routeInventory.catalog ?? ["/zh-tw/products"])];
  return [];
}

function contentRoute(recordType, record, inheritedRoute) {
  if (recordType === "series" && typeof record.slug === "string") return `/zh-tw/series/${record.slug}`;
  if ((recordType === "types" || recordType === "catalog-types") && typeof record.slug === "string") return `/zh-tw/types/${record.slug}`;
  return inheritedRoute;
}

function contentRecords(sourceFile, snapshot) {
  const records = new Map();
  const fileType = sourceFile.split("/").at(-1)?.replace(/\.json$/i, "") ?? "record";
  function visit(value, pointer = [], inheritedRoute) {
    if (Array.isArray(value)) {
      for (const item of value) visit(item, pointer, inheritedRoute);
      return;
    }
    if (!value || typeof value !== "object") return;
    const recordType = pointer.at(-1) ?? fileType;
    const route = contentRoute(recordType, value, inheritedRoute);
    if (typeof value.id === "string" && value.id) {
      records.set(`${sourceFile}\0${recordType}\0${value.id}`, {
        sourceFile,
        recordType,
        id: value.id,
        route,
        value,
      });
    }
    for (const [key, child] of Object.entries(value)) visit(child, [...pointer, key], route);
  }
  visit(snapshot);
  return records;
}

function publicRecord(record, previousRoute) {
  const result = {
    sourceFile: record.sourceFile,
    recordType: record.recordType,
    id: record.id,
  };
  if (record.route) result.route = record.route;
  if (previousRoute && previousRoute !== record.route) result.previousRoute = previousRoute;
  return result;
}

export function classifyContentRecords(baseSnapshots = {}, currentSnapshots = {}) {
  const added = [];
  const changed = [];
  const removed = [];
  const files = [...new Set([...Object.keys(baseSnapshots), ...Object.keys(currentSnapshots)])].sort();
  for (const sourceFile of files) {
    const before = contentRecords(sourceFile, baseSnapshots[sourceFile]);
    const after = contentRecords(sourceFile, currentSnapshots[sourceFile]);
    for (const [key, record] of after) {
      const prior = before.get(key);
      if (!prior) added.push(publicRecord(record));
      else if (JSON.stringify(prior.value) !== JSON.stringify(record.value)) changed.push(publicRecord(record, prior.route));
    }
    for (const [key, record] of before) {
      if (!after.has(key)) removed.push(publicRecord(record));
    }
  }
  const compare = (left, right) => `${left.sourceFile}\0${left.recordType}\0${left.id}`.localeCompare(`${right.sourceFile}\0${right.recordType}\0${right.id}`);
  return { added: added.sort(compare), changed: changed.sort(compare), removed: removed.sort(compare) };
}

export function classifyRepositoryChanges(changes = [], routeInventory = {}) {
  const result = { added: [], changed: [], removed: [] };
  const routes = new Set();
  for (const change of changes) {
    const path = normalizePath(change?.path);
    requireCondition(path.length > 0, "Every repository change requires a path");
    const status = String(change?.status ?? "").toUpperCase().slice(0, 1);
    if (status === "A") result.added.push(path);
    else if (status === "D") result.removed.push(path);
    else if (["M", "C", "R", "T"].includes(status)) result.changed.push(path);
    else throw new ReleaseContractError(`Unsupported repository change status for ${path}`);
    for (const route of publicRoutesForPath(path, routeInventory)) routes.add(route);
  }
  for (const entries of Object.values(result)) entries.sort();
  return { ...result, affectedRoutes: [...routes].sort() };
}

function validatePreview(preview, sourceCommit) {
  requireCondition(preview && typeof preview === "object", "Preview identity is required");
  requireCondition(DEPLOYMENT_PATTERN.test(preview.deploymentId ?? ""), "Preview requires an immutable Vercel deployment ID");
  let url;
  try {
    url = new URL(preview.url);
  } catch {
    throw new ReleaseContractError("Preview URL must be a valid HTTPS URL");
  }
  requireCondition(url.protocol === "https:", "Preview URL must use HTTPS");
  requireCondition(url.hostname.endsWith(".vercel.app"), "Preview URL must be the provider deployment URL");
  requireCondition(!url.hostname.includes("-git-"), "Branch-only Preview URLs are not immutable approval evidence");
  requireCondition(!url.username && !url.password && !url.search && !url.hash, "Preview evidence URL must not contain credentials, query parameters, or fragments");
  requireCondition(preview.indexable === false, "Preview must be confirmed non-indexable");
  requireCondition(preview.sourceCommit === sourceCommit, "Preview source commit must equal the release source commit");
  requireCondition(PROJECT_PATTERN.test(preview.projectId ?? ""), "Preview requires a verified Vercel project ID");
  requireCondition(preview.readyState === "READY", "Preview deployment must be READY");
  requireCondition(preview.environment === "preview", "Preview deployment must belong to the Preview environment");
  return {
    deploymentId: preview.deploymentId,
    url: url.toString().replace(/\/$/, ""),
    sourceCommit: preview.sourceCommit,
    indexable: false,
    projectId: preview.projectId,
    readyState: "READY",
    environment: "preview",
  };
}

function validateGates(validation, sourceCommit) {
  requireCondition(validation?.sourceCommit === sourceCommit, "Gate report commit must equal the release source commit");
  requireCondition(validation?.passed === true, "All release gates must pass");
  requireCondition(Array.isArray(validation.gates) && validation.gates.length > 0, "Release evidence requires named gate results");
  const gates = validation.gates.map((gate) => {
    requireCondition(typeof gate?.name === "string" && gate.name.trim(), "Each release gate requires a name");
    requireCondition(gate.passed === true, `Release gate ${gate.name} did not pass`);
    return { name: gate.name.trim(), passed: true };
  });
  const gateNames = gates.map((gate) => gate.name).sort();
  requireCondition(
    new Set(gateNames).size === gateNames.length && JSON.stringify(gateNames) === JSON.stringify(REQUIRED_GATES),
    "Gate report must contain the exact required release gates",
  );
  return { sourceCommit, passed: true, gates };
}

function validateRollback(rollback, preview) {
  requireCondition(rollback && typeof rollback === "object", "Rollback deployment evidence is required");
  requireCondition(DEPLOYMENT_PATTERN.test(rollback.deploymentId ?? ""), "Rollback requires an immutable Vercel deployment ID");
  requireCondition(rollback.deploymentId !== preview.deploymentId, "Rollback deployment must differ from the candidate Preview");
  requireCondition(COMMIT_PATTERN.test(rollback.sourceCommit ?? ""), "Rollback requires a full source commit");
  requireCondition(rollback.projectId === preview.projectId, "Rollback deployment must belong to the same Vercel project");
  requireCondition(rollback.readyState === "READY", "Rollback deployment must be READY");
  requireCondition(rollback.environment === "production", "Rollback target must be a Production deployment");
  return {
    deploymentId: rollback.deploymentId,
    sourceCommit: rollback.sourceCommit,
    projectId: rollback.projectId,
    readyState: "READY",
    environment: "production",
  };
}

function removedRoutesForPath(path, knownRoutes) {
  const staticRoute = routeForAppPage(path);
  if (staticRoute) return [staticRoute];

  const dynamicRoute = normalizePath(path).match(/^website\/src\/app\/\[locale\]\/(series|types)\/\[slug\]\/page\.tsx$/);
  if (!dynamicRoute) return [];
  const prefix = `/zh-tw/${dynamicRoute[1]}/`;
  return knownRoutes.filter((route) => route.startsWith(prefix));
}

function removalTreatments(removedPaths, redirects, notFoundRoutes, retiredRoutes = [], knownRoutes = []) {
  const governedRedirects = new Map();
  for (const redirect of redirects ?? []) {
    requireCondition(typeof redirect?.source === "string" && redirect.source.startsWith("/"), "Redirect source must be an absolute public path");
    requireCondition(typeof redirect?.destination === "string" && redirect.destination.startsWith("/"), "Redirect destination must be an absolute public path");
    requireCondition(redirect.source !== redirect.destination, "Redirect source and destination must differ");
    requireCondition(typeof redirect.permanent === "boolean", "Redirect permanence must be explicit");
    requireCondition(!governedRedirects.has(redirect.source), `Duplicate governed redirect source: ${redirect.source}`);
    governedRedirects.set(redirect.source, redirect);
  }
  const knownRouteSet = new Set(knownRoutes);
  for (const redirect of governedRedirects.values()) {
    requireCondition(!governedRedirects.has(redirect.destination), `Redirect chains and loops are not allowed: ${redirect.source}`);
    requireCondition(knownRouteSet.has(redirect.destination), `Redirect destination is not a known public route: ${redirect.destination}`);
  }
  const governedNotFound = new Set();
  for (const route of notFoundRoutes ?? []) {
    requireCondition(
      typeof route === "string" && route.startsWith("/") && !route.startsWith("//") && !/[?#]/.test(route),
      "Not-found authority entries must be absolute public paths without query strings or fragments",
    );
    requireCondition(!governedNotFound.has(route), `Duplicate not-found authority route: ${route}`);
    governedNotFound.add(route);
  }
  const treatments = [];
  const routes = new Set(retiredRoutes.filter(Boolean));
  for (const path of removedPaths) {
    for (const route of removedRoutesForPath(path, knownRoutes)) routes.add(route);
  }
  for (const route of [...routes].sort()) {
    const redirect = governedRedirects.get(route);
    if (redirect) treatments.push({ route, treatment: "redirect", destination: redirect.destination });
    else if (governedNotFound.has(route)) treatments.push({ route, treatment: "not-found" });
    else throw new ReleaseContractError(`Untreated public removal: ${route}. Add a governed nearest-target redirect or explicit not-found treatment.`);
  }
  return treatments;
}

export function buildReleaseEvidence(input) {
  const sourceCommit = input?.sourceCommit;
  requireCondition(COMMIT_PATTERN.test(sourceCommit ?? ""), "Release source commit must be a full 40-character Git commit");
  const classified = classifyRepositoryChanges(input.changes, input.routeInventory);
  const contentChanges = input.contentChanges ?? { added: [], changed: [], removed: [] };
  const preview = validatePreview(input.preview, sourceCommit);
  const validation = validateGates(input.validation, sourceCommit);
  const rollback = validateRollback(input.rollback, preview);
  const retiredRoutes = [
    ...contentChanges.removed.map((record) => record.route),
    ...contentChanges.changed.map((record) => record.previousRoute),
  ].filter(Boolean);
  const knownRoutes = new Set(input.routeInventory?.all ?? []);
  for (const records of Object.values(contentChanges)) {
    for (const record of records) if (record.route && !retiredRoutes.includes(record.route)) knownRoutes.add(record.route);
  }
  const removals = removalTreatments(
    classified.removed,
    input.redirects,
    input.notFoundRoutes,
    retiredRoutes,
    [...knownRoutes],
  );
  const affectedRoutes = new Set(classified.affectedRoutes);
  for (const records of Object.values(contentChanges)) {
    for (const record of records) {
      if (record.route) affectedRoutes.add(record.route);
      if (record.previousRoute) affectedRoutes.add(record.previousRoute);
    }
  }
  return {
    schemaVersion: 1,
    sourceCommit,
    preview,
    validation,
    changes: {
      added: classified.added,
      changed: classified.changed,
      removed: classified.removed,
    },
    affectedRoutes: [...affectedRoutes].sort(),
    contentChanges,
    removals,
    rollback,
    rollbackTarget: rollback.deploymentId,
    baseCommit: rollback.sourceCommit,
    projectId: preview.projectId,
  };
}

export function verifyPromotionPreconditions({ evidence, approval, currentCommit, workingTreeClean }) {
  requireCondition(evidence?.schemaVersion === 1, "Unsupported or malformed release evidence");
  requireCondition(COMMIT_PATTERN.test(evidence.sourceCommit ?? ""), "Evidence source commit is invalid");
  validatePreview(evidence.preview, evidence.sourceCommit);
  validateGates(evidence.validation, evidence.sourceCommit);
  const rollback = validateRollback(evidence.rollback, evidence.preview);
  requireCondition(evidence.rollbackTarget === rollback.deploymentId, "Rollback target does not match verified rollback evidence");
  requireCondition(evidence.baseCommit === rollback.sourceCommit, "Release base commit does not match verified rollback evidence");
  requireCondition(evidence.projectId === evidence.preview.projectId, "Release project does not match Preview evidence");
  requireCondition(approval?.status === "approved", "JP PUMP approval is missing or rejected");
  requireCondition(approval.sourceCommit === evidence.sourceCommit, "Approved commit does not match the Preview evidence commit");
  requireCondition(approval.deploymentId === evidence.preview.deploymentId, "Approved deployment does not match the Preview evidence deployment");
  requireCondition(typeof approval.approvedBy === "string" && approval.approvedBy.trim().length > 0, "Approval requires the JP PUMP approver identity");
  requireCondition(
    typeof approval.approvedAt === "string" && approval.approvedAt.includes("T") && Number.isFinite(Date.parse(approval.approvedAt)),
    "Approval requires an ISO timestamp",
  );
  requireCondition(
    typeof approval.approvalReference === "string" && approval.approvalReference.trim().length > 0,
    "Approval requires an access-controlled approval reference",
  );
  requireCondition(approval.evidenceDigest === releaseEvidenceDigest(evidence), "Approval does not match the exact release evidence digest");
  requireCondition(currentCommit === evidence.sourceCommit, "Current HEAD does not match the approved release commit");
  requireCondition(workingTreeClean === true, "Working tree is dirty; promotion from uncommitted state is blocked");
  return {
    deploymentId: evidence.preview.deploymentId,
    rollbackTarget: rollback.deploymentId,
    sourceCommit: evidence.sourceCommit,
  };
}

export function verifyRollbackPreconditions({ evidence, authorization }) {
  requireCondition(evidence?.schemaVersion === 1, "Unsupported or malformed release evidence");
  requireCondition(COMMIT_PATTERN.test(evidence.sourceCommit ?? ""), "Evidence source commit is invalid");
  validatePreview(evidence.preview, evidence.sourceCommit);
  validateGates(evidence.validation, evidence.sourceCommit);
  const restored = validateRollback(evidence.rollback, evidence.preview);
  requireCondition(evidence.rollbackTarget === restored.deploymentId, "Rollback target does not match verified rollback evidence");
  requireCondition(evidence.baseCommit === restored.sourceCommit, "Release base commit does not match verified rollback evidence");
  requireCondition(evidence.projectId === evidence.preview.projectId, "Release project does not match Preview evidence");
  requireCondition(authorization?.status === "approved", "JP PUMP rollback approval is missing or rejected");
  requireCondition(
    authorization.restoredDeploymentId === restored.deploymentId,
    "Authorized restored deployment does not match the known-good rollback target",
  );
  requireCondition(
    authorization.supersededDeploymentId === evidence.preview.deploymentId,
    "Authorized superseded deployment does not match the promoted release deployment",
  );
  requireCondition(
    authorization.restoredDeploymentId !== authorization.supersededDeploymentId,
    "Restored and superseded deployments must differ",
  );
  requireCondition(authorization.projectId === evidence.projectId, "Rollback authorization belongs to a different Vercel project");
  requireCondition(
    authorization.evidenceDigest === releaseEvidenceDigest(evidence),
    "Rollback authorization does not match the exact release evidence digest",
  );
  requireCondition(
    typeof authorization.authorizedBy === "string" && authorization.authorizedBy.trim().length > 0,
    "Rollback approval requires the JP PUMP authorizer identity",
  );
  requireCondition(
    typeof authorization.authorizedAt === "string"
      && authorization.authorizedAt.includes("T")
      && Number.isFinite(Date.parse(authorization.authorizedAt)),
    "Rollback approval requires an ISO timestamp",
  );
  requireCondition(
    typeof authorization.authorizationReference === "string" && authorization.authorizationReference.trim().length > 0,
    "Rollback approval requires an access-controlled authorization reference",
  );
  return {
    restoredDeploymentId: restored.deploymentId,
    supersededDeploymentId: evidence.preview.deploymentId,
    projectId: evidence.projectId,
    restoredSourceCommit: restored.sourceCommit,
    supersededSourceCommit: evidence.sourceCommit,
  };
}
