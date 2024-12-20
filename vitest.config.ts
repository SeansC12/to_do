/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup-test-env.ts"],
    mockReset: true,
    coverage: {
      provider: "v8",
      exclude: [
        "**/cypress/**",
        "**/mocks/**",
        "**/prisma/**",
        "*config.{js,ts}",
        "**/build/**",
        ".eslintrc.cjs",
        "**/entry*.ts",
        "**/ui/**",
        "**/entry.*.tsx",
        "**/healthcheck.tsx",
      ],
    },
  },
});
