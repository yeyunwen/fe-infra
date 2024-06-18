import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));

const packagesDir = path.resolve(__dirname, "packages");
const packageDir = (name) => path.resolve(packagesDir, name);
const pkg = (name) => require(packageDir(`${name}/package.json`));
console.log(pkg("create-api"));

export default defineConfig([
  {
    input: packageDir("create-api/src/index.ts"),
    output: [
      {
        file: packageDir("create-api/dist/index.cjs.js"),
        format: "cjs",
      },
      {
        file: packageDir("create-api/dist/index.esm.js"),
        format: "esm",
      },
    ],
    external: [
      ...Object.keys(pkg("create-api").dependencies || {}),
      ...Object.keys(pkg("create-api").devDependencies || {}),
      ...Object.keys(require("./package.json").devDependencies || {}),
      ...["node:fs", "node:path"],
    ],
    plugins: [typescript({ tsconfig: "./tsconfig.build.json" })],
  },
]);
