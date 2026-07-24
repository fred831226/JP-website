# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: series-detail.spec.ts >> Story 2.6 — Media dialog and Contact continuation >> Series actions navigate to Contact without source attribution
- Location: tests/e2e/series-detail.spec.ts:113:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: '前往聯絡頁' })

```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
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
  74  |     await expect(firstRow.getByText("40")).toBeVisible();
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
> 117 |     await page.getByRole("link", { name: "前往聯絡頁" }).click();
      |                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
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