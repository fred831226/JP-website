import assert from "node:assert/strict";
import { copyFile, cp, readFile, mkdtemp, readdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "../..");
const json = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
async function activeReleaseJson(relativePath) {
  const indicator = await json("catalog-current.json");
  return JSON.parse(await readFile(resolve(root, indicator.release, relativePath), "utf8"));
}

async function runScript(script, fixtureRoot) {
  return new Promise((resolveResult) => {
    const child = spawn(process.execPath, [resolve(root, script)], { env: { ...process.env, CATALOG_ROOT: fixtureRoot } });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("close", (code) => resolveResult({ code, output }));
  });
}

async function releaseFixture(prefix) {
  const fixtureRoot = await mkdtemp(join(tmpdir(), prefix));
  await cp(resolve(root, "data"), join(fixtureRoot, "data"), { recursive: true });
  await cp(resolve(root, "src", "data"), join(fixtureRoot, "src", "data"), { recursive: true });
  await cp(resolve(root, "src", "components"), join(fixtureRoot, "src", "components"), { recursive: true });
  await cp(resolve(root, "public", "media"), join(fixtureRoot, "public", "media"), { recursive: true });
  await copyFile(resolve(root, "catalog-current.json"), join(fixtureRoot, "catalog-current.json"));
  await cp(resolve(root, "releases"), join(fixtureRoot, "releases"), { recursive: true });
  return fixtureRoot;
}

function candidateFixture(label = "candidate") {
  return {
    generated: {
      series: Array.from({ length: 22 }, (_, index) => ({
        id: `series-${index}`,
        brandId: "jp-pump",
        name: label,
        productName: label,
        pumpType: "臥式泵",
        purposeTags: [],
        modelCount: 0,
        models: [],
      })),
    },
    overview: { series: Array.from({ length: 22 }, (_, index) => ({ id: `series-${index}`, brandId: "jp-pump", purposeTags: [], headMin: null, headMax: null, flowMin: null, flowMax: null, modelCount: 0, published: null })) },
  };
}

function candidateWithModel(label = "candidate") {
  const candidate = candidateFixture(label);
  candidate.generated.series[0].models = [{
    id: "model-0",
    name: "Model 0",
    specs: {
      horsepower_hp: null,
      power_kw: null,
      inlet_inch: null,
      outlet_inch: null,
      rated_head_m: null,
      max_head_m: null,
      total_head_m: null,
      rated_flow_lmin: null,
      max_flow_lmin: null,
      power_source: null,
      weight_kg: null,
    },
  }];
  candidate.generated.series[0].modelCount = 1;
  candidate.overview.series[0].modelCount = 1;
  return candidate;
}

const candidateIds = (candidate) => candidate.generated.series.map(({ id }) => id);
const publishFixtureCandidate = (publisher, candidate, options) => publisher(candidate, { ...options, expectedSeriesIds: options.expectedSeriesIds ?? candidateIds(candidate) });
const releaseOutputPaths = async (fixtureRoot) => {
  const { release } = JSON.parse(await readFile(join(fixtureRoot, "catalog-current.json"), "utf8"));
  return ["data/catalog.generated.json", "data/catalog-overview.json", "src/data/catalog.generated.json", "src/data/catalog-overview.json"].map((relative) => join(fixtureRoot, release, relative));
};

async function mutateWorkbook(fixtureRoot, sheetName, headerRow, changes) {
  const xlsx = await import("xlsx");
  const workbookPath = join(fixtureRoot, "data", "source-catalog.xlsx");
  const workbook = xlsx.read(await readFile(workbookPath), { type: "buffer" });
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: null, header: 1 });
  const columns = Object.fromEntries((rows[headerRow] ?? []).map((header, index) => [String(header).trim(), index]));
  for (const { row, field, value } of changes) {
    const address = xlsx.utils.encode_cell({ r: row, c: columns[field] });
    sheet[address] = { t: "s", v: value };
  }
  await writeFile(workbookPath, xlsx.write(workbook, { type: "buffer", bookType: "xlsx" }));
}

test("catalog data has exactly 22 canonical series with one pump type and unique model assignment", async () => {
  const generated = await json("data/catalog.generated.json");
  const content = await json("data/catalog-content.json");
  const overview = await json("data/catalog-overview.json");
  assert.equal(generated.series.length, 22);
  assert.equal(content.series.length, 22);
  assert.equal(overview.series.length, 22);
  assert.equal(new Set(content.series.map(({ slug }) => slug)).size, 22);
  assert.ok(generated.series.every(({ pumpType }) => typeof pumpType === "string" && pumpType.length > 0));
  assert.equal(generated.series.find(({ name }) => name === "VBSG")?.pumpType, "臥式泵");
  const modelIds = generated.series.flatMap(({ models }) => models.map(({ id }) => id));
  assert.equal(new Set(modelIds).size, modelIds.length);
});

