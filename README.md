# axios
axios

## 安装

```js
npm i @stroll/axios

```
## 引入
```js
import axios from '@stroll/axios'
// 声明实例并初始化参数
const Axios = new axios({
  * @param { baseURL: 'https://api.***.com' } String 域名 必传参数
  * @param { url: '/getUserInfo' } String 请求路径 必传参数
  * @param { withCredentials: true | false } Boolean 是否允许携带凭证 可选参数 默认true
  * @param { method: 'get' | 'post' | 'put' | 'delete' | ... } String 请求方式 可选参数 默认get
  * @param { timeout: 3000 } Number 请求超时 单位毫秒 可选参数 默认3秒
  * @param { headers: {} } Json header体 可选参数 默认为空
  * @param { data: {} } Json|Number|String|Array body体 可选参数 默认为空
  * @param { params: {} } Json URL参数 可选参数 默认为空
  * @param { reqFn: (config) => {} } 函数 请求前拦截 参数config
  * @param { resFn: (response) => {} } 函数 响应后拦截 参数response
  * @param { res: (res) => {} } 函数 请求成功处理 回传参数res
  * @param { rej: (err) => {} } 函数 请求失败处理 回传参数err
  * @param { wait: [{ method: 请求方式, url: 请求路径 }] } Array 需要同步的接口 方式为可选参数，路径为必传参数
})
// 调用
Axios.api({
  * @param { baseURL: 'https://api.***.com' } String 域名 必传参数
  * @param { url: '/getUserInfo' } String 请求路径 必传参数
  * @param { withCredentials: true | false } Boolean 是否允许携带凭证 可选参数 默认true
  * @param { method: 'get' | 'post' | 'put' | 'delete' | ... } String 请求方式 可选参数 默认get
  * @param { timeout: 3000 } Number 请求超时 单位毫秒 可选参数 默认3秒
  * @param { headers: {} } Json header体 可选参数 默认为空
  * @param { data: {} } Json|Number|String|Array body体 可选参数 默认为空
  * @param { params: {} } Json URL参数 可选参数 默认为空
  * @param { reqFn: (config) => {} } 函数 请求前拦截 参数config
  * @param { resFn: (response) => {} } 函数 响应后拦截 参数response
  * @param { res: (res) => {} } 函数 请求成功处理 回传参数res
  * @param { rej: (err) => {} } 函数 请求失败处理 回传参数err
  * @param { wait: [{ method: 请求方式, url: 请求路径 }] } Array 需要同步的接口 方式为可选参数，路径为必传参数
}).then(res => {}).catch(err => {})

// 重置初始参数
Axios.reset({
  * @param { baseURL: 'https://api.***.com' } String 域名 必传参数
  * @param { url: '/getUserInfo' } String 请求路径 必传参数
  * @param { withCredentials: true | false } Boolean 是否允许携带凭证 可选参数 默认true
  * @param { method: 'get' | 'post' | 'put' | 'delete' | ... } String 请求方式 可选参数 默认get
  * @param { timeout: 3000 } Number 请求超时 单位毫秒 可选参数 默认3秒
  * @param { headers: {} } Json header体 可选参数 默认为空
  * @param { data: {} } Json|Number|String|Array body体 可选参数 默认为空
  * @param { params: {} } Json URL参数 可选参数 默认为空
  * @param { reqFn: (config) => {} } 函数 请求前拦截 参数config
  * @param { resFn: (response) => {} } 函数 响应后拦截 参数response
  * @param { res: (res) => {} } 函数 请求成功处理 回传参数res
  * @param { rej: (err) => {} } 函数 请求失败处理 回传参数err
  * @param { wait: [{ method: 请求方式, url: 请求路径 }] } Array 需要同步的接口 方式为可选参数，路径为必传参数
})

```