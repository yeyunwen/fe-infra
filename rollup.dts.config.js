//@ts-check
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";

export default defineConfig([
  {
    input: "temp/packages/create-api/src/index.d.ts",
    output: {
      file: "packages/create-api/dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
    external: ["openapi-typescript"],
  },
  {
    input: "temp/packages/shared/src/index.d.ts",
    output: {
      file: "packages/shared/dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
]);
