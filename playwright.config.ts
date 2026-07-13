import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests.
 *
 * These run against a real Next.js server (`npm run build && npm start`), so
 * they exercise the actual middleware, Server Components, and route handlers —
 * not a mock. They deliberately avoid anything that would need live Square,
 * Supabase, or Resend credentials, so they pass on a clean checkout with an
 * empty .env: the specs assert on public behaviour, redirects, accessibility
 * landmarks, and the ABSENCE of confidential pricing.
 *
 * Run:  npx playwright install --with-deps chromium && npm run test:e2e
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