test("public schema is singular at Series level and has no Model pump type", async () => {
  const schema = await readFile(resolve(root, "src/lib/validation/catalog.ts"), "utf8");
  assert.match(schema, /pumpTypeId:\s*z\.string/);
  assert.doesNotMatch(schema, /pumpTypeIds/);
  assert.doesNotMatch(schema, /models:[\s\S]*?pumpType:/);
});

test("approved Booster copy and internal review boundary are governed", async () => {
  const content = await json("data/catalog-content.json");
  const governance = await json("data/catalog-overview-governance.json");
  const booster = content.series.find(({ id }) => id === "grundfos-2cr-i-n-booster");
  assert.equal(booster?.shortDescription, "2CR(I,N) Booster 雙台變頻恆壓泵浦，採恆定壓力交替並列變頻供水，依據水量調整泵浦數量及變頻供水。");
  for (const statement of ["恆壓交替並列", "靜音", "防水鎚", "無水保護", "過載保護", "異常交替", "檢修方便", "提供運轉及異常監視接點", "節省能源", "容易選型、安裝及試車"]) {
    assert.match(booster?.introduction ?? "", new RegExp(statement));
  }
  assert.deepEqual(governance.review, { reviewer: "Fred", reviewDate: "2026-08-21", publicLastUpdatedDate: "2026-08-21" });
  assert.doesNotMatch(JSON.stringify(content), /Fred/);
});

test("invalid candidates fail before atomic output replacement", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-"));
  const generatedPath = join(dir, "catalog.generated.json");
  const overviewPath = join(dir, "catalog-overview.json");
  await writeFile(generatedPath, "known-generated");
  await writeFile(overviewPath, "known-overview");
  await assert.rejects(
    publishCatalogCandidate({ generated: { series: [] }, overview: { series: [] } }, {
      generatedPath,
      overviewPath,
      source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 },
    }),
    /fixture\.xlsx.*完整產品規格表.*row 4.*22 canonical Series/i,
  );
  assert.equal(await readFile(generatedPath, "utf8"), "known-generated");
  assert.equal(await readFile(overviewPath, "utf8"), "known-overview");
});

test("candidate rejects an unknown stable Series ID even when all 22 records still join", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const generated = await activeReleaseJson("data/catalog.generated.json");
  const overview = await activeReleaseJson("data/catalog-overview.json");
  const expectedIds = (await json("data/catalog-content.json")).series.map(({ id }) => id);
  const replacedId = "unapproved-replacement";
  generated.series[21] = { ...generated.series[21], id: replacedId };
  overview.series[21] = { ...overview.series[21], id: replacedId };
  await assert.rejects(
    publishCatalogCandidate({ generated, overview }, {
      expectedSeriesIds: expectedIds,
      source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 25 },
    }),
    /fixture\.xlsx.*完整產品規格表.*row 25.*approved canonical Series identity set.*unapproved-replacement/i,
  );
});

test("publisher requires the governed canonical Series identity contract before activation", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-required-identity-"));
  const candidate = candidateFixture("unapproved");
  await assert.rejects(
    publishCatalogCandidate(candidate, { releaseRoot: dir, source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } }),
    /canonical Series identity contract/i,
  );
});

test("publisher rejects malformed Overview ranges before activation", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-overview-contract-"));
  const candidate = candidateFixture();
  candidate.overview.series[0].headMin = {};
  await assert.rejects(
    publishCatalogCandidate(candidate, { releaseRoot: dir, expectedSeriesIds: candidateIds(candidate), source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } }),
    /overview\.headMin.*decimal/i,
  );
});

test("publisher rejects whitespace-only technical values before activation", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-whitespace-candidate-"));
  const candidate = candidateWithModel();
  candidate.generated.series[0].models[0].specs.power_source = " ";
  await assert.rejects(
    publishCatalogCandidate(candidate, { releaseRoot: dir, expectedSeriesIds: candidateIds(candidate), source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } }),
    /power_source.*unknown technical values must be null/i,
  );
});

