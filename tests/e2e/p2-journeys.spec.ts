import { test, expect } from "@playwright/test";

/**
 * P2-4 — key journey smoke: catalog query, series, contact actions in chrome.
 */
const ZH = "/zh-tw";

test.describe("P2-4 — key journey smoke", () => {
  test("Catalog type query narrows and shares via URL", async ({ page }) => {
    await page.goto(`${ZH}/products?type=sewage-pump`);
    await expect(page.locator("h1")).toContainText("產品總覽");
    await expect(page).toHaveURL(/type=sewage-pump/);
    const cards = page.locator('a[href*="/zh-tw/series/"]');
    await expect(cards.first()).toBeVisible();
  });

  test("Series page exposes Contact continuation without source attribution", async ({ page }) => {
    await page.goto(`${ZH}/series/hs`);
    await expect(page.locator("h1")).toBeVisible();
    const contact = page.getByRole("main").getByRole("link", { name: /聯絡/ });
    await expect(contact.first()).toHaveAttribute("href", "/zh-tw/contact");
    await expect(page).not.toHaveURL(/[?&](from|src|ref|utm_)=/);
  });

  test("Footer exposes governed tel and mailto actions", async ({ page }) => {
    await page.goto(ZH);
    const footer = page.getByRole("contentinfo");
    await expect(footer.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(footer.locator('a[href^="mailto:"]')).toHaveCount(1);
  });

  test("Services top-level nav link is active after Header server/client split", async ({
    page,
  }) => {
    await page.goto(`${ZH}/services`);
    const services = page.getByRole("navigation", { name: "主導覽" }).getByRole("link", {
      name: "服務與實績",
    });
    await expect(services).toHaveCSS("text-decoration-line", "underline");
  });
});
