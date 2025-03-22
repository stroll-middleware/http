/** 响应头信息
 * - Date	日期	响应生成的日期和时间。例如：Wed, 18 Apr 2024 12:00:00 GMT
 * - Server	服务器	服务器软件的名称和版本。例如：Apache/2.4.1 (Unix)
 * - Content-Type	内容类型	响应体的媒体类型（MIME类型），如text/html; charset=UTF-8, application/json等。
 * - Content-Length	内容长度	响应体的大小，单位是字节。例如：3145
 * - Content-Encoding	内容编码	响应体的压缩编码，如 gzip, deflate等。
 * - Content-Language	内容语言	响应体的语言。例如：zh-CN
 * - Content-Location	内容位置	响应体的 URI。例如：/index.html
 * - Content-Range	内容范围	响应体的字节范围，用于分块传输。例如：bytes 0-999/8000
 * - Cache-Control	缓存控制	控制响应的缓存行为, 如 no-cache 表示必须重新请求。
 * - Connection	连接	管理连接的选项，如keep-alive或close，keep-alive 表示连接不会在传输后关闭。。
 * - Set-Cookie	设置 Cookie	设置客户端的 cookie。例如：sessionId=abc123; Path=/; Secure
 * - Expires	过期时间	响应体的过期日期和时间。例如：Thu, 18 Apr 2024 12:00:00 GMT
 * - Last-Modified	最后修改时间	资源最后被修改的日期和时间。例如：Wed, 18 Apr 2024 11:00:00 GMT
 * - ETag	实体标签	资源的特定版本的标识符。例如："33a64df551425fcc55e6"
 * - Location	位置	用于重定向的 URI。例如：/newresource
 * - Pragma	实现特定的指令	包含实现特定的指令，如 no-cache。
 * - WWW-Authenticate	认证信息	认证信息，通常用于HTTP认证。例如：Basic realm="Access to the site"
 * - Accept-Ranges	接受范围	指定可接受的请求范围类型。例如：bytes
 * - Age	经过时间	响应生成后经过的秒数，从原始服务器生成到代理服务器。例如：24
 * - Allow	允许方法	列出资源允许的 HTTP 方法 。例如：GET, POST，HEAD等
 * - Vary	变化	告诉下游代理如何使用响应头信息来确定响应是否可以从缓存中获取。例如：Accept
 * - Strict-Transport-Security	严格传输安全	指示浏览器仅通过 HTTPS 与服务器通信。例如：max-age=31536000; includeSubDomains
 * - X-Frame-Options	框架选项	控制页面是否允许在框架中显示，防止点击劫持攻击。例如：SAMEORIGIN
 * - X-Content-Type-Options	内容类型选项	指示浏览器不要尝试猜测资源的 MIME 类型。例如：nosniff
 * - X-XSS-Protection	XSS保护	控制浏览器的 XSS 过滤和阻断。例如：1; mode=block
 * - Public-Key-Pins	公钥固定	HTTP 头信息，用于HTTP公共密钥固定（HPKP），一种安全机制，用于防止中间人攻击。例如：pin-sha256="base64+primarykey"; pin-sha256="base64+backupkey"; max-age=expireTime
 */
/** Content-Type 常用类型
 * @param {string} "text/html" ： HTML格式
 * @param {string} "text/plain" ：纯文本格式
 * @param {string} "text/xml" ： XML格式
 * @param {string} "image/gif" ：gif图片格式
 * @param {string} "image/jpeg" ：jpg图片格式
 * @param {string} "image/png" ：png图片格式
 * @param {string} "application/xhtml+xml" ：XHTML格式
 * @param {string} "application/xml" ： XML数据格式
 * @param {string} "application/atom+xml" ：Atom XML聚合格式
 * @param {string} "application/json" ： JSON数据格式
 * @param {string} "application/pdf" ：pdf格式
 * @param {string} "application/msword" ： Word文档格式
 * @param {string} "application/octet-stream" ：二进制流数据（如常见的文件下载）
 * @param {string} "multipart/form-data" 表示表单数据,也可上传文件
 * application/x-www-form-urlencoded; charset=utf-8
 */
