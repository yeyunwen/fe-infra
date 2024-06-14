const stringKeyList = ["string", "email", "password", "url", "byte", "binary"];
const stringEnum: { [key: string]: "string" } = {};
stringKeyList.forEach((key) => {
  stringEnum[key] = "string";
});

const numberKeyList = [
  "int64",
  "integer",
  "long",
  "float",
  "double",
  "number",
  "int",
  "float",
  "double",
  "int32",
  "int64",
];
const numberEnum: { [key: string]: "number" } = {};
numberKeyList.forEach((key) => {
  numberEnum[key] = "number";
});

const dateKeyList = ["Date", "date", "dateTime", "date-time", "datetime"];
const dateEnum: { [key: string]: "Date" } = {};
dateKeyList.forEach((key) => {
  dateEnum[key] = "Date";
});

export const typeEnum: { [key: string]: string } = {
  ...stringEnum,
  ...numberEnum,
  ...dateEnum,
  boolean: "boolean",
};
