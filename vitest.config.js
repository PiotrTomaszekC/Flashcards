import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: "./backend/test/setup.js",
    include: ["backend/**/*.test.js"],
    coverage: {
      provider: "v8", // or 'c8' if you prefer
      reporter: ["text", "html", "lcov"],
      exclude: ["frontend/**"],
    },
  },
});
