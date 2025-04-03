import CRUD from "./CRUD";
import { aDL, fileProgress, formData, isJSON, toData, toParams } from "./data";
import { REQUEST, CANCEL } from "./request";
import {
  Expand,
  jsonObjType,
  dataType,
  FetchInterceptor,
  ResponseInterceptor,
  bodyType,
  DelType,
  jsonArrType,
  configType,
} from "./types";

/**
 * @description: http请求类
 * @param {string} baseURL 基础URL
 * @param {string} method 请求方法
 * @param {string} url 请求地址
 * @param {string} headers 请求头
 * @param {string} body 请求体
 * @param {string} params 请求参数
 * @param {string} signal 关闭标识
 * @param {string} timeout 超时时间
 * @param {string} requestInterceptors 请求拦截器
 * @param {string} responseInterceptors 响应拦截器
 * @param {string} onError 错误处理
 * @param {string} keepalive 是否允许关闭页面后继续发送请求
 * @param {string} credentials 确定浏览器是否应该发送cookie， omit 不发送， same-origin 发送同域的cookie， cors 发送跨域的cookie， navigate 发送所有cookie
 * @param {string} mode 设置请求的跨域行为
 * @param {string} referrer 指定用于请求的 Referer 标头的值字符串
 * @param {string} referrerPolicy 一个设置 Referer 标头策略的字符串。此选项的语法和语义与 Referrer-Policy 标头完全相同。
 * @param {string} browsingTopics 布尔值，指定应将当前用户的选定主题发送到与请求关联的 Sec-Browsing-Topics 标题中。
 * @param {string} cache 请求要使用的缓存模式
 * @param {string} priority 指定了 fetch 请求相对于同一类型的其他请求的优先级
 * @param {string} responseType null
 * @param {string} window null
 * @param {string} dispatcher
 * @param {string} duplex half
 * @return http
 */
export class http {
  static case: http;
  requestInterceptors: FetchInterceptor = (config) => config;
  responseInterceptors: ResponseInterceptor = (data) => data;
  static requestInterceptors: FetchInterceptor = (config) => config;
  static responseInterceptors: ResponseInterceptor = (data) => data;
  errorListener?: (error: any) => void;
  static errorListener?: (error: any) => void;
  requestList: { [s: string]: AbortController } = {};
  static requestList: { [s: string]: AbortController } = {};
  cancelMark: {
    [signal: string]: AbortController[];
  } = {};
  static cancelMark: {
    [signal: string]: AbortController[];
  } = {};
  config: configType = {
    url: "",
    method: "GET",
    baseURL: "",
    timeout: 0,
    headers: undefined,
    params: undefined,
    body: undefined,
    signal: undefined,
    responseType: undefined,
    onError: undefined,
    requestInterceptors: (config) => config,
    responseInterceptors: (body) => body,
    keepalive: false,
    credentials: undefined,
    mode: undefined,
    cache: undefined,
    priority: undefined,
  };
  static config: configType = {
    url: "",
    method: "GET",
    baseURL: "",
    timeout: 0,
    headers: undefined,
    params: undefined,
    body: undefined,
    signal: undefined,
    responseType: undefined,
    onError: undefined,
    requestInterceptors: (config) => config,
    responseInterceptors: (body) => body,
    keepalive: false,
    credentials: undefined,
    mode: undefined,
    cache: undefined,
    priority: undefined,
  };
  constructor(config: configType) {
    const headers: any = Object.assign(
      this.config.headers || {},
      config.headers || {}
    );
    this.config = Object.assign(this.config || {}, config || {});
    if (Object.keys(headers).length) {
      this.config.headers = headers;
    }
  }

  static init(config: configType) {
    return this.create(config);
  }

  async getData (response: any) {
    try {
      let data = await response.text()
      if(data){
        if (isJSON(data)) {
          data = JSON.parse(data);
        }
      }
      response.data = data;
      return response;
    } catch (error) {
      return response;
    }
  }
  static async getData (response: any) {
    try {
      let data = await response.text()
      if(data){
        if (isJSON(data)) {
          data = JSON.parse(data);
        }
      }
      response.data = data;
      return response;
    } catch (error) {
      return response;
    }
  }

