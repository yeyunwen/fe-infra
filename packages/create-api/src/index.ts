import axios from "axios";
import type { OpenAPI3 } from "openapi-typescript";
import { ServiceGenerator } from "./serviceGenerator";

const getApiJson = async (url: string) => {
  try {
    const response = await axios.get<any, { data: OpenAPI3 }>(url);
    return response.data;
  } catch (error) {
    console.log("getApiJson error: ", error);
    process.exit(1);
  }
};

type ResFnOption = {
  url: string;
};
const genResFn = async ({ url }: ResFnOption) => {
  const schemaJson = await getApiJson(url);
  const serviceGenerator = new ServiceGenerator(schemaJson, {
    basePath: "src/api",
  });
  serviceGenerator.genFile();
};

export default genResFn;
