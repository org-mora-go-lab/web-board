import { defineConfig, devices } from "@playwright/test";

import {
  APP_PORT,
  BASE_URL,
  E2E_DATABASE_PATH,
  LIBSQL_MOCK_AUTH_TOKEN,
  LIBSQL_MOCK_DATABASE_PATH,
  LIBSQL_MOCK_PORT,
  LIBSQL_MOCK_URL,
  MOCK_APP_BASE_URL,
  MOCK_OAUTH_PORT,
  MOCK_OAUTH_URL,
  REMOTE_APP_BASE_URL,
  REMOTE_APP_PORT,
} from "./tests/__constant__";
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
      env: {
        VERCEL: "",
        TURSO_DATABASE_URL: "",
        TURSO_AUTH_TOKEN: "",
        DATABASE_PATH: E2E_DATABASE_PATH,
        NEXT_DIST_DIR: ".next-e2e",
        ...mockOAuthEnv(),
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npm run mock",
      url: MOCK_APP_BASE_URL,
      env: {
        MOCK_APP_PORT: "3300",
        MOCK_OAUTH_PORT: "4300",
        MOCK_DATABASE_PATH: "data/e2e-mock.db",
        MOCK_DIST_DIR: ".next-e2e-mock",
      },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: "node tests/__mock__/libsql-server.mjs",
      url: `${LIBSQL_MOCK_URL}/health`,
      env: {
        LIBSQL_MOCK_PORT: String(LIBSQL_MOCK_PORT),
        LIBSQL_MOCK_DATABASE_PATH,
        LIBSQL_MOCK_AUTH_TOKEN,
      },
      reuseExistingServer: false,
    },
    {
      command: `npx next dev --port ${REMOTE_APP_PORT}`,
      url: REMOTE_APP_BASE_URL,
      env: {
        VERCEL: "1",
        TURSO_DATABASE_URL: `libsql://localhost:${LIBSQL_MOCK_PORT}?tls=0`,
        TURSO_AUTH_TOKEN: LIBSQL_MOCK_AUTH_TOKEN,
        DATABASE_PATH: "/var/task/data/board.db",
        NEXT_DIST_DIR: ".next-e2e-turso",
      },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
