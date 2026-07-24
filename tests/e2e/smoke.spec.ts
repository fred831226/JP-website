import { test, expect } from "@playwright/test";

const ZH = "/zh-tw";

test.describe("Public smoke — core routes load", () => {
  test("Home loads with Traditional Chinese shell", async ({ page }) => {
    await page.goto(ZH);
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hant-TW");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.locator("h1")).toContainText("泵浦");
  });

  test("Primary destinations respond", async ({ page }) => {
    for (const path of [
      `${ZH}/products`,
      `${ZH}/services`,
      `${ZH}/company`,
      `${ZH}/partners`,
      `${ZH}/contact`,
      `${ZH}/series/hs`,
    ]) {
      const res = await page.goto(path);
      expect(res?.ok()).toBeTruthy();
    }
  });

  test("Unknown route returns 404", async ({ page }) => {
    const res = await page.goto(`${ZH}/nonexistent-page`);
    expect(res?.status()).toBe(404);
  });
});
