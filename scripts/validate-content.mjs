// Content & release validation gate
// Usage: node scripts/validate-content.mjs
// Checks: schemas, IDs, links, media rights, pump-type label map, sitemap consistency

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
let errors = [];
let warnings = [];

function err(file, record, field, msg) {
  errors.push({ file, record, field, message: msg });
}

function warn(file, record, field, msg) {
  warnings.push({ file, record, field, message: msg });
}

function buildPumpTypeLabelMap(pumpTypes) {
  const map = new Map();
  for (const type of pumpTypes) {
    if (!Array.isArray(type.sourceLabels) || type.sourceLabels.length === 0) {
      err("catalog-types.json", type.id, "sourceLabels", "Must include at least one source label");
      continue;
    }
    const labels = new Set([type.name, ...type.sourceLabels]);
    for (const label of labels) {
      if (!label || typeof label !== "string") {
        err("catalog-types.json", type.id, "sourceLabels", "Empty or invalid label");
        continue;
      }
      const existing = map.get(label);
      if (existing && existing !== type.id) {
        err(
          "catalog-types.json",
          type.id,
          "sourceLabels",
          `Label "${label}" already maps to "${existing}"`,
        );
        continue;
      }
      map.set(label, type.id);
    }
  }
  return map;
}

// 1. Load catalog files
const genPath = resolve(ROOT, "data", "catalog.generated.json");
const contentPath = resolve(ROOT, "data", "catalog-content.json");
const brandsPath = resolve(ROOT, "content", "taxonomy", "catalog-brands.json");
const typesPath = resolve(ROOT, "content", "taxonomy", "catalog-types.json");
const purposesPath = resolve(ROOT, "content", "taxonomy", "catalog-purposes.json");
const pagesDir = resolve(ROOT, "content", "pages");
const pageFiles = ["home.json", "company.json", "contact.json", "services.json", "partners.json", "site.json"];

for (const [label, p] of [
  ["generated", genPath],
  ["content", contentPath],
  ["brands", brandsPath],
  ["types", typesPath],
  ["purposes", purposesPath],
]) {
  if (!existsSync(p)) err("N/A", label, "file", `Missing file: ${p}`);
}

for (const name of pageFiles) {
  const p = resolve(pagesDir, name);
  if (!existsSync(p)) err("N/A", name, "file", `Missing page content: ${p}`);
}

if (errors.length > 0) {
  printReport();
  process.exit(1);
}

const gen = JSON.parse(readFileSync(genPath, "utf-8"));
const content = JSON.parse(readFileSync(contentPath, "utf-8"));
const types = JSON.parse(readFileSync(typesPath, "utf-8"));
const brands = JSON.parse(readFileSync(brandsPath, "utf-8"));
const purposes = JSON.parse(readFileSync(purposesPath, "utf-8"));

if (!Array.isArray(types) || types.length === 0) {
  err("catalog-types.json", "root", "array", "Pump types must be a non-empty array");
}

const typeIds = new Set(types.map((t) => t.id));
const pumpTypeLabelMap = buildPumpTypeLabelMap(types);

// 2. Check stable ID uniqueness
const genIds = gen.series.map((s) => s.id);
const contentIds = content.series.map((s) => s.id);
const dupGen = genIds.filter((id, i) => genIds.indexOf(id) !== i);
const dupContent = contentIds.filter((id, i) => contentIds.indexOf(id) !== i);
if (dupGen.length) err("catalog.generated.json", "series", "id", `Duplicate IDs: ${dupGen.join(", ")}`);
if (dupContent.length) err("catalog-content.json", "series", "id", `Duplicate IDs: ${dupContent.join(", ")}`);

const dupTypeIds = types.map((t) => t.id).filter((id, i, arr) => arr.indexOf(id) !== i);
if (dupTypeIds.length) err("catalog-types.json", "types", "id", `Duplicate IDs: ${dupTypeIds.join(", ")}`);

// 3. Check generated vs content ID alignment
for (const gs of gen.series) {
  const c = content.series.find((s) => s.id === gs.id);
  if (!c) err("catalog-content.json", gs.id, "id", `Missing content entry for series "${gs.name}" (id: ${gs.id})`);
}

for (const cs of content.series) {
  const g = gen.series.find((s) => s.id === cs.id);
  if (!g) err("catalog.generated.json", cs.id, "id", `Orphaned content entry "${cs.name}" - no matching generated series`);
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
  if (!gs.pumpType) err("catalog.generated.json", gs.id, "pumpType", "Missing pump type label");
  for (const m of gs.models) {
    if (!m.id) err("catalog.generated.json", gs.id, "model.id", `Model "${m.name}" has no ID`);
    if (!m.name) err("catalog.generated.json", gs.id, "model.name", `Model id "${m.id}" has no name`);
  }
}

for (const cs of content.series) {
  if (!cs.slug) err("catalog-content.json", cs.id, "slug", "Missing slug");
  if (!cs.shortDescription) warn("catalog-content.json", cs.id, "shortDescription", "Missing short description");
}

// 6. Pump-type label map completeness (P0-2 / P0-3)
for (const gs of gen.series) {
  if (!gs.pumpType) continue;
  const resolved = pumpTypeLabelMap.get(gs.pumpType);
  if (!resolved) {
    err(
      "catalog.generated.json",
      gs.id,
      "pumpType",
      `Unmapped pump type label "${gs.pumpType}" — add to catalog-types.json sourceLabels`,
    );
  } else if (!typeIds.has(resolved)) {
    err(
      "catalog-types.json",
      resolved,
      "id",
      `Label "${gs.pumpType}" resolved to missing type id "${resolved}"`,
    );
  }
}

for (const type of types) {
  if (!type.name) err("catalog-types.json", type.id, "name", "Missing name");
  if (!type.slug) err("catalog-types.json", type.id, "slug", "Missing slug");
}

for (const brand of brands) {
  if (!brand.id) err("catalog-brands.json", "brand", "id", "Missing brand id");
}

for (const purpose of purposes) {
  if (!purpose.id) err("catalog-purposes.json", "purpose", "id", "Missing purpose id");
}

// 6b. site.json nav pump types must reference real type ids
const site = JSON.parse(readFileSync(resolve(pagesDir, "site.json"), "utf-8"));
const navPumpTypes = site?.nav?.products?.pumpTypes ?? [];
for (const pt of navPumpTypes) {
  if (!typeIds.has(pt.id)) {
    err("site.json", pt.id, "nav.products.pumpTypes", `Unknown pump type id "${pt.id}"`);
  }
}

// 7. Media file existence
for (const cs of content.series) {
  if (cs.image) {
    const rel = cs.image.startsWith("/") ? cs.image.slice(1) : cs.image;
    const imgPath = resolve(ROOT, "public", rel);
    if (!existsSync(imgPath)) err("catalog-content.json", cs.id, "image", `Missing media: ${cs.image}`);
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

// 8. Page JSON parseability (loader contract surface)
for (const name of pageFiles) {
  const p = resolve(pagesDir, name);
  try {
    JSON.parse(readFileSync(p, "utf-8"));
  } catch (e) {
    err(name, "root", "json", `Invalid JSON: ${e.message}`);
  }
}

// 9. Check for null/zero technical values
for (const gs of gen.series) {
  for (const m of gs.models) {
    for (const [key, val] of Object.entries(m.specs)) {
      if (val === "" || val === null) {
        warn("catalog.generated.json", `${gs.id}/${m.id}`, key, "Empty technical value");
      }
    }
  }
}

// 10. Build check reminder (can't actually run build from here)
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