test("publisher keeps the previous release selected when activation fails", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-publisher-activate-"));
  const candidate = candidateFixture();
  await publishFixtureCandidate(publishCatalogCandidate, candidate, { releaseRoot: dir, source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } });
  const oldIndicator = await readFile(join(dir, "catalog-current.json"), "utf8");
  const oldRelease = JSON.parse(oldIndicator).release;
  const oldBodies = await Promise.all(["data/catalog.generated.json", "src/data/catalog.generated.json", "data/catalog-overview.json", "src/data/catalog-overview.json"].map((path) => readFile(join(dir, oldRelease, path))));
  await assert.rejects(
    publishFixtureCandidate(publishCatalogCandidate, candidate, {
      releaseRoot: dir,
      source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 },
      fault: ({ phase }) => phase === "activate",
    }),
    /injected publish failure/i,
  );
  assert.equal(await readFile(join(dir, "catalog-current.json"), "utf8"), oldIndicator);
  const retainedBodies = await Promise.all(["data/catalog.generated.json", "src/data/catalog.generated.json", "data/catalog-overview.json", "src/data/catalog-overview.json"].map((path) => readFile(join(dir, oldRelease, path))));
  retainedBodies.forEach((body, index) => assert.deepEqual(body, oldBodies[index]));
});

test("publisher cleanup faults preserve the selected complete release", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-publisher-cleanup-"));
  const candidate = candidateFixture();
  await publishFixtureCandidate(publishCatalogCandidate, candidate, {
    releaseRoot: dir,
    source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 },
    fault: ({ phase }) => phase === "cleanup",
  });
  const indicator = JSON.parse(await readFile(join(dir, "catalog-current.json"), "utf8"));
  assert.equal(JSON.parse(await readFile(join(dir, indicator.release, "data", "catalog.generated.json"), "utf8")).series.length, 22);
});

test("publisher exposes a complete four-file candidate through one atomic release indicator", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-release-indicator-"));
  const candidate = candidateFixture();
  await publishFixtureCandidate(publishCatalogCandidate, candidate, {
    releaseRoot: dir,
    source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 },
    fault: ({ phase }) => phase === "cleanup",
  });
  const indicator = JSON.parse(await readFile(join(dir, "catalog-current.json"), "utf8"));
  assert.match(indicator.release, /^releases\/[\w-]+$/);
  const released = await Promise.all([
    "data/catalog.generated.json",
    "src/data/catalog.generated.json",
    "data/catalog-overview.json",
    "src/data/catalog-overview.json",
  ].map((path) => readFile(join(dir, indicator.release, path), "utf8")));
  assert.equal(released.filter((body) => body.includes("series-21")).length, 4);
});

test("release validation rejects legacy media assigned to a different Series", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-media-");
  const contentPath = join(fixtureRoot, "data", "catalog-content.json");
  const content = JSON.parse(await readFile(contentPath, "utf8"));
  content.series[0].image = content.series[1].image;
  await writeFile(contentPath, JSON.stringify(content, null, 2));
  await writeFile(join(fixtureRoot, "src", "data", "catalog-content.json"), JSON.stringify(content, null, 2));
  const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /media.*relationship|relationship.*media/i);
});

test("release validation rejects a non-decimal Overview range with source field evidence", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-overview-range-");
  await mutateWorkbook(fixtureRoot, "網頁_產品總覽", 0, [{ row: 1, field: "揚程最小值_m", value: "not-a-decimal" }]);
  const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /source-catalog\.xlsx.*網頁_產品總覽![A-Z]+2.*揚程最小值_m.*decimal\/unit rule/i);
});

test("importer reports the actual filter-tag Excel column for malformed ranges", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-filter-range-location-");
  await mutateWorkbook(fixtureRoot, "網站篩選標籤", 2, [{ row: 3, field: "揚程最小值", value: "not-a-decimal" }]);
  const result = await runScript("scripts/import-catalog.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /source-catalog\.xlsx.*網站篩選標籤![A-Z]+4.*揚程最小值.*decimal\/unit rule/i);
});

test("release validation rejects a filter-tag Series absent from the main sheet", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-filter-series-");
  await mutateWorkbook(fixtureRoot, "網站篩選標籤", 2, [{ row: 3, field: "產品系列", value: "不存在系列" }]);
  const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /網站篩選標籤.*產品系列.*missing from main sheet/i);
});

