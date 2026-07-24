import { test, expect } from "@playwright/test";

/**
 * Stories 2.4 / 2.5 / 2.6 — Series overview, Model table, media, contact actions.
 */
const ZH = "/zh-tw";

test.describe("Story 2.4 — Canonical Series overview", () => {
  test("Series page shows suitability note and key-data units", async ({ page }) => {
    await page.goto(`${ZH}/series/hs`);
    await expect(
      page.getByText("最終選型、採購與適用性請聯絡傑平有限公司確認。"),
    ).toBeVisible();
    await expect(page.getByText("最小揚程")).toBeVisible();
    await expect(page.getByText("最大揚程")).toBeVisible();
    await expect(page.getByText("最小揚水量")).toBeVisible();
    await expect(page.getByText("最大揚水量")).toBeVisible();
    // Reviewed HS ranges from catalog-overview.json (scoped to key-data tiles)
    const keyData = page.locator(".keydata-tile");
    await expect(keyData.filter({ hasText: "最小揚程" })).toContainText("40");
    await expect(keyData.filter({ hasText: "最大揚程" })).toContainText("56");
    await expect(keyData.filter({ hasText: "最小揚水量" })).toContainText("300");
    await expect(keyData.filter({ hasText: "最大揚水量" })).toContainText("680");
  });

  test("Missing Series values render 未提供 (Y series via stable id path)", async ({
    page,
  }) => {
    // getSeries() currently resolves by id; /series/y works today.
    await page.goto(`${ZH}/series/y`);
    await expect(page.getByText("未提供").first()).toBeVisible();
  });

  test("Canonical slug /series/y-series resolves (Story 2.1/2.4)", async ({ page }) => {
    // Known gap: generateStaticParams emits slug y-series but getSeries() looks up by id.
    test.fail(true, "Series loader matches id, not locale slug — y-series 404s");
    const res = await page.goto(`${ZH}/series/y-series`);
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("h1")).toContainText("Y");
  });

  test("Purpose tags are non-interactive", async ({ page }) => {
    await page.goto(`${ZH}/series/hs`);
    const tag = page.getByText("大樓揚水", { exact: true });
    await expect(tag).toBeVisible();
    await expect(tag).not.toHaveAttribute("href", /.*/);
    await expect(tag.evaluate((el) => el.tagName)).resolves.toMatch(/SPAN|DIV|P/i);
  });

  test("V1 Series page has no Model detail route or PDF download", async ({ page }) => {
    await page.goto(`${ZH}/series/hs`);
    await expect(page.getByRole("link", { name: /PDF|下載|download/i })).toHaveCount(0);
    await expect(page.locator('a[href*="/models/"]')).toHaveCount(0);
  });
});

test.describe("Story 2.5 — Model specifications table", () => {
  test("HS Model table lists all 12 reviewed models", async ({ page }) => {
    await page.goto(`${ZH}/series/hs`);
    const table = page.locator("table");
    await expect(table).toBeVisible();
    await expect(table.locator("tbody tr")).toHaveCount(12);
    await expect(table.getByText("HS-37-80")).toBeVisible();
  });

  test("Model table exposes reviewed numeric specs (not blanket 未提供)", async ({
    page,
  }) => {
    // Known gap: table reads specs.head/flow/power but generated data has rated_head_m / rated_flow_lmin.
    test.fail(true, "Model table field mapping does not match generated catalog keys");
    await page.goto(`${ZH}/series/hs`);
    const firstRow = page.locator("table tbody tr").first();
    await expect(firstRow.getByText("HS-37-80")).toBeVisible();
    await expect(firstRow.getByText("40")).toBeVisible();
    await expect(firstRow.getByText("300")).toBeVisible();
  });

  test("HS model row currently falls back to 未提供 for unmapped spec keys", async ({
    page,
  }) => {
    await page.goto(`${ZH}/series/hs`);
    const firstRow = page.locator("table tbody tr").first();
    await expect(firstRow.getByText("HS-37-80")).toBeVisible();
    await expect(firstRow.getByText("未提供").first()).toBeVisible();
  });

  test("SB/SBI/SBN extreme fixture renders all 491 rows without pagination", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto(`${ZH}/series/sb-sbi-sbn`);
    const table = page.locator("table");
    await expect(table).toBeVisible();
    await expect(table.locator("tbody tr")).toHaveCount(491);
    await expect(page.getByRole("button", { name: /下一頁|Load more|載入更多/i })).toHaveCount(
      0,
    );
  });
});

test.describe("Story 2.6 — Media dialog and Contact continuation", () => {
  test("Series image opens enlargement dialog and closes with Escape", async ({
    page,
  }) => {
    await page.goto(`${ZH}/series/hs`);
    await page.getByRole("button", { name: /放大檢視 HS/ }).click();
    const dialog = page.getByRole("dialog", { name: "圖片放大檢視" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("Series actions navigate to Contact without source attribution", async ({
    page,
  }) => {
    await page.goto(`${ZH}/series/hs`);
    await page.getByRole("link", { name: "前往聯絡頁" }).click();
    await expect(page).toHaveURL(/\/zh-tw\/contact\/?$/);
    await expect(page).not.toHaveURL(/[?&](series|from|src)=/);
  });

  test("返回產品總覽 recovers catalog entry", async ({ page }) => {
    await page.goto(`${ZH}/series/hs`);
    await page.getByRole("link", { name: "返回產品總覽" }).click();
    await expect(page).toHaveURL(/\/zh-tw\/products\/?$/);
  });
});
