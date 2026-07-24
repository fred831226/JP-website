# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: series-detail.spec.ts >> Story 2.5 — Model specifications table >> Model table exposes reviewed numeric specs (not blanket 未提供)
- Location: tests/e2e/series-detail.spec.ts:66:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('table tbody tr').first().getByText('40')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('table tbody tr').first().getByText('40')

```

```yaml
- banner:
  - link "回首頁":
    - /url: /zh-tw
    - img "JP PUMP"
  - navigation "主導覽":
    - button "產品總覽"
    - link "服務與實績":
      - /url: /zh-tw/services
    - button "關於傑平"
    - link "聯絡我們":
      - /url: /zh-tw/contact
- main:
  - text: 最終選型、採購與適用性請聯絡傑平有限公司確認。 點擊圖片放大檢視
  - button "放大檢視 HS 圖片":
    - img "HS 產品圖"
  - paragraph: 最小揚程
  - paragraph: 40 m
  - paragraph: 最大揚程
  - paragraph: 56 m
  - paragraph: 最小揚水量
  - paragraph: 300 L/min
  - paragraph: 最大揚水量
  - paragraph: 680 L/min
  - heading "HS" [level=1]
  - paragraph: 品牌：傑平有限公司 JP PUMP
  - paragraph: HS 系列全不鏽鋼沉水式揚水泵，專為大樓揚水設計，榮獲多國專利認證。採用活動式推力軸承與多面結合式結構，具備高效能與耐用特性。
  - table:
    - rowgroup:
      - row "型號 揚程 (m) 揚水量 (L/min) 功率 (kW)":
        - columnheader "型號"
        - columnheader "揚程 (m)"
        - columnheader "揚水量 (L/min)"
        - columnheader "功率 (kW)"
    - rowgroup:
      - row "HS-37-80 未提供 未提供 未提供":
        - cell "HS-37-80"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-55-80 未提供 未提供 未提供":
        - cell "HS-55-80"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-75-80 未提供 未提供 未提供":
        - cell "HS-75-80"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-110-80 未提供 未提供 未提供":
        - cell "HS-110-80"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-150-80 未提供 未提供 未提供":
        - cell "HS-150-80"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-187-80 未提供 未提供 未提供":
        - cell "HS-187-80"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-220-100 未提供 未提供 未提供":
        - cell "HS-220-100"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-262-100 未提供 未提供 未提供":
        - cell "HS-262-100"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-37-50 未提供 未提供 未提供":
        - cell "HS-37-50"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-55-50 未提供 未提供 未提供":
        - cell "HS-55-50"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-75-50 未提供 未提供 未提供":
        - cell "HS-75-50"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
      - row "HS-110-50 未提供 未提供 未提供":
        - cell "HS-110-50"
        - cell "未提供"
        - cell "未提供"
        - cell "未提供"
  - text: 沉水式揚水泵 大樓揚水
  - link "前往聯絡頁":
    - /url: /zh-tw/contact
  - link "返回產品總覽":
    - /url: /zh-tw/products
- contentinfo:
  - img "JP PUMP"
  - navigation "頁尾導覽":
    - link "首頁":
      - /url: /zh-tw
    - link "產品總覽":
      - /url: /zh-tw/products
    - link "服務與實績":
      - /url: /zh-tw/services
    - link "公司資訊":
      - /url: /zh-tw/company
    - link "合作夥伴":
      - /url: /zh-tw/partners
    - link "聯絡我們":
      - /url: /zh-tw/contact
  - text: 聯絡資訊
  - link "+886-2-1234-5678":
    - /url: tel:+886-2-1234-5678
  - link "info@jp-pump.com.tw":
    - /url: mailto:info@jp-pump.com.tw
  - text: 台北市中山區...
