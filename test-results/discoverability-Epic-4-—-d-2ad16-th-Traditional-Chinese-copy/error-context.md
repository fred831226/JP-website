# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: discoverability.spec.ts >> Epic 4 — discoverability basics >> 404 remains inside zh-tw shell with Traditional Chinese copy
- Location: tests/e2e/discoverability.spec.ts:42:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('banner')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('banner')

```

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | /**
  4  |  * Epic 4 lean checks — locale shell, robots, sitemap, 404 recovery.
  5  |  */
  6  | const ZH = "/zh-tw";
  7  | 
  8  | test.describe("Epic 4 — discoverability basics", () => {
  9  |   test("robots.txt is served", async ({ request }) => {
  10 |     const res = await request.get("/robots.txt");
  11 |     expect(res.ok()).toBeTruthy();
  12 |     const body = await res.text();
  13 |     expect(body).toMatch(/sitemap/i);
  14 |   });
  15 | 
  16 |   test("sitemap.xml includes core zh-tw routes", async ({ request }) => {
  17 |     const res = await request.get("/sitemap.xml");
  18 |     expect(res.ok()).toBeTruthy();
  19 |     const body = await res.text();
  20 |     expect(body).toContain("/zh-tw");
  21 |     expect(body).toContain("/zh-tw/products");
  22 |     expect(body).toContain("/zh-tw/series/hs");
  23 |     expect(body).toContain("/zh-tw/contact");
  24 |   });
  25 | 
  26 |   test("Organization JSON-LD is present on public pages", async ({ page }) => {
  27 |     await page.goto(ZH);
  28 |     const jsonLd = page.locator('script[type="application/ld+json"]');
  29 |     await expect(jsonLd).toHaveCount(1);
  30 |     const raw = await jsonLd.textContent();
  31 |     expect(raw).toBeTruthy();
  32 |     const data = JSON.parse(raw!);
  33 |     expect(data["@type"]).toBe("Organization");
  34 |     expect(data.name).toContain("傑平");
  35 |   });
  36 | 
  37 |   test("Unknown path returns HTTP 404", async ({ page }) => {
  38 |     const res = await page.goto(`${ZH}/does-not-exist-${Date.now()}`);
  39 |     expect(res?.status()).toBe(404);
  40 |   });
  41 | 
  42 |   test("404 remains inside zh-tw shell with Traditional Chinese copy", async ({ page }) => {
  43 |     // Known gap: unmatched routes currently hit Next.js default English 404 without locale layout.
  44 |     test.fail(true, "Locale not-found shell is not applied to unmatched /zh-tw/* paths");
  45 |     const res = await page.goto(`${ZH}/does-not-exist-${Date.now()}`);
  46 |     expect(res?.status()).toBe(404);
> 47 |     await expect(page.getByRole("banner")).toBeVisible();
     |                                            ^ Error: expect(locator).toBeVisible() failed
  48 |     await expect(page.getByText("找不到此頁面")).toBeVisible();
  49 |   });
  50 | });
  51 | 
```