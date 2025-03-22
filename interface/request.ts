// Request.body: 只读 主体内容的 ReadableStream。
// Request.bodyUsed: 只读 存储 true 或 false，以指示请求是否仍然未被使用。
// Request.cache: 只读 包含请求的缓存模式（例如，default、reload、no-cache）。
// Request.credentials: 只读 包含请求的凭据（例如，omit、same-origin、include）。默认是 same-origin。
// Request.destination: 只读 返回一个描述请求的目的字符串。这是一个字符串，指示所请求的内容类型。
// Request.headers: 只读 包含请求相关联的 Headers 对象。
// Request.integrity: 只读 包含请求的子资源完整性值（例如 sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=）。
// Request.isHistoryNavigation: 只读 布尔值，表示请求是否为历史导航。
// Request.method: 只读 包含请求的方法（GET、POST 等）。
// Request.mode: 只读 包含请求的模式（例如，cors、no-cors、same-origin、navigate）。
// Request.redirect: 只读 包含如何处理重定向的模式。它可能是 follow、error 或 manual 之一。
// Request.referrer: 只读 包含请求的 referrer（例如，client）。
// Request.referrerPolicy: 只读 包含请求的 referrer 策略（例如，no-referrer）。
// Request.signal: 只读 返回与请求相关联的 AbortSignal。
// Request.url: 只读 包含请求的 URL。
// Request.keepalive: 一个布尔值，表示请求的 keepalive 状态

// Request.arrayBuffer() 返回 promise，其兑现值为请求主体的 ArrayBuffer 表示形式。
// Request.blob() 返回 promise，其兑现值为请求主体的 Blob 表示形式。
// request.bytes() 返回 promise，其兑现值为请求主体经过 Uint8Array 解析的结果。
// Request.clone() 创建一个当前 Request 对象的副本。
// Request.formData() 返回 promise，其兑现值为请求主体的 FormData 表示形式。
// Request.json() 返回 promise，其兑现值为请求主体经过 JSON 解析的结果。
// Request.text() 返回 promise，其兑现值为请求主体的文本表示形式。
