// Content & release validation gate
// Usage: node scripts/validate-content.mjs
// Checks: schemas, IDs, links, media rights, sitemap consistency

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const xlsx = await import("xlsx");

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

// 1. Load catalog files
const genPath = resolve(ROOT, "data", "catalog.generated.json");
const publicGenPath = resolve(ROOT, "src", "data", "catalog.generated.json");
const contentPath = resolve(ROOT, "data", "catalog-content.json");
const publicContentPath = resolve(ROOT, "src", "data", "catalog-content.json");
const overviewPath = resolve(ROOT, "data", "catalog-overview.json");
const publicOverviewPath = resolve(ROOT, "src", "data", "catalog-overview.json");
const overviewGovernancePath = resolve(ROOT, "data", "catalog-overview-governance.json");
const sourceCatalogPath = resolve(ROOT, "data", "source-catalog.xlsx");
const brandsPath = resolve(ROOT, "src", "data", "catalog-brands.json");
const typesPath = resolve(ROOT, "src", "data", "catalog-types.json");
const purposesPath = resolve(ROOT, "src", "data", "catalog-purposes.json");

for (const [label, p] of [["generated", genPath], ["public-generated", publicGenPath], ["content", contentPath], ["public-content", publicContentPath], ["overview", overviewPath], ["public-overview", publicOverviewPath], ["overview-governance", overviewGovernancePath], ["source-catalog", sourceCatalogPath], ["brands", brandsPath], ["types", typesPath], ["purposes", purposesPath]]) {
  if (!existsSync(p)) err("N/A", label, "file", `Missing file: ${p}`);
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
const brandIdByName = new Map([["傑平", "jp-pump"], ["葛蘭富", "grundfos"]]);
const excelSeries = new Map();
const excelOverview = new Map();
const text = (value) => String(value ?? "").trim();

if (!sourceSheet) {
  err("source-catalog.xlsx", "完整產品規格表", "sheet", "Required catalog sheet is missing");
} else {
  const sourceRows = xlsx.utils.sheet_to_json(sourceSheet, { defval: null, header: 1 }).slice(3);
  for (const [rowIndex, row] of sourceRows.entries()) {
    const sourceRow = rowIndex + 4;
    if (!row.slice(0, 7).some((value) => text(value))) continue;
    const brandName = text(row[0]);
    const brandId = brandIdByName.get(brandName);
    const seriesName = text(row[1]);
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
        published: text(row[column["首頁代表"] ?? column["是否發布"]]),
      });
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

// 6. Media file existence
const mediaDir = resolve(ROOT, "public", "media");
for (const cs of content.series) {
  if (cs.image) {
    const rel = cs.image.startsWith("/") ? cs.image.slice(1) : cs.image;
    const imgPath = resolve(ROOT, "public", rel);
    if (!existsSync(imgPath)) err("catalog-content.json", cs.id, "image", `Missing media: ${cs.image}`);
  }
  if (Array.isArray(cs.images)) {
    for (const img of cs.images) {
      const rel = img.startsWith("/") ? img.slice(1) : img;
      const imgPath = resolve(ROOT, "public", rel);
      if (!existsSync(imgPath)) err("catalog-content.json", cs.id, "images", `Missing media: ${img}`);
    }
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
for (const gs of gen.series) {
  for (const m of gs.models) {
    for (const [key, val] of Object.entries(m.specs)) {
      if (val === "" || val === null) {
        warn("catalog.generated.json", `${gs.id}/${m.id}`, key, "Empty technical value");
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
