import { expect, test } from "@playwright/test";

test("首頁圖片持續緩慢放大，每十秒切換一張", async ({ page }) => {
  await page.goto("/zh-tw");

  const slides = page.locator("[data-carousel-slide]");
  await expect(slides.first()).toHaveAttribute("data-active", "true");
  await expect(page.locator('[data-zoom="true"]')).toHaveCount(1);
  await expect(page.locator('[data-zoom="true"]')).toHaveCSS("animation-name", "home-hero-zoom");
  await expect(page.locator('[data-zoom="true"]')).toHaveCSS("animation-duration", "10s");
  await expect(page.locator('[data-zoom="true"]')).toHaveCSS("transition-duration", "1s");
  await expect(slides.nth(1)).toHaveAttribute("data-active", "true", { timeout: 12000 });
  await page.getByRole("button", { name: "上一張 Hero 圖片" }).click();
  await expect(slides.first()).toHaveAttribute("data-active", "true");
});

test("減少動態效果時直接顯示靜態最終畫面", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/zh-tw");

  const slides = page.locator("[data-carousel-slide]");
  await expect(slides.last()).toHaveAttribute("data-active", "true");
  await expect(page.locator('[data-zoom="true"]')).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Hero 圖片/ })).toBeHidden();
  await expect(page.getByRole("link", { name: "認識我們" })).toBeVisible();
});
