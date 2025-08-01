import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.ts",
    coverage: {
      provider: "v8", // or try "c8" if issues persist
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000", // 👈 complete this
    },
  },
});
