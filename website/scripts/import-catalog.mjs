// repeatable validated Excel intake for JP PUMP multi-brand product catalog
// Usage: node scripts/import-catalog.mjs
// Reads: website/data/source-catalog.xlsx
// Writes: website/data/catalog.generated.json, website/data/catalog-overview.json

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const MAIN_SHEET = "\u5b8c\u6574\u7522\u54c1\u898f\u683c\u8868"; // 完整產品規格表
const OVERVIEW_SHEET = "\u7db2\u9801_\u7522\u54c1\u7e3d\u89bd"; // 網頁_產品總覽
const FILTER_TAGS_SHEET = "\u7db2\u7ad9\u7be9\u9078\u6a19\u7c64"; // 網站篩選標籤

const JP_EXCLUDED = new Set(["2VBSG", "VBSG", "KH-VBSG"]);

// normalize pump type typos in source data
const PT_NORMALIZE = {
  "\u6c59\u6c34\u6c5e": "\u6c61\u6c34\u6cf5", // 汙水汞 → 污水泵
  "\u6c5e\u6c34\u6c5e": "\u6c61\u6c34\u6cf5", // 汞水汞 → 污水泵
};

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

const purposeTagCols = [41, 42, 43, 44, 45, 46, 47, 48];

// normalize series names for cross-sheet matching
const SERIES_KEY_NORMALIZE = {
  "Y\u7cfb\u5217": "Y", // Y系列 → Y
};

function normalizeSeriesName(n) {
  return SERIES_KEY_NORMALIZE[n] || n;
}

function sv(v) { return v != null ? String(v).trim() : ""; }
function toNullIfEmpty(v) { const s = sv(v); return s === "" ? null : s; }

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

  const seriesMap = new Map();
  const modelReviewStatus = new Map(); // key: seriesId|modelName -> reviewNote

  // Process main sheet rows
  for (const row of rows) {
    const brandRaw = sv(row[0] || "");
    const brandId = BRAND_ID_MAP[brandRaw];
    if (!brandId) continue;

    const seriesName = sv(row[1] || "");
    if (!seriesName) continue;

    // JP excluded series
    if (brandId === "jp-pump" && JP_EXCLUDED.has(seriesName)) continue;

    const modelName = sv(row[3] || "");
    if (!modelName) continue;

    const rawPumpType = sv(row[6] || "");
    const pumpType = PT_NORMALIZE[rawPumpType] || rawPumpType;
    const ident = sv(row[4] || "");

    const specs = {};
    for (const [key, col] of specFields) {
      const v = row[col];
      if (v != null) specs[key] = String(v);
    }

    // Gather purpose tags
    const tags = [];
    for (const c of purposeTagCols) {
      const t = sv(row[c]);
      if (t) tags.push(t);
    }

    // Source & review status
    const sourceRef = sv(row[38] || "");
    const dataStatus = sv(row[37] || "");

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
      });
    }
    const entry = seriesMap.get(seriesKey);
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
  if (ovColOf["\u54c1\u724c"] !== undefined && ovColOf["\u7522\u54c1\u7cfb\u5217"] !== undefined) {
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

    for (const row of ovRows) {
      const ovBrand = sv(row[ovBrandCol]);
      const ovSeries = sv(row[ovSeriesCol]);
      if (!ovBrand || !ovSeries) continue;
      const bid = BRAND_ID_MAP[ovBrand];
      if (!bid) continue;
      const ovKey = `${bid}::${normalizeSeriesName(ovSeries)}`;

      const purposeStr = ovPurposesCol !== undefined ? sv(row[ovPurposesCol]) : "";
      const purposeTags = purposeStr ? purposeStr.split(/[,，、\u002f\u3001]/).map((t) => t.trim()).filter(Boolean) : [];

      overviewMap.set(ovKey, {
        purposeTags,
        headMin: ovHeadMinCol !== undefined ? toNullIfEmpty(row[ovHeadMinCol]) : null,
        headMax: ovHeadMaxCol !== undefined ? toNullIfEmpty(row[ovHeadMaxCol]) : null,
        flowMin: ovFlowMinCol !== undefined ? toNullIfEmpty(row[ovFlowMinCol]) : null,
        flowMax: ovFlowMaxCol !== undefined ? toNullIfEmpty(row[ovFlowMaxCol]) : null,
        modelCount: ovModelCountCol !== undefined ? (row[ovModelCountCol] != null ? Number(row[ovModelCountCol]) : null) : null,
        published: ovPublishedCol !== undefined ? toNullIfEmpty(row[ovPublishedCol]) : null,
      });
    }
  }

  // ── Build output series ──
  const generatedSeries = [];
  const overviewSeries = [];
  const allModels = [];

  for (const [key, s] of seriesMap) {
    const id = cleanSeriesId(key, s.brandId);
    const ov = overviewMap.get(key);
    const purposeTags = ov?.purposeTags?.length ? ov.purposeTags : [...s.purposeTags].sort();

    generatedSeries.push({
      id,
      brandId: s.brandId,
      name: s.seriesName,
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
      id,
      brandId: s.brandId,
      purposeTags,
      headMin: ov?.headMin ?? null,
      headMax: ov?.headMax ?? null,
      flowMin: ov?.flowMin ?? null,
      flowMax: ov?.flowMax ?? null,
      modelCount: ov?.modelCount ?? s.models.length,
      published: ov?.published ?? null,
    });

    s.models.forEach((m) => {
      allModels.push({
        seriesId: id,
        modelName: m.name,
        source: m.source,
        reviewNote: m.reviewNote,
      });
    });
  }

  // ── Write catalog.generated.json ──
  const generated = {
    generatedAt: new Date().toISOString(),
    source: "\u6cf5\u6d66\u7522\u54c1\u898f\u683c\u8cc7\u6599\u5eab_JP.updated5_\u542b\u7db2\u9801\u5206\u9801_\u65b0\u589e\u845b\u862d\u5bcc\u9010\u578b\u865f_\u6027\u80fd\u503c\u8986\u6838\u66f4\u65b0\u7248.xlsx",
    series: generatedSeries,
  };

  const genOutPath = resolve(ROOT, "data", "catalog.generated.json");
  writeFileSync(genOutPath, JSON.stringify(generated, null, 2), "utf-8");
  console.log("Wrote catalog.generated.json");
  console.log("  Series:", generatedSeries.length, "| Models:", generatedSeries.reduce((a, s) => a + s.modelCount, 0));

  // ── Write catalog-overview.json ──
  const overview = { series: overviewSeries };
  const ovOutPath = resolve(ROOT, "data", "catalog-overview.json");
  writeFileSync(ovOutPath, JSON.stringify(overview, null, 2), "utf-8");
  console.log("Wrote catalog-overview.json");

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
