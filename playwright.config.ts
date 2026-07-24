import { defineConfig } from "@playwright/test";

const PORT = 3010;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    headless: true,
  },
  webServer: {
    // Prefer production server so tests don't bind a stale `next dev` on :3000.
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
