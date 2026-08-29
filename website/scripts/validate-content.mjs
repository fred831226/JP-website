// Content & release validation gate
// Usage: node scripts/validate-content.mjs
// Checks: schemas, IDs, links, media rights, sitemap consistency

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const xlsx = await import("xlsx");

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.CATALOG_ROOT ? resolve(process.env.CATALOG_ROOT) : resolve(__dirname, "..");
let errors = [];
let warnings = [];

function err(file, record, field, msg) {
  errors.push({ file, record, field, message: msg });
}

function warn(file, record, field, msg) {
  warnings.push({ file, record, field, message: msg });
}

// 1. Load catalog files
const releaseIndicatorPath = resolve(ROOT, "catalog-current.json");
let releasePath = null;
if (!existsSync(releaseIndicatorPath)) {
  err("catalog-current.json", "release", "indicator", "Missing required release indicator");
} else {
  try {
    const indicator = JSON.parse(readFileSync(releaseIndicatorPath, "utf-8"));
    if (!/^releases\/[a-z0-9-]+$/i.test(indicator.release ?? "")) err("catalog-current.json", "release", "indicator", "Release indicator must select a versioned releases/<id> directory");
    else releasePath = resolve(ROOT, indicator.release);
  } catch {
    err("catalog-current.json", "release", "indicator", "Release indicator must be valid JSON");
  }
}
const catalogPath = (relativePath) => releasePath ? resolve(releasePath, relativePath) : null;
const genPath = catalogPath("data/catalog.generated.json");
const publicGenPath = catalogPath("src/data/catalog.generated.json");
const contentPath = resolve(ROOT, "data", "catalog-content.json");
const publicContentPath = resolve(ROOT, "src", "data", "catalog-content.json");
const overviewPath = catalogPath("data/catalog-overview.json");
const publicOverviewPath = catalogPath("src/data/catalog-overview.json");
const overviewGovernancePath = resolve(ROOT, "data", "catalog-overview-governance.json");
const sourceCatalogPath = resolve(ROOT, "data", "source-catalog.xlsx");
const brandsPath = resolve(ROOT, "src", "data", "catalog-brands.json");
const typesPath = resolve(ROOT, "src", "data", "catalog-types.json");
const purposesPath = resolve(ROOT, "src", "data", "catalog-purposes.json");

for (const [label, p] of [["generated", genPath], ["public-generated", publicGenPath], ["content", contentPath], ["public-content", publicContentPath], ["overview", overviewPath], ["public-overview", publicOverviewPath], ["overview-governance", overviewGovernancePath], ["source-catalog", sourceCatalogPath], ["brands", brandsPath], ["types", typesPath], ["purposes", purposesPath]]) {
  if (!p || !existsSync(p)) err("N/A", label, "file", `Missing file: ${p ?? "selected release"}`);
}

if (errors.length > 0) {
  printReport();
  process.exit(1);
}

const gen = JSON.parse(readFileSync(genPath, "utf-8"));
const publicGen = JSON.parse(readFileSync(publicGenPath, "utf-8"));
const content = JSON.parse(readFileSync(contentPath, "utf-8"));
const publicContent = JSON.parse(readFileSync(publicContentPath, "utf-8"));
const overview = JSON.parse(readFileSync(overviewPath, "utf-8"));
const publicOverview = JSON.parse(readFileSync(publicOverviewPath, "utf-8"));
const overviewGovernance = JSON.parse(readFileSync(overviewGovernancePath, "utf-8"));
const brands = JSON.parse(readFileSync(brandsPath, "utf-8"));
const pumpTypes = JSON.parse(readFileSync(typesPath, "utf-8"));
const approvedPumpTypes = [
  { id: "horizontal-pump", name: "臥式泵", slug: "horizontal-pump" },
  { id: "submersible-well-pump", name: "沉水式揚水泵", slug: "submersible-well-pump" },
  { id: "sewage-pump", name: "沉水式污水泵", slug: "sewage-pump" },
  { id: "vertical-multistage-pump", name: "立式楊水泵", slug: "vertical-multistage-pump" },
];
const approvedPumpTypeNames = new Set(approvedPumpTypes.map((type) => type.name));
const homepagePumpTypeNames = content.homepagePumpTypes?.map((type) => type.name) ?? [];

