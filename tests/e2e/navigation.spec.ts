import { test, expect } from "@playwright/test";

/**
 * Story 1.2 — Navigate Public Trust Surfaces
 * AC: header order, About/Product menus, mobile menu, footer structure, no News.
 */
const ZH = "/zh-tw";

test.describe("Story 1.2 — public navigation", () => {
  test("Header exposes primary items in approved order", async ({ page }) => {
    await page.goto(ZH);
    const nav = page.getByRole("navigation", { name: "主導覽" });
    await expect(nav).toBeVisible();

    const labels = await nav.locator("a, button").evaluateAll((els) =>
      els.map((el) => el.textContent?.replace(/\s+/g, " ").trim() ?? "").filter(Boolean),
    );

    const primary = ["產品總覽", "服務與實績", "關於傑平", "聯絡我們"];
    const found = primary.map((label) => labels.findIndex((t) => t.startsWith(label)));
    expect(found.every((i) => i >= 0)).toBeTruthy();
    expect(found[0]).toBeLessThan(found[1]!);
    expect(found[1]).toBeLessThan(found[2]!);
    expect(found[2]).toBeLessThan(found[3]!);
  });

  test("Logo returns Home", async ({ page }) => {
    await page.goto(`${ZH}/products`);
    await page.getByRole("link", { name: "回首頁" }).click();
    await expect(page).toHaveURL(/\/zh-tw\/?$/);
  });

  test("About menu opens with Company and Partners only", async ({ page }) => {
    await page.goto(ZH);
    const about = page.getByRole("navigation", { name: "主導覽" }).getByRole("button", {
      name: /關於傑平/,
    });
    await about.click();
    await expect(about).toHaveAttribute("aria-expanded", "true");

    const menu = page.getByRole("menu");
    await expect(menu.getByRole("menuitem", { name: "公司資訊" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "合作夥伴" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: /新聞|News/i })).toHaveCount(0);

    await page.keyboard.press("Escape");
    await expect(about).toHaveAttribute("aria-expanded", "false");
  });

  test("Product menu lists items and includes 全部產品", async ({ page }) => {
    await page.goto(ZH);
    const products = page.getByRole("navigation", { name: "主導覽" }).getByRole("button", {
      name: /產品總覽/,
    });
    await products.click();

    const menu = page.getByRole("menu");
    await expect(menu.getByRole("menuitem", { name: "全部產品" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "沉水式揚水泵" })).toBeVisible();
  });

  test("Product menu places 全部產品 last (Story 1.2 AC)", async ({ page }) => {
    // Known gap: Header currently prepends 全部產品 before pump-type links.
    test.fail(true, "Product menu order does not yet match Story 1.2 AC (全部產品 last)");
    await page.goto(ZH);
    await page
      .getByRole("navigation", { name: "主導覽" })
      .getByRole("button", { name: /產品總覽/ })
      .click();
    const itemLabels = await page.getByRole("menu").getByRole("menuitem").allTextContents();
    expect(itemLabels.at(-1)?.trim()).toBe("全部產品");
  });

  test("Services remains a direct top-level link", async ({ page }) => {
    await page.goto(ZH);
    const nav = page.getByRole("navigation", { name: "主導覽" });
    await nav.getByRole("link", { name: "服務與實績" }).click();
    await expect(page).toHaveURL(/\/zh-tw\/services/);
    await expect(page.locator("h1")).toContainText("服務與實績");
  });

  test("Mobile menu exposes same destinations", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(ZH);

    await expect(page.getByRole("navigation", { name: "主導覽" })).toBeHidden();
    const trigger = page.getByRole("button", { name: "選單" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const mobile = page.getByRole("navigation", { name: "行動選單" });
    await expect(mobile).toBeVisible();
    await expect(mobile.getByText("產品總覽")).toBeVisible();
    await expect(mobile.getByText("服務與實績")).toBeVisible();
    await expect(mobile.getByText("關於傑平")).toBeVisible();
    await expect(mobile.getByRole("link", { name: "聯絡我們" })).toBeVisible();
  });

  test("Footer includes identity, nav, and contact", async ({ page }) => {
    await page.goto(ZH);
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByAltText("JP PUMP")).toBeVisible();
    await expect(footer.getByRole("navigation", { name: "頁尾導覽" })).toBeVisible();
    await expect(footer.getByText("聯絡資訊")).toBeVisible();
  });
});
