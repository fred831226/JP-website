import { defineConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const port = Number(process.env.PLAYWRIGHT_PORT ?? "3000");
const reuseExistingServer = !isCI || process.env.PLAYWRIGHT_REUSE_SERVER === "true";
const externalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === "true";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: `http://localhost:${port}`,
    headless: true,
  },
  webServer: externalServer ? undefined : {
    command: isCI
      ? `node node_modules/next/dist/bin/next start -p ${port}`
      : `node node_modules/next/dist/bin/next dev -p ${port}`,
    port,
    reuseExistingServer,
  },
});