for (const [file, records] of [["catalog.generated.json", gen.series], ["catalog-content.json", content.series], ["catalog-overview.json", overview.series]]) {
  if (!Array.isArray(records) || records.length !== 22) err(file, "series", "cardinality", "Must contain exactly 22 canonical Series");
}
if (overviewGovernance.review?.reviewer !== "Fred" || overviewGovernance.review?.reviewDate !== "2026-08-21" || overviewGovernance.review?.publicLastUpdatedDate !== "2026-08-21") {
  err("catalog-overview-governance.json", "review", "boundary", "Internal reviewer/date and public last-updated date must match the approved 2026-08-21 baseline");
}
if (/Fred/.test(JSON.stringify(content)) || /reviewer/.test(JSON.stringify(content))) err("catalog-content.json", "catalog", "privacy", "Internal reviewer data must not enter public content");
const canonicalIds = new Set(gen.series.map(({ id }) => id));
const contentIdsForJoin = new Set(content.series.map(({ id }) => id));
const overviewIdsForJoin = new Set(overview.series.map(({ id }) => id));
if (canonicalIds.size !== 22 || contentIdsForJoin.size !== 22 || overviewIdsForJoin.size !== 22 || [...canonicalIds].some((id) => !contentIdsForJoin.has(id) || !overviewIdsForJoin.has(id))) {
  err("catalog", "series", "stable-key join", "Generated, content, and overview must have one complete unique 22-Series stable-key join");
}
const vbsg = gen.series.find(({ name }) => name === "VBSG");
if (!vbsg || vbsg.pumpType !== "臥式泵") err("catalog.generated.json", "VBSG", "pumpType", "VBSG must belong only to 臥式泵");
const allModelIds = gen.series.flatMap(({ models }) => models.map(({ id }) => id));
if (new Set(allModelIds).size !== allModelIds.length) err("catalog.generated.json", "models", "id", "Each source Model must belong to exactly one canonical Series");

if (JSON.stringify(homepagePumpTypeNames) !== JSON.stringify(approvedPumpTypes.map((type) => type.name))) {
  err("catalog-content.json", "homepagePumpTypes", "name", "Homepage pump types must be exactly the four approved names and order");
}

if (JSON.stringify(gen.series) !== JSON.stringify(publicGen.series)) {
  err("src/data/catalog.generated.json", "series", "content", "Public generated catalog does not match data/catalog.generated.json");
}
if (JSON.stringify(content) !== JSON.stringify(publicContent)) {
  err("src/data/catalog-content.json", "catalog", "content", "Public catalog content does not match data/catalog-content.json");
}
if (JSON.stringify(overview) !== JSON.stringify(publicOverview)) {
  err("src/data/catalog-overview.json", "catalog", "content", "Public catalog overview does not match data/catalog-overview.json");
}
const publicPumpTypes = pumpTypes.map(({ id, name, slug }) => ({ id, name, slug }));
if (JSON.stringify(publicPumpTypes) !== JSON.stringify(approvedPumpTypes)) {
  err("src/data/catalog-types.json", "pumpTypes", "taxonomy", "Pump types must be exactly the four approved IDs, names, slugs, and order");
}

const sourceWorkbook = xlsx.read(readFileSync(sourceCatalogPath), { type: "buffer" });
const sourceSheet = sourceWorkbook.Sheets["完整產品規格表"];
const sourceOverviewSheet = sourceWorkbook.Sheets["網頁_產品總覽"];
const sourceFilterTagsSheet = sourceWorkbook.Sheets["網站篩選標籤"];
const brandIdByName = new Map([["傑平", "jp-pump"], ["葛蘭富", "grundfos"]]);
const excelSeries = new Map();
const excelOverview = new Map();
const excelFilterOverview = new Map();
const text = (value) => String(value ?? "").trim();
const canonicalSeriesName = (value) => text(value) === "自吸式" ? "Y系列" : text(value);
const decimalRange = (value, file, record, field) => {
  const normalized = text(value);
  if (!normalized) return null;
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    err(file, record, field, "Non-numeric range violates the decimal/unit rule");
    return null;
  }
  return normalized;
};
const governedMainHeaders = new Map([
  [0, "品牌"], [1, "產品系列"], [2, "產品名稱"], [3, "型號"], [4, "產品識別碼"], [5, "用途"], [6, "泵浦類型"],
  [7, "馬力_HP"], [8, "功率_kW"], [9, "入口口徑_inch"], [10, "出口口徑_inch"], [12, "額定揚程_m"], [14, "最高揚程_m"], [15, "全揚程_m"],
  [17, "額定水量_Lmin"], [19, "最大水量_Lmin"], [23, "電源"], [36, "重量_kg"], [39, "來源PDF"], [40, "資料狀態"],
  [41, "用途標籤1"], [42, "用途標籤2"], [43, "用途標籤3"], [44, "用途標籤4"], [45, "用途標籤5"], [46, "用途標籤6"], [47, "用途標籤7"], [48, "用途標籤8"],
]);
const governedMainNumericFields = new Map([
  [7, "horsepower_hp"], [8, "power_kw"], [12, "rated_head_m"], [14, "max_head_m"],
  [15, "total_head_m"], [17, "rated_flow_lmin"], [19, "max_flow_lmin"], [36, "weight_kg"],
]);

