# axios 二次封装
  相同错误处理   配合message回调使用 相同错误抛出一次  
  防抖          相同的接口一定时间里只触发第一次
  通用方法        Request
  get url传参     GetByUrl
  post url传参    PostByUrl
  get body传参    GetByBody
  post body传参   PostByBody

## 安装

```js
npm i @stroll/axios

```
## 引入
```js
import axios from '@stroll/axios'
// 声明实例并初始化参数
const Axios = new axios({
  baseURL: 'https://api.***.com', // String 域名 必传参数
  url: '/getUserInfo', // String 请求路径 必传参数(初始化可不传)
  method: 'get' | 'post' | 'put' | 'delete' | ..., // String 请求方式 可选参数 默认get
  timeout: 3000, // Number 请求超时 单位毫秒 可选参数 默认3秒
  isAntiShake: true, // 防抖开关
  antiShakeTime: null, // 防抖时间，需打开isAntiShake， 默认使用timeout
  withCredentials: true | false, // Boolean 是否允许携带凭证 可选参数 默认true
  headers: {}, // Json header体 可选参数 默认为空
  data: {}, // Json|Number|String|Array body体 可选参数 默认为空
  params: {}, // Json URL参数 可选参数 默认为空
  message: null, // 错误处理（需打开prompt）
  reqFn: (config) => {}, // 函数 请求前拦截 参数config
  resFn: (response) => {}, // 函数 响应后拦截 参数response
  // 未实现
  await: [{ method: '请求方式', url: '请求路径' } | '请求路径'], // Array[{Json}|String] 需要同步的接口 方式为可选参数，路径为必传参数
})
```
## 通用调用
```js
Axios.Request({
  url: '/getUserInfo', // String 请求路径 必传参数
  withCredentials: true | false, // Boolean 是否允许携带凭证 可选参数 默认true
  method: 'get' | 'post' | 'put' | 'delete' | ..., // String 请求方式 可选参数 默认get
  timeout: 3000, // Number 请求超时 单位毫秒 可选参数 默认3秒
  headers: {}, // Json header体 可选参数 默认为空
  data: {}, // Json|Number|String|Array body体 可选参数 默认为空
  params: {}, // Json URL参数 可选参数 默认为空
}).then(res => {
  // 成功回调
}).catch(err => {
  // 失败回调
})
```

## get方式URL传参
```js
Axios.GetByUrl(
  url, // 请求路径
  params, //  URL参数
  prompt, // 是否关闭提示
  timeout // 请求超时
)
```

## post方式URL传参
```js
Axios.PostByUrl(
  url, // 请求路径
  params, //  URL参数
  prompt, // 是否关闭提示
  timeout // 请求超时
)
```
## get方式body传参
```js
Axios.GetByBody(
  url, // 请求路径
  data, // body参数
  prompt, // 是否关闭提示
  timeout // 请求超时
)
```

## post方式body传参
```js
Axios.PostByBody(
  url, // 请求路径
  data, // body参数
  prompt,
  timeout // 请求超时
)
```
