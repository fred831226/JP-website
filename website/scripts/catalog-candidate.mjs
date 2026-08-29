import { mkdir, rename, rm, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";

const numericFields = new Set(["horsepower_hp", "power_kw", "rated_head_m", "max_head_m", "total_head_m", "rated_flow_lmin", "max_flow_lmin", "weight_kg"]);
const technicalFields = ["horsepower_hp", "power_kw", "inlet_inch", "outlet_inch", "rated_head_m", "max_head_m", "total_head_m", "rated_flow_lmin", "max_flow_lmin", "power_source", "weight_kg"];
const requiredSeriesFields = ["id", "brandId", "name", "productName", "pumpType"];
const requiredModelFields = ["id", "name", "specs"];
const requiredOverviewFields = ["id", "brandId", "headMin", "headMax", "flowMin", "flowMax", "modelCount", "published"];
const decimalString = (value) => typeof value === "string" && /^\d+(\.\d+)?$/.test(value);

function sourceLabel(source = {}) {
  return `${source.file ?? "catalog candidate"} | ${source.sheet ?? "candidate"} | row ${source.row ?? "N/A"}`;
}

export function validateCatalogCandidate(candidate, source) {
  const generated = candidate?.generated?.series;
  const overview = candidate?.overview?.series;
  const at = sourceLabel(source);
  if (!Array.isArray(generated) || generated.length !== 22) throw new Error(`${at} | series: violated rule: exactly 22 canonical Series required`);
  if (!Array.isArray(overview) || overview.length !== 22) throw new Error(`${at} | overview.series: violated rule: exactly 22 canonical Series required`);
  const ids = new Set();
  const models = new Set();
  for (const series of generated) {
    for (const field of requiredSeriesFields) {
      if (typeof series?.[field] !== "string" || !series[field]) throw new Error(`${at} | series.${field} | record ${series?.id ?? "(missing)"}: violated rule: required Series field`);
    }
    if (!series.id || ids.has(series.id)) throw new Error(`${at} | series.id | record ${series.id ?? "(missing)"}: violated rule: unique stable Series id`);
    ids.add(series.id);
    if (!Array.isArray(series.purposeTags)) throw new Error(`${at} | series.purposeTags | record ${series.id}: violated rule: required Series field`);
    if (!Number.isInteger(series.modelCount) || series.modelCount < 0) throw new Error(`${at} | series.modelCount | record ${series.id}: violated rule: required Series field`);
    if (!Array.isArray(series.models)) throw new Error(`${at} | series.models | record ${series.id}: violated rule: Models must be an array`);
    if (series.modelCount !== series.models.length) throw new Error(`${at} | series.modelCount | record ${series.id}: violated rule: declared Model count must match Models`);
    for (const model of series.models) {
      for (const field of requiredModelFields) {
        if (field === "specs" ? !model?.specs || Array.isArray(model.specs) || typeof model.specs !== "object" : typeof model?.[field] !== "string" || !model[field]) {
          throw new Error(`${at} | model.${field} | record ${model?.id ?? "(missing)"}: violated rule: required Model field`);
        }
      }
      if (!model.id || models.has(model.id)) throw new Error(`${at} | model.id | record ${model.id ?? "(missing)"}: violated rule: each Model belongs to exactly one canonical Series`);
      models.add(model.id);
      if (Object.hasOwn(model, "pumpType")) throw new Error(`${at} | model.pumpType | record ${model.id}: violated rule: Pump Type is Series-level only`);
      for (const field of technicalFields) {
        if (!Object.hasOwn(model.specs, field)) throw new Error(`${at} | ${field} | record ${model.id}: violated rule: every consumed technical key must be present; use null when unknown`);
        const value = model.specs[field];
        if (value === "" || (typeof value === "string" && !value.trim())) throw new Error(`${at} | ${field} | record ${model.id}: violated rule: unknown technical values must be null`);
        if (numericFields.has(field) && value !== null && !decimalString(value)) throw new Error(`${at} | ${field} | record ${model.id}: violated rule: numeric decimal and declared unit required`);
        if (!numericFields.has(field) && value !== null && (typeof value !== "string" || !value.trim())) throw new Error(`${at} | ${field} | record ${model.id}: violated rule: technical text must be non-empty or null`);
      }
    }
  }
  for (const record of overview) {
    for (const field of requiredOverviewFields) {
      if (!Object.hasOwn(record ?? {}, field)) throw new Error(`${at} | overview.${field} | record ${record?.id ?? "(missing)"}: violated rule: required Overview field`);
    }
    if (typeof record.id !== "string" || !record.id || typeof record.brandId !== "string" || !record.brandId || !Array.isArray(record.purposeTags) || record.purposeTags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      throw new Error(`${at} | overview | record ${record?.id ?? "(missing)"}: violated rule: required Overview field`);
    }
    if (!Number.isInteger(record.modelCount) || record.modelCount < 0 || record.modelCount === null || record.published === undefined) {
      throw new Error(`${at} | overview | record ${record.id}: violated rule: required Overview field`);
    }
    for (const field of ["headMin", "headMax", "flowMin", "flowMax"]) {
      if (record[field] !== null && !decimalString(record[field])) throw new Error(`${at} | overview.${field} | record ${record.id}: violated rule: decimal string or null required`);
    }
    if (record.published !== null && record.published !== "是") throw new Error(`${at} | overview.published | record ${record.id}: violated rule: approved published value or null required`);
  }
  const overviewIds = new Set(overview.map(({ id }) => id));
  if (overviewIds.size !== 22 || [...ids].some((id) => !overviewIds.has(id))) throw new Error(`${at} | overview.id: violated rule: generated/overview stable-key join must be complete`);
  const overviewById = new Map(overview.map((record) => [record.id, record]));
  for (const series of generated) {
    if (overviewById.get(series.id).modelCount !== series.models.length) throw new Error(`${at} | overview.modelCount | record ${series.id}: violated rule: declared Model count must match Models`);
  }
}

export function validateCanonicalSeriesIds(candidate, expectedSeriesIds, source) {
  const expected = new Set(expectedSeriesIds);
  const actual = new Set(candidate.generated.series.map(({ id }) => id));
  const missing = [...expected].filter((id) => !actual.has(id));
  const unknown = [...actual].filter((id) => !expected.has(id));
  if (missing.length || unknown.length) {
    throw new Error(`${sourceLabel(source)} | series.id: violated rule: approved canonical Series identity set; missing: ${missing.join(", ") || "none"}; unknown: ${unknown.join(", ") || "none"}`);
  }
}

export async function publishCatalogCandidate(candidate, options) {
  validateCatalogCandidate(candidate, options.source);
  if (!Array.isArray(options.expectedSeriesIds) || options.expectedSeriesIds.length !== 22) throw new Error("catalog publisher requires a governed canonical Series identity contract");
  validateCanonicalSeriesIds(candidate, options.expectedSeriesIds, options.source);
  if (!options.releaseRoot) throw new Error("catalog publisher requires a releaseRoot for atomic version switching");
  return publishVersionedRelease(candidate, options);
}

async function publishVersionedRelease(candidate, options) {
  const releaseId = randomUUID();
  const releasesPath = join(options.releaseRoot, "releases");
  const stagePath = join(releasesPath, `.${releaseId}.stage`);
  const releasePath = join(releasesPath, releaseId);
  const indicatorPath = join(options.releaseRoot, "catalog-current.json");
  const indicatorStagePath = join(options.releaseRoot, `.${releaseId}.catalog-current.stage`);
  const files = [
    ["data/catalog.generated.json", candidate.generated],
    ["src/data/catalog.generated.json", candidate.generated],
    ["data/catalog-overview.json", candidate.overview],
    ["src/data/catalog-overview.json", candidate.overview],
  ];
  const injectFault = (phase, index) => {
    if (options.fault?.({ phase, index })) throw new Error(`injected publish failure during ${phase} ${index}`);
  };

  await mkdir(releasesPath, { recursive: true });
  try {
    for (const [index, [relativePath, body]] of files.entries()) {
      const targetPath = join(stagePath, relativePath);
      await mkdir(dirname(targetPath), { recursive: true });
      injectFault("stage", index);
      await writeFile(targetPath, `${JSON.stringify(body, null, 2)}\n`, "utf8");
    }
    await rename(stagePath, releasePath);
    await writeFile(indicatorStagePath, `${JSON.stringify({ release: `releases/${releaseId}` })}\n`, "utf8");
    injectFault("activate", 0);
    // This is the only reader-visible mutation: a reader resolves the indicator
    // once and can therefore reach either the complete old release or this
    // complete new release, never an in-progress combination of four files.
    await rename(indicatorStagePath, indicatorPath);
  } catch (error) {
    await unlink(indicatorStagePath).catch(() => {});
    // The indicator is the only activated state. Anything which did not reach
    // it must be removed so a later publish never discovers an ambiguous
    // staging directory or an unselected release.
    await rm(stagePath, { recursive: true, force: true }).catch(() => {});
    await rm(releasePath, { recursive: true, force: true }).catch(() => {});
    throw error;
  }

  // Retention cleanup is deliberately best-effort and happens only after the
  // release pointer is atomically switched. A cleanup problem cannot alter the
  // selected release or require a partial rollback.
  try {
    injectFault("cleanup", 0);
  } catch {
    // Keep older release directories for a later safe cleanup attempt.
  }
}