if (!sourceSheet) {
  err("source-catalog.xlsx", "完整產品規格表", "sheet", "Required catalog sheet is missing");
} else {
  const mainSheetRows = xlsx.utils.sheet_to_json(sourceSheet, { defval: null, header: 1 });
  const headers = mainSheetRows[2] ?? [];
  for (const [index, expected] of governedMainHeaders) {
    const actual = text(headers[index]);
    if (actual !== expected) err("source-catalog.xlsx", "完整產品規格表 row 3", expected, `Violated governed header/unit contract: expected "${expected}", received "${actual || "(blank)"}"`);
  }
  const sourceRows = mainSheetRows.slice(3);
  for (const [rowIndex, row] of sourceRows.entries()) {
    const sourceRow = rowIndex + 4;
    for (const [index, field] of governedMainNumericFields) {
      const value = text(row[index]);
      if (value && !/^\d+(\.\d+)?$/.test(value)) {
        err("source-catalog.xlsx", `完整產品規格表!${xlsx.utils.encode_col(index)}${sourceRow}`, field, "Non-numeric technical value violates the decimal/unit rule");
      }
    }
    if (!row.slice(0, 7).some((value) => text(value))) continue;
    const brandName = text(row[0]);
    const brandId = brandIdByName.get(brandName);
      const seriesName = canonicalSeriesName(row[1]);
    const modelName = text(row[3]);
    const modelId = text(row[4]);
    const pumpType = text(row[6]);
    if (!brandName) err("source-catalog.xlsx", `row${sourceRow}`, "A", "Missing brand");
    else if (!brandId) err("source-catalog.xlsx", `row${sourceRow}`, "A", `Unknown brand: ${brandName}`);
    if (!seriesName) err("source-catalog.xlsx", `row${sourceRow}`, "B", "Missing series name");
    if (!modelName) err("source-catalog.xlsx", `row${sourceRow}`, "D", "Missing model name");
    if (!modelId) err("source-catalog.xlsx", `row${sourceRow}`, "E", "Missing product identifier");
    if (!approvedPumpTypeNames.has(pumpType)) err("source-catalog.xlsx", `${seriesName || `row${sourceRow}`}`, "G", `Unknown pump type: ${pumpType || "(blank)"}`);
    if (!brandId || !seriesName || !modelName || !modelId || !approvedPumpTypeNames.has(pumpType)) continue;

    const key = `${brandId}|${seriesName}`;
    const entry = excelSeries.get(key) ?? { brandId, seriesName, pumpType, models: new Map(), modelIds: new Set() };
    if (entry.pumpType !== pumpType) err("source-catalog.xlsx", `${seriesName}@row${sourceRow}`, "G", `Series mixes pump types "${entry.pumpType}" and "${pumpType}"`);
    if (entry.models.has(modelName)) err("source-catalog.xlsx", `${seriesName}@row${sourceRow}`, "D", `Duplicate model name: ${modelName}`);
    if (entry.modelIds.has(modelId)) err("source-catalog.xlsx", `${seriesName}@row${sourceRow}`, "E", `Duplicate product identifier: ${modelId}`);
    entry.models.set(modelName, modelId);
    entry.modelIds.add(modelId);
    excelSeries.set(key, entry);
  }
}

