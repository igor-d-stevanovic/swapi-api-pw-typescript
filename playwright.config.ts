import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  retries: 2,
  workers: "75%",
  reporter: [
    ["list"],
    ["allure-playwright"],
  ],
  use: {
    baseURL: process.env.SWAPI_BASE_URL ?? "https://swapi.dev",
    extraHTTPHeaders: {
      Accept: "application/json",
    },
  },
});