test("importer rejects an isolated unknown-Brand workbook without changing paired outputs", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-workbook-");
  const xlsx = await import("xlsx");
  const workbookPath = join(fixtureRoot, "data", "source-catalog.xlsx");
  const workbook = xlsx.read(await readFile(workbookPath), { type: "buffer" });
  workbook.Sheets["完整產品規格表"].A4.v = "未知品牌";
  await writeFile(workbookPath, xlsx.write(workbook, { type: "buffer", bookType: "xlsx" }));
  const outputPaths = await releaseOutputPaths(fixtureRoot);
  const before = await Promise.all(outputPaths.map((path) => readFile(path)));
  const result = await new Promise((resolveResult) => {
    const child = spawn(process.execPath, [resolve(root, "scripts/import-catalog.mjs")], { env: { ...process.env, CATALOG_ROOT: fixtureRoot } });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("close", (code) => resolveResult({ code, output }));
  });
  assert.notEqual(result.code, 0);
  assert.match(result.output, /完整產品規格表!A4: unknown brand "未知品牌"/);
  const after = await Promise.all(outputPaths.map((path) => readFile(path)));
  after.forEach((body, index) => assert.deepEqual(body, before[index]));
});

test("importer rejects an exchanged governed HP/kW header without changing four outputs", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-unit-header-");
  await mutateWorkbook(fixtureRoot, "完整產品規格表", 2, [{ row: 2, field: "馬力_HP", value: "功率_kW" }]);
  const outputPaths = await releaseOutputPaths(fixtureRoot);
  const before = await Promise.all(outputPaths.map((path) => readFile(path)));
  const result = await runScript("scripts/import-catalog.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /完整產品規格表!H3.*expected governed header\/unit "馬力_HP".*功率_kW/i);
  const after = await Promise.all(outputPaths.map((path) => readFile(path)));
  after.forEach((body, index) => assert.deepEqual(body, before[index]));
});

test("standalone validation rejects an exchanged governed HP/kW header with source location", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-validate-unit-header-");
  await mutateWorkbook(fixtureRoot, "完整產品規格表", 2, [{ row: 2, field: "馬力_HP", value: "功率_kW" }]);
  const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /source-catalog\.xlsx.*完整產品規格表.*row 3.*馬力_HP.*governed header\/unit/i);
});

test("importer blocks a missing Overview brand column instead of publishing fallback data", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-overview-header-");
  await mutateWorkbook(fixtureRoot, "網頁_產品總覽", 0, [{ row: 0, field: "品牌", value: "品牌已移除" }]);
  const outputPaths = await releaseOutputPaths(fixtureRoot);
  const before = await Promise.all(outputPaths.map((path) => readFile(path)));
  const result = await runScript("scripts/import-catalog.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /網頁_產品總覽.*品牌.*required column missing/i);
  const after = await Promise.all(outputPaths.map((path) => readFile(path)));
  after.forEach((body, index) => assert.deepEqual(body, before[index]));
});

test("importer preserves blank governed numeric cells as null rather than rejecting an empty string", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-null-spec-");
  await mutateWorkbook(fixtureRoot, "完整產品規格表", 2, [{ row: 3, field: "馬力_HP", value: "" }]);
  const result = await runScript("scripts/import-catalog.mjs", fixtureRoot);
  assert.equal(result.code, 0, result.output);
  const indicator = JSON.parse(await readFile(join(fixtureRoot, "catalog-current.json"), "utf8"));
  const generated = JSON.parse(await readFile(join(fixtureRoot, indicator.release, "data", "catalog.generated.json"), "utf8"));
  assert.equal(generated.series.flatMap((series) => series.models).find((model) => model.id)?.specs.horsepower_hp, null);
});

test("importer requires exactly one Overview record for every main-sheet Series without changing old outputs", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-missing-overview-");
  await mutateWorkbook(fixtureRoot, "網頁_產品總覽", 0, [
    { row: 1, field: "品牌", value: "" },
    { row: 1, field: "產品系列", value: "" },
  ]);
  const outputPaths = await releaseOutputPaths(fixtureRoot);
  const before = await Promise.all(outputPaths.map((path) => readFile(path)));
  const result = await runScript("scripts/import-catalog.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /完整產品規格表!B\d+.*missing unique Overview join/i);
  const after = await Promise.all(outputPaths.map((path) => readFile(path)));
  after.forEach((body, index) => assert.deepEqual(body, before[index]));
});

