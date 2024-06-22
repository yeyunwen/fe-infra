import type { OpenAPI3 } from "openapi-typescript";
import { ServiceGenerator } from "./serviceGenerator";

export const getApiJson = async (url: string) => {
  try {
    const response = (await fetch(url).then((res) => res.json())) as OpenAPI3;
    return response;
  } catch (error) {
    console.log("getApiJson error: ", error);
    process.exit(1); // 如果获取接口信息失败，直接退出进程
  }
};

export type ResFnOption = {
  url: string;
};
export const genResFn = async ({ url }: ResFnOption) => {
  const schemaJson = await getApiJson(url);
  const serviceGenerator = new ServiceGenerator(schemaJson, {
    basePath: "src/api",
  });
  serviceGenerator.genFile();
};

export const defineConfig = (config: ResFnOption): ResFnOption => {
  return config;
};
