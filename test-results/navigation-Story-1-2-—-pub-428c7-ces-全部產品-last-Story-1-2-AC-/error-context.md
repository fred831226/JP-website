# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Story 1.2 — public navigation >> Product menu places 全部產品 last (Story 1.2 AC)
- Location: tests/e2e/navigation.spec.ts:62:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('navigation', { name: '主導覽' }).getByRole('button', { name: /產品總覽/ })

```

# Page snapshot

```yaml
- generic [ref=e2]: Internal Server Error
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | /**
  4   |  * Story 1.2 — Navigate Public Trust Surfaces
  5   |  * AC: header order, About/Product menus, mobile menu, footer structure, no News.
  6   |  */
  7   | const ZH = "/zh-tw";
  8   | 
  9   | test.describe("Story 1.2 — public navigation", () => {
  10  |   test("Header exposes primary items in approved order", async ({ page }) => {
  11  |     await page.goto(ZH);
  12  |     const nav = page.getByRole("navigation", { name: "主導覽" });
  13  |     await expect(nav).toBeVisible();
  14  | 
  15  |     const labels = await nav.locator("a, button").evaluateAll((els) =>
  16  |       els.map((el) => el.textContent?.replace(/\s+/g, " ").trim() ?? "").filter(Boolean),
  17  |     );
  18  | 
  19  |     const primary = ["產品總覽", "服務與實績", "關於傑平", "聯絡我們"];
  20  |     const found = primary.map((label) => labels.findIndex((t) => t.startsWith(label)));
  21  |     expect(found.every((i) => i >= 0)).toBeTruthy();
  22  |     expect(found[0]).toBeLessThan(found[1]!);
  23  |     expect(found[1]).toBeLessThan(found[2]!);
  24  |     expect(found[2]).toBeLessThan(found[3]!);
  25  |   });
  26  | 
  27  |   test("Logo returns Home", async ({ page }) => {
  28  |     await page.goto(`${ZH}/products`);
  29  |     await page.getByRole("link", { name: "回首頁" }).click();
  30  |     await expect(page).toHaveURL(/\/zh-tw\/?$/);
  31  |   });
  32  | 
  33  |   test("About menu opens with Company and Partners only", async ({ page }) => {
  34  |     await page.goto(ZH);
  35  |     const about = page.getByRole("navigation", { name: "主導覽" }).getByRole("button", {
  36  |       name: /關於傑平/,
  37  |     });
  38  |     await about.click();
  39  |     await expect(about).toHaveAttribute("aria-expanded", "true");
  40  | 
  41  |     const menu = page.getByRole("menu");
  42  |     await expect(menu.getByRole("menuitem", { name: "公司資訊" })).toBeVisible();
  43  |     await expect(menu.getByRole("menuitem", { name: "合作夥伴" })).toBeVisible();
  44  |     await expect(menu.getByRole("menuitem", { name: /新聞|News/i })).toHaveCount(0);
  45  | 
  46  |     await page.keyboard.press("Escape");
  47  |     await expect(about).toHaveAttribute("aria-expanded", "false");
  48  |   });
  49  | 
  50  |   test("Product menu lists items and includes 全部產品", async ({ page }) => {
  51  |     await page.goto(ZH);
  52  |     const products = page.getByRole("navigation", { name: "主導覽" }).getByRole("button", {
  53  |       name: /產品總覽/,
  54  |     });
  55  |     await products.click();
  56  | 
  57  |     const menu = page.getByRole("menu");
  58  |     await expect(menu.getByRole("menuitem", { name: "全部產品" })).toBeVisible();
  59  |     await expect(menu.getByRole("menuitem", { name: "沉水式揚水泵" })).toBeVisible();
  60  |   });
  61  | 
  62  |   test("Product menu places 全部產品 last (Story 1.2 AC)", async ({ page }) => {
  63  |     // Known gap: Header currently prepends 全部產品 before pump-type links.
  64  |     test.fail(true, "Product menu order does not yet match Story 1.2 AC (全部產品 last)");
  65  |     await page.goto(ZH);
  66  |     await page
  67  |       .getByRole("navigation", { name: "主導覽" })
  68  |       .getByRole("button", { name: /產品總覽/ })
> 69  |       .click();
      |        ^ Error: locator.click: Test timeout of 30000ms exceeded.
  70  |     const itemLabels = await page.getByRole("menu").getByRole("menuitem").allTextContents();
  71  |     expect(itemLabels.at(-1)?.trim()).toBe("全部產品");
  72  |   });
  73  | 
  74  |   test("Services remains a direct top-level link", async ({ page }) => {
  75  |     await page.goto(ZH);
  76  |     const nav = page.getByRole("navigation", { name: "主導覽" });
  77  |     await nav.getByRole("link", { name: "服務與實績" }).click();
  78  |     await expect(page).toHaveURL(/\/zh-tw\/services/);
  79  |     await expect(page.locator("h1")).toContainText("服務與實績");
  80  |   });
  81  | 
  82  |   test("Mobile menu exposes same destinations", async ({ page }) => {
  83  |     await page.setViewportSize({ width: 375, height: 812 });
  84  |     await page.goto(ZH);
  85  | 
  86  |     await expect(page.getByRole("navigation", { name: "主導覽" })).toBeHidden();
  87  |     const trigger = page.getByRole("button", { name: "選單" });
  88  |     await expect(trigger).toBeVisible();
  89  |     await trigger.click();
  90  | 
  91  |     const mobile = page.getByRole("navigation", { name: "行動選單" });
  92  |     await expect(mobile).toBeVisible();
  93  |     await expect(mobile.getByText("產品總覽")).toBeVisible();
  94  |     await expect(mobile.getByText("服務與實績")).toBeVisible();
  95  |     await expect(mobile.getByText("關於傑平")).toBeVisible();
  96  |     await expect(mobile.getByRole("link", { name: "聯絡我們" })).toBeVisible();
  97  |   });
  98  | 
  99  |   test("Footer includes identity, nav, and contact", async ({ page }) => {
  100 |     await page.goto(ZH);
  101 |     const footer = page.getByRole("contentinfo");
  102 |     await expect(footer.getByAltText("JP PUMP")).toBeVisible();
  103 |     await expect(footer.getByRole("navigation", { name: "頁尾導覽" })).toBeVisible();
  104 |     await expect(footer.getByText("聯絡資訊")).toBeVisible();
  105 |   });
  106 | });
  107 | 
```