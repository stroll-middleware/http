// Response.headers: 只读 包含此 Response 所关联的 Headers 对象。
// Response.ok: 只读 包含了一个布尔值，标示该 Response 成功（HTTP 状态码的范围在 200-299）。
// Response.redirected: 只读 表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目。
// Response.status: 只读 包含 Response 的状态码（例如 200 表示成功）。
// Response.statusText: 只读 包含了与该 Response 状态码一致的状态信息（例如，OK 对应 200）。
// Response.type: 只读 包含 Response 的类型（例如，basic、cors）。
// Response.url: 只读 包含 Response 的 URL。
// Response.useFinalURL: 包含了一个布尔值，来标示这是否是该 Response 的最终 URL。
// Response.body: 只读 一个简单的 getter，用于暴露一个 ReadableStream 类型的 body 内容。
// Response.bodyUsed: 只读 包含了一个布尔值来标示该 Response 是否读取过 Body。
// response.headers: 只读 包含与响应关联的Headers对象

// Response.clone() 创建一个 Response 对象的克隆。
// Response.error() 返回一个绑定了网络错误的新的 Response 对象。
// Response.redirect() 用另一个 URL 创建一个新的 Response。
// Response.bytes() 它返回一个使用Blob解析的 promise。
// Response..arrayBuffer() 读取 Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 ArrayBuffer 格式的 Promise 对象。
// Response..blob() 读取 Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 Blob 格式的 Promise 对象。
// Response..formData() 读取Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 FormData 格式的 Promise 对象。
// Response..json() 读取 Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 JSON 格式的 Promise 对象。
// Response..text() 读取 Response 对象并且将它设置为已读（因为 Responses 对象被设置为了 stream 的方式，所以它们只能被读取一次），并返回一个被解析为 USVString 格式的 Promise 对象。
