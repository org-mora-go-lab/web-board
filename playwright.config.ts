import { defineConfig, devices } from "@playwright/test";

import { APP_PORT, BASE_URL, E2E_DATABASE_PATH, MOCK_OAUTH_PORT, MOCK_OAUTH_URL } from "./tests/__constant__";
import { mockOAuthEnv } from "./tests/__mock__";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "line",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node tests/__mock__/oauth-server.mjs",
      url: `${MOCK_OAUTH_URL}/health`,
      env: { MOCK_OAUTH_PORT: String(MOCK_OAUTH_PORT) },
      reuseExistingServer: !process.env.CI,
    },
    {
      // Separate port, build dir and database so the suite never touches `npm run dev` state.
      command: `node -e "require('fs').rmSync('${E2E_DATABASE_PATH}',{force:true})" && npx next dev --port ${APP_PORT}`,
      url: BASE_URL,
      env: { DATABASE_PATH: E2E_DATABASE_PATH, NEXT_DIST_DIR: ".next-e2e", ...mockOAuthEnv() },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
