import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyDeploymentEnvironment,
  getIndexingHeaders,
  getRobotsPolicy,
  shouldShowPreviewBanner,
} from "../../src/lib/deployment-environment.ts";

test("only an explicit Vercel production environment is indexable", () => {
  assert.deepEqual(classifyDeploymentEnvironment("production"), {
    kind: "production",
    isProduction: true,
    isIndexable: true,
    label: null,
  });
  for (const value of ["preview", "development", "staging", "PRODUCTION"]) {
    const environment = classifyDeploymentEnvironment(value);
    assert.equal(environment.isProduction, false);
    assert.equal(environment.isIndexable, false);
    assert.equal(environment.label, value === "preview" ? "預覽環境" : "開發環境");
  }
});

test("Preview and unknown environments disallow crawling and omit Production sitemap identity", () => {
  assert.deepEqual(getRobotsPolicy("preview"), {
    rules: { userAgent: "*", disallow: "/" },
  });
  assert.deepEqual(getRobotsPolicy("staging"), {
    rules: { userAgent: "*", disallow: "/" },
  });
  assert.deepEqual(getRobotsPolicy("production"), {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.jp-pump.com.tw/sitemap.xml",
  });
});

test("omitted environment reads the ambient Vercel environment", () => {
  const previous = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = "preview";
    assert.equal(classifyDeploymentEnvironment().kind, "preview");
    assert.deepEqual(getRobotsPolicy(), {
      rules: { userAgent: "*", disallow: "/" },
    });
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});

test("Production emits no X-Robots-Tag while Preview and Development fail closed", () => {
  assert.deepEqual(getIndexingHeaders("production"), []);
  assert.deepEqual(getIndexingHeaders("preview"), [
    { key: "X-Robots-Tag", value: "noindex, nofollow" },
  ]);
  assert.deepEqual(getIndexingHeaders("development"), [
    { key: "X-Robots-Tag", value: "noindex, nofollow" },
  ]);
  assert.deepEqual(getIndexingHeaders("staging"), [
    { key: "X-Robots-Tag", value: "noindex, nofollow" },
  ]);
});

test("only non-Production environments show the Preview banner", () => {
  assert.equal(shouldShowPreviewBanner(classifyDeploymentEnvironment("production")), false);
  assert.equal(shouldShowPreviewBanner(classifyDeploymentEnvironment("preview")), true);
  assert.equal(shouldShowPreviewBanner(classifyDeploymentEnvironment("development")), true);
});
