#!/usr/bin/env node

import { genResFn } from "../dist/index.esm.js";
import { resolve } from "node:path";
import pc from "picocolors";

const configPath = resolve(process.cwd(), "./create-api.config.js");

const configFile = await import(configPath).catch(() => {
  console.log(
    pc.red(
      `[sxfe-create-api]: ${pc.italic("create-api.config.js")} 文件不存在`,
    ),
  );
  process.exit(1);
});

const config = configFile.default || {};

genResFn(config);
