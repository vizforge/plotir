import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const fromRoot = (path: string): string =>
  fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@plotir/core": fromRoot("./packages/core/src/index.ts"),
      "@plotir/vegalite": fromRoot("./packages/vegalite/src/index.ts"),
      "@plotir/tableau": fromRoot("./packages/tableau/src/index.ts"),
    },
  },
  test: {
    include: ["packages/*/test/**/*.test.ts"],
  },
});
