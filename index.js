import Axios from 'axios'

class NewAxios {
  async constructor(config) {
    this.config = config || {}
    this.instance = await Axios.create({})
    this.lineUp = []
    await this.interceptors()
  }

  async reset (options) {
    await Object.assign(this.config, options)
    return await this.interceptors()
  }

  async interceptors () {
    return new Promise(res => {
      this.instance.interceptors.request.use(async config => {
        this.config.reqFn && await this.config.reqFn(config)
        return config
      }, err => Promise.reject(err))
    
      this.instance.interceptors.response.use(async response => {
        this.config.resFn && await this.config.resFn(response)
        return response
      }, err => Promise.reject(err))

      res(true)
    }).catch(err => {
      console.log(err)
      return err
    })
  }

  /**
   * 
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
   */
  api (obj) {
    obj = obj || {}
    const { method = 'get', timeout = 3000, baseURL = '', withCredentials = false, headers = {}, data = {}, params = {}, wait = [] } = this.config
    return new Promise((resolve, reject) => {
      instance({
        baseURL: obj.baseURL || baseURL,
        withCredentials: obj.withCredentials || withCredentials,
        method: obj.method || method,
        url: obj.url || url,
        timeout: obj.timeout || timeout,
        headers: obj.headers || headers, // header体
        data: obj.data || data, // body参数
        params: obj.params || params //  URL参数
      }).then(data => {
        if (res) {
          res(resolve, data)
        } else {
          resolve(data)
        }
      }).catch(err => {
        if (rej) {
          rej(reject, err)
        } else {
          reject(err)
        }
        return err
      })
    })
  }
}

export default NewAxios
