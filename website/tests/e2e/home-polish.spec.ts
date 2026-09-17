import { expect, test } from "@playwright/test";

test("首頁不顯示情境示意標籤", async ({ page }) => {
  await page.goto("/zh-tw");

  await expect(page.getByText("首頁氣氛／情境示意參考 · 非建案實績或工程成果證據")).toHaveCount(0);
});

test("首頁 Hero 保留精簡搜尋卡片與無障礙主標題", async ({ page }) => {
  await page.goto("/zh-tw");

  await expect(page.getByText("以扎實經驗，守護每一套泵浦系統")).toHaveCount(0);
  await expect(page.getByText("從設備選擇到工程服務，以清楚且可核實的資訊協助客戶找到合適方向。")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "JP PUMP", level: 1 })).toBeAttached();
  await expect(page.getByRole("img", { name: "傑平有限公司", exact: true })).toHaveAttribute(
    "src",
    /company-name-horizontal-spaced-transparent\.png/,
  );
  const heroPanel = page.locator(".home-hero-panel");
  await expect(heroPanel).toHaveCount(1);
  await expect(heroPanel).not.toHaveClass(/md:w-\[32%\]/);
  await expect(heroPanel).toHaveCSS("animation-duration", "4s");
  await expect(heroPanel).toHaveCSS("animation-delay", "0.2s");
  const wordmark = page.locator(".home-hero-wordmark");
  await expect(wordmark).toHaveCount(1);
  await expect(wordmark).toHaveCSS("animation-duration", "4s");
  await expect(wordmark).toHaveCSS("animation-delay", "0.2s");
  expect(await wordmark.evaluate((element) => element.closest(".home-hero-panel"))).toBeNull();
  const heroLink = page.getByRole("link", { name: "認識我們" });
  await expect(heroLink).toHaveCSS("display", "flex");
  const kickerBox = await page.getByText("可靠歷史 · 工程能力 · 快速回應").boundingBox();
  const heroLinkBox = await heroLink.boundingBox();
  expect(heroLinkBox?.y).toBeGreaterThan(kickerBox?.y ?? 0);
});

test("首頁 Hero 卡片在寬窄螢幕均維持可讀寬度", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/zh-tw");
  const wideCard = await page.locator(".home-hero-panel").boundingBox();
  expect(wideCard?.width).toBeGreaterThan(300);
  expect(wideCard?.width).toBeLessThanOrEqual(360);

  await page.setViewportSize({ width: 320, height: 900 });
  await page.reload();
  const narrowCard = await page.locator(".home-hero-panel").boundingBox();
  expect(narrowCard?.width).toBeGreaterThan(250);
  expect(narrowCard?.width).toBeLessThanOrEqual(320);
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
  await expect(banner).toHaveClass(/h-\[320px\]/);
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
