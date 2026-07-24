import { test, expect } from "@playwright/test";

/**
 * Stories 2.2 / 2.3 — Product Overview, taxonomy, shareable filters.
 */
const ZH = "/zh-tw";

test.describe("Story 2.2 — Product Overview and taxonomy", () => {
  test("Product Overview lists published Series cards", async ({ page }) => {
    await page.goto(`${ZH}/products`);
    await expect(page.locator("h1")).toContainText("產品總覽");
    await expect(page.getByRole("link", { name: /HS/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /SB\/SBI\/SBN/ })).toBeVisible();
  });

  test("Series card is a single link to the canonical Series route", async ({ page }) => {
    await page.goto(`${ZH}/products`);
    const hs = page.getByRole("link", { name: /HS/ }).first();
    await expect(hs).toHaveAttribute("href", "/zh-tw/series/hs");
    await hs.click();
    await expect(page).toHaveURL(/\/zh-tw\/series\/hs/);
    await expect(page.locator("h1")).toContainText("HS");
  });

  test("Brand taxonomy landing loads", async ({ page }) => {
    const res = await page.goto(`${ZH}/brands/jp-pump`);
    expect(res?.ok()).toBeTruthy();
  });

  test("Pump Type taxonomy landing loads", async ({ page }) => {
    const res = await page.goto(`${ZH}/types/submersible-well-pump`);
    expect(res?.ok()).toBeTruthy();
  });
});

test.describe("Story 2.3 — Filter and share product results", () => {
  test("Filter UI exposes search, brand, type, purpose, and clear-all", async ({
    page,
  }) => {
    await page.goto(`${ZH}/products`);
    const aside = page.getByRole("complementary", { name: "產品篩選" }).or(
      page.locator('aside[aria-label="產品篩選"]'),
    );
    await expect(aside).toBeVisible();
    await expect(page.getByLabel("搜尋")).toBeVisible();
    await expect(page.getByRole("button", { name: "全部" }).first()).toBeVisible();
    await expect(page.getByRole("group", { name: "泵浦類型" })).toBeVisible();
    await expect(page.getByRole("group", { name: "用途" })).toBeVisible();
  });

  test("URL type filter narrows results and is restorable", async ({ page }) => {
    await page.goto(`${ZH}/products?type=submersible-well-pump`);
    await expect(page).toHaveURL(/type=submersible-well-pump/);
    await expect(page.getByRole("link", { name: /HS/ })).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/type=submersible-well-pump/);
    await expect(page.getByRole("link", { name: /HS/ })).toBeVisible();
  });

  test("Brand filter via control updates URL immediately", async ({ page }) => {
    await page.goto(`${ZH}/products`);
    await page.getByRole("button", { name: /傑平有限公司 JP PUMP/ }).click();
    await expect(page).toHaveURL(/brand=jp-pump/);
  });

  test("No-match state preserves message and clear action", async ({ page }) => {
    await page.goto(`${ZH}/products?q=ZZZ-NO-MATCH`);
    await expect(page.getByText("沒有符合目前條件的產品。")).toBeVisible();
    await expect(page.getByRole("button", { name: "重設全部條件" })).toBeVisible();
  });

  test("Clear-all returns unconstrained Product Overview", async ({ page }) => {
    await page.goto(`${ZH}/products?q=ZZZ-NO-MATCH`);
    await page.getByRole("button", { name: "重設全部條件" }).click();
    await expect(page).toHaveURL(/\/zh-tw\/products\/?$/);
    await expect(page.getByRole("link", { name: /HS/ })).toBeVisible();
  });
});
