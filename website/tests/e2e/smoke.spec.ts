import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000/zh-tw";

test.describe("Public smoke tests", () => {
  test("Home page loads with correct title", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("h1")).toContainText("以扎實經驗，守護每一套泵浦系統");
  });

  test("Header navigation shows all items", async ({ page }) => {
    await page.goto(BASE);
    const nav = page.getByRole("navigation", { name: "主導覽" });
    await expect(nav).toBeVisible();
    await expect(nav.getByText("產品總覽")).toBeVisible();
    await expect(nav.getByText("服務與實績")).toBeVisible();
    await expect(nav.getByText("關於傑平")).toBeVisible();
    await expect(nav.getByText("聯絡我們")).toBeVisible();
  });

  test("Product overview page loads", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await expect(page.locator("h1")).toContainText("產品總覽");
  });

  test("Series page renders model table", async ({ page }) => {
    await page.goto(`${BASE}/series/hs`);
    await expect(page.locator("h1")).toContainText("HS");
    const table = page.locator("table");
    await expect(table).toBeVisible();
    const rows = table.locator("tbody tr");
    await expect(rows).toHaveCount(12);
  });

  test("SB/SBI/SBN 491-row extreme fixture", async ({ page }) => {
    await page.goto(`${BASE}/series/sb-sbi-sbn`);
    const table = page.locator("table");
    await expect(table).toBeVisible();
    const rows = table.locator("tbody tr");
    await expect(rows).toHaveCount(491);
  });

  test("Contact page is dark-themed", async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await expect(page.locator("h1")).toContainText("聯絡我們");
  });

  test("Company page loads", async ({ page }) => {
    await page.goto(`${BASE}/company`);
    await expect(page.locator("h1")).toContainText("公司資訊");
    await expect(page.getByText("台北大巨蛋")).toBeVisible();
    await expect(page.getByText("3,000+").first()).toBeVisible();
    await expect(page.getByText("15,000+")).toBeVisible();
    await expect(page.getByText("總經理願景")).toBeVisible();
  });

  test("Partners page shows Grundfos", async ({ page }) => {
    await page.goto(`${BASE}/partners`);
    await expect(page.locator("h1")).toContainText("合作夥伴");
    await expect(page.getByText("Grundfos 葛蘭富")).toBeVisible();
    await expect(page.getByText("台灣葛蘭富公司總監 陳幼翎")).toBeVisible();
  });

  test("Services page loads with capability tags", async ({ page }) => {
    await page.goto(`${BASE}/services`);
    await expect(page.locator("h1")).toContainText("服務與實績");
  });

  test("Pump type filtering via URL works", async ({ page }) => {
    await page.goto(`${BASE}/products?type=submersible-well-pump`);
    await expect(page.locator("h1")).toContainText("產品總覽");
  });

  test("Brand and Purpose remain filters without standalone pages", async ({ page, request }) => {
    await page.goto(`${BASE}/products`);
    await expect(page.getByRole("group", { name: "品牌" })).toBeVisible();
    await expect(page.getByRole("group", { name: "用途" })).toBeVisible();

    const brandPage = await page.goto(`${BASE}/brands/jp-pump`);
    expect(brandPage?.status()).toBe(404);

    const grundfosBrandPage = await page.goto(`${BASE}/brands/grundfos`);
    expect(grundfosBrandPage?.status()).toBe(404);

    const purposePage = await page.goto(`${BASE}/purposes/${encodeURIComponent("大樓揚水")}`);
    expect(purposePage?.status()).toBe(404);

    const sitemap = await request.get("http://localhost:3000/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).not.toContain("/brands/");
    expect(sitemapBody).not.toContain("/purposes/");
    expect(sitemapBody).toContain("/series/");
  });

  test("Not found returns 404 page", async ({ page }) => {
    const resp = await page.goto(`${BASE}/nonexistent-page`);
    expect(resp?.status()).toBe(404);
  });
});
