#!/usr/bin/env node

import { genResFn } from "../dist/index.esm.js";
import { resolve } from "node:path";

const configPath = resolve(process.cwd(), "./create-api.config.js");
const { default: config } = await import(configPath);

genResFn(config);
