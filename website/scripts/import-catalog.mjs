// repeatable validated Excel intake for JP PUMP multi-brand product catalog
// Usage: node scripts/import-catalog.mjs
// Reads: website/data/source-catalog.xlsx
// Writes: website/data/catalog.generated.json, website/data/catalog-overview.json

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { publishCatalogCandidate } from "./catalog-candidate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.CATALOG_ROOT ? resolve(process.env.CATALOG_ROOT) : resolve(__dirname, "..");

const MAIN_SHEET = "\u5b8c\u6574\u7522\u54c1\u898f\u683c\u8868"; // 完整產品規格表
const OVERVIEW_SHEET = "\u7db2\u9801_\u7522\u54c1\u7e3d\u89bd"; // 網頁_產品總覽
const FILTER_TAGS_SHEET = "\u7db2\u7ad9\u7be9\u9078\u6a19\u7c64"; // 網站篩選標籤

const APPROVED_PUMP_TYPES = new Set(["臥式泵", "沉水式揚水泵", "沉水式污水泵", "立式楊水泵"]);

// stable brand IDs
const BRAND_ID_MAP = {
  "\u5091\u5e73": "jp-pump", // 傑平
  "\u845b\u862d\u5bcc": "grundfos", // 葛蘭富
};

const specFields = [
  ["horsepower_hp", 7], ["power_kw", 8],
  ["inlet_inch", 9], ["outlet_inch", 10],
  ["rated_head_m", 12], ["max_head_m", 14], ["total_head_m", 15],
  ["rated_flow_lmin", 17], ["max_flow_lmin", 19],
  ["power_source", 23], ["weight_kg", 36],
];
const NUMERIC_SPEC_FIELDS = new Set(["horsepower_hp", "power_kw", "rated_head_m", "max_head_m", "total_head_m", "rated_flow_lmin", "max_flow_lmin", "weight_kg"]);

// Every column the importer reads is governed here. Keeping the index beside
// its contractual header prevents numeric data from being silently relabelled
// when a workbook column is inserted, swapped, or renamed.
const MAIN_HEADER_CONTRACT = new Map([
  [0, "品牌"], [1, "產品系列"], [2, "產品名稱"], [3, "型號"], [4, "產品識別碼"], [5, "用途"], [6, "泵浦類型"],
  [7, "馬力_HP"], [8, "功率_kW"], [9, "入口口徑_inch"], [10, "出口口徑_inch"], [12, "額定揚程_m"], [14, "最高揚程_m"], [15, "全揚程_m"],
  [17, "額定水量_Lmin"], [19, "最大水量_Lmin"], [23, "電源"], [36, "重量_kg"], [39, "來源PDF"], [40, "資料狀態"],
  [41, "用途標籤1"], [42, "用途標籤2"], [43, "用途標籤3"], [44, "用途標籤4"], [45, "用途標籤5"], [46, "用途標籤6"], [47, "用途標籤7"], [48, "用途標籤8"],
]);

const purposeTagCols = [41, 42, 43, 44, 45, 46, 47, 48];

// normalize series names for cross-sheet matching
const SERIES_KEY_NORMALIZE = {
  "Y\u7cfb\u5217": "Y", // Y系列 → Y
  "\u81ea\u5438\u5f0f": "Y", // 自吸式 filter tag → Y系列 canonical group
};

function normalizeSeriesName(n) {
  return SERIES_KEY_NORMALIZE[n] || n;
}

function sv(v) { return v != null ? String(v).trim() : ""; }
function toNullIfEmpty(v) { const s = sv(v); return s === "" ? null : s; }
function decimalOrNull(value, location, field) {
  const normalized = toNullIfEmpty(value);
  if (normalized === null) return null;
  if (!/^\d+(\.\d+)?$/.test(normalized)) throw new Error(`${location} | ${field}: non-numeric range violates decimal/unit rule`);
  return normalized;
}

