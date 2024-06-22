import fs from "node:fs";
import path from "node:path";
import {
  type MediaTypeObject,
  type ObjectSubtype,
  type OpenAPI3,
  type OperationObject,
  type ParameterObject,
  type PathItemObject,
  type PathsObject,
  type RequestBodyObject,
  type ResponseObject,
  type SchemaObject,
} from "openapi-typescript";
import Handlebars from "handlebars";
import prettier from "prettier";
import { upperFirstChar } from "@sxfe/shared";
import { typeEnum } from "./typeEnum";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

Handlebars.registerHelper("upperFirstChar", (str: string) => {
  return upperFirstChar(str);
});
// 定义自定义帮助函数
Handlebars.registerHelper("eq", function (v1, v2, options) {
  if (v1 === v2) {
    //@ts-ignore
    return options.fn(this);
  } else {
    //@ts-ignore
    return options.inverse(this);
  }
});

export type PropsItem = {
  type: string;
  description: string;
  name: string;
  required: boolean;
};
export type ApiData = {
  tag: string;
  url: string;
  name: string;
  method: string;
  paramsList: PropsItem[];
  responseList: PropsItem[];
} & OperationObject;

export type GeneratorOptions = {
  basePath: string;
};

export class ServiceGenerator {
  protected readonly openAPIData: OpenAPI3;
  protected apiData: Record<string, ApiData[]> = {};
  protected options: GeneratorOptions;

  constructor(openAPIData: OpenAPI3, options: GeneratorOptions) {
    this.openAPIData = openAPIData;
    this.options = options;
    const paths = this.openAPIData.paths as PathsObject;
    Object.keys(paths).forEach((key) => {
      const path = paths[key] as PathItemObject;
      const methods = Object.keys(path) as (keyof PathItemObject)[];
      this.apiData[key] = [];
      methods.forEach((method) => {
        const operation = path[method] as OperationObject;
        let paramsList: PropsItem[] = [];
        let responseList: PropsItem[] = [];
        if (method === "get") {
          (operation.parameters as ParameterObject[]).forEach((param) => {
            if (param.in === "query") {
              paramsList.push({
                name: param.name,
                description: param.description || "",
                required: param.required || false,
                type: this.getType(param.schema!),
              });
            }
          });
        } else if (method === "post") {
          const schema = (
            (operation.requestBody as RequestBodyObject).content[
              "application/json"
            ] as MediaTypeObject
          ).schema as ObjectSubtype;
          paramsList = this.handleObjectSubType(schema);
        }

        if (
          operation.responses &&
          operation.responses["200"] &&
          (operation.responses["200"] as ResponseObject).content
        ) {
          const schema = (
            (operation.responses["200"] as ResponseObject).content![
              "application/json"
            ] as MediaTypeObject
          ).schema as ObjectSubtype;
          responseList = this.handleObjectSubType(schema);
        } else {
          responseList = [];
        }

        this.apiData[key].push({
          ...operation,
          url: key,
          name: key.split("/").at(-1) || "",
          tag: operation.tags?.at(-1)?.split("/")?.at(-1) || "",
          method,
          summary: operation.summary || "",
          paramsList,
          responseList,
        });
      });
    });
  }

  public handleObjectSubType(schema: ObjectSubtype) {
    const props: PropsItem[] = [];
    Object.keys(schema.properties || {}).forEach((key) => {
      props.push({
        name: key,
        description: schema.properties![key].description || "",
        required: schema.required?.includes(key) || false,
        type: this.getType(schema.properties![key] as SchemaObject),
      });
    });
    return props;
  }

  public async genRequestTemplate(apiData: ApiData) {
    const template = fs.readFileSync(
      path.resolve(__dirname, "../", "./template/request.hbs"),
      "utf-8",
    );
    let content = Handlebars.compile(template)({ apiData });

    content = await prettier.format(content, {
      semi: true,
      singleQuote: false,
      parser: "typescript",
    });

    return content;
  }

  public getType(schema: SchemaObject): string {
    const { type } = schema;
    let result = typeEnum[type as string];
    if (result) {
      return result;
    }

    if (schema.allOf && schema.allOf.length > 0) {
      return `${schema.allOf.map((item) => this.getType(item as SchemaObject)).join(" & ")}`;
    }

    if (schema.oneOf && schema.oneOf.length > 0) {
      return `${schema.oneOf.map((item) => this.getType(item as SchemaObject)).join(" | ")}`;
    }

    if (schema.anyOf && schema.anyOf.length > 0) {
      return `${schema.anyOf.map((item) => this.getType(item as SchemaObject)).join(" | ")}`;
    }

    if (type === "array") {
      let { items } = schema;
      const arrayType = this.getType(items as SchemaObject);
      return `${arrayType}[]`;
    }

    if (type === "object" && schema.properties) {
      const properties = schema.properties;
      const propertyKeys = Object.keys(properties);
      if (propertyKeys.length === 0) {
        return "Record<string, any>";
      }
      return `{ ${propertyKeys
        .map((key) => {
          const property = properties[key] as SchemaObject;
          let required = false;
          if (schema.required?.includes(key)) {
            required = true;
          }
          return `${key}${required ? "" : "?"}: ${this.getType(property)};`;
        })
        .join(" ")}
        }`;
    }

    return "any";
  }

  public genFile() {
    Object.keys(this.apiData).forEach((key) => {
      const data = this.apiData[key];
      const folderPath = path.join(this.options.basePath, data[0].tag);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, {
          recursive: true,
        });
      }
      data.forEach(async (item) => {
        const fileName = `${item.method + upperFirstChar(key.split("/").at(-1) as string)}.ts`;
        const content = await this.genRequestTemplate(item);
        fs.writeFileSync(path.join(folderPath, fileName), content);
      });
    });
  }
}
