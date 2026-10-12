import { expect, test } from "@playwright/test";

const pages = ["/en", "/en/company", "/en/partners", "/en/products", "/en/contact"];

test("English inquiry path is complete and correctly marked", async ({ page, request }) => {
  for (const path of pages) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.locator("main").innerText(), path).not.toMatch(/[\u3400-\u9fff]/u);
    await expect(page.locator(`link[rel="canonical"]`)).toHaveAttribute("href", new RegExp(`${path.replace(/\//g, "\\/")}/?$`));
    await expect(page.locator('link[rel="alternate"][hreflang="zh-TW"]')).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Contact", exact: true }).first()).toHaveAttribute("href", "/en/contact");
  }

  const products = await request.get("/en/products");
  expect(await products.text()).not.toContain("/en/series/");
  await page.goto("/en");
  await expect(page.locator(".project-gallery-tile")).toHaveCount(11);
  await expect(page.locator(".product-type-card")).toHaveCount(6);
  await expect(page.locator(".gateway")).toHaveCount(3);
  await page.goto("/en/company");
  await expect(page.locator(".project-gallery-tile")).toHaveCount(11);
  await page.goto("/en/partners");
  await expect(page.getByRole("heading", { name: "History and business" })).toBeVisible();
  await page.goto("/en/contact");
  await expect(page.locator('iframe[title="JIEPING CO., LTD location map"]')).toBeVisible();
  await page.goto("/en/products");
  await expect(page.locator("[data-catalog-series]")).toHaveCount(21);
  await expect(page.getByText("2VBSG", { exact: true })).toHaveCount(0);
  await expect(page.locator("[data-catalog-series]").first()).toHaveAttribute("href", "/en/contact");
  await page.getByRole("button", { name: "Circulator pumps" }).click();
  await expect(page).toHaveURL(/\/en\/products\?type=circulator-pump$/);
  await expect(page.getByTestId("catalog-result-count")).toContainText("product series");
  const series = await request.get("/en/series/hs");
  expect(series.status()).toBe(404);
  const services = await request.get("/en/services");
  expect(services.status()).toBe(404);
});

test("language switch only targets published English pages", async ({ page }) => {
  await page.goto("/zh-tw/company");
  await page.getByRole("link", { name: "切換至英文版" }).click();
  await expect(page).toHaveURL(/\/en\/company\/?$/);
  await page.getByRole("link", { name: "Switch to Traditional Chinese" }).click();
  await expect(page).toHaveURL(/\/zh-tw\/company\/?$/);

  await page.goto("/zh-tw/series/hs");
  await expect(page.getByRole("link", { name: "切換至英文版" })).toHaveAttribute("href", "/en/products");
});
