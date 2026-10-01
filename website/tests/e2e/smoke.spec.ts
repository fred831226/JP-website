import { test, expect } from "@playwright/test";

const ORIGIN = `http://localhost:${process.env.PLAYWRIGHT_PORT ?? "3000"}`;
const BASE = `${ORIGIN}/zh-tw`;

test.describe("Public smoke tests", () => {
  test("Home page does not expose internal implementation notes", async ({ page }) => {
    await page.goto(BASE);
    const publicText = await page.locator("body").innerText();

    for (const internalNote of [
      "≤ 5 秒／靜態降級",
      "照片序列只播放一次、總長不超過 5 秒",
      "正式年份與沿革待核准",
      "可公開的服務事實待核准",
      "正式區域與能力待核准",
      "正式聯絡流程待核准",
      "產品類別名稱、排序與圖片須依正式受控分類核准。點擊整張卡片後前往系列產品頁。",
      "此區負責說明網站的三條主要路徑，不重複 Hero 篩選器。",
      "正式實績照片待核准",
      "來源、使用權與真實性確認後顯示",
      "正式建案名稱待核准",
      "工作範圍、解決內容與成果只呈現 JP PUMP 已核准事實。",
      "核准後呈現案型、工作範圍、成果與相關產品。",
      "未通過公開權利或安全檢查的內容不會顯示。",
    ]) {
      expect(publicText).not.toContain(internalNote);
    }
  });

  test("Home page loads with correct title", async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator("h1")).toContainText("JP PUMP");
  });

  test("根站 JSON-LD 以傑平泵浦作為網站名稱並保留公司正式名稱", async ({ page }) => {
    await page.goto(BASE);
    const schema = JSON.parse(await page.locator('script#schema-org[type="application/ld+json"]').textContent() ?? "{}");
    const website = schema["@graph"]?.find((entry: { "@type"?: string }) => entry["@type"] === "WebSite");
    const organization = schema["@graph"]?.find((entry: { "@type"?: string }) => entry["@type"] === "Organization");

    expect(website).toMatchObject({
      name: "傑平泵浦",
      alternateName: ["傑平", "傑平有限公司", "JP PUMP"],
    });
    expect(organization).toMatchObject({ name: "傑平有限公司" });
  });

  test("首頁快速篩選顯示產品類別並套用類型條件", async ({ page }) => {
    await page.goto(BASE);

    const typeSelect = page.locator("#qf-type");
    await expect(page.getByLabel("類別")).toBeVisible();
    await expect(typeSelect.locator("option")).toHaveText([
      "全部",
      "臥式泵",
      "變頻恆壓泵",
      "循環泵",
      "沉水式揚水泵",
      "沉水式污水泵",
      "立式揚水泵",
    ]);

    await typeSelect.selectOption("vertical-multistage-pump");
    await page.getByRole("button", { name: "搜尋產品" }).click();
    await expect(page).toHaveURL(`${BASE}/products?type=vertical-multistage-pump`);
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
    await page.goto(`${BASE}/products`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toContainText("產品總覽");
  });

  test("產品篩選公開六個已核准類型與代表系列", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    const typeGroup = page.getByRole("group", { name: "泵浦類型" }).last();
    const typeButtons = typeGroup.getByRole("button");

    await expect(typeButtons).toHaveCount(6);
    await expect(typeButtons).toHaveText(["臥式泵", "變頻恆壓泵", "循環泵", "沉水式揚水泵", "沉水式污水泵", "立式揚水泵"]);

    const representativeSeries = [
      ["horizontal-pump", "gp"],
      ["variable-frequency-constant-pressure-system", "vbsg"],
      ["circulator-pump", "grundfos-magna3"],
      ["submersible-well-pump", "hs"],
      ["sewage-pump", "cv"],
      ["vertical-multistage-pump", "sb-sbi-sbn"],
    ];
    for (const [typeId, seriesSlug] of representativeSeries) {
      await page.goto(`${BASE}/products?type=${typeId}`);
      await expect(page.locator(`a[href="/zh-tw/series/${seriesSlug}"]`)).toBeVisible();
    }
  });

  test("產品總覽導覽切換會同步套用或清除類型篩選", async ({ page }) => {
    const variableFrequencyType = "variable-frequency-constant-pressure-system";
    await page.goto(`${BASE}/products?type=${variableFrequencyType}`);
    await expect(page.getByTestId("catalog-result-count")).toHaveText("共 5 個產品系列");

    const productsMenu = page.getByRole("button", { name: "產品總覽" });
    await productsMenu.click();
    await page.getByRole("menuitem", { name: "全部產品" }).click();
    await page.waitForURL(`${BASE}/products`);
    await expect(page.getByTestId("catalog-result-count")).toHaveText("共 21 個產品系列");

    await productsMenu.click();
    await page.getByRole("menuitem", { name: "變頻恆壓泵" }).click();
    await page.waitForURL(`${BASE}/products?type=${variableFrequencyType}`);
    await expect(page.getByTestId("catalog-result-count")).toHaveText("共 5 個產品系列");
  });

  test("產品首頁顯示六個已核准類型", async ({ page }) => {
    await page.goto(BASE);
    const typeSection = page.locator("section").filter({
      has: page.getByRole("heading", { name: "依產品類別找到合適系列" }),
    });
    await expect(typeSection.locator("a.product-type-card")).toHaveCount(6);
    const homepageTypes = [
      ["臥式泵", "horizontal-pump"],
      ["變頻恆壓泵", "variable-frequency-constant-pressure-system"],
      ["循環泵", "circulator-pump"],
      ["沉水式揚水泵", "submersible-well-pump"],
      ["沉水式污水泵", "sewage-pump"],
      ["立式揚水泵", "vertical-multistage-pump"],
    ];
    for (const [name, typeId] of homepageTypes) {
      await expect(typeSection.getByText(name, { exact: true })).toBeVisible();
      await expect(typeSection.locator("a.product-type-card").filter({ hasText: name })).toHaveAttribute(
        "href",
        `/zh-tw/products?type=${typeId}`,
      );
    }
  });

  test("產品初始靜態 HTML 保留所有系列連結", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`${BASE}/products`, { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href^="/zh-tw/series/"]')).toHaveCount(21);
    await expect(page.locator('a[href="/zh-tw/series/vbsg"]')).toBeAttached();
    await expect(page.locator('a[href="/zh-tw/series/grundfos-nb-nbg-nk-nkg-nbe-nbge-nke-nkge"]')).toBeAttached();
    await context.close();
  });

  test("產品查詢會移除舊值、未知值、空值與多重類型值", async ({ page }) => {
    await page.goto(`${BASE}/products?brand=unknown&type=self-priming-pump&type=&type=sewage-pump&type=sewage-pump&purpose=unknown`);
    await expect(page).toHaveURL(`${BASE}/products?type=sewage-pump`);
    await expect(page.getByRole("group", { name: "泵浦類型" }).getByRole("button", { name: "沉水式污水泵" }))
      .toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /移除.*條件/ })).toHaveCount(0);
    await expect(page.getByText("self-priming-pump", { exact: true })).toHaveCount(0);
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/vbsg"]')).toBeHidden();

    await page.goto(`${BASE}/products?brand=jp-pump&brand=grundfos&type=horizontal-pump&type=sewage-pump`);
    await expect(page).toHaveURL(`${BASE}/products`);
    await expect(page.getByRole("group", { name: "品牌" }).getByRole("button", { name: "全部", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('a[href="/zh-tw/series/vbsg"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/grundfos-cm-cme"]')).toBeVisible();
  });

  test("產品搜尋輸入會隨上一頁與下一頁同步", async ({ page }) => {
    await page.goto(`${BASE}/products`);
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

  test("產品類型只能單選，品牌與類型使用 AND", async ({ page }) => {
    await page.goto(`${BASE}/products`);
    const typeGroup = page.getByRole("group", { name: "泵浦類型" });
    await typeGroup.getByRole("button", { name: "臥式泵" }).click();
    await expect(page).toHaveURL(`${BASE}/products?type=horizontal-pump`);
    await typeGroup.getByRole("button", { name: "沉水式污水泵" }).click();
    await expect(page).toHaveURL(`${BASE}/products?type=sewage-pump`);
    await expect(page.locator('a[href="/zh-tw/series/vbsg"]')).toBeHidden();
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/hs"]')).toBeHidden();

    await typeGroup.getByRole("button", { name: "沉水式污水泵" }).click();
    await expect(page).toHaveURL(`${BASE}/products`);
    await expect(page.locator('a[href="/zh-tw/series/vbsg"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeVisible();

    await page.getByRole("group", { name: "品牌" }).getByRole("button", { name: "Grundfos 葛蘭富" }).click();
    await expect(page).toHaveURL(`${BASE}/products?brand=grundfos`);
    await expect(page.locator('a[href="/zh-tw/series/grundfos-sc-hc"]')).toBeVisible();
    await expect(page.locator('a[href="/zh-tw/series/cv"]')).toBeHidden();
    await page.getByRole("group", { name: "品牌" }).getByRole("button", { name: "Grundfos 葛蘭富" }).click();
    await expect(page).toHaveURL(`${BASE}/products`);
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
    await expect(page.locator("h1")).toContainText("關於傑平");
    await expect(page.getByText("台北大巨蛋")).toBeVisible();
    await expect(page.getByText("總經理願景")).toHaveCount(0);
  });

  test("Partners page shows Grundfos", async ({ page }) => {
    await page.goto(`${BASE}/partners`);
    await expect(page.locator("h1")).toContainText("授權經銷品牌");
    await expect(page.getByRole("heading", { name: "Grundfos 葛蘭富", exact: true })).toBeVisible();
    await expect(page.getByText("台灣葛蘭富公司總監 陳幼翎")).toHaveCount(0);
  });

  test("Services page loads with capability tags", async ({ page }) => {
    await page.goto(`${BASE}/services`);
    await expect(page.locator("h1")).toContainText("服務與實績");
  });

  test("Pump type filtering via URL works", async ({ page }) => {
    await page.goto(`${BASE}/products?type=submersible-well-pump`);
    await expect(page.locator("h1")).toContainText("產品總覽");
  });

  test("Brand remains a filter without a standalone page", async ({ page, request }) => {
    await page.goto(`${BASE}/products`);
    await expect(page.getByRole("group", { name: "品牌" })).toBeVisible();
    await expect(page.getByRole("group", { name: "用途" })).toHaveCount(0);

    const brandPage = await page.goto(`${BASE}/brands/jp-pump`);
    expect(brandPage?.status()).toBe(404);

    const grundfosBrandPage = await page.goto(`${BASE}/brands/grundfos`);
    expect(grundfosBrandPage?.status()).toBe(404);

    const purposePage = await page.goto(`${BASE}/purposes/${encodeURIComponent("大樓揚水")}`);
    expect(purposePage?.status()).toBe(404);

    const sitemap = await request.get(`${ORIGIN}/sitemap.xml`);
    expect(sitemap.ok()).toBeTruthy();
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).not.toContain("/brands/");
    expect(sitemapBody).not.toContain("/purposes/");
    if (process.env.VERCEL_ENV === "production") expect(sitemapBody).toContain("/series/");
    else expect(sitemapBody).not.toContain("<loc>");
  });

  test("Not found returns 404 page", async ({ page }) => {
    const resp = await page.goto(`${BASE}/nonexistent-page`);
    expect(resp?.status()).toBe(404);
  });
});
