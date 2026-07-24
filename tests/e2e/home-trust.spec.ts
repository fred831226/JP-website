import { test, expect } from "@playwright/test";

/**
 * Stories 1.3, 1.4, 1.5, 1.6, 2.7 — Home + trust surfaces + contact.
 */
const ZH = "/zh-tw";

test.describe("Story 1.3 / 2.7 — Home trust and discovery", () => {
  test("Hero shows positioning and 認識我們 CTA", async ({ page }) => {
    await page.goto(ZH);
    await expect(page.locator("h1")).toContainText("泵浦");
    await expect(page.getByRole("link", { name: "認識我們" })).toHaveAttribute(
      "href",
      "/zh-tw/company",
    );
  });

  test("Home quick filter defaults to 全部 and submits to Product Overview", async ({
    page,
  }) => {
    await page.goto(ZH);
    const brand = page.locator("#qf-brand");
    const purpose = page.locator("#qf-purpose");
    await expect(brand).toHaveValue("");
    await expect(purpose).toHaveValue("");

    await page.getByRole("button", { name: "搜尋產品" }).click();
    await expect(page).toHaveURL(/\/zh-tw\/products\/?$/);
    await expect(page.locator("h1")).toContainText("產品總覽");
  });

  test("Home quick filter encodes Brand constraint in URL", async ({ page }) => {
    await page.goto(ZH);
    await page.locator("#qf-brand").selectOption("jp-pump");
    await page.getByRole("button", { name: "搜尋產品" }).click();
    await expect(page).toHaveURL(/brand=jp-pump/);
  });

  test("Destination gateways link Product / Services / Contact", async ({ page }) => {
    await page.goto(ZH);
    const gateways = page.getByRole("group", { name: "主要入口" });
    await expect(gateways.getByRole("link", { name: /產品總覽/ })).toBeVisible();
    await expect(gateways.getByRole("link", { name: /服務與實績/ })).toBeVisible();
    await expect(gateways.getByRole("link", { name: /聯絡我們/ })).toBeVisible();
  });

  test("Home omits News and does not invent empty Project cards", async ({ page }) => {
    await page.goto(ZH);
    await expect(page.getByRole("heading", { name: /新聞|News/i })).toHaveCount(0);
    await expect(page.getByText("精選建案實績")).toHaveCount(0);
  });
});

test.describe("Story 1.4 — Company and Partners", () => {
  test("Company presents legal name without inventing founded year", async ({ page }) => {
    await page.goto(`${ZH}/company`);
    await expect(page.locator("h1")).toContainText("公司資訊");
    await expect(page.getByText("傑平有限公司")).toBeVisible();
    await expect(page.getByText(/創立年份/)).toHaveCount(0);
  });

  test("Partners empty state when no approved partner records", async ({ page }) => {
    await page.goto(`${ZH}/partners`);
    await expect(page.locator("h1")).toContainText("合作夥伴");
    await expect(page.getByText("尚無已核准的合作夥伴資訊。")).toBeVisible();
  });
});

test.describe("Story 1.5 — Services and Project evidence", () => {
  test("Services hero lists approved capabilities", async ({ page }) => {
    await page.goto(`${ZH}/services`);
    await expect(page.locator("h1")).toContainText("服務與實績");
    for (const label of ["估價", "選型", "供應", "安裝", "維修", "顧問"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("Empty projects shows factual empty state and Contact", async ({ page }) => {
    await page.goto(`${ZH}/services`);
    await expect(page.getByText("尚無公開的建案實績資料。")).toBeVisible();
    await expect(page.getByRole("main").getByRole("link", { name: "聯絡我們" })).toHaveAttribute(
      "href",
      "/zh-tw/contact",
    );
  });
});

test.describe("Story 1.6 — Contact", () => {
  test("Contact uses dark composition without a form or source attribution", async ({
    page,
  }) => {
    await page.goto(`${ZH}/contact`);
    await expect(page.locator("h1")).toContainText("聯絡我們");
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page).not.toHaveURL(/[?&](from|src|ref|utm_)=/);
  });

  test("Unapproved contact fields are omitted (no placeholder phone/email)", async ({
    page,
  }) => {
    await page.goto(`${ZH}/contact`);
    // contact.json currently has null phone/email — AC: omit, do not invent
    await expect(page.getByRole("main").getByRole("link", { name: /tel:/i })).toHaveCount(0);
    await expect(page.getByRole("main").locator('a[href^="mailto:"]')).toHaveCount(0);
    await expect(page.getByRole("main").locator('a[href^="tel:"]')).toHaveCount(0);
  });
});