  /** 创建一个请求实例
   * @description: http请求类
   * @param {string} baseURL 基础URL
   * @param {string} method 请求方法
   * @param {string} url 请求地址
   * @param {string} headers 请求头
   * @param {string} body 请求体
   * @param {string} params 请求参数
   * @param {string} signal 关闭标识
   * @param {string} timeout 超时时间
   * @param {string} requestInterceptors 请求拦截器
   * @param {string} responseInterceptors 响应拦截器
   * @param {string} onError 错误处理
   * @param {string} keepalive 是否允许关闭页面后继续发送请求
   * @param {string} credentials 确定浏览器是否应该发送cookie， omit 不发送， same-origin 发送同域的cookie， cors 发送跨域的cookie， navigate 发送所有cookie
   * @param {string} mode 设置请求的跨域行为
   * @param {string} referrer 指定用于请求的 Referer 标头的值字符串
   * @param {string} referrerPolicy 一个设置 Referer 标头策略的字符串。此选项的语法和语义与 Referrer-Policy 标头完全相同。
   * @param {string} browsingTopics 布尔值，指定应将当前用户的选定主题发送到与请求关联的 Sec-Browsing-Topics 标题中。
   * @param {string} cache 请求要使用的缓存模式
   * @param {string} priority 指定了 fetch 请求相对于同一类型的其他请求的优先级
   * @param {string} responseType null
   * @param {string} window null
   * @param {string} dispatcher
   * @param {string} duplex half
   * @return http
   */
  static create(config: configType) {
    if (this.case) {
      return this.case;
    }
    this.case = new http(config);
    return this.case;
  }

  initConfig(config: configType = {}) {
    const headers: any = {
      ...JSON.parse(JSON.stringify(this.config.headers || {})),
      ...JSON.parse(JSON.stringify(config.headers || {})),
    };
    config = { ...this.config, ...config, headers };
    return config;
  }
  static initConfig(config: configType = {}) {
    const headers: any = Object.assign(
      this.config.headers || {},
      config.headers || {}
    );
    config = Object.assign(this.config, config);
    if (Object.keys(headers).length) {
      config.headers = headers;
    }
    return config;
  }

  /** 添加请求拦截器
   * @param interceptor
   */
  interceptRequest(interceptor: FetchInterceptor) {
    this.requestInterceptors = interceptor;
  }

  /** 添加响应拦截器
   *
   * @param interceptor
   */
  interceptResponse(interceptor: ResponseInterceptor) {
    this.responseInterceptors = interceptor;
  }

  /** 添加错误监听器
   *
   * @param listener
   */
  onError(listener: (err: any) => void) {
    this.errorListener = listener;
  }

  /** a标签下载文件
   *
   * @param file 文件
   * @param info 文件信息
   */
  aDL(file: Blob | File, info: { type?: string; name?: string } = {}) {
    aDL(file, info);
  }
  /** a标签下载文件
   *
   * @param file 文件
   * @param info 文件信息
   */
  static aDL(file: Blob | File, info: { type?: string; name?: string } = {}) {
    aDL(file, info);
  }

  /** 文件进度
   *
   * @param file 文件
   * @param onProgress 进度回调
   */
  fileProgress(
    file: File | File[],
    onProgress: (progress: { [s: string]: number }) => void
  ) {
    fileProgress(file, onProgress);
  }
  /** 文件进度
   *
   * @param file 文件
   * @param onProgress 进度回调
   */
  static fileProgress(
    file: File | File[],
    onProgress: (progress: { [s: string]: number }) => void
  ) {
    fileProgress(file, onProgress);
  }

  /** 取消请求
   *
   * @param mark 发送请求时config.signal的标识字段
   */
  cancel(mark: string) {
    return CANCEL.call(this, mark);
  }
  /** 取消请求
   *
   * @param mark 发送请求时config.signal的标识字段
   */
  static cancel(mark: string) {
    return CANCEL.call(this, mark);
  }

  /** 请求
   *
   * @param init 请求配置
   * @returns Promise
   */
  request(config: Expand<configType> = {}, analysis?: true) {
    return REQUEST.call(this, config, analysis);
  }
  /** 请求
   *
   * @param init 请求配置
   * @returns Promise
   */
  static request(config: Expand<configType> = {}) {
    return REQUEST.call(this, config);
  }