if (!sourceOverviewSheet) {
  err("source-catalog.xlsx", "網頁_產品總覽", "sheet", "Required overview sheet is missing");
} else {
  const overviewRows = xlsx.utils.sheet_to_json(sourceOverviewSheet, { defval: null, header: 1 });
  const overviewHeaders = overviewRows[0] ?? [];
  const column = Object.fromEntries(overviewHeaders.map((value, index) => [text(value), index]));
  for (const required of ["品牌", "產品系列", "泵浦類型"]) {
    if (column[required] === undefined) err("source-catalog.xlsx", "網頁_產品總覽", required, "Missing required column");
  }
  if (["品牌", "產品系列", "泵浦類型"].every((name) => column[name] !== undefined)) {
    for (const [rowIndex, row] of overviewRows.slice(1).entries()) {
      const sourceRow = rowIndex + 2;
      const brandName = text(row[column["品牌"]]);
      const seriesName = text(row[column["產品系列"]]);
      if (!brandName && !seriesName) continue;
      const brandId = brandIdByName.get(brandName);
      const pumpType = text(row[column["泵浦類型"]]);
      if (!brandId) err("source-catalog.xlsx", `overview@row${sourceRow}`, "品牌", `Unknown brand: ${brandName || "(blank)"}`);
      if (!seriesName) err("source-catalog.xlsx", `overview@row${sourceRow}`, "產品系列", "Missing series name");
      if (!approvedPumpTypeNames.has(pumpType)) err("source-catalog.xlsx", `${seriesName || `overview@row${sourceRow}`}`, "泵浦類型", `Unknown pump type: ${pumpType || "(blank)"}`);
      if (!brandId || !seriesName || !approvedPumpTypeNames.has(pumpType)) continue;
      const key = `${brandId}|${seriesName}`;
      const main = excelSeries.get(key);
      if (!main) err("source-catalog.xlsx", `${seriesName}@overview-row${sourceRow}`, "產品系列", "Overview series is missing from main sheet");
      else if (main.pumpType !== pumpType) err("source-catalog.xlsx", `${seriesName}@overview-row${sourceRow}`, "泵浦類型", `Overview value "${pumpType}" does not match main sheet "${main.pumpType}"`);
      if (excelOverview.has(key)) err("source-catalog.xlsx", `${seriesName}@overview-row${sourceRow}`, "產品系列", "Duplicate overview series");
      excelOverview.set(key, {
        purpose: text(row[column["用途標籤"] ?? column["用途"]]),
        purposeTags: text(row[column["用途標籤"] ?? column["用途"]]).split(/[,，、/]/).map((value) => value.trim()).filter(Boolean),
        headMin: column["揚程最小值_m"] !== undefined ? decimalRange(row[column["揚程最小值_m"]], "source-catalog.xlsx", `網頁_產品總覽!${xlsx.utils.encode_col(column["揚程最小值_m"])}${sourceRow}`, "揚程最小值_m") : null,
        headMax: column["揚程最大值_m"] !== undefined ? decimalRange(row[column["揚程最大值_m"]], "source-catalog.xlsx", `網頁_產品總覽!${xlsx.utils.encode_col(column["揚程最大值_m"])}${sourceRow}`, "揚程最大值_m") : null,
        flowMin: column["水量最小值_Lmin"] !== undefined ? decimalRange(row[column["水量最小值_Lmin"]], "source-catalog.xlsx", `網頁_產品總覽!${xlsx.utils.encode_col(column["水量最小值_Lmin"])}${sourceRow}`, "水量最小值_Lmin") : null,
        flowMax: column["水量最大值_Lmin"] !== undefined ? decimalRange(row[column["水量最大值_Lmin"]], "source-catalog.xlsx", `網頁_產品總覽!${xlsx.utils.encode_col(column["水量最大值_Lmin"])}${sourceRow}`, "水量最大值_Lmin") : null,
        modelCount: column["型號數量"] !== undefined && row[column["型號數量"]] != null ? Number(row[column["型號數量"]]) : null,
        published: text(row[column["首頁代表"] ?? column["是否發布"]]),
      });
    }
  }
}

if (!sourceFilterTagsSheet) {
  err("source-catalog.xlsx", "網站篩選標籤", "sheet", "Required filter tags sheet is missing");
} else {
  const filterRows = xlsx.utils.sheet_to_json(sourceFilterTagsSheet, { defval: null, header: 1 });
  const headers = filterRows[2] ?? [];
  const column = Object.fromEntries(headers.map((value, index) => [text(value), index]));
  for (const required of ["品牌", "產品系列", "揚程最小值", "揚程最大值", "水量最小值", "水量最大值"]) {
    if (column[required] === undefined) err("source-catalog.xlsx", "網站篩選標籤", required, "Missing required column");
  }
  if (["品牌", "產品系列", "揚程最小值", "揚程最大值", "水量最小值", "水量最大值"].every((name) => column[name] !== undefined)) {
    for (const [rowIndex, row] of filterRows.slice(3).entries()) {
        const brandName = text(row[column["品牌"]]);
        const brandId = brandIdByName.get(brandName);
        const seriesName = canonicalSeriesName(row[column["產品系列"]]);
        if (!brandName && !seriesName) continue;
        if (!brandName) {
          err("source-catalog.xlsx", `網站篩選標籤@row${rowIndex + 4}`, "品牌", "Missing Brand");
          continue;
        }
        if (!brandId) {
          err("source-catalog.xlsx", `網站篩選標籤@row${rowIndex + 4}`, "品牌", `Unknown Brand: ${brandName}`);
          continue;
        }
        if (!seriesName) {
          err("source-catalog.xlsx", `網站篩選標籤@row${rowIndex + 4}`, "產品系列", "Missing Series");
          continue;
      }
      const key = `${brandId}|${seriesName}`;
      if (!excelSeries.has(key)) {
        err("source-catalog.xlsx", `網站篩選標籤@row${rowIndex + 4}`, "產品系列", "Filter-tag Series is missing from main sheet");
        continue;
      }
      const aggregate = excelFilterOverview.get(key) ?? { headMin: null, headMax: null, flowMin: null, flowMax: null };
      for (const [field, columnName, mode] of [["headMin", "揚程最小值", "min"], ["headMax", "揚程最大值", "max"], ["flowMin", "水量最小值", "min"], ["flowMax", "水量最大值", "max"]]) {
        const raw = row[column[columnName]];
        if (raw == null || text(raw) === "" || text(raw) === "未提供") continue;
        const decimal = text(raw);
        if (!/^\d+(\.\d+)?$/.test(decimal)) {
          err("source-catalog.xlsx", `網站篩選標籤!${xlsx.utils.encode_col(column[columnName])}${rowIndex + 4}`, columnName, "Non-numeric range violates the decimal/unit rule");
          continue;
        }
        const value = Number(decimal);
        aggregate[field] = aggregate[field] == null ? value : (mode === "min" ? Math.min(aggregate[field], value) : Math.max(aggregate[field], value));
      }
      excelFilterOverview.set(key, aggregate);
    }
  }
}

