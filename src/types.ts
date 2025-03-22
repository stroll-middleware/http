export type Expand<T> = T extends object
  ? T extends Array<infer U>
    ? Array<Expand<U>>
    : T extends Map<infer K, infer V>
    ? Map<Expand<K>, Expand<V>>
    : T extends Set<infer U>
    ? Set<Expand<U>>
    : {
        [K in keyof T]: Expand<T[K]>;
      }
  : T;

export type DelType<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export type InKey<T> = {
  [P in keyof T]: T[P] extends object ? InKey<T[P]> : T[P];
};

export type InArrKey<T extends string | number | symbol> = {
  [P in T]?: string
};

export type dataType = valueType | jsonArrType | jsonObjType;

export type valueType = string | number | boolean;

export type jsonArrType = [valueType | jsonObjType | jsonArrType];

export type jsonObjType = {
  [s: string]: valueType | jsonArrType | jsonObjType;
};

// 定义拦截器类型
export type FetchInterceptor = (request: RequestInit) => RequestInit;
export type ResponseInterceptor = (response: Response) => Response;

export type methodType =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS"
  | "CONNECT"
  | "TRACE";

export type binaryType = "arraybuffer" | "buffer" | "blob";

export type credentialsType = "include" | "omit" | "same-origin";

export type modeType = "same-origin" | "cors" | "navigate" | "no-cors";

export type referrerPolicyType =
  | ""
  | "same-origin"
  | "no-referrer"
  | "no-referrer-when-downgrade"
  | "origin"
  | "origin-when-cross-origin"
  | "strict-origin"
  | "strict-origin-when-cross-origin"
  | "unsafe-url";

export type cacheType =
  | "no-store"
  | "no-cache"
  | "force-cache"
  | "only-if-cached";

export type bodyType =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | ReadableStream
  | Blob
  | BufferSource
  | File
  | DataView
  | ArrayBuffer
  | FormData
  | URLSearchParams
  | string
  | null;

export type priorityType = "low" | "medium" | "high";

export type redirectType = "follow" | "error" | "manual";

export type configType = {
  url?: string;
  method?: methodType;
  baseURL?: string;
  headers?: { [P in headersType]?: string };
  params?: Expand<dataType>;
  body?: Expand<bodyType>;
  redirect?: redirectType;
  signal?: AbortSignal;
  timeout?: number;
  responseType?: binaryType | "json" | "text";
  requestInterceptors?: FetchInterceptor;
  responseInterceptors?: ResponseInterceptor;
  onError?: (error: Error) => void;
  keepalive?: boolean;
  credentials?: credentialsType;
  mode?: modeType;
  referrer?: string;
  referrerPolicy?: referrerPolicyType;
  browsingTopics?: boolean;
  cache?: cacheType;
  priority?: priorityType;
};

export type RequestInit = {
  method?: methodType; // 请求方法
  keepalive?: boolean; // 设置为 true 时,允许关闭页面后继续发送请求
  headers?: Expand<HeadersInit>;
  body?: bodyType; // 请求体
  redirect?: redirectType; // 确定服务器以重定向状态响应时浏览器的行为
  integrity?: string; // 包含请求的子资源完整性值
  signal?: Expand<AbortSignal> | null; // 取消请求设置
  credentials?: credentialsType; // 确定浏览器是否应该发送cookie， omit 不发送， same-origin 发送同域的cookie， cors 发送跨域的cookie， navigate 发送所有cookie
  mode?: modeType; // 设置请求的跨域行为
  referrer?: string; // 指定用于请求的 Referer 标头的值字符串
  referrerPolicy?: referrerPolicyType; // 一个设置 Referer 标头策略的字符串。此选项的语法和语义与 Referrer-Policy 标头完全相同。
  browsingTopics: boolean; // 布尔值，指定应将当前用户的选定主题发送到与请求关联的 Sec-Browsing-Topics 标题中。
  cache?: cacheType; // 请求要使用的缓存模式
  priority: priorityType; // 指定了 fetch 请求相对于同一类型的其他请求的优先级
  window?: null;
  dispatcher?: any;
  duplex?: "half";
};

export type headersType =
  | verifyHeaderTypw
  | cacheHeaderType
  | conditionHeaderType
  | TCPHeaderType
  | negotiationHeaderType
  | controlHeaderType
  | cookieHeaderType
  | CORSHeaderType
  | downloadHeaderType
  | summaryHeaderType
  | textHeaderType
  | proxyHeaderType
  | rangeHeaderType
  | redirectHeaderType
  | requestHeaderType
  | responseHeaderType
  | suretyHeaderType
  | fetchHeaderType
  | serverHeaderType
  | codingHeaderType
  | webSocketHeaderType
  | otherHeaderType
  | attributeHeaderType
  | clientHeaderType
  | experimentalHeaderType
  | nonstandardHeaderType;

type verifyHeaderTypw =
  | "WWW-Authenticate"
  | "Authorization"
  | "Proxy-Authenticate"
  | "Proxy-Authorization";

type cacheHeaderType =
  | "Age"
  | "Cache-Control"
  | "Clear-Site-Data"
  | "Expires"
  | "No-Vary-Search";