  /** 用于获取资源
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config 配置项
   * @returns Promise<any>
   */
  async get(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.GET.call(this, info);
    return this.getData(response);
  }
  /** 用于获取资源
   *
   * @param info - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  static async get(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.GET.call(this, info);
    return this.getData(response);
  }
  /** 下载文件,想获取进度,需要后端返回文件流（fs.createReadStream(filePath)）
   *
   * - headers["content-length"] 里返回文件大小
   * - headers["Content-Type"] 返回类型
   * - headers["Content-Disposition"] 返回名称
   *
   * - 需要设置 "Access-Control-Expose-Headers" = "Content-Disposition"， 前端才能获取到 Content-Disposition
   *
   * @param info - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @param onProgress 进度回调
   * @returns
   */
  getDL(
    info: {
      url: string;
      params?: Expand<dataType>;
      body?: Expand<bodyType> | jsonArrType | jsonObjType;
      config?: Expand<configType>;
    },
    onProgress?: (progress: number) => void
  ) {
    return CRUD.GETDL.call(this, info, onProgress);
  }
  /** 下载文件,想获取进度,需要后端返回文件流（fs.createReadStream(filePath)）
   *
   * - headers["content-length"] 里返回文件大小
   * - headers["Content-Type"] 返回类型
   * - headers["Content-Disposition"] 返回名称
   *
   * - 需要设置 "Access-Control-Expose-Headers" = "Content-Disposition"， 前端才能获取到 Content-Disposition
   *
   * @param info - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @param onProgress 进度回调
   * @returns
   */
  static getDL(
    info: {
      url: string;
      params?: Expand<dataType>;
      config?: Expand<configType>;
    },
    onProgress?: (progress: number) => void
  ) {
    return CRUD.GETDL.call(this, info, onProgress);
  }
  /** 需要后端返回数据流
   *
   * @param info - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @param listeners 回调函数返回阶段数据
   * nodejs 示例
   * ```js
   * import Koa from "koa";
   * import Router from "koa-router";
   * import {PassThrough} from "stream";
   * import cors from "koa2-cors";
   * 
   * const app = new Koa();
   * const router = new Router();
   * app.use(cors());
   * // 使用路由器中间件
   * app.use(router.routes()).use(router.allowedMethods());
   * 
   * // 修改路由：发送流式数据
   * router.get("/stream", async (ctx) => {
   *   // 设置流式响应头
   *  ctx.set({
   *    "Content-Type": "text/event-stream",
   *    "Cache-Control": "no-cache",
   *    "Connection": "keep-alive",
   *  });
   * 
   *  // 模拟的对话数据
   *  const responseText = [
   *    "你好！我是 DeepSeek 的智能助手。\n",
   *    "我正在分析您的问题...\n",
   *    "根据现有数据，建议如下：\n",
   *    "1. 首先检查网络连接\n",
   *    "2. 验证 API 密钥有效性\n",
   *    "3. 查看服务状态面板\n",
   *    "\n需要更详细的帮助吗？"
   *  ];
   *  const stream = new PassThrough();
   *  ctx.status = 200;
   * 
   *  for (let i = 0; i < responseText.length; i++) {
   *    const content = responseText[i]
   *    setTimeout(() => {
   *      stream.write(
   *        `${JSON.stringify({
   *          id: i + 1,
   *          content,
   *          length: responseText.length
   *        })}\n`
   *      );
   *      if (i === responseText.length - 1) {
   *        stream.end();
   *      }
   *    }, i * 1000);
   *  }
   *  ctx.body = stream;
   *  
   *  // 处理客户端断开连接
   *  ctx.req.on("close", () => {
   *  console.log("客户端断开连接");
   *  ctx.res.end();
   *  });
   *});
   *
   *const hostname = "127.0.0.1";
   *const port = 6060;
   *app.listen(port, hostname, () => {
   *  console.log(`Server running at http://${hostname}:${port}/`);
   *});
   * ```
   * @returns Promise<any>
   */
  getStreamText(
    info: {
      url: string;
      params?: Expand<dataType>;
      body?: Expand<bodyType> | jsonArrType | jsonObjType;
      config?: Expand<configType>;
    },
    listeners: (res: any) => void
  ) {
    return CRUD.GETSTREAMTEXT.call(this, info, listeners);
  }
  /** 需要后端返回数据流
   *
   * @param info - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @param listeners 回调函数返回阶段数据
   * nodejs 示例
   * ```js
   * import Koa from "koa";
   * import Router from "koa-router";
   * import {PassThrough} from "stream";
   * import cors from "koa2-cors";
   * 
   * const app = new Koa();
   * const router = new Router();
   * app.use(cors());
   * // 使用路由器中间件
   * app.use(router.routes()).use(router.allowedMethods());
   * 
   * // 修改路由：发送流式数据
   * router.get("/stream", async (ctx) => {
   *   // 设置流式响应头
   *  ctx.set({
   *    "Content-Type": "text/event-stream",
   *    "Cache-Control": "no-cache",
   *    "Connection": "keep-alive",
   *  });
   * 
   *  // 模拟的对话数据
   *  const responseText = [
   *    "你好！我是 DeepSeek 的智能助手。\n",
   *    "我正在分析您的问题...\n",
   *    "根据现有数据，建议如下：\n",
   *    "1. 首先检查网络连接\n",
   *    "2. 验证 API 密钥有效性\n",
   *    "3. 查看服务状态面板\n",
   *    "\n需要更详细的帮助吗？"
   *  ];
   *  const stream = new PassThrough();
   *  ctx.status = 200;
   * 
   *  for (let i = 0; i < responseText.length; i++) {
   *    const content = responseText[i]
   *    setTimeout(() => {
   *      stream.write(
   *        `${JSON.stringify({
   *          id: i + 1,
   *          content,
   *          length: responseText.length
   *        })}\n`
   *      );
   *      if (i === responseText.length - 1) {
   *        stream.end();
   *      }
   *    }, i * 1000);
   *  }
   *  ctx.body = stream;
   *  
   *  // 处理客户端断开连接
   *  ctx.req.on("close", () => {
   *  console.log("客户端断开连接");
   *  ctx.res.end();
   *  });
   *});
   *
   *const hostname = "127.0.0.1";
   *const port = 6060;
   *app.listen(port, hostname, () => {
   *  console.log(`Server running at http://${hostname}:${port}/`);
   *});
   * ```
   * @returns Promise<any>
   */
  static getStreamText(
    info: {
      url: string;
      params?: Expand<dataType>;
      body?: Expand<bodyType> | jsonArrType | jsonObjType;
      config?: Expand<configType>;
    },
    listeners: (res: any) => void
  ) {
    return CRUD.GETSTREAMTEXT.call(this, info, listeners);
  }

