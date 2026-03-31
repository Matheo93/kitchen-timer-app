import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Kitchen: cook from a short distance
    viewport: { width: 390, height: 844 },
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'desktop-chrome',
      use: {
        viewport: { width: 1280, height: 800 },
        baseURL: 'http://localhost:3000',
      },
    },
  ],
  // Dev server is already running on port 3701
})
