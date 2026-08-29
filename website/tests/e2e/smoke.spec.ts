import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000/zh-tw";

test.describe("Public smoke tests", () => {
  test("Home page loads with correct title", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("h1")).toContainText("以扎實經驗，守護每一套泵浦系統");
  });

  test("Header navigation shows all items", async ({ page }) => {
    await page.goto(BASE);
    const nav = page.getByRole("navigation", { name: "主導覽" });
    await expect(nav).toBeVisible();
    await expect(nav.getByText("產品總覽")).toBeVisible();
    await expect(nav.getByText("服務與實績")).toBeVisible();
    await expect(nav.getByText("關於傑平")).toBeVisible();
    await expect(nav.getByText("聯絡我們")).toBeVisible();
  });

  test("Product overview page loads", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await expect(page.locator("h1")).toContainText("產品總覽");
  });

  test("產品篩選只公開四大泵浦類型與代表系列", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    const typeGroup = page.getByRole("group", { name: "泵浦類型" });
    const typeButtons = typeGroup.getByRole("button");

    await expect(typeButtons).toHaveCount(4);
    await expect(typeButtons).toHaveText(["臥式泵", "沉水式揚水泵", "沉水式污水泵", "立式楊水泵"]);

    const representativeSeries = [
      ["horizontal-pump", "2vbsg"],
      ["submersible-well-pump", "hs"],
      ["sewage-pump", "cv"],
      ["vertical-multistage-pump", "sb-sbi-sbn"],
    ];
    for (const [typeId, seriesSlug] of representativeSeries) {
      await page.goto(`${BASE}/products?type=${typeId}`);
      await expect(page.locator(`a[href="/zh-tw/series/${seriesSlug}"]`)).toBeVisible();
    }
  });

  test("產品首頁只顯示四大泵浦類型", async ({ page }) => {
    await page.goto(BASE);
    const typeSection = page.locator("section").filter({
      has: page.getByRole("heading", { name: "依產品用途找到合適系列" }),
    });
    await expect(typeSection.locator("a.purpose-card")).toHaveCount(4);
    for (const name of ["臥式泵", "沉水式揚水泵", "沉水式污水泵", "立式楊水泵"]) {
      await expect(typeSection.getByText(name, { exact: true })).toBeVisible();
    }
  });

  test("產品初始靜態 HTML 保留所有系列連結", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${BASE}/products`);
    await expect(page.locator('a[href^="/zh-tw/series/"]')).toHaveCount(22);
    await expect(page.locator('a[href="/zh-tw/series/vbsg"]')).toBeAttached();
    await expect(page.locator('a[href="/zh-tw/series/grundfos-nb-nbg-nk-nkg-nbe-nbge-nke-nkge"]')).toBeAttached();
    await context.close();
  });

  test("產品查詢會移除舊值、未知值、空值與重複值", async ({ page }) => {
    await page.goto(`${BASE}/products?brand=unknown&type=self-priming-pump&type=&type=sewage-pump&type=sewage-pump&purpose=unknown`);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(`${BASE}/products?type=sewage-pump`);
    await expect(page.getByRole("button", { name: "移除泵浦類型條件" }).locator(".."))
      .toContainText("沉水式污水泵");
    await expect(page.getByText("self-priming-pump", { exact: true })).toHaveCount(0);
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/vbsg"]')).toBeHidden();

    await page.goto(`${BASE}/products?brand=jp-pump&brand=grundfos&type=horizontal-pump`);
    await expect(page).toHaveURL(`${BASE}/products?type=horizontal-pump`);
    await expect(page.getByRole("button", { name: "移除品牌條件" })).toHaveCount(0);
    await expect(page.locator('a[href="/zh-tw/series/vbsg"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/grundfos-cm-cme"]')).toBeVisible();
  });

  test("產品搜尋輸入會隨上一頁與下一頁同步", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await page.waitForLoadState("networkidle");
    const search = page.getByRole("textbox", { name: "搜尋" });
    await search.fill("HS");
    await search.press("Enter");
    await expect(page).toHaveURL(`${BASE}/products?q=HS`);
    await expect(search).toHaveValue("HS");
    await expect(page.locator('a[href="/zh-tw/series/hs"]')).toBeVisible();

    await search.fill("CV");
    await search.press("Enter");
    await expect(page).toHaveURL(`${BASE}/products?q=CV`);
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL(`${BASE}/products?q=HS`);
    await expect(search).toHaveValue("HS");
    await expect(page.locator('a[href="/zh-tw/series/hs"]')).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(`${BASE}/products?q=CV`);
    await expect(search).toHaveValue("CV");
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();
  });

  test("產品類型使用 OR，品牌與類型使用 AND", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    await page.waitForLoadState("networkidle");
    const typeGroup = page.getByRole("group", { name: "泵浦類型" });
    await typeGroup.getByRole("button", { name: "臥式泵" }).click();
    await expect(page).toHaveURL(`${BASE}/products?type=horizontal-pump`);
    await typeGroup.getByRole("button", { name: "沉水式污水泵" }).click();
    await expect(page).toHaveURL(`${BASE}/products?type=horizontal-pump&type=sewage-pump`);
    await expect(page.locator('a[href="/zh-tw/series/2vbsg"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/hs"]')).toBeHidden();

    await page.getByRole("button", { name: "移除泵浦類型條件" }).first().click();
    await expect(page).toHaveURL(`${BASE}/products?type=sewage-pump`);
    await expect(page.locator('a[href="/zh-tw/series/2vbsg"]')).toBeHidden();
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();

    await page.getByRole("group", { name: "品牌" }).getByRole("button", { name: "Grundfos 葛蘭富" }).click();
    await expect(page).toHaveURL(`${BASE}/products?brand=grundfos&type=sewage-pump`);
    await expect(page.locator('a[href="/zh-tw/series/grundfos-sc-hc"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeHidden();
    await expect(page.getByRole("button", { name: "移除泵浦類型條件" }).locator(".."))
      .toContainText("沉水式污水泵");
    await page.getByRole("button", { name: "移除品牌條件" }).click();
    await expect(page).toHaveURL(`${BASE}/products?type=sewage-pump`);
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();
  });

  test("Series page renders model table", async ({ page }) => {
    await page.goto(`${BASE}/series/hs`);
    await expect(page.locator("h1")).toContainText("HS");
    const table = page.locator("table");
    await expect(table).toBeVisible();
    const rows = table.locator("tbody tr");
    await expect(rows).toHaveCount(12);
  });

  test("Grundfos 合併系列以子系列規格表呈現", async ({ page }) => {
    await page.goto(`${BASE}/series/grundfos-cm-cme`);
    await expect(page.getByRole("heading", { name: "CM 規格表" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "CME 規格表" })).toBeVisible();
    await expect(page.getByText("規格資料未提供", { exact: true })).toBeVisible();

    await page.goto(`${BASE}/series/grundfos-sc-hc`);
    for (const name of ["SC 規格表", "HC 規格表", "HS／SS 規格表"]) {
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
  });

  test("Series page presents the shared hero, introduction, and specifications in order", async ({ page }) => {
    await page.goto(`${BASE}/series/hs`);

    const heroTitle = page.getByRole("heading", { level: 1, name: "HS" });
    const introductionTitle = page.getByRole("heading", { level: 2, name: "產品介紹" });
    const specificationsTitle = page.getByRole("heading", { level: 2, name: "產品規格" });

    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(page.getByText("傑平有限公司 JP PUMP／沉水式揚水泵／HS", { exact: true })).toBeVisible();
    await expect(introductionTitle).toBeVisible();
    await expect(page.getByRole("img", { name: "HS 產品圖" })).toBeVisible();
    await expect(specificationsTitle).toBeVisible();
    await expect(page.getByText("最小揚程", { exact: true })).toBeVisible();

    const readingOrder = await page.locator("h1, h2").evaluateAll((headings) =>
      headings.map((heading) => heading.textContent?.trim()).filter(Boolean),
    );
    expect(readingOrder.indexOf("HS")).toBeLessThan(readingOrder.indexOf("產品介紹"));
    expect(readingOrder.indexOf("產品介紹")).toBeLessThan(readingOrder.indexOf("產品規格"));
  });

  test("SB/SBI/SBN 491-row extreme fixture", async ({ page }) => {
    await page.goto(`${BASE}/series/sb-sbi-sbn`);
    const table = page.locator("table");
    await expect(table).toBeVisible();
    const rows = table.locator("tbody tr");
    await expect(rows).toHaveCount(491);
  });

  test("Contact page is dark-themed", async ({ page }) => {
    await page.goto(`${BASE}/contact`);
    await expect(page.locator("h1")).toContainText("聯絡我們");
  });

  test("Company page loads", async ({ page }) => {
    await page.goto(`${BASE}/company`);
    await expect(page.locator("h1")).toContainText("公司資訊");
    await expect(page.getByText("台北大巨蛋")).toBeVisible();
    await expect(page.getByText("3,000+").first()).toBeVisible();
    await expect(page.getByText("15,000+")).toBeVisible();
    await expect(page.getByText("總經理願景")).toBeVisible();
  });

  test("Partners page shows Grundfos", async ({ page }) => {
    await page.goto(`${BASE}/partners`);
    await expect(page.locator("h1")).toContainText("合作夥伴");
    await expect(page.getByText("Grundfos 葛蘭富")).toBeVisible();
    await expect(page.getByText("台灣葛蘭富公司總監 陳幼翎")).toBeVisible();
  });

  test("Services page loads with capability tags", async ({ page }) => {
    await page.goto(`${BASE}/services`);
    await expect(page.locator("h1")).toContainText("服務與實績");
  });

  test("Pump type filtering via URL works", async ({ page }) => {
    await page.goto(`${BASE}/products?type=submersible-well-pump`);
    await expect(page.locator("h1")).toContainText("產品總覽");
  });

  test("Brand and Purpose remain filters without standalone pages", async ({ page, request }) => {
    await page.goto(`${BASE}/products`);
    await expect(page.getByRole("group", { name: "品牌" })).toBeVisible();
    await expect(page.getByRole("group", { name: "用途" })).toBeVisible();

    const brandPage = await page.goto(`${BASE}/brands/jp-pump`);
    expect(brandPage?.status()).toBe(404);

    const grundfosBrandPage = await page.goto(`${BASE}/brands/grundfos`);
    expect(grundfosBrandPage?.status()).toBe(404);

    const purposePage = await page.goto(`${BASE}/purposes/${encodeURIComponent("大樓揚水")}`);
    expect(purposePage?.status()).toBe(404);

    const sitemap = await request.get("http://localhost:3000/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).not.toContain("/brands/");
    expect(sitemapBody).not.toContain("/purposes/");
    expect(sitemapBody).toContain("/series/");
  });

  test("Not found returns 404 page", async ({ page }) => {
    const resp = await page.goto(`${BASE}/nonexistent-page`);
    expect(resp?.status()).toBe(404);
  });
});
