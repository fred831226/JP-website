import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("locale root layout renders language-specific html and both published locales", async () => {
  const root = resolve(import.meta.dirname, "../src/app/layout.tsx");
  const locale = resolve(import.meta.dirname, "../src/app/[locale]/layout.tsx");
  const localeLayout = await readFile(locale, "utf8");

  await assert.rejects(access(root));
  assert.match(localeLayout, /<html lang=/);
  assert.match(localeLayout, /<body/);
  assert.match(localeLayout, /PageTransition/);
  assert.match(localeLayout, /generateStaticParams/);
  assert.match(localeLayout, /SITE_LOCALES/);
  await assert.rejects(access(resolve(import.meta.dirname, "../app")));
});
