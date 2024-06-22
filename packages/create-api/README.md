# @sxfe/create-api

## 介绍

一个用于根据openapi规范快速生成前端接口请求方法的工具

## 使用

安装

```bash
npm install @sxfe/create-api -D
```

在**项目根目录**下创建`create-api.config.js`文件，配置如下

```js
import { defineConfig } from "@sxfe/create-api";

/**
 * @returns {import("@sxfe/create-api").ResFnOption}
 * @description 一个提供类型友好的方法。
 */
export default defineConfig({
  url: "https://api.example.com", // 接口的openapi地址
});
```
