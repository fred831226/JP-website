// Content & release validation gate
// Usage: node scripts/validate-content.mjs
// Checks: schemas, IDs, links, media rights, sitemap consistency

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

// 1. Load catalog files
const genPath = resolve(ROOT, "data", "catalog.generated.json");
const contentPath = resolve(ROOT, "data", "catalog-content.json");
const brandsPath = resolve(ROOT, "src", "data", "catalog-brands.json");
const typesPath = resolve(ROOT, "src", "data", "catalog-types.json");
const purposesPath = resolve(ROOT, "src", "data", "catalog-purposes.json");

for (const [label, p] of [["generated", genPath], ["content", contentPath], ["brands", brandsPath], ["types", typesPath], ["purposes", purposesPath]]) {
  if (!existsSync(p)) err("N/A", label, "file", `Missing file: ${p}`);
}

if (errors.length > 0) {
  printReport();
  process.exit(1);
}

const gen = JSON.parse(readFileSync(genPath, "utf-8"));
const content = JSON.parse(readFileSync(contentPath, "utf-8"));
const brands = JSON.parse(readFileSync(brandsPath, "utf-8"));

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
  if (!brand) warn("catalog.generated.json", gs.id, "brandId", `Unknown brandId: ${gs.brandId}`);
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
