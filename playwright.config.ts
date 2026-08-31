/**
 * Playwright config (IMPLEMENTATION_PLAN §2.6, §0.5).
 *
 * The interaction suite runs against the built static site via `astro preview`.
 * The webServer command rebuilds first (so `validate` + build are green before
 * tests run) then serves `dist/` on port 4321.
 *
 * NOTE: requires a Playwright browser to be installed first:
 *   npx playwright install chromium
 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [['line']],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321 --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    // Optional escape hatch for sandboxed/CI environments where the
    // Playwright browser CDN is unreachable: point PW_CHROMIUM_EXECUTABLE at
    // any Chromium binary. When unset, behaviour is unchanged.
    ...(process.env.PW_CHROMIUM_EXECUTABLE
      ? {
          launchOptions: {
            executablePath: process.env.PW_CHROMIUM_EXECUTABLE,
            args: ['--no-sandbox', '--disable-gpu'],
          },
        }
      : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