- alert
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * Stories 2.4 / 2.5 / 2.6 — Series overview, Model table, media, contact actions.
  5   |  */
  6   | const ZH = "/zh-tw";
  7   | 
  8   | test.describe("Story 2.4 — Canonical Series overview", () => {
  9   |   test("Series page shows suitability note and key-data units", async ({ page }) => {
  10  |     await page.goto(`${ZH}/series/hs`);
  11  |     await expect(
  12  |       page.getByText("最終選型、採購與適用性請聯絡傑平有限公司確認。"),
  13  |     ).toBeVisible();
  14  |     await expect(page.getByText("最小揚程")).toBeVisible();
  15  |     await expect(page.getByText("最大揚程")).toBeVisible();
  16  |     await expect(page.getByText("最小揚水量")).toBeVisible();
  17  |     await expect(page.getByText("最大揚水量")).toBeVisible();
  18  |     // Reviewed HS ranges from catalog-overview.json (scoped to key-data tiles)
  19  |     const keyData = page.locator(".keydata-tile");
  20  |     await expect(keyData.filter({ hasText: "最小揚程" })).toContainText("40");
  21  |     await expect(keyData.filter({ hasText: "最大揚程" })).toContainText("56");
  22  |     await expect(keyData.filter({ hasText: "最小揚水量" })).toContainText("300");
  23  |     await expect(keyData.filter({ hasText: "最大揚水量" })).toContainText("680");
  24  |   });
  25  | 
  26  |   test("Missing Series values render 未提供 (Y series via stable id path)", async ({
  27  |     page,
  28  |   }) => {
  29  |     // getSeries() currently resolves by id; /series/y works today.
  30  |     await page.goto(`${ZH}/series/y`);
  31  |     await expect(page.getByText("未提供").first()).toBeVisible();
  32  |   });
  33  | 
  34  |   test("Canonical slug /series/y-series resolves (Story 2.1/2.4)", async ({ page }) => {
  35  |     // Known gap: generateStaticParams emits slug y-series but getSeries() looks up by id.
  36  |     test.fail(true, "Series loader matches id, not locale slug — y-series 404s");
  37  |     const res = await page.goto(`${ZH}/series/y-series`);
  38  |     expect(res?.ok()).toBeTruthy();
  39  |     await expect(page.locator("h1")).toContainText("Y");
  40  |   });
  41  | 
  42  |   test("Purpose tags are non-interactive", async ({ page }) => {
  43  |     await page.goto(`${ZH}/series/hs`);
  44  |     const tag = page.getByText("大樓揚水", { exact: true });
  45  |     await expect(tag).toBeVisible();
  46  |     await expect(tag).not.toHaveAttribute("href", /.*/);
  47  |     await expect(tag.evaluate((el) => el.tagName)).resolves.toMatch(/SPAN|DIV|P/i);
  48  |   });
  49  | 
  50  |   test("V1 Series page has no Model detail route or PDF download", async ({ page }) => {
  51  |     await page.goto(`${ZH}/series/hs`);
  52  |     await expect(page.getByRole("link", { name: /PDF|下載|download/i })).toHaveCount(0);
  53  |     await expect(page.locator('a[href*="/models/"]')).toHaveCount(0);
  54  |   });
  55  | });
  56  | 
  57  | test.describe("Story 2.5 — Model specifications table", () => {
  58  |   test("HS Model table lists all 12 reviewed models", async ({ page }) => {
  59  |     await page.goto(`${ZH}/series/hs`);
  60  |     const table = page.locator("table");
  61  |     await expect(table).toBeVisible();
  62  |     await expect(table.locator("tbody tr")).toHaveCount(12);
  63  |     await expect(table.getByText("HS-37-80")).toBeVisible();
  64  |   });
  65  | 
  66  |   test("Model table exposes reviewed numeric specs (not blanket 未提供)", async ({
  67  |     page,
  68  |   }) => {
  69  |     // Known gap: table reads specs.head/flow/power but generated data has rated_head_m / rated_flow_lmin.
  70  |     test.fail(true, "Model table field mapping does not match generated catalog keys");
  71  |     await page.goto(`${ZH}/series/hs`);
  72  |     const firstRow = page.locator("table tbody tr").first();
  73  |     await expect(firstRow.getByText("HS-37-80")).toBeVisible();
> 74  |     await expect(firstRow.getByText("40")).toBeVisible();
      |                                            ^ Error: expect(locator).toBeVisible() failed
  75  |     await expect(firstRow.getByText("300")).toBeVisible();
  76  |   });
  77  | 
  78  |   test("HS model row currently falls back to 未提供 for unmapped spec keys", async ({
  79  |     page,
  80  |   }) => {
  81  |     await page.goto(`${ZH}/series/hs`);
  82  |     const firstRow = page.locator("table tbody tr").first();
  83  |     await expect(firstRow.getByText("HS-37-80")).toBeVisible();
  84  |     await expect(firstRow.getByText("未提供").first()).toBeVisible();
  85  |   });
  86  | 
  87  |   test("SB/SBI/SBN extreme fixture renders all 491 rows without pagination", async ({
  88  |     page,
  89  |   }) => {
  90  |     test.setTimeout(60_000);
  91  |     await page.goto(`${ZH}/series/sb-sbi-sbn`);
  92  |     const table = page.locator("table");
  93  |     await expect(table).toBeVisible();
  94  |     await expect(table.locator("tbody tr")).toHaveCount(491);
  95  |     await expect(page.getByRole("button", { name: /下一頁|Load more|載入更多/i })).toHaveCount(
  96  |       0,
  97  |     );
  98  |   });
  99  | });
  100 | 
  101 | test.describe("Story 2.6 — Media dialog and Contact continuation", () => {
  102 |   test("Series image opens enlargement dialog and closes with Escape", async ({
  103 |     page,
  104 |   }) => {
  105 |     await page.goto(`${ZH}/series/hs`);
  106 |     await page.getByRole("button", { name: /放大檢視 HS/ }).click();
  107 |     const dialog = page.getByRole("dialog", { name: "圖片放大檢視" });
  108 |     await expect(dialog).toBeVisible();
  109 |     await page.keyboard.press("Escape");
  110 |     await expect(dialog).toHaveCount(0);
  111 |   });
  112 | 
  113 |   test("Series actions navigate to Contact without source attribution", async ({
  114 |     page,
  115 |   }) => {
  116 |     await page.goto(`${ZH}/series/hs`);
  117 |     await page.getByRole("link", { name: "前往聯絡頁" }).click();
  118 |     await expect(page).toHaveURL(/\/zh-tw\/contact\/?$/);
  119 |     await expect(page).not.toHaveURL(/[?&](series|from|src)=/);
  120 |   });
  121 | 
  122 |   test("返回產品總覽 recovers catalog entry", async ({ page }) => {
  123 |     await page.goto(`${ZH}/series/hs`);
  124 |     await page.getByRole("link", { name: "返回產品總覽" }).click();
  125 |     await expect(page).toHaveURL(/\/zh-tw\/products\/?$/);
  126 |   });
  127 | });
  128 | 
```