  /** 用于部分更新
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - params.config 配置项
   * @returns Promise<any>
   */
  async patch(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.PATCH.call(this, info);
    return this.getData(response);
  }
  /** 用于部分更新
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config 配置项
   * @returns Promise<any>
   */
  static async patch(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.PATCH.call(this, info);
    return this.getData(response);
  }
  /** 用于表单部分更新
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  async patchForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.PATCHFORM.call(this, info);
    return this.getData(response);
  }
  /** 用于表单部分更新
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  static async patchForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.PATCHFORM.call(this, info);
    return this.getData(response);
  }
  /** 用于表单部分更新、上传
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @param  onProgress 进度回调
   * @returns Promise<any>
   */
  async patchFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    const response = await CRUD.PATCHFILEFORM.call(this, info, onProgress);
    return this.getData(response);
  }
  /** 用于表单部分更新、上传
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - config 配置项
   * @param onProgress - 进度条回调
   * @returns Promise<any>
   */
  static async patchFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    const response = await CRUD.PATCHFILEFORM.call(this, info, onProgress);
    return this.getData(response);
  }

  /** 用于创建资源
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - config 配置项
   * @returns Promise<any>
   */
  async post(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.POST.call(this, info);
    return this.getData(response);
  }
  /** 用于创建资源
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - config 配置项
   * @returns Promise<any>
   */
  static async post(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.POST.call(this, info);
    return this.getData(response);
  }
  /** 用于表单创建资源
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - config 配置项
   * @returns Promise<any>
   */
  async postForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.POSTFORM.call(this, info);
    return this.getData(response);
  }
  /** 用于表单创建资源
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - params.config - 配置项
   * @returns Promise<any>
   */
  static async postForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.POSTFORM.call(this, info);
    return this.getData(response);
  }
  /** 用于表单创建上传资源
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - params.config - 配置项
   * @param  onProgress 进度回调
   * @returns Promise<any>
   */
  async postFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    const response = await CRUD.POSTFILEFORM.call(this, info, onProgress);
    return this.getData(response);
  }
  /** 用于表单创建上传资源
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - params.config - 配置项
   * @param  onProgress 进度回调
   * @returns Promise<any>
   */
  static async postFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    const response = await CRUD.POSTFILEFORM.call(this, info, onProgress);
    return this.getData(response);
  }
  /** 下载文件,想获取进度,需要后端返回文件流（fs.createReadStream(filePath)）
   *
   * - headers["content-length"] 里返回文件大小
   * - headers["Content-Type"] 返回类型
   * - headers["Content-Disposition"] 返回名称
   *
   * - 需要设置 "Access-Control-Expose-Headers" = "Content-Disposition"， 前端才能获取到 Content-Disposition
   *
   * @param info - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.config - 配置项
   * @param  onProgress 进度回调
   * @returns
   */
  postDL(
    info: {
      url: string;
      params?: Expand<dataType>;
      body?: Expand<bodyType> | jsonArrType | jsonObjType;
      config?: Expand<configType>;
    },
    onProgress?: (progress: number) => void
  ) {
    return CRUD.POSTDL.call(this, info, onProgress);
  }
  /** 下载文件,想获取进度,需要后端返回文件流（fs.createReadStream(filePath)）
   *
   * - headers["content-length"] 里返回文件大小
   * - headers["Content-Type"] 返回类型
   * - headers["Content-Disposition"] 返回名称
   *
   * - 需要设置 "Access-Control-Expose-Headers" = "Content-Disposition"， 前端才能获取到 Content-Disposition
   *
   * @param info - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - params.config - 配置项
   * @param  onProgress 进度回调
   * @returns
   */
  static postDL(
    info: {
      url: string;
      params?: Expand<dataType>;
      body?: Expand<bodyType> | jsonArrType | jsonObjType;
      config?: Expand<configType>;
    },
    onProgress?: (progress: number) => void
  ) {
    return CRUD.POSTDL.call(this, info, onProgress);
  }

  /** 文件分块上传
   * 
   * @param info 包含文件切片所需信息的对象
   * @param info.url 文件上传的URL地址
   * @param info.params 可选的扩展数据类型参数，用于自定义上传的其他信息
   * @param info.body 包含文件及切片相关参数的对象
   * @param info.body.file 要上传的文件对象
   * @param info.body.chunkSize 可选的 每个文件块的大小，默认一片为（1024 * 1024 * 2）
   * @param info.body.passedBlocks 可选的 已上传的文件块序号数组，用于中断续传 与 needBlock 而选一
   * @param info.body.needBlock 可选的 需要上传的文件块序号数组，用于中断续传 与 passedBlocks 而选一
   * @param info.config 可选的扩展配置类型参数，用于自定义上传配置
   * 
   * @requires
   * - file: 要上传的文件分片
   * - fileName：文件名
   * - fileType：文件类型
   * - chunkIndex：切片序号，从0开始
   * - totalChunks：切片总数
   * - md5：当前文件分片的MD5值，用于校验
   * - md5All：整个文件的MD5值，用于校验
   * 
   * nodejs 示例
   * ```js
   * import Koa from 'koa';
   * import Router from'koa-router';
   * import koaBody from 'koa-body';
   * import cors from "koa2-cors";
   * import fs from 'fs';
   * import path from 'path';
   * import MD5 from '@stroll/data/dist/md5';
   * 
   * const app = new Koa();
   * const router = new Router();
   * 
   * app.use(
   *   cors({
   *     origin: `*`,
   *     maxAge: 500000,
   *     credentials: true,
   *   })
   * );
   * 
   * // 配置 koa-body 中间件来处理文件上传
   * app.use(koaBody({
   *   multipart: true,
   *   formidable: {
   *     maxFileSize: 100 * 1024 * 1024, // 设置最大文件大小为 100MB
   *     maxFieldsSize: 10 * 1024 * 1024, // 设置最大字段大小为 10MB
   *     keepExtensions: true, // 保留文件扩展名
   *     // uploadDir: path.resolve(__dirname, 'uploads'), // 设置上传文件的目录
   *   },
   * }));
   * // 存储分片文件
   * const fileInfo: {
   *   fileArr: any[],
   *   length: number
   * } = {
   *   length: 0,
   *   fileArr: []
   * }
   * // 文件上传接口
   * router.post('/upload', async (ctx: any) => {
   *   try {
   *     const { chunkIndex, totalChunks, fileName, md5 } = ctx.request.body;
   *     if (!chunkIndex || !totalChunks || !fileName || !md5) {
   *       ctx.status = 400;
   *       ctx.body = { error: 'Missing required fields' };
   *       return;
   *     }
   *     if(!fileInfo.fileArr || fileInfo.fileArr.length === 0) {
   *       fileInfo.fileArr = Array(totalChunks|0);
   *     }
   *     const file = ctx.request.files?.file;
   *     if (!file) {
   *       ctx.status = 400;
   *       ctx.body = { error: 'File not found in request' };
   *       return;
   *     }
   *     // 计算上传分片的 md5 值
   *     const chunkBuffer = fs.readFileSync(file.filepath);
   *     const serverMd5Chunk = MD5(chunkBuffer.toString());
   *     
   *     // 验证客户端发送的 md5 值与服务器计算的 md5 值是否一致
   *     if (serverMd5Chunk !== md5) {
   *       ctx.status = 400;
   *       ctx.body = { error: `MD5不匹配的块${chunkIndex}: 预期的 ${md5}, 得到 ${serverMd5Chunk}` };
   *       return;
   *     }
   *     fileInfo.fileArr[chunkIndex] = chunkBuffer;
   *     fileInfo.length++;
   * 
   *     if (+fileInfo.length === +totalChunks) {
   *       const filePath = path.join(__dirname, `uploads/${fileName}`);
   *       fs.writeFileSync(filePath, '')
   *       const BufferData = Buffer.concat(fileInfo.fileArr).toString()
   *       console.log('BufferData', MD5(BufferData), md5All)
   *       for (let i = 0; i < fileInfo.fileArr.length; i++) {
   *         // 追加写入到文件中
   *         fs.appendFileSync(filePath, fileInfo.fileArr[i])
   *       }
   *       fileInfo.fileArr = [];
   *       fileInfo.length = 0;
   *       ctx.body = { message: '文件成功上传' };
   *     } else {
   *       ctx.body = { message: '块成功上传了' };
   *     }
   *   } catch (error: any) {
   *     console.error('上传期间的错误:', error.message);
   *     ctx.status = 500;
   *     ctx.body = { error: '内部服务器错误' };
   *   }
   * });
   * ```
   * 
   * app.use(router.routes());
   * app.use(router.allowedMethods());
   * 
   * const port = 6060;
   * app.listen(port, () => {
   *   console.log('Server is running on http://localhost:' + port);
   * });
   * 
   * @returns 返回切片操作的结果，具体类型和内容取决于CRUD.SLICEFILE的实现
   */
  postSliceFile (
    info: {
      url: string;
      params?: Expand<dataType>;
      body: {
        file: File;
        chunkSize?: number;
        passedBlocks?: number[];
        needBlock?: number[];
      };
      config?: Expand<configType>;
    },
    onProgress: Function
  ){
    return CRUD.POSTSLICEFILE.call(this, info, onProgress);
  }
  /** 文件分块上传
   * 
   * @param info 包含文件切片所需信息的对象
   * @param info.url 文件上传的URL地址
   * @param info.params 可选的扩展数据类型参数，用于自定义上传的其他信息
   * @param info.body 包含文件及切片相关参数的对象
   * @param info.body.file 要上传的文件对象
   * @param info.body.chunkSize 可选的 每个文件块的大小，默认一片为（1024 * 1024 * 2）
   * @param info.body.passedBlocks 可选的 已上传的文件块序号数组，用于中断续传 与 needBlock 而选一
   * @param info.body.needBlock 可选的 需要上传的文件块序号数组，用于中断续传 与 passedBlocks 而选一
   * @param info.config 可选的扩展配置类型参数，用于自定义上传配置
   * 
   * @requires
   * - file: 要上传的文件分片
   * - fileName：文件名
   * - fileType：文件类型
   * - chunkIndex：切片序号，从0开始
   * - totalChunks：切片总数
   * - md5：当前文件分片的MD5值，用于校验
   * - md5All：整个文件的MD5值，用于校验
   * 
   * nodejs 示例
   * ```js
   * import Koa from 'koa';
   * import Router from'koa-router';
   * import koaBody from 'koa-body';
   * import cors from "koa2-cors";
   * import fs from 'fs';
   * import path from 'path';
   * import MD5 from '@stroll/data/dist/md5';
   * 
   * const app = new Koa();
   * const router = new Router();
   * 
   * app.use(
   *   cors({
   *     origin: `*`,
   *     maxAge: 500000,
   *     credentials: true,
   *   })
   * );
   * 
   * // 配置 koa-body 中间件来处理文件上传
   * app.use(koaBody({
   *   multipart: true,
   *   formidable: {
   *     maxFileSize: 100 * 1024 * 1024, // 设置最大文件大小为 100MB
   *     maxFieldsSize: 10 * 1024 * 1024, // 设置最大字段大小为 10MB
   *     keepExtensions: true, // 保留文件扩展名
   *     // uploadDir: path.resolve(__dirname, 'uploads'), // 设置上传文件的目录
   *   },
   * }));
   * // 存储分片文件
   * const fileInfo: {
   *   fileArr: any[],
   *   length: number
   * } = {
   *   length: 0,
   *   fileArr: []
   * }
   * // 文件上传接口
   * router.post('/upload', async (ctx: any) => {
   *   try {
   *     const { chunkIndex, totalChunks, fileName, md5 } = ctx.request.body;
   *     if (!chunkIndex || !totalChunks || !fileName || !md5) {
   *       ctx.status = 400;
   *       ctx.body = { error: 'Missing required fields' };
   *       return;
   *     }
   *     if(!fileInfo.fileArr || fileInfo.fileArr.length === 0) {
   *       fileInfo.fileArr = Array(totalChunks|0);
   *     }
   *     const file = ctx.request.files?.file;
   *     if (!file) {
   *       ctx.status = 400;
   *       ctx.body = { error: 'File not found in request' };
   *       return;
   *     }
   *     // 计算上传分片的 md5 值
   *     const chunkBuffer = fs.readFileSync(file.filepath);
   *     const serverMd5Chunk = MD5(chunkBuffer.toString());
   *     
   *     // 验证客户端发送的 md5 值与服务器计算的 md5 值是否一致
   *     if (serverMd5Chunk !== md5) {
   *       ctx.status = 400;
   *       ctx.body = { error: `MD5不匹配的块${chunkIndex}: 预期的 ${md5}, 得到 ${serverMd5Chunk}` };
   *       return;
   *     }
   *     fileInfo.fileArr[chunkIndex] = chunkBuffer;
   *     fileInfo.length++;
   * 
   *     if (+fileInfo.length === +totalChunks) {
   *       const filePath = path.join(__dirname, `uploads/${fileName}`);
   *       fs.writeFileSync(filePath, '')
   *       const BufferData = Buffer.concat(fileInfo.fileArr).toString()
   *       console.log('BufferData', MD5(BufferData), md5All)
   *       for (let i = 0; i < fileInfo.fileArr.length; i++) {
   *         // 追加写入到文件中
   *         fs.appendFileSync(filePath, fileInfo.fileArr[i])
   *       }
   *       fileInfo.fileArr = [];
   *       fileInfo.length = 0;
   *       ctx.body = { message: '文件成功上传' };
   *     } else {
   *       ctx.body = { message: '块成功上传了' };
   *     }
   *   } catch (error: any) {
   *     console.error('上传期间的错误:', error.message);
   *     ctx.status = 500;
   *     ctx.body = { error: '内部服务器错误' };
   *   }
   * });
   * 
   * 
   * app.use(router.routes());
   * app.use(router.allowedMethods());
   * 
   * const port = 6060;
   * app.listen(port, () => {
   *   console.log('Server is running on http://localhost:' + port);
   * });
   * ```
   * 
   * @returns 返回切片操作的结果，具体类型和内容取决于CRUD.SLICEFILE的实现
   */
  static postSliceFile (
    info: {
      url: string;
      params?: Expand<dataType>;
      body: {
        file: File;
        chunkSize?: number;
        passedBlocks?: number[];
        needBlock?: number[];
      };
      config?: Expand<configType>;
    },
    onProgress: Function
  ){
    return CRUD.POSTSLICEFILE.call(this, info, onProgress);
  }

  /** 用于更新资源
   *
   * @param param - {url, params, body,}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  put(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.PUT.call(this, info);
  }
  /** 用于更新资源
   *
   * @param param - {url, params, body,}
   * - param.url - 请求地址
   * - param.params - 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  static async put(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.PUT.call(this, info);
    return this.getData(response);
  }
  /** 用于表单更新资源
   *
   * @param param - {url, body,}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * @param config 配置项
   * @returns Promise<any>
   */
  async putForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.PUTFORM.call(this, info);
    return this.getData(response);
  }
  /** 用于表单更新资源
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  static async putForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.PUTFORM.call(this, info);
    return this.getData(response);
  }
  /** 用于表单更新资源/文件
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @param  onProgress 进度回调
   * @returns Promise<any>
   */
  async putFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    const response = await CRUD.PUTFILEFORM.call(this, info, onProgress);
    return this.getData(response);
  }
  /** 用于表单更新资源/文件
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @param onProgress 进度回调
   * @returns Promise<any>
   */
  static async putFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    const response = await CRUD.PUTFILEFORM.call(this, info, onProgress);
    return this.getData(response);
  }
  /** 用于 SSE 服务器向客户端单项推送长连接
   * - 需要 返回 流数据
   * - nodejs可以使用 import {PassThrough} from "stream";
   *
   * nodejs 示例
   * ```js
   * import Koa from "koa";
   * import Router from "koa-router";
   * import {PassThrough} from "stream";
   *
   * const app = new Koa();
   * const router = new Router();
   *
   * app.use(router.routes()).use(router.allowedMethods());
   *
   * router.get("/sse", async (ctx) => {
   * const ss = new PassThrough();
   * ctx.set({
   *   "Content-Type": "text/event-stream",
   *   // "Cache-Control": "no-cache",
   *   // Connection: "keep-alive",
   *   // "Access-Control-Allow-Origin":"*",
   *   // "Access-Control-Allow-Headers":"Content-Type"
   * });
   * ctx.body = ss;
   * // 使用定时器来模拟任务
   * setInterval(()=>{
   *   const date = { date: `当前时间：北京时间${new Date().toLocaleTimeString()}` };
   *   // 此处的customEventName可以按照自己的需求定义
   *   const data = 'event: customEventName\n'+"data:"+JSON.stringify(date)+"" + "\n\n";
   *     ss.push(data);
   *   }, 1000)
   * });
   * ```
   *
   * @param param - {url, params, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * @param listener - 数据监听器
   * @returns Promise<EventSource>
   * - EventSource.readyState 只读 一个代表连接状态的数字。可能值是 CONNECTING（0）、OPEN（1）或 CLOSED（2）。
   * - EventSource.url 只读 一个表示事件源的 URL 字符串。
   * - EventSource.withCredentials 只读 一个布尔值，表示 EventSource 对象是否使用跨源资源共享（CORS）凭据来实例化（true），或者不使用（false，即默认值）。
   * - EventSource.close() 关闭连接（如果有），并将 readyState 属性设置为 CLOSED。如果连接已经关闭，则该方法不执行任何操作。
   */
  connect(
    info: {
      url: string;
      params?: Expand<dataType>;
    },
    listener: (data: MessageEvent<any>) => void
  ) {
    return CRUD.CONNECT.call(this, info, listener);
  }
  /** 用于 SSE 服务器向客户端单项推送长连接
   * - 需要 返回 流数据
   * - nodejs可以使用 import {PassThrough} from "stream";
   *
   * nodejs 示例
   * ```js
   * import Koa from "koa";
   * import Router from "koa-router";
   * import {PassThrough} from "stream";
   *
   * const app = new Koa();
   * const router = new Router();
   *
   * app.use(router.routes()).use(router.allowedMethods());
   *
   * router.get("/sse", async (ctx) => {
   * const ss = new PassThrough();
   * ctx.set({
   *   "Content-Type": "text/event-stream",
   *   // "Cache-Control": "no-cache",
   *   // Connection: "keep-alive",
   *   // "Access-Control-Allow-Origin":"*",
   *   // "Access-Control-Allow-Headers":"Content-Type"
   * });
   * ctx.body = ss;
   * // 使用定时器来模拟任务
   * setInterval(()=>{
   *   const date = { date: `当前时间：北京时间${new Date().toLocaleTimeString()}` };
   *   // 此处的customEventName可以按照自己的需求定义
   *   const data = 'event: customEventName\n'+"data:"+JSON.stringify(date)+"" + "\n\n";
   *     ss.push(data);
   *   }, 1000)
   * });
   * ```
   *
   * @param param - {url, params, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * @param listener - 数据监听器
   * @returns Promise<EventSource>
   * - EventSource.readyState 只读 一个代表连接状态的数字。可能值是 CONNECTING（0）、OPEN（1）或 CLOSED（2）。
   * - EventSource.url 只读 一个表示事件源的 URL 字符串。
   * - EventSource.withCredentials 只读 一个布尔值，表示 EventSource 对象是否使用跨源资源共享（CORS）凭据来实例化（true），或者不使用（false，即默认值）。
   * - EventSource.close() 关闭连接（如果有），并将 readyState 属性设置为 CLOSED。如果连接已经关闭，则该方法不执行任何操作。
   */
  static connect(
    info: {
      url: string;
      params?: Expand<dataType>;
    },
    listener: (data: MessageEvent<any>) => void
  ) {
    return CRUD.CONNECT.call(this, info, listener);
  }

  /** 用于删除资源
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config 配置项
   * @returns Promise<any>
   */
  async delete(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.DELETE.call(this, info);
    return this.getData(response);
  }
  /** 用于删除资源
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  static async delete(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.DELETE.call(this, info);
    return this.getData(response);
  }

  /** 不返回message body内容，仅仅是获得获取资源的部分信息
   *
   * @param param - {url, params, data, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.config - 配置项
   * @returns
   */
  async head(info: {
    url: string;
    params?: Expand<dataType>;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.HEAD.call(this, info);
    return this.getData(response);
  }
  /** 不返回message body内容，仅仅是获得获取资源的部分信息
   *
   * @param param - {url, params, data, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.config 配置项
   * @returns
   */
  static async head(info: {
    url: string;
    params?: Expand<dataType>;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.HEAD.call(this, info);
    return this.getData(response);
  }

  /** 用于url验证，验证接口服务是否正常
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  async options(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.OPTIONS.call(this, info);
    return this.getData(response);
  }
  /** 用于url验证，验证接口服务是否正常
   *
   * @param param - {url, params, body,config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config 配置项
   * @returns Promise<any>
   */
  static async options(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.OPTIONS.call(this, info);
    return this.getData(response);
  }

  /** 回显服务器收到的请求
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config 配置项
   * @returns Promise<any>
   */
  async trace(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.TRACE.call(this, info);
    return this.getData(response);
  }
  /** 回显服务器收到的请求
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config 配置项
   * @returns Promise<any>
   */
  static async trace(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    const response = await CRUD.TRACE.call(this, info);
    return this.getData(response);
  }

  toData(params: string) {
    return toData(params);
  }
  static toData(params: string) {
    return toData(params);
  }

  toParams(data: Expand<jsonObjType>) {
    return toParams(data);
  }
  static toParams(data: Expand<jsonObjType>) {
    return toParams(data);
  }

  formData(data: Expand<jsonObjType>) {
    return formData(data);
  }
  static formData(data: Expand<jsonObjType>) {
    return formData(data);
  }
}

export default http;