const generatedByKey = new Map();
for (const series of gen.series) {
  const sourceSeriesName = series.sourceSeriesName ?? series.name;
  const key = `${series.brandId}|${sourceSeriesName}`;
  const group = generatedByKey.get(key) ?? [];
  group.push(series);
  generatedByKey.set(key, group);
}
for (const [key, excel] of excelSeries) {
  const generatedGroup = generatedByKey.get(key);
  if (!generatedGroup) {
    err("catalog.generated.json", key, "series", "Excel series is missing from generated catalog");
    continue;
  }
  for (const generated of generatedGroup) {
    if (generated.pumpType !== excel.pumpType) err("catalog.generated.json", generated.id, "pumpType", `Value "${generated.pumpType}" does not match Excel "${excel.pumpType}"`);
  }
  const generatedModels = new Map();
  for (const generated of generatedGroup) {
    for (const model of generated.models) {
      if (generatedModels.has(model.name)) err("catalog.generated.json", generated.id, "models", `Model is assigned to more than one public series: ${model.name}`);
      generatedModels.set(model.name, model.id);
    }
  }
  for (const [modelName, modelId] of excel.models) {
    if (!generatedModels.has(modelName)) err("catalog.generated.json", key, "models", `Excel model is missing: ${modelName}`);
    else if (generatedModels.get(modelName) !== modelId) err("catalog.generated.json", `${key}/${modelName}`, "model.id", `Identifier "${generatedModels.get(modelName)}" does not match Excel "${modelId}"`);
  }
  for (const [modelName] of generatedModels) {
    if (!excel.models.has(modelName)) err("source-catalog.xlsx", key, "models", `Generated model is missing from Excel: ${modelName}`);
  }
}
for (const [key, generatedGroup] of generatedByKey) {
  if (!excelSeries.has(key)) err("source-catalog.xlsx", generatedGroup.map((series) => series.id).join(","), "series", "Generated series is missing from Excel");
}

for (const generated of overview.series) {
  const excelKey = `${generated.brandId}|${generated.id === "jp-pump-y" ? "Y系列" : gen.series.find((series) => series.id === generated.id)?.sourceSeriesName}`;
  const excel = excelOverview.get(excelKey);
  const filter = excelFilterOverview.get(excelKey);
  const governed = overviewGovernance.series.find((entry) => entry.id === generated.id);
  if (!excel) {
    err("catalog-overview.json", generated.id, "series", "Generated overview is missing from Excel");
    continue;
  }
  const expected = {
    headMin: filter?.headMin != null ? String(filter.headMin) : excel.headMin,
    headMax: filter?.headMax != null ? String(filter.headMax) : excel.headMax,
    flowMin: filter?.flowMin != null ? String(filter.flowMin) : excel.flowMin,
    flowMax: filter?.flowMax != null ? String(filter.flowMax) : excel.flowMax,
  };
  for (const [field, value] of Object.entries(expected)) {
    if (generated[field] !== value) err("catalog-overview.json", generated.id, field, `Value "${generated[field]}" does not match Excel aggregation "${value}"`);
  }
  if (generated.modelCount !== excel.modelCount) err("catalog-overview.json", generated.id, "modelCount", `Value "${generated.modelCount}" does not match Excel "${excel.modelCount}"`);
  if (JSON.stringify(generated.purposeTags) !== JSON.stringify(excel.purposeTags)) err("catalog-overview.json", generated.id, "purposeTags", "Value does not match Excel");
  const expectedPublished = excel.published || governed?.published || "";
  if ((generated.published ?? "") !== expectedPublished) err("catalog-overview.json", generated.id, "published", "Value does not match the Excel or governed fallback value");
}

