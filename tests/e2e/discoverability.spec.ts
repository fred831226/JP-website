import { test, expect } from "@playwright/test";

/**
 * Epic 4 lean checks — locale shell, robots, sitemap, 404 recovery.
 */
const ZH = "/zh-tw";

test.describe("Epic 4 — discoverability basics", () => {
  test("robots.txt is served", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toMatch(/sitemap/i);
  });

  test("sitemap.xml includes core zh-tw routes", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain("/zh-tw");
    expect(body).toContain("/zh-tw/products");
    expect(body).toContain("/zh-tw/series/hs");
    expect(body).toContain("/zh-tw/contact");
  });

  test("Organization JSON-LD is present on public pages", async ({ page }) => {
    await page.goto(ZH);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const raw = await jsonLd.textContent();
    expect(raw).toBeTruthy();
    const data = JSON.parse(raw!);
    expect(data["@type"]).toBe("Organization");
    expect(data.name).toContain("傑平");
  });

  test("Unknown path returns HTTP 404", async ({ page }) => {
    const res = await page.goto(`${ZH}/does-not-exist-${Date.now()}`);
    expect(res?.status()).toBe(404);
  });

  test("404 remains inside zh-tw shell with Traditional Chinese copy", async ({ page }) => {
    // Known gap: unmatched routes currently hit Next.js default English 404 without locale layout.
    test.fail(true, "Locale not-found shell is not applied to unmatched /zh-tw/* paths");
    const res = await page.goto(`${ZH}/does-not-exist-${Date.now()}`);
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByText("找不到此頁面")).toBeVisible();
  });
});
