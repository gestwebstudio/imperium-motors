import { defineConfig } from "@playwright/test";

/**
 * UI-тесты главной страницы и кита (public/ui-kit/*).
 * reducedMotion: "reduce" отключает авто-прокрутку hero и делает
 * карусели детерминированными — переключения идут только по клику.
 */
export default defineConfig({
  testDir: "./tests/ui",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    reducedMotion: "reduce",
    viewport: { width: 1920, height: 1180 },
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