if (!Array.isArray(overviewGovernance.series)) {
  err("catalog-overview-governance.json", "series", "type", "Series must be an array");
} else {
  const seenGovernanceIds = new Set();
  for (const entry of overviewGovernance.series) {
    const allowedFields = new Set(["id", "purposeTags", "published"]);
    const unknownFields = Object.keys(entry).filter((field) => !allowedFields.has(field));
    if (!entry.id) err("catalog-overview-governance.json", "(missing id)", "id", "Missing series id");
    else if (seenGovernanceIds.has(entry.id)) err("catalog-overview-governance.json", entry.id, "id", "Duplicate series id");
    if (unknownFields.length) err("catalog-overview-governance.json", entry.id || "(missing id)", "fields", `Unknown fields: ${unknownFields.join(", ")}`);
    if (entry.purposeTags !== undefined && (!Array.isArray(entry.purposeTags) || entry.purposeTags.some((tag) => !text(tag)))) err("catalog-overview-governance.json", entry.id, "purposeTags", "Invalid purposeTags");
    if (entry.published !== undefined && entry.published !== "是") err("catalog-overview-governance.json", entry.id, "published", `Invalid value: ${entry.published}`);
    const generated = gen.series.find((series) => series.id === entry.id);
    if (entry.id && !generated) err("catalog-overview-governance.json", entry.id, "id", "Orphaned governance entry");
    if (generated) {
      const excel = excelOverview.get(`${generated.brandId}|${generated.sourceSeriesName ?? generated.name}`);
      if (entry.purposeTags !== undefined && excel?.purpose) err("catalog-overview-governance.json", entry.id, "purposeTags", "Governance duplicates an Excel-owned purpose value");
      if (entry.published !== undefined && excel?.published) err("catalog-overview-governance.json", entry.id, "published", "Governance duplicates an Excel-owned published value");
    }
    if (entry.id) seenGovernanceIds.add(entry.id);
  }
}

// 2. Check stable ID uniqueness
const genIds = gen.series.map((s) => s.id);
const contentIds = content.series.map((s) => s.id);
const dupGen = genIds.filter((id, i) => genIds.indexOf(id) !== i);
const dupContent = contentIds.filter((id, i) => contentIds.indexOf(id) !== i);
if (dupGen.length) err("catalog.generated.json", "series", "id", `Duplicate IDs: ${dupGen.join(", ")}`);
if (dupContent.length) err("catalog-content.json", "series", "id", `Duplicate IDs: ${dupContent.join(", ")}`);

// 3. Check generated vs content ID alignment
for (const gs of gen.series) {
  const c = content.series.find((s) => s.id === gs.id);
  if (!c) err("catalog-content.json", gs.id, "id", `Missing content entry for series "${gs.name}" (id: ${gs.id})`);
}

for (const cs of content.series) {
  const g = gen.series.find((s) => s.id === cs.id);
  if (!g) err("catalog.generated.json", cs.id, "id", `Orphaned content entry "${cs.id}" - no matching generated series`);
}

// 4. Model count consistency
for (const gs of gen.series) {
  if (gs.models.length !== gs.modelCount) {
    err("catalog.generated.json", gs.id, "modelCount", `Declared ${gs.modelCount} but has ${gs.models.length} models`);
  }
}

// 5. Check required fields
for (const gs of gen.series) {
  if (!gs.name) err("catalog.generated.json", gs.id, "name", "Missing series name");
  if (!gs.brandId) err("catalog.generated.json", gs.id, "brandId", "Missing brandId");
  const brand = brands.find((b) => b.id === gs.brandId);
  if (!brand) err("catalog.generated.json", gs.id, "brandId", `Unknown brandId: ${gs.brandId}`);
  if (!approvedPumpTypeNames.has(gs.pumpType)) {
    err("catalog.generated.json", gs.id, "pumpType", `Unknown pump type: ${gs.pumpType || "(blank)"}`);
  }
  for (const m of gs.models) {
    if (!m.id) err("catalog.generated.json", gs.id, "model.id", `Model "${m.name}" has no ID`);
    if (!m.name) err("catalog.generated.json", gs.id, "model.name", `Model id "${m.id}" has no name`);
  }
}

for (const cs of content.series) {
  if (!cs.slug) err("catalog-content.json", cs.id, "slug", "Missing slug");
  if (!cs.shortDescription) warn("catalog-content.json", cs.id, "shortDescription", "Missing short description");
}

