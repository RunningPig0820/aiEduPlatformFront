// @ts-check
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: 'http://localhost:3000',
    channel: 'chrome',
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'off',
  },
  reporter: 'list',
})
