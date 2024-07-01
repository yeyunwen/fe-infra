import type { OpenAPI3 } from "openapi-typescript";
import pc from "picocolors";
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
  /** 接口地址 */
  url: string;
  /**
   * 生成接口请求方法要存放文件位置
   * @default 'src/api'
   */
  basePath?: string;
  /**
   * 接口请求方法
   * @default 'import request from "sxfe-net/web"'
   */
  requestFn?: string;
};
export const genResFn = async ({ url, ...rest }: ResFnOption) => {
  if (!url) {
    console.log(pc.red("[sxfe-create-api]: url 不能为空"));
    process.exit(1);
  }
  const schemaJson = await getApiJson(url);
  const serviceGenerator = new ServiceGenerator(schemaJson, {
    basePath: "src/api",
    requestFn: 'import request from "sxfe-net/web"',
    ...rest,
  });
  serviceGenerator.genFile();
};

export const defineConfig = (config: ResFnOption): ResFnOption => {
  return config;
};
