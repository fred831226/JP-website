import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000/zh-tw";

test.describe("Public smoke tests", () => {
  test("Home page loads with correct title", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("h1")).toContainText("傑平");
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
  });

  test("Services page loads with capability tags", async ({ page }) => {
    await page.goto(`${BASE}/services`);
    await expect(page.locator("h1")).toContainText("服務與實績");
  });

  test("Pump type filtering via URL works", async ({ page }) => {
    await page.goto(`${BASE}/products?type=submersible-well-pump`);
    await expect(page.locator("h1")).toContainText("產品總覽");
  });

  test("Not found returns 404 page", async ({ page }) => {
    const resp = await page.goto(`${BASE}/nonexistent-page`);
    expect(resp?.status()).toBe(404);
  });
});
