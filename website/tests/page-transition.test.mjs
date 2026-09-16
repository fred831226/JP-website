import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const componentPath = resolve(import.meta.dirname, "../src/components/PageTransition.tsx");

test("all public content except product-series detail pages animates in immediately", async () => {
  const component = await readFile(componentPath, "utf8");

  assert.match(component, /pathname\.startsWith\("\/zh-tw\/series\/"\)/);
  assert.match(component, /prefers-reduced-motion:\s*reduce/);
  assert.match(component, /key=\{pathname\}/);
  assert.match(component, /page-transition-content/);
  assert.match(component, /data-page-transition=/);
  assert.match(component, /animation:\s*page-content-arrive\s+260ms/);
  assert.doesNotMatch(component, /router\.push/);
  assert.doesNotMatch(component, /setTimeout/);
  assert.doesNotMatch(component, /page-transition-mist/);
});
