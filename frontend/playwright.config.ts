import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:49174', channel: 'msedge', headless: true },
  webServer: {
    command: `"${process.execPath}" node_modules/@angular/cli/bin/ng.js serve --host 127.0.0.1 --port 49174`,
    url: 'http://127.0.0.1:49174',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
