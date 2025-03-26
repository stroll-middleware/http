import CRUD from "./CRUD";
import { aDL, fileProgress, formData, toData, toParams } from "./data";
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
  request(
    config: Expand<configType> = {}
  ) {
    return REQUEST.call(this, config);
  }
  /** 请求
   *
   * @param init 请求配置
   * @returns Promise
   */
  static request(
    config: Expand<configType> = {}
  ) {
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
  get(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.GET.call(this, info);
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
  static get(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.GET.call(this, info);
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
  /** 需要后端返回数据流
   * 
   * @param info - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @param listeners 回调函数
   * @returns
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

  /** 用于部分更新
   *
   * @param param - {url, params, body, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.body - body 请求参数
   * - params.config 配置项
   * @returns Promise<any>
   */
  patch(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.PATCH.call(this, info);
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
  static patch(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.PATCH.call(this, info);
  }
  /** 用于表单部分更新
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  patchForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    return CRUD.PATCHFORM.call(this, info);
  }
  /** 用于表单部分更新
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  static patchForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    return CRUD.PATCHFORM.call(this, info);
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
  patchFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    return CRUD.PATCHFILEFORM.call(this, info, onProgress);
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
  static patchFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    return CRUD.PATCHFILEFORM.call(this, info, onProgress);
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
  post(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.POST.call(this, info);
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
  static post(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.POST.call(this, info);
  }
  /** 用于表单创建资源
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - config 配置项
   * @returns Promise<any>
   */
  postForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    return CRUD.POSTFORM.call(this, info);
  }
  /** 用于表单创建资源
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - params.config - 配置项
   * @returns Promise<any>
   */
  static postForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    return CRUD.POSTFORM.call(this, info);
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
  postFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    return CRUD.POSTFILEFORM.call(this, info, onProgress);
  }
  postStreamText(
    info: {
      url: string;
      params?: Expand<dataType>;
      body?: Expand<bodyType> | jsonArrType | jsonObjType;
      config?: Expand<configType>;
    },
    listeners: (res: any) => void
  ) {
    return CRUD.POSTSTREAMTEXT.call(this, info, listeners);
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
  static postFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    return CRUD.POSTFILEFORM.call(this, info, onProgress);
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
  static put(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.PUT.call(this, info);
  }
  /** 用于表单更新资源
   *
   * @param param - {url, body,}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * @param config 配置项
   * @returns Promise<any>
   */
  putForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    return CRUD.PUTFORM.call(this, info);
  }
  /** 用于表单更新资源
   *
   * @param param - {url, body, config}
   * - param.url - 请求地址
   * - param.body - body 请求参数
   * - param.config - 配置项
   * @returns Promise<any>
   */
  static putForm(info: {
    url: string;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>;
  }) {
    return CRUD.PUTFORM.call(this, info);
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
  putFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    return CRUD.PUTFILEFORM.call(this, info, onProgress);
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
  static putFileForm(
    info: {
      url: string;
      body: DelType<bodyType, "string" | "null">;
      config?: Expand<configType>;
    },
    onProgress?: (progress: { [s: string]: number }) => void
  ) {
    return CRUD.PUTFILEFORM.call(this, info, onProgress);
  }
  /** 用于 SSE 服务器向客户端单项推送长连接
   * - 需要 返回 流数据
   * - nodejs可以使用 import {PassThrough} from "stream";
   *
   * 示例
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
   * 示例
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
  delete(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.DELETE.call(this, info);
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
  static delete(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.DELETE.call(this, info);
  }

  /** 不返回message body内容，仅仅是获得获取资源的部分信息
   *
   * @param param - {url, params, data, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.config - 配置项
   * @returns
   */
  head(info: {
    url: string;
    params?: Expand<dataType>;
    config?: Expand<configType>;
  }) {
    return CRUD.HEAD.call(this, info);
  }
  /** 不返回message body内容，仅仅是获得获取资源的部分信息
   *
   * @param param - {url, params, data, config}
   * - param.url - 请求地址
   * - param.params - url 请求参数
   * - param.config 配置项
   * @returns
   */
  static head(info: {
    url: string;
    params?: Expand<dataType>;
    config?: Expand<configType>;
  }) {
    return CRUD.HEAD.call(this, info);
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
  options(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.OPTIONS.call(this, info);
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
  static options(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.OPTIONS.call(this, info);
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
  trace(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.TRACE.call(this, info);
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
  static trace(info: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  }) {
    return CRUD.TRACE.call(this, info);
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
