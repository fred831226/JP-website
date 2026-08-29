import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const notFoundRoutes = JSON.parse(
  readFileSync(new URL("../../data/not-found-routes.json", import.meta.url), "utf8"),
) as string[];

test("non-Production environment is visibly marked and non-indexable", async ({ page, request }) => {
  const response = await page.goto("/zh-tw/");

  await expect(page.getByRole("region", { name: "非正式環境" })).toContainText(/預覽環境|開發環境/);
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");

  const robots = await request.get("/robots.txt");
  const robotsText = await robots.text();
  expect(robotsText).toContain("Disallow: /");
  expect(robotsText).not.toContain("Sitemap:");
});

for (const route of notFoundRoutes as string[]) {
  test(`reviewed removal returns not found: ${route}`, async ({ request }) => {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  });
}
