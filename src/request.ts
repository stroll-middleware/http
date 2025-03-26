import { configType, Expand } from "./types";

// 提取公共逻辑：生成请求唯一标识
function generateReqKey(input: any, config: any): string {
  return `${input}${JSON.stringify(config.params)}${JSON.stringify(config.body)}`;
}

// 提取公共逻辑：清理取消标记
function clearCancelMark(this: any, reqKey: string, signal?: string) {
  if (this.requestList[reqKey]) {
    delete this.requestList[reqKey];
  } else if (signal && this.cancelMark[signal]) {
    delete this.cancelMark[signal];
  }
}

export async function REQUEST(
  this: any,
  init: Expand<configType> = {},
  listeners?: Function
) {
  // 初始化控制器和配置
  const controller = new AbortController();
  let config = this.initConfig(init as any);

  // 生成请求唯一标识
  const reqKey = generateReqKey(config.url, config);

  // 检查是否存在重复请求
  if (this.requestList[reqKey]) {
    console.error('重复请求');
    return ;
  }

  // 设置信号
  const signal = config.signal;
  if (signal) {
    this.cancelMark[signal] = this.cancelMark[signal] || [];
    this.cancelMark[signal].push(controller);
  } else {
    this.requestList[reqKey] = true;
  }
  config.signal = controller.signal;

  // 超时处理
  let timeout: any;
  if (config.timeout) {
    timeout = setTimeout(() => {
      controller.abort('请求超时');
      clearCancelMark.call(this, reqKey, signal);
    }, config.timeout);
  }

  // 基础 URL 处理
  if (config.baseURL) {
    config.url = `${config.baseURL}${config.url}`;
  }

  // 请求拦截器
  if (this.config.requestInterceptors) {
    const requestInterceptors = this.config.requestInterceptors(config);
    config = requestInterceptors || config;
  }
  if (this.interceptRequest) {
    const requestInterceptors = this.requestInterceptors(config);
    config = requestInterceptors || config;
  }

  return new Promise((resolve, reject) => {
    fetch(config.url, config as any).then(async (response: any) => {
      listeners && await listeners(response)
      let data = await response.text()
      if(data){
        if (isJSON(data)) {
          data = JSON.parse(data);
        }
      }
      response.data = data
      if (this.config.responseInterceptors) {
        response = this.config.responseInterceptors(response) || response;
      }
      if (this.responseInterceptors) {
        response = this.responseInterceptors(response) || response;
      }
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        this.config.onError && this.config.onError(response);
        this.errorListener && this.errorListener(response);
        if(!this.config.onError && !this.errorListener) {
          reject(response);
        }
      }
    }).catch((err)=>{
      this.config.onError && this.config.onError(err);
      this.errorListener && this.errorListener(err);
      console.error(err)
      return err;
    }).finally(() => {
      clearTimeout(timeout);
      clearCancelMark.call(this, reqKey, signal);
    })
  })
}

export async function CANCEL(this: any, mark: string|string[]): Promise<boolean> {
  let successCount = 0;
  const marks = Array.isArray(mark) ? mark : [mark];

  for (const m of marks) {
    const cancelMark = this.cancelMark[m];
    if (!cancelMark) continue; // 如果不存在该标记，跳过

    for (const key in cancelMark) {
      cancelMark[key].abort(`手动取消了标记 ${m} 请求`); // 执行取消操作
      successCount++; // 成功计数
      delete cancelMark[key];
    }

    if (Object.keys(cancelMark).length === 0) {
      delete this.cancelMark[m]; // 清理空的信号标记
    }
  }

  return successCount > 0; // 返回是否成功取消了任何请求
}

function isJSON(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    // 转换出错，抛出异常
    return false;
  }
  return true;
}
export default REQUEST;