test("import and standalone validation enforce every consumed main-sheet header/unit", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-full-header-");
  await mutateWorkbook(fixtureRoot, "完整產品規格表", 2, [{ row: 2, field: "電源", value: "電源_V" }]);
  const importResult = await runScript("scripts/import-catalog.mjs", fixtureRoot);
  assert.notEqual(importResult.code, 0);
  assert.match(importResult.output, /完整產品規格表!X3.*expected governed header\/unit "電源"/i);
  const validationResult = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(validationResult.code, 0);
  assert.match(validationResult.output, /完整產品規格表.*row 3.*電源.*governed header\/unit/i);
});

test("standalone validation treats a technical empty string as blocking while null remains the only unknown value", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-empty-tech-");
  const indicator = JSON.parse(await readFile(join(fixtureRoot, "catalog-current.json"), "utf8"));
  for (const relative of ["data/catalog.generated.json", "src/data/catalog.generated.json"]) {
    const path = join(fixtureRoot, indicator.release, relative);
    const generated = JSON.parse(await readFile(path, "utf8"));
    generated.series[0].models[0].specs.horsepower_hp = "";
    await writeFile(path, JSON.stringify(generated, null, 2));
  }
  const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /horsepower_hp.*empty technical value.*null/i);
});

test("standalone validation blocks whitespace-only technical text", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-whitespace-tech-");
  const indicator = JSON.parse(await readFile(join(fixtureRoot, "catalog-current.json"), "utf8"));
  for (const relative of ["data/catalog.generated.json", "src/data/catalog.generated.json"]) {
    const path = join(fixtureRoot, indicator.release, relative);
    const generated = JSON.parse(await readFile(path, "utf8"));
    generated.series[0].models[0].specs.power_source = " ";
    await writeFile(path, JSON.stringify(generated, null, 2));
  }
  const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /power_source.*empty technical value.*null/i);
});

test("candidate rejects missing models, model specs, required fields, and inconsistent modelCount before activation", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  for (const [label, mutate, expected] of [
    ["models", (candidate) => { delete candidate.generated.series[0].models; }, /models.*Models must be an array/i],
    ["specs", (candidate) => { candidate.generated.series[0].models = [{ id: "model-0", name: "Model 0" }]; candidate.generated.series[0].modelCount = 1; }, /model\.specs.*required Model field/i],
    ["field", (candidate) => { delete candidate.generated.series[0].brandId; }, /series\.brandId.*required Series field/i],
    ["count", (candidate) => { candidate.generated.series[0].modelCount = 1; }, /modelCount.*declared Model count/i],
  ]) {
    const candidate = candidateFixture();
    mutate(candidate);
    await assert.rejects(
      publishFixtureCandidate(publishCatalogCandidate, candidate, { releaseRoot: await mkdtemp(join(tmpdir(), `jp-story-2-8-${label}-`)), source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 7 } }),
      expected,
    );
  }
});

test("standalone validation blocks missing, malformed, and dangling release indicators", async () => {
  for (const [label, indicator, expected] of [
    ["missing", null, /Missing required release indicator/i],
    ["malformed", "{not json", /Release indicator must be valid JSON/i],
    ["dangling", JSON.stringify({ release: "releases/missing-release" }), /Missing file:.*releases[\\/]missing-release/i],
  ]) {
    const fixtureRoot = await releaseFixture(`jp-story-2-8-indicator-${label}-`);
    const path = join(fixtureRoot, "catalog-current.json");
    if (indicator === null) await (await import("node:fs/promises")).unlink(path);
    else await writeFile(path, indicator);
    const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
    assert.notEqual(result.code, 0);
    assert.match(result.output, expected);
  }
});

test("standalone validation blocks a missing consumed technical key", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-missing-tech-");
  const indicator = JSON.parse(await readFile(join(fixtureRoot, "catalog-current.json"), "utf8"));
  for (const relative of ["data/catalog.generated.json", "src/data/catalog.generated.json"]) {
    const path = join(fixtureRoot, indicator.release, relative);
    const generated = JSON.parse(await readFile(path, "utf8"));
    delete generated.series[0].models[0].specs.power_kw;
    await writeFile(path, JSON.stringify(generated, null, 2));
  }
  const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /power_kw.*Missing consumed technical key/i);
});

test("importer reports malformed technical data at the actual later workbook row", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-later-tech-row-");
  await mutateWorkbook(fixtureRoot, "完整產品規格表", 2, [{ row: 4, field: "馬力_HP", value: "not-a-decimal" }]);
  const result = await runScript("scripts/import-catalog.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /完整產品規格表!H5.*horsepower_hp.*non-numeric range/i);
});