// 6. Media governance. The owner-confirmed 2026-08-21 set deliberately
// needs no retrospective per-file approval register; anything outside this
// fixed set is a new/replacement asset and must carry normal provenance,
// rights, and approval facts.
const confirmed20260821Media = new Set([
  "/media/hs-product-1.jfif", "/media/2vbsg-product-1.png", "/media/2vbsg-product-2.png", "/media/kh-vbsg-product-1.png", "/media/vbsg-product-1.png", "/media/gp-product-1.png", "/media/cv-product-1.png", "/media/sn-product-1.png", "/media/tp-product-1.png", "/media/jq-product-1.png", "/media/y-series-product-1.png", "/media/sb-sbi-sbn-product-1.jfif", "/media/grundfos-2cm-product-1.png", "/media/grundfos-2cr-i-n-booster-product-1.png", "/media/cm-product-1.png", "/media/cme-product-1.png", "/media/grundfos-cr-cri-crn-product-1.png", "/media/dwk-product-1.png", "/media/dpk-product-1.png", "/media/grundfos-sp-a-sp-product-1.png", "/media/sc-product-1.png", "/media/hc-product-1.png", "/media/hs-ss-product-1.png", "/media/grundfos-magna3-product-1.png", "/media/grundfos-hydro-mpc-product-1.png", "/media/cl-product-1.png", "/media/lf-product-1.png", "/media/nb-nbe-nk-nke-product-1.png", "/media/nbg-nbge-nkg-nkge-product-1.png",
]);
const mediaOwners = new Map();
function isLoadableImage(path) {
  try {
    const bytes = readFileSync(path);
    return (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47)
      || (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff);
  } catch { return false; }
}
function validateSeriesMedia(cs, img) {
  if (typeof img !== "string" || !img.startsWith("/media/")) {
    err("catalog-content.json", cs.id, "media", `Media relationship must use a public /media path: ${String(img)}`);
    return;
  }
  const imgPath = resolve(ROOT, "public", img.slice(1));
  if (!existsSync(imgPath)) {
    err("catalog-content.json", cs.id, "media", `Missing media: ${img}`);
    return;
  }
  if (!isLoadableImage(imgPath)) err("catalog-content.json", cs.id, "media", `Media loadability check failed: ${img}`);
  const alt = cs.imageAlt === undefined ? `${cs.name ?? ""} 產品圖片`.trim() : String(cs.imageAlt).trim();
  if (!alt) err("catalog-content.json", cs.id, "imageAlt", "Media accessibility requires non-empty alternative text");
  const owner = mediaOwners.get(img);
  if (owner && owner !== cs.id) err("catalog-content.json", cs.id, "media", `Media relationship conflict: ${img} is already assigned to ${owner}`);
  else mediaOwners.set(img, cs.id);
  if (!confirmed20260821Media.has(img)) {
    const approval = cs.mediaApproval;
    if (!approval || !String(approval.provenance ?? "").trim() || !String(approval.rights ?? "").trim() || !String(approval.approved ?? "").trim()) {
      err("catalog-content.json", cs.id, "mediaApproval", `New or replacement media requires provenance, rights, and approval governance: ${img}`);
    }
  }
}
for (const cs of content.series) {
  if (cs.image) validateSeriesMedia(cs, cs.image);
  if (Array.isArray(cs.images)) {
    for (const img of cs.images) validateSeriesMedia(cs, img);
  }
}
if (content.homepagePumpTypes) {
  for (const pt of content.homepagePumpTypes) {
    if (pt.silhouette) {
      const rel = pt.silhouette.startsWith("/") ? pt.silhouette.slice(1) : pt.silhouette;
      const silPath = resolve(ROOT, "public", rel);
      if (!existsSync(silPath)) err("catalog-content.json", `homepage:${pt.seriesId}`, "silhouette", `Missing silhouette: ${pt.silhouette}`);
    }
  }
}

// 7. Check for null/empty technical values
const numericSpecFields = new Set(["horsepower_hp", "power_kw", "rated_head_m", "max_head_m", "total_head_m", "rated_flow_lmin", "max_flow_lmin", "weight_kg"]);
const technicalSpecFields = ["horsepower_hp", "power_kw", "inlet_inch", "outlet_inch", "rated_head_m", "max_head_m", "total_head_m", "rated_flow_lmin", "max_flow_lmin", "power_source", "weight_kg"];
for (const gs of gen.series) {
  for (const m of gs.models) {
    for (const key of technicalSpecFields) {
      if (!Object.hasOwn(m.specs, key)) {
        err("catalog.generated.json", `${gs.id}/${m.id}`, key, "Missing consumed technical key; use null for an unknown value");
        continue;
      }
      const val = m.specs[key];
      if (val === "" || (typeof val === "string" && !val.trim())) err("catalog.generated.json", `${gs.id}/${m.id}`, key, "Empty technical value is invalid; use null for an unknown value");
      if (numericSpecFields.has(key) && val != null && val !== "" && !/^\d+(\.\d+)?$/.test(String(val))) {
        err("catalog.generated.json", `${gs.id}/${m.id}`, key, "Numeric technical values must be decimal strings with their declared unit");
      }
      if (!numericSpecFields.has(key) && val != null && (typeof val !== "string" || !val.trim())) {
        err("catalog.generated.json", `${gs.id}/${m.id}`, key, "Technical text must be non-empty or null");
      }
    }
  }
}