// stable ID generation: brandId + series name → clean series ID
function cleanSeriesId(key, brandId) {
  let id = key.toLowerCase();
  // replace full-width slashes and separators with dashes
  id = id.replace(/[\uff0f\u30fb\uff0c\u3001\u002f]/g, "-"); // ／・，、 /
  // collapse the brandId prefix delimiter
  id = id.replace(/^[a-z0-9-]+::/, "");
  // plain id: brand-prefixed
  id = brandId + "-" + id;
  // replace all remaining non-alphanumeric (except dash) with dash
  id = id.replace(/[^a-z0-9-]+/g, "-");
  // collapse consecutive dashes
  id = id.replace(/-+/g, "-");
  // trim leading/trailing dashes
  id = id.replace(/^-+|-+$/g, "");
  return id || `${brandId}-series`;
}

async function run() {
  const xlsx = await import("xlsx");
  const src = resolve(ROOT, "data", "source-catalog.xlsx");
  if (!existsSync(src)) {
    console.error("ERROR: source-catalog.xlsx not found at", src);
    process.exit(1);
  }
  const buf = readFileSync(src);
  const wb = xlsx.read(buf, { type: "buffer" });

  // ── MAIN SHEET ──
  const sheet = wb.Sheets[MAIN_SHEET];
  if (!sheet) { console.error("ERROR: sheet not found:", MAIN_SHEET); process.exit(1); }
  const data = xlsx.utils.sheet_to_json(sheet, { defval: null, header: 1 });
  if (data.length < 4) { console.error("ERROR: insufficient rows"); process.exit(1); }
  const headers = data[2];
  for (const [index, expected] of MAIN_HEADER_CONTRACT) {
    if (sv(headers[index]) !== expected) throw new Error(`${MAIN_SHEET}!${xlsx.utils.encode_col(index)}3: expected governed header/unit "${expected}", received "${sv(headers[index]) || "(blank)"}"`);
  }
  const rows = data.slice(3);

  // ── OVERVIEW SHEET (row 0 = headers, row 1+ = data) ──
  const ovSheet = wb.Sheets[OVERVIEW_SHEET];
  const ovData = ovSheet ? xlsx.utils.sheet_to_json(ovSheet, { defval: null, header: 1 }) : [];
  const ovHeaders = ovData.length >= 1 ? ovData[0] : [];
  const ovRows = ovData.slice(1);
  const ovColOf = {};
  ovHeaders.forEach((h, i) => { if (h) ovColOf[String(h).trim()] = i; });

  // ── FILTER TAGS SHEET ──
  const ftSheet = wb.Sheets[FILTER_TAGS_SHEET];
  const ftData = ftSheet ? xlsx.utils.sheet_to_json(ftSheet, { defval: null, header: 1 }) : [];
  const ftHeaders = ftData.length >= 3 ? ftData[2] : [];
  const ftRows = ftData.slice(3);
  const ftColOf = {};
  ftHeaders.forEach((h, i) => { if (h) ftColOf[String(h).trim()] = i; });

  const filterOverviewMap = new Map();
  const ftBrandCol = ftColOf["品牌"];
  const ftSeriesCol = ftColOf["產品系列"];
  const ftHeadMinCol = ftColOf["揚程最小值"];
  const ftHeadMaxCol = ftColOf["揚程最大值"];
  const ftFlowMinCol = ftColOf["水量最小值"];
  const ftFlowMaxCol = ftColOf["水量最大值"];
  for (const [field, column] of [["品牌", ftBrandCol], ["產品系列", ftSeriesCol], ["揚程最小值", ftHeadMinCol], ["揚程最大值", ftHeadMaxCol], ["水量最小值", ftFlowMinCol], ["水量最大值", ftFlowMaxCol]]) {
    if (column === undefined) throw new Error(`${FILTER_TAGS_SHEET} | ${field}: required column missing`);
  }
  for (const [filterIndex, row] of ftRows.entries()) {
    const brandRaw = sv(row[ftBrandCol]);
    const brandId = BRAND_ID_MAP[brandRaw];
    const seriesName = sv(row[ftSeriesCol]);
    if (!brandRaw && !seriesName) continue;
    if (!brandId) throw new Error(`${FILTER_TAGS_SHEET}!row ${filterIndex + 4} | 品牌: unknown brand "${brandRaw || "(blank)"}"`);
    if (!seriesName) throw new Error(`${FILTER_TAGS_SHEET}!row ${filterIndex + 4} | 產品系列: missing Series`);
    const key = `${brandId}::${normalizeSeriesName(seriesName)}`;
    const summary = filterOverviewMap.get(key) ?? { headMin: null, headMax: null, flowMin: null, flowMax: null, sourceRow: filterIndex + 4 };
    for (const [field, columnName, col, mode] of [
      ["headMin", "揚程最小值", ftHeadMinCol, "min"],
      ["headMax", "揚程最大值", ftHeadMaxCol, "max"],
      ["flowMin", "水量最小值", ftFlowMinCol, "min"],
      ["flowMax", "水量最大值", ftFlowMaxCol, "max"],
    ]) {
      const rawValue = row[col];
      if (rawValue == null || sv(rawValue) === "") continue;
        const decimal = decimalOrNull(rawValue, `source-catalog.xlsx | ${FILTER_TAGS_SHEET}!${xlsx.utils.encode_col(col)}${filterIndex + 4}`, columnName);
      if (decimal === null) continue;
      const value = Number(decimal);
      const current = summary[field] === null ? null : Number(summary[field]);
      if (current === null || (mode === "min" ? value < current : value > current)) {
        summary[field] = String(value);
      }
    }
    filterOverviewMap.set(key, summary);
  }

  const governancePath = resolve(ROOT, "data", "catalog-overview-governance.json");
  if (!existsSync(governancePath)) {
    throw new Error(`Missing governed overview input: ${governancePath}`);
  }
  const governance = JSON.parse(readFileSync(governancePath, "utf-8"));
  if (!Array.isArray(governance.series)) {
    throw new Error("catalog-overview-governance.json: series must be an array");
  }
  const governanceMap = new Map();
  for (const entry of governance.series) {
    const allowedFields = new Set(["id", "purposeTags", "published"]);
    const unknownFields = Object.keys(entry).filter((field) => !allowedFields.has(field));
    if (!entry.id || unknownFields.length > 0) {
      throw new Error(`catalog-overview-governance.json: invalid entry "${entry.id || "(missing id)"}"${unknownFields.length ? `; unknown fields: ${unknownFields.join(", ")}` : ""}`);
    }
    if (governanceMap.has(entry.id)) {
      throw new Error(`catalog-overview-governance.json: duplicate series id "${entry.id}"`);
    }
    if (entry.purposeTags !== undefined && (!Array.isArray(entry.purposeTags) || entry.purposeTags.some((tag) => !sv(tag)))) {
      throw new Error(`catalog-overview-governance.json: series "${entry.id}" has invalid purposeTags`);
    }
    if (entry.published !== undefined && entry.published !== "是") {
      throw new Error(`catalog-overview-governance.json: series "${entry.id}" has invalid published value "${entry.published}"`);
    }
    governanceMap.set(entry.id, entry);
  }

  const seriesMap = new Map();
  const modelReviewStatus = new Map(); // key: seriesId|modelName -> reviewNote

  // Process main sheet rows
  for (const [rowIndex, row] of rows.entries()) {
    const sourceRow = rowIndex + 4;
    const hasSourceData = row.slice(0, 7).some((value) => sv(value));
    if (!hasSourceData) continue;

    const brandRaw = sv(row[0] || "");
    const brandId = BRAND_ID_MAP[brandRaw];
    if (!brandRaw) throw new Error(`${MAIN_SHEET}!A${sourceRow}: missing brand`);
    if (!brandId) throw new Error(`${MAIN_SHEET}!A${sourceRow}: unknown brand "${brandRaw}"`);

    const seriesName = sv(row[1] || "");
    if (!seriesName) throw new Error(`${MAIN_SHEET}!B${sourceRow}: missing series name`);

    const modelName = sv(row[3] || "");
    if (!modelName) throw new Error(`${MAIN_SHEET}!D${sourceRow}: missing model name`);

    const ident = sv(row[4] || "");
    if (!ident) throw new Error(`${MAIN_SHEET}!E${sourceRow}: missing product identifier`);

    const pumpType = sv(row[6] || "");
    if (!APPROVED_PUMP_TYPES.has(pumpType)) {
      throw new Error(`${MAIN_SHEET}!G${sourceRow}: series "${seriesName}" has unknown pump type "${pumpType || "(blank)"}"`);
    }

    const specs = {};
    for (const [key, col] of specFields) {
      const location = `source-catalog.xlsx | ${MAIN_SHEET}!${xlsx.utils.encode_col(col)}${sourceRow}`;
      specs[key] = NUMERIC_SPEC_FIELDS.has(key)
        ? decimalOrNull(row[col], location, key)
        : toNullIfEmpty(row[col]);
    }

    // Gather purpose tags
    const tags = [];
    for (const c of purposeTagCols) {
      const t = sv(row[c]);
      if (t) tags.push(t);
    }

    // Source & review status
    const sourceRef = sv(row[39] || "");
    const dataStatus = sv(row[40] || "");

    const fullKey = `${seriesName}|${modelName}`;
    if (dataStatus) {
      modelReviewStatus.set(fullKey, dataStatus);
    }

    const seriesKey = `${brandId}::${normalizeSeriesName(seriesName)}`;
    if (!seriesMap.has(seriesKey)) {
      seriesMap.set(seriesKey, {
        brandId,
        brandName: brandRaw,
        seriesName,
        pumpType,
        productName: sv(row[2] || ""),
        purposeTags: new Set(),
        models: [],
        sourceRow,
      });
    }
    const entry = seriesMap.get(seriesKey);
    if (entry.pumpType !== pumpType) {
      throw new Error(`${MAIN_SHEET}!G${sourceRow}: series "${seriesName}" mixes pump types "${entry.pumpType}" and "${pumpType}"`);
    }
    if (entry.models.some((model) => model.id === ident || model.name === modelName)) {
      throw new Error(`${MAIN_SHEET}!D${sourceRow}: duplicate model "${modelName}" or identifier "${ident}" in series "${seriesName}"`);
    }
    tags.forEach((t) => entry.purposeTags.add(t));

    entry.models.push({
      id: ident || modelName,
      name: modelName,
      specs,
      source: sourceRef || null,
      reviewNote: dataStatus || null,
    });
  }

  // ── Read overview sheet for series-level data ──
  const overviewMap = new Map();
  for (const required of ["\u54c1\u724c", "\u7522\u54c1\u7cfb\u5217", "\u6cf5\u6d66\u985e\u578b"]) {
    if (ovColOf[required] === undefined) throw new Error(`${OVERVIEW_SHEET}!row 1 | ${required}: required column missing`);
  }
  {
    const ovBrandCol = ovColOf["\u54c1\u724c"];
    const ovSeriesCol = ovColOf["\u7522\u54c1\u7cfb\u5217"];
    const ovTypeCol = ovColOf["\u6cf5\u6d66\u985e\u578b"];
    const ovPurposesCol = ovColOf["\u7528\u9014\u6a19\u7c64"] ?? ovColOf["\u7528\u9014"];
    const ovHeadMinCol = ovColOf["\u63da\u7a0b\u6700\u5c0f\u503c_m"] ?? ovColOf["\u63da\u7a0b\u6700\u5c0f\u503c"];
    const ovHeadMaxCol = ovColOf["\u63da\u7a0b\u6700\u5927\u503c_m"] ?? ovColOf["\u63da\u7a0b\u6700\u5927\u503c"];
    const ovFlowMinCol = ovColOf["\u6c34\u91cf\u6700\u5c0f\u503c_Lmin"] ?? ovColOf["\u6c34\u91cf\u6700\u5c0f\u503c"];
    const ovFlowMaxCol = ovColOf["\u6c34\u91cf\u6700\u5927\u503c_Lmin"] ?? ovColOf["\u6c34\u91cf\u6700\u5927\u503c"];
    const ovModelCountCol = ovColOf["\u578b\u865f\u6578\u91cf"];
    const ovPublishedCol = ovColOf["\u9996\u9801\u4ee3\u8868"] ?? ovColOf["\u662f\u5426\u767c\u5e03"];

    for (const [overviewIndex, row] of ovRows.entries()) {
      const sourceRow = overviewIndex + 2;
      const ovBrand = sv(row[ovBrandCol]);
      const ovSeries = sv(row[ovSeriesCol]);
      if (!ovBrand && !ovSeries) continue;
      if (!ovBrand) throw new Error(`${OVERVIEW_SHEET}!A${sourceRow}: missing brand`);
      if (!ovSeries) throw new Error(`${OVERVIEW_SHEET}!B${sourceRow}: missing series`);
      const bid = BRAND_ID_MAP[ovBrand];
      if (!bid) throw new Error(`${OVERVIEW_SHEET}!A${sourceRow}: unknown brand "${ovBrand}"`);
      const ovKey = `${bid}::${normalizeSeriesName(ovSeries)}`;
      const ovPumpType = sv(row[ovTypeCol]);
      if (!APPROVED_PUMP_TYPES.has(ovPumpType)) {
        throw new Error(`${OVERVIEW_SHEET}!C${sourceRow}: series "${ovSeries}" has unknown pump type "${ovPumpType || "(blank)"}"`);
      }
      const mainSeries = seriesMap.get(ovKey);
      if (!mainSeries) {
        throw new Error(`${OVERVIEW_SHEET}!B${sourceRow}: series "${ovSeries}" has no matching main-sheet series`);
      }
      if (mainSeries.pumpType !== ovPumpType) {
        throw new Error(`${OVERVIEW_SHEET}!C${sourceRow}: series "${ovSeries}" pump type "${ovPumpType}" does not match main sheet "${mainSeries.pumpType}"`);
      }
      if (overviewMap.has(ovKey)) {
        throw new Error(`${OVERVIEW_SHEET}!B${sourceRow}: duplicate series "${ovSeries}"`);
      }

      const purposeStr = ovPurposesCol !== undefined ? sv(row[ovPurposesCol]) : "";
      const purposeTags = purposeStr ? purposeStr.split(/[,，、\u002f\u3001]/).map((t) => t.trim()).filter(Boolean) : [];

      overviewMap.set(ovKey, {
        purposeTags,
        headMin: ovHeadMinCol !== undefined ? decimalOrNull(row[ovHeadMinCol], `source-catalog.xlsx | ${OVERVIEW_SHEET}!${xlsx.utils.encode_col(ovHeadMinCol)}${sourceRow}`, "揚程最小值_m") : null,
        headMax: ovHeadMaxCol !== undefined ? decimalOrNull(row[ovHeadMaxCol], `source-catalog.xlsx | ${OVERVIEW_SHEET}!${xlsx.utils.encode_col(ovHeadMaxCol)}${sourceRow}`, "揚程最大值_m") : null,
        flowMin: ovFlowMinCol !== undefined ? decimalOrNull(row[ovFlowMinCol], `source-catalog.xlsx | ${OVERVIEW_SHEET}!${xlsx.utils.encode_col(ovFlowMinCol)}${sourceRow}`, "水量最小值_Lmin") : null,
        flowMax: ovFlowMaxCol !== undefined ? decimalOrNull(row[ovFlowMaxCol], `source-catalog.xlsx | ${OVERVIEW_SHEET}!${xlsx.utils.encode_col(ovFlowMaxCol)}${sourceRow}`, "水量最大值_Lmin") : null,
        modelCount: ovModelCountCol !== undefined ? (row[ovModelCountCol] != null ? Number(row[ovModelCountCol]) : null) : null,
        published: ovPublishedCol !== undefined ? toNullIfEmpty(row[ovPublishedCol]) : null,
      });
    }
  }

  // ── Build output series ──
  const generatedSeries = [];
  const overviewSeries = [];
  const allModels = [];
  const usedGovernanceIds = new Set();

  for (const [key, filterOverview] of filterOverviewMap) {
    if (!seriesMap.has(key)) {
      throw new Error(`${FILTER_TAGS_SHEET}!row ${filterOverview.sourceRow} | 產品系列: unknown Series "${key}"`);
    }
  }

  for (const [key, s] of seriesMap) {
    const sourceId = cleanSeriesId(key, s.brandId);
    const ov = overviewMap.get(key);
    if (!ov) {
      throw new Error(`${MAIN_SHEET}!B${s.sourceRow}: series "${s.seriesName}" has missing unique Overview join`);
    }
    const filterOverview = filterOverviewMap.get(key);
    const governed = governanceMap.get(sourceId);
    if (governed) usedGovernanceIds.add(sourceId);
      const purposeTags = ov?.purposeTags?.length
        ? ov.purposeTags
        : governed?.purposeTags?.length
          ? governed.purposeTags
          : [...s.purposeTags].sort();

      generatedSeries.push({
        id: sourceId,
        brandId: s.brandId,
        name: s.seriesName,
        sourceSeriesName: s.seriesName,
        productName: s.productName,
        pumpType: s.pumpType,
        purposeTags,
        modelCount: s.models.length,
        models: s.models.map((m) => ({
          id: m.id,
          name: m.name,
          specs: m.specs,
        })),
      });

      overviewSeries.push({
        id: sourceId,
        brandId: s.brandId,
        purposeTags,
        headMin: filterOverview?.headMin ?? ov?.headMin ?? null,
        headMax: filterOverview?.headMax ?? ov?.headMax ?? null,
        flowMin: filterOverview?.flowMin ?? ov?.flowMin ?? null,
        flowMax: filterOverview?.flowMax ?? ov?.flowMax ?? null,
        modelCount: s.models.length,
        published: ov?.published ?? governed?.published ?? null,
      });

      s.models.forEach((m) => {
        allModels.push({
          seriesId: sourceId,
          modelName: m.name,
          source: m.source,
          reviewNote: m.reviewNote,
        });
      });
  }

  const orphanedGovernance = [...governanceMap.keys()].filter((id) => !usedGovernanceIds.has(id));
  if (orphanedGovernance.length > 0) {
    throw new Error(`catalog-overview-governance.json: orphaned series ids: ${orphanedGovernance.join(", ")}`);
  }

  // ── Write catalog.generated.json ──
  const generated = {
    generatedAt: new Date().toISOString(),
    source: "source-catalog.xlsx",
    series: generatedSeries,
  };

  const overview = { series: overviewSeries };
  const canonicalContent = JSON.parse(readFileSync(resolve(ROOT, "data", "catalog-content.json"), "utf-8"));
  if (!Array.isArray(canonicalContent.series) || canonicalContent.series.length !== 22) {
    throw new Error("catalog-content.json: expected exactly 22 governed canonical Series");
  }
  await publishCatalogCandidate({ generated, overview }, { releaseRoot: ROOT, expectedSeriesIds: canonicalContent.series.map(({ id }) => id), source: { file: "source-catalog.xlsx", sheet: MAIN_SHEET, row: 4 } });
  console.log("Atomically switched the catalog release indicator");
  console.log("  Series:", generatedSeries.length, "| Models:", generatedSeries.reduce((a, s) => a + s.modelCount, 0));

  // ── Series breakdown ──
  console.log("\n=== Series Breakdown ===");
  for (const s of generatedSeries) {
    const ov = overviewSeries.find((o) => o.id === s.id);
    console.log(`  [${s.brandId}] ${s.name} | Models: ${s.modelCount} | PumpType: ${s.pumpType} | Published: ${ov?.published ?? "N/A"}`);
  }

  // ── Reviewed model count (58 = 2CM 15 + 2CR Booster 43) ──
  const reviewedModels = allModels.filter((m) => m.reviewNote && m.reviewNote.includes("\u4eba\u5de5\u8986\u6838")); // 人工覆核
  console.log(`\n=== Review Status ===`);
  console.log(`  Models with performance review flags: ${reviewedModels.length}`);
  const reviewedBySeries = new Map();
  reviewedModels.forEach((m) => {
    const cnt = reviewedBySeries.get(m.seriesId) || 0;
    reviewedBySeries.set(m.seriesId, cnt + 1);
  });
  for (const [sid, cnt] of reviewedBySeries) {
    console.log(`    ${sid}: ${cnt} reviewed models`);
  }

  console.log("\nDONE");
}

run().catch((e) => { console.error(e); process.exit(1); });