test("standalone validation rejects malformed main-sheet technical data at the actual later workbook cell", async () => {
  const fixtureRoot = await releaseFixture("jp-story-2-8-standalone-later-tech-row-");
  await mutateWorkbook(fixtureRoot, "完整產品規格表", 2, [{ row: 4, field: "馬力_HP", value: "not-a-decimal" }]);
  const result = await runScript("scripts/validate-content.mjs", fixtureRoot);
  assert.notEqual(result.code, 0);
  assert.match(result.output, /source-catalog\.xlsx.*完整產品規格表!H5.*horsepower_hp.*decimal\/unit rule/i);
});

test("publisher removes unactivated staging and release directories after stage or activation failures", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-publish-cleanup-"));
  const candidate = candidateFixture();
  await publishFixtureCandidate(publishCatalogCandidate, candidate, { releaseRoot: dir, source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } });
  const oldIndicator = await readFile(join(dir, "catalog-current.json"), "utf8");
  const before = await readdir(join(dir, "releases"));
  for (const phase of ["stage", "activate"]) {
    await assert.rejects(
      publishFixtureCandidate(publishCatalogCandidate, candidate, {
        releaseRoot: dir,
        source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 },
        fault: ({ phase: current }) => current === phase,
      }),
      /injected publish failure/i,
    );
    assert.equal(await readFile(join(dir, "catalog-current.json"), "utf8"), oldIndicator);
    assert.deepEqual(await readdir(join(dir, "releases")), before);
  }
});

test("a cleanup fault cannot change the indicator and a later publish can activate successfully", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-publish-retry-"));
  const candidate = (label) => candidateFixture(label);
  await publishFixtureCandidate(publishCatalogCandidate, candidate("1"), { releaseRoot: dir, source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } });
  const oldIndicator = await readFile(join(dir, "catalog-current.json"), "utf8");
  await publishFixtureCandidate(publishCatalogCandidate, candidate("cleanup-fault"), {
    releaseRoot: dir,
    source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 },
    fault: ({ phase }) => phase === "cleanup",
  });
  const cleanupIndicator = await readFile(join(dir, "catalog-current.json"), "utf8");
  assert.notEqual(cleanupIndicator, oldIndicator);
  await publishFixtureCandidate(publishCatalogCandidate, candidate("retry"), { releaseRoot: dir, source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } });
  const indicator = JSON.parse(await readFile(join(dir, "catalog-current.json"), "utf8"));
  const generated = JSON.parse(await readFile(join(dir, indicator.release, "data", "catalog.generated.json"), "utf8"));
  assert.equal(generated.series[0].name, "retry");
});

test("a reader that captures one indicator stays on one complete release when activation occurs between file reads", async () => {
  const { publishCatalogCandidate } = await import("../../scripts/catalog-candidate.mjs");
  const dir = await mkdtemp(join(tmpdir(), "jp-story-2-8-reader-snapshot-"));
  const candidate = (label) => ({ ...candidateFixture(label), overview: { series: candidateFixture().overview.series.map((record) => ({ ...record, headMin: label })) } });
  await publishFixtureCandidate(publishCatalogCandidate, candidate("1"), { releaseRoot: dir, source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } });
  const captured = JSON.parse(await readFile(join(dir, "catalog-current.json"), "utf8"));
  await publishFixtureCandidate(publishCatalogCandidate, candidate("2"), { releaseRoot: dir, source: { file: "fixture.xlsx", sheet: "完整產品規格表", row: 4 } });
  const generated = JSON.parse(await readFile(join(dir, captured.release, "data", "catalog.generated.json"), "utf8"));
  const overview = JSON.parse(await readFile(join(dir, captured.release, "data", "catalog-overview.json"), "utf8"));
  assert.equal(generated.series[0].name, "1");
  assert.equal(overview.series[0].headMin, "1");
  const loader = await readFile(resolve(root, "src/lib/content/load-catalog.ts"), "utf8");
  assert.match(loader, /const release = readCatalogRelease\(\);[\s\S]*const generated = release\.generated;[\s\S]*const overview = release\.overview;/);
  assert.doesNotMatch(loader, /legacyPath|existsSync\(indicatorPath\)/);
});

test("versioned release files are included in the Next output tracing contract", async () => {
  const config = await readFile(resolve(root, "next.config.ts"), "utf8");
  assert.match(config, /outputFileTracingIncludes/);
  assert.match(config, /catalog-current\.json/);
  assert.match(config, /releases\/\*\*\/\*/);
});
