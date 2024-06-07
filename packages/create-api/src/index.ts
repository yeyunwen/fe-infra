import Handlebars from "handlebars";

import axios from "axios";
import type {
  OpenAPI3,
  OperationObject,
  ParameterObject,
  PathItemObject,
  ResponsesObject,
} from "openapi-typescript";

type ReqMethod = typeof REQ_METHOD;
const REQ_METHOD = {
  get: "getRequst",
  post: "postRequst",
};

const url =
  process.argv[2] || "http://127.0.0.1:4523/export/openapi/5?version=3.0";
const getApiJson = async <T>(url: string) => {
  const response = await axios.get<any, T>(url).catch((err) => {
    console.log("err1", err);
  });
  return response;
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
  info: ApiInfo
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

const { data: apiJson } = await getApiJson<OpenAPI3>(url);
if (apiJson) {
  const { paths } = apiJson;
  const urlList = Object.keys(apiJson.paths!);
  for (const url of urlList) {
    const pathInfo = paths![url] as PathItemObject;
    const methodList = Object.keys(pathInfo);
    methodList.forEach((method) => {
      const apiInfo = { url, method: method as keyof ReqMethod };
      const apiType = generateRequest(
        pathInfo[method as keyof PathItemObject],
        apiInfo
      );
      console.log(apiType);
    });
  }
}
