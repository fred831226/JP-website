import { expect, test } from "@playwright/test";

const base = "/zh-tw";

test("22 cards are crawlable and sitemap contains the same canonical routes", async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${base}/products`);
  const hrefs = await page.locator('[data-catalog-series]').evaluateAll((cards) => cards.map((card) => card.getAttribute("href")));
  expect(hrefs).toHaveLength(22);
  expect(new Set(hrefs).size).toBe(22);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const sitemapSeries = [...sitemap.matchAll(/<loc>[^<]*\/zh-tw\/series\/[^<]+<\/loc>/g)].map(([value]) => value);
  expect(sitemapSeries).toHaveLength(22);
  expect(sitemap).not.toMatch(/\/brands\/|\/purposes\/|\/models\//);
  await context.close();
});

test("Product card has classification, complete ranges, and one canonical link", async ({ page }) => {
  await page.goto(`${base}/products`);
  const card = page.locator('[data-catalog-series="jp-pump-hs"]');
  await expect(card).toHaveAttribute("href", "/zh-tw/series/hs");
  await expect(card.getByText("沉水式揚水泵", { exact: true })).toBeVisible();
  await expect(card.getByText(/揚程範圍（m）(?:未提供|\d)/)).toBeVisible();
  await expect(card.getByText(/揚水量範圍（L\/min）(?:未提供|\d)/)).toBeVisible();
  await expect(card.locator("a")).toHaveCount(0);
});

test("Series content follows the required reading order and public review boundary", async ({ page }) => {
  await page.goto(`${base}/series/hs`);
  for (const label of ["最小揚程", "最大揚程", "最小揚水量", "最大揚水量"]) await expect(page.getByText(label, { exact: true })).toBeVisible();
  await expect(page.getByText("最後更新：2026-08-21", { exact: true })).toBeVisible();
  expect(await page.locator("body").innerText()).not.toContain("Fred");
  const order = await page.locator("[data-series-section]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-series-section")));
  expect(order).toEqual(["suitability", "media", "key-data", "introduction", "models", "purposes", "actions"]);
});

test("filter changes are immediate, latest-state safe, selected, counted, and announced", async ({ page }) => {
  await page.goto(`${base}/products`);
  await page.waitForLoadState("networkidle");
  const search = page.getByRole("textbox", { name: "搜尋" });
  await search.fill("HS");
  await expect(page).toHaveURL(/q=HS/, { timeout: 10_000 });
  const type = page.getByRole("group", { name: "泵浦類型" }).getByRole("button", { name: "沉水式揚水泵" });
  await type.click();
  await expect(type).toHaveAttribute("aria-pressed", "true");
  await search.fill("CV");
  await search.fill("HS");
  await expect(page).toHaveURL(/type=submersible-well-pump.*q=HS|q=HS.*type=submersible-well-pump/);
  await expect(page.getByTestId("catalog-result-count")).toContainText("1");
  await expect(page.getByRole("status")).toContainText("1");
});

test("duplicate or invalid Brand queries reset to all without losing valid Type and Purpose", async ({ page }) => {
  await page.goto(`${base}/products?brand=grundfos&brand=grundfos&brand=invalid&type=horizontal-pump&purpose=一般工業用水`);
  await expect.poll(() => new URL(page.url()).searchParams.getAll("brand")).toEqual([]);
  await expect(page).toHaveURL(/\/zh-tw\/products\?type=horizontal-pump&purpose=/);
  await expect(page.getByRole("button", { name: "全部", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("group", { name: "泵浦類型" }).getByRole("button", { name: "臥式泵" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("group", { name: "用途" }).getByRole("button", { name: "一般工業用水" })).toHaveAttribute("aria-pressed", "true");
});

test("keyboard search and rapid Type/Purpose changes preserve focus and every selected condition", async ({ page }) => {
  await page.goto(`${base}/products`);
  const search = page.getByRole("textbox", { name: "搜尋" });
  await search.focus();
  await search.pressSequentially("HS", { delay: 80 });
  await expect(search).toHaveValue("HS");
  await expect(page).toHaveURL(/q=HS/);
  await expect(search).toBeFocused();
  const type = page.getByRole("group", { name: "泵浦類型" }).getByRole("button", { name: "沉水式揚水泵" });
  const purpose = page.getByRole("group", { name: "用途" }).getByRole("button", { name: "大樓揚水" });
  await type.click();
  await purpose.click();
  await expect(page).toHaveURL(/q=HS.*type=submersible-well-pump.*purpose=|type=submersible-well-pump.*purpose=.*q=HS/, { timeout: 10_000 });
  await expect(type).toHaveAttribute("aria-pressed", "true");
  await expect(purpose).toHaveAttribute("aria-pressed", "true");
});

test("catalog search input has a 44 by 44 CSS px touch target", async ({ page }) => {
  await page.goto(`${base}/products`);
  const search = page.getByRole("textbox", { name: "搜尋" });
  const box = await search.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
});

test("empty results preserve conditions and provide recovery actions", async ({ page }) => {
  await page.goto(`${base}/products?brand=grundfos&type=submersible-well-pump&q=definitely-no-match`);
  const empty = page.getByTestId("catalog-empty-state");
  await expect(empty).toBeVisible();
  await expect(page.getByRole("button", { name: "移除品牌條件" })).toBeVisible();
  await expect(empty.getByRole("button", { name: "重設全部條件" })).toBeVisible();
  await expect(empty.getByRole("link", { name: /聯絡/ })).toHaveAttribute("href", "/zh-tw/contact");
});

test("dialog failure is labelled and focus returns to the exact trigger", async ({ page }) => {
  await page.goto(`${base}/series/2vbsg`);
  await page.waitForLoadState("networkidle");
  const trigger = page.getByRole("button", { name: /放大檢視 2VBSG/ }).first();
  await trigger.focus();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "圖片放大檢視" });
  await dialog.locator("img").evaluate((image) => image.dispatchEvent(new Event("error")));
  await expect(dialog.getByRole("status")).toContainText("圖片無法載入");
  const close = dialog.getByRole("button", { name: "關閉" });
  expect((await close.boundingBox())?.width).toBeGreaterThanOrEqual(44);
  await close.click();
  await expect(trigger).toBeFocused();
});

test("a failed gallery image does not prevent a later approved image from opening", async ({ page }) => {
  await page.goto(`${base}/series/2vbsg`);
  await page.waitForLoadState("networkidle");
  const firstTrigger = page.getByRole("button", { name: /放大檢視 2VBSG 圖片 1/ });
  await firstTrigger.click();
  const dialog = page.getByRole("dialog", { name: "圖片放大檢視" });
  await dialog.locator("img").evaluate((image) => image.dispatchEvent(new Event("error")));
  await expect(dialog.getByRole("status")).toBeVisible();
  await dialog.getByRole("button", { name: "關閉" }).click();
  await page.getByRole("button", { name: "下一張圖片" }).click();
  const secondTrigger = page.getByRole("button", { name: /放大檢視 2VBSG 圖片 2/ });
  await secondTrigger.click();
  await expect(dialog.getByRole("status")).toHaveCount(0);
  await expect(dialog.locator("img")).toBeVisible();
});

test("model table is labelled, contained at 320px, and preserves 491 semantic rows", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(`${base}/series/sb-sbi-sbn`);
  const region = page.getByRole("region", { name: /型號規格表/ });
  await expect(region.getByText(/左右滑動/)).toBeVisible();
  await expect(region.locator("tbody tr")).toHaveCount(491);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  expect(await region.evaluate((node) => node.scrollWidth > node.clientWidth)).toBeTruthy();
});
