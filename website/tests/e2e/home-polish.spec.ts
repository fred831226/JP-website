import { expect, test } from "@playwright/test";

test("首頁不顯示情境示意標籤", async ({ page }) => {
  await page.goto("/zh-tw");

  await expect(page.getByText("首頁氣氛／情境示意參考 · 非建案實績或工程成果證據")).toHaveCount(0);
});

test("頁尾使用更新後的 JP PUMP Logo", async ({ page }) => {
  await page.goto("/zh-tw");

  await expect(page.locator("footer img[alt='JP PUMP']")).toHaveAttribute(
    "src",
    /jp-pump-logo-edited\.png/,
  );
});

test("頁尾只提供品牌、導覽與已核准聯絡資訊", async ({ page }) => {
  await page.goto("/zh-tw/services");

  const footer = page.locator("footer");
  await expect(footer.getByText("傑平泵浦有限公司")).toBeVisible();
  await expect(footer.getByText("JP Pump Solution")).toBeVisible();
  await expect(footer.getByRole("navigation", { name: "頁尾導覽" }).getByRole("link")).toHaveCount(6);
  await expect(footer.getByText("公司聯絡資訊")).toBeVisible();
  await expect(footer.getByText("工廠聯絡資訊")).toHaveCount(0);
  await expect(footer.getByText("CERTIFICATES")).toHaveCount(0);
});

test("頁尾導覽與品牌標誌在同一列", async ({ page }) => {
  await page.goto("/zh-tw/services");

  const footer = page.locator("footer");
  const logoBox = await footer.locator("img[alt='JP PUMP']").boundingBox();
  const navBox = await footer.getByRole("navigation", { name: "頁尾導覽" }).boundingBox();

  expect(logoBox).not.toBeNull();
  expect(navBox).not.toBeNull();
  expect(Math.abs((logoBox?.y ?? 0) - (navBox?.y ?? 0))).toBeLessThan(24);
});

test("服務頁使用首頁 Hero 圖作為橫幅背景", async ({ page }) => {
  await page.goto("/zh-tw/services");

  const banner = page.locator("main > section").first();
  await expect(banner.locator("img").first()).toHaveAttribute("src", /homepage-hero-taiwan-riverside\.webp/);
  await expect(banner).toHaveClass(/min-h-\[280px\]/);
});

test("主要內頁共用首頁 Hero 圖橫幅", async ({ page }) => {
  for (const path of ["/zh-tw/company", "/zh-tw/products", "/zh-tw/partners", "/zh-tw/contact", "/zh-tw/types/horizontal-pump", "/zh-tw/series/vbsg"]) {
    await page.goto(path);
    await expect(page.locator("main > :first-child img").first()).toHaveAttribute("src", /homepage-hero-taiwan-riverside\.webp/);
  }
});

test("公司頁以品牌招牌搭配工程資訊區塊，且不顯示願景", async ({ page }) => {
  await page.goto("/zh-tw/company");

  await expect(page.getByRole("img", { name: "傑平有限公司 JP PUMP 招牌" }).first()).toHaveAttribute("src", /company-brand-sign\.png/);
  await expect(page.getByText("總經理願景")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "里程碑建案" })).toBeVisible();
});

test("公司聯絡區呈現公司識別", async ({ page }) => {
  await page.goto("/zh-tw/company");

  const contact = page.locator("[data-company-section='contact']");
  await expect(contact.getByText("傑平泵浦有限公司")).toBeVisible();
  await expect(contact.getByText("JP Pump Solution")).toBeVisible();
});