// 8. Slug uniqueness
const contentSlugs = content.series.map((s) => s.slug);
const dupSlugs = contentSlugs.filter((slug, i) => contentSlugs.indexOf(slug) !== i);
if (dupSlugs.length) err("catalog-content.json", "series", "slug", `Duplicate slugs: ${dupSlugs.join(", ")}`);

// 9. Approved operational facts guard (company / partners / contact / site)
const companyPath = resolve(ROOT, "src", "data", "company.json");
const contactPath = resolve(ROOT, "src", "data", "contact.json");
const sitePath = resolve(ROOT, "src", "data", "site.json");
const partnersPath = resolve(ROOT, "src", "data", "partners.json");
for (const [label, p] of [["company", companyPath], ["contact", contactPath], ["site", sitePath], ["partners", partnersPath]]) {
  if (!existsSync(p)) err("N/A", label, "file", `Missing file: ${p}`);
}

if (errors.length === 0) {
  const company = JSON.parse(readFileSync(companyPath, "utf-8"));
  const contact = JSON.parse(readFileSync(contactPath, "utf-8"));
  const site = JSON.parse(readFileSync(sitePath, "utf-8"));
  const partners = JSON.parse(readFileSync(partnersPath, "utf-8"));

  const placeholderRe = /待核准|待確認|待提供|1234-5678|\.\.\.|…/;
  for (const [file, obj] of [["company.json", company], ["contact.json", contact], ["site.json", site], ["partners.json", partners]]) {
    const s = JSON.stringify(obj);
    const hit = s.match(placeholderRe) ? s.match(placeholderRe)[0] : null;
    if (hit) err(file, "N/A", "content", `Placeholder/unapproved token found: "${hit}"`);
  }

  if (contactInfoPhone(contact) !== "02-2649-6338") err("contact.json", "info", "phone", "Phone does not match approved value");
  if (contactInfoEmail(contact) !== "jie.ping@msa.hinet.net") err("contact.json", "info", "email", "Primary email does not match approved value");
  if (!/新北市汐止區水源路二段90號/.test(contactInfoAddress(contact))) err("contact.json", "info", "address", "Address does not match approved value");
  if (site.contactInfo.phone !== contact.info.phone) err("site.json", "contactInfo", "phone", "Mismatch with contact.json");
  if (site.contactInfo.email !== contact.info.email) err("site.json", "contactInfo", "email", "Mismatch with contact.json");
  const expectedNavTypes = approvedPumpTypes.map(({ id, name }) => ({
    id,
    label: name,
    href: `/zh-tw/products?type=${id}`,
  }));
  if (JSON.stringify(site.nav?.products?.pumpTypes) !== JSON.stringify(expectedNavTypes)) {
    err("site.json", "nav.products", "pumpTypes", "Product navigation must match the four approved pump types");
  }
  if (partners.length === 0) err("partners.json", "partners", "content", "No approved partner records");
}

function contactInfoPhone(obj) { return obj.info ? obj.info.phone : null; }
function contactInfoEmail(obj) { return obj.info ? obj.info.email : null; }
function contactInfoAddress(obj) { return obj.info ? obj.info.address : null; }

// 10. Build check reminder
warn("N/A", "N/A", "build", "Run 'npm run build' to verify production build");

function printReport() {
  console.log(`\n=== Validation Report ===`);
  console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`);
  if (errors.length) {
    console.log(`\n--- ERRORS ---`);
    errors.forEach((e) => console.log(`  [ERR] ${e.file} | ${e.record} | ${e.field}: ${e.message}`));
  }
  if (warnings.length) {
    console.log(`\n--- WARNINGS ---`);
    warnings.forEach((w) => console.log(`  [WARN] ${w.file} | ${w.record} | ${w.field}: ${w.message}`));
  }
}

printReport();
if (errors.length) {
  console.log("\n❌ VALIDATION FAILED - Blocking release");
  process.exit(1);
} else {
  console.log("\n✅ VALIDATION PASSED");
}
