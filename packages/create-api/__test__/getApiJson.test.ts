import { getApiJson } from "../src/genResFn";

test("getApiJson", async () => {
  const url = "https://petstore.swagger.io/v2/swagger.json";
  const res = await getApiJson(url);
  expect(res).toBeDefined();
});
