import Handlebars from "handlebars";
import axios from "axios";
import type {
  OpenAPI3,
  OperationObject,
  ParameterObject,
  ResponsesObject,
} from "openapi-typescript";
import { ServiceGenerator } from "./serviceGenerator";

type ReqMethod = typeof REQ_METHOD;
const REQ_METHOD = {
  get: "getRequst",
  post: "postRequst",
};

const getApiJson = async (url: string) => {
  try {
    const response = await axios.get<any, { data: OpenAPI3 }>(url);
    return response.data;
  } catch (error) {
    console.log("getApiJson error: ", error);
    process.exit(1);
  }
};

type ApiInfo = {
  url: string;
  method: keyof ReqMethod;
};

const generateParams = (parameters: ParameterObject[]) => {
  if (!parameters) return;
  console.log("Handlebars", Handlebars);

  const template = Handlebars.compile(`
    type ParamsType = {
      {{#each parameters}}
        /**
         * {{ description }}
         */
        {{ name }}{{required : "" ? "?"}}: {{ schema.type }};
      {{/each}}
    }
    `);
  return template({ parameters });
};

const generateResponse = (responses: ResponsesObject) => {
  if (!responses || !responses["200"]) return "any";
};

export const generateRequest = async (
  pathItem: OperationObject,
  info: ApiInfo,
) => {
  const { parameters, responses } = pathItem;
  const { url, method } = info;
  const paramsType = generateParams(parameters as ParameterObject[]);
  const responseType = generateResponse(responses!);
  return `
type ParamsType = ${paramsType || "any"}
type ResponseType = ${responseType}

export const regionTree = (params: ParamsType) =>
    ${
      REQ_METHOD[method]
    }<typeof params, IResponseType<ResponseType>>(${url}, params)`;
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

genResFn({
  url: "http://127.0.0.1:4523/export/openapi/2?version=3.0",
});
