// repeatable validated Excel intake for JP PUMP product catalog
// Usage: node scripts/import-catalog.mjs
// Reads: website/data/source-catalog.xlsx -> Writes: website/data/catalog.generated.json

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const MAIN_SHEET = "\u5b8c\u6574\u7522\u54c1\u898f\u683c\u8868";
const EXCLUDED_SERIES = new Set(["2VBSG", "VBSG", "KH-VBSG"]);

const PT_MAP = {
  "\u6c5e\u6c34\u6c5e": "\u6c61\u6c34\u6cf5",
  "\u6c61\u6c34\u6cf5": "\u6c61\u6c34\u6cf5",
};

const purposeCols = [42, 43, 44, 45, 46, 47, 48, 49];
const specFields = [
  ["horsepower_hp", 8], ["power_kw", 9],
  ["inlet_inch", 10], ["outlet_inch", 11],
  ["rated_head_m", 13], ["max_head_m", 15], ["total_head_m", 16],
  ["rated_flow_lmin", 18], ["max_flow_lmin", 20],
  ["power_source", 24], ["weight_kg", 37],
];

function sv(v) { return v != null ? String(v).trim() : ""; }

async function run() {
  const xlsx = await import("xlsx");
  const src = resolve(ROOT, "data", "source-catalog.xlsx");
  const buf = readFileSync(src);
  const wb = xlsx.read(buf, { type: "buffer" });
  const sheet = wb.Sheets[MAIN_SHEET];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: null, header: 1 });

  if (data.length < 4) {
    console.error("ERROR: insufficient rows");
    process.exit(1);
  }

  const headers = data[2];
  const rows = data.slice(3);
  const colOf = {};
  headers.forEach((h, i) => { if (h) colOf[String(h).trim()] = i; });

  const seriesCol = colOf["\u7522\u54c1\u7cfb\u5217"];
  const modelCol = colOf["\u578b\u865f"];
  const identCol = colOf["\u7522\u54c1\u8b58\u5225\u78bc"];
  const ptCol = colOf["\u6cf5\u6d66\u985e\u578b"];
  const nameCol = colOf["\u7522\u54c1\u540d\u7a31"];

  if (seriesCol === undefined) {
    console.error("ERROR: column header not found");
    process.exit(1);
  }

  const seriesMap = new Map();

  for (const row of rows) {
    const series = sv(row[seriesCol]);
    if (!series || EXCLUDED_SERIES.has(series)) continue;

    const modelName = sv(row[modelCol]);
    if (!modelName) continue;

    const ptRaw = sv(row[ptCol]);
    const pumpType = PT_MAP[ptRaw] || ptRaw;

    const tags = [];
    for (const c of purposeCols) {
      const t = sv(row[c]);
      if (t) tags.push(t);
    }

    if (!seriesMap.has(series)) {
      seriesMap.set(series, {
        pumpType,
        productName: sv(row[nameCol]),
        purposeTags: new Set(),
        models: [],
      });
    }
    const entry = seriesMap.get(series);
    tags.forEach((t) => entry.purposeTags.add(t));

    const ident = sv(row[identCol]);
    const specs = {};
    for (const [key, col] of specFields) {
      const v = row[col];
      if (v != null) specs[key] = String(v);
    }

    entry.models.push({ id: ident || modelName, name: modelName, specs });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    source: "\u6cf5\u6d66\u7522\u54c1\u898f\u683c\u8cc7\u6599\u5eab_JP.updated5.xlsx",
    series: [],
  };

  for (const [name, s] of seriesMap) {
    output.series.push({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || name,
      name,
      productName: s.productName,
      pumpType: s.pumpType,
      purposeTags: [...s.purposeTags].sort(),
      modelCount: s.models.length,
      models: s.models,
    });
  }

  const outPath = resolve(ROOT, "data", "catalog.generated.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2), "utf-8");
  console.log("Wrote", outPath);
  console.log("Series:", output.series.length, "Models:", output.series.reduce((a, s) => a + s.modelCount, 0));
}

run().catch((e) => { console.error(e); process.exit(1); });