type conditionHeaderType =
  | "Last-Modified"
  | "ETag"
  | "If-Match"
  | "If-None-Match"
  | "If-Modified-Since"
  | "If-Unmodified-Since"
  | "Vary";

type TCPHeaderType = "Connection" | "Keep-Alive";

type negotiationHeaderType =
  | "Accept"
  | "Accept-Encoding"
  | "Accept-Language"
  | "Accept-Patch"
  | "Accept-Post";

type controlHeaderType = "Expect" | "Max-Forwards";

type cookieHeaderType = "Cookie" | "Set-Cookie";

type CORSHeaderType =
  | "Access-Control-Allow-Credentials"
  | "Access-Control-Allow-Headers"
  | "Access-Control-Allow-Methods"
  | "Access-Control-Allow-Origin"
  | "Access-Control-Expose-Headers"
  | "Access-Control-Max-Age"
  | "Access-Control-Request-Headers"
  | "Access-Control-Request-Method"
  | "Origin"
  | "Timing-Allow-Origin";

type downloadHeaderType = "Content-Disposition";

type summaryHeaderType =
  | "Content-Digest"
  | "Repr-Digest"
  | "Want-Content-Digest"
  | "Want-Repr-Digest";

type textHeaderType =
  | "Content-Length"
  | "Content-Type"
  | "Content-Encoding"
  | "Content-Language"
  | "Content-Location";

type proxyHeaderType = "Forwarded" | "Via";

type rangeHeaderType = "Accept-Ranges" | "Range" | "If-Range" | "Content-Range";

type redirectHeaderType = "Location" | "Refresh";

type requestHeaderType =
  | "From"
  | "Host"
  | "Referer"
  | "Referrer-Policy"
  | "User-Agent";

type responseHeaderType = "Allow" | "Server";

type suretyHeaderType =
  | "Cross-Origin-Embedder-Policy"
  | "Cross-Origin-Opener-Policy"
  | "Cross-Origin-Resource-Policy"
  | "Content-Security-Policy"
  | "Content-Security-Policy-Report-Only"
  | "Permissions-Policy"
  | "Reporting-Endpoints"
  | "Strict-Transport-Security"
  | "Upgrade-Insecure-Requests"
  | "X-Content-Type-Options"
  | "X-Frame-Options"
  | "X-Permitted-Cross-Domain-Policies"
  | "X-Powered-By"
  | "X-XSS-Protection";

type fetchHeaderType =
  | "Sec-Fetch-Site"
  | "Sec-Fetch-Mode"
  | "Sec-Fetch-User"
  | "Sec-Fetch-Dest"
  | "Sec-Purpose"
  | "Service-Worker-Navigation-Preload";

type serverHeaderType = "Reporting-Endpoints";

type codingHeaderType = "Transfer-Encoding" | "TE" | "Trailer";

type webSocketHeaderType =
  | "Sec-WebSocket-Accept"
  | "Sec-WebSocket-Extensions"
  | "Sec-WebSocket-Key"
  | "Sec-WebSocket-Protocol"
  | "Sec-WebSocket-Version";

type otherHeaderType =
  | "Alt-Svc"
  | "Alt-Used"
  | "Date"
  | "Link"
  | "Retry-After"
  | "Server-Timing"
  | "Service-Worker"
  | "Service-Worker-Allowed"
  | "SourceMap"
  | "Upgrade"
  | "Priority";

type attributeHeaderType =
  | "Attribution-Reporting-Eligible"
  | "Attribution-Reporting-Register-Source"
  | "Attribution-Reporting-Register-Trigger";

type clientHeaderType = "Accept-CH" | "Critical-CH";

type experimentalHeaderType =
  | "Accept-Signature"
  | "Early-Data"
  | "Set-Login"
  | "Signature"
  | "Signed-Headers"
  | "Speculation-Rules"
  | "Supports-Loading-Mode"
  | "Sec-CH-UA"
  | "Sec-CH-UA-Arch"
  | "Sec-CH-UA-Bitness"
  | "Sec-CH-UA-Form-Factor"
  | "Sec-CH-UA-Full-Version-List"
  | "Sec-CH-UA-Mobile"
  | "Sec-CH-UA-Model"
  | "Sec-CH-UA-Platform"
  | "Sec-CH-UA-Platform-Version"
  | "Sec-CH-UA-WoW64"
  | "Sec-CH-Prefers-Color-Scheme"
  | "Sec-CH-Prefers-Reduced-Motion"
  | "Sec-CH-Prefers-Reduced-Transparency"
  | "Device-Memory"
  | "Downlink"
  | "ECT"
  | "RTT"
  | "Save-Data"
  | "Sec-GPC"
  | "Origin-Agent-Cluster"
  | "NEL"
  | "Observe-Browsing-Topics"
  | "Sec-Browsing-Topics";

type nonstandardHeaderType =
  | "X-Forwarded-For"
  | "X-Forwarded-Host"
  | "X-Forwarded-Proto"
  | "X-DNS-Prefetch-Control"
  | "X-Robots-Tag";
