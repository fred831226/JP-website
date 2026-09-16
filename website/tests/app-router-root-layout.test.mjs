import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("App Router has a root layout while the locale layout remains responsible for zh-tw generation", async () => {
  const root = resolve(import.meta.dirname, "../src/app/layout.tsx");
  const locale = resolve(import.meta.dirname, "../src/app/[locale]/layout.tsx");
  const [rootLayout, localeLayout] = await Promise.all([readFile(root, "utf8"), readFile(locale, "utf8")]);

  assert.match(rootLayout, /<html/);
  assert.match(rootLayout, /<body/);
  assert.match(rootLayout, /PageTransition/);
  assert.match(localeLayout, /generateStaticParams/);
  assert.match(localeLayout, /locale:\s*"zh-tw"/);
  await assert.rejects(access(resolve(import.meta.dirname, "../app")));
});
