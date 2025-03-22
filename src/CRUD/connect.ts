// 建立一个到由目标资源标识的服务器的隧道
import { spliceUrl } from '../data';
import {
  Expand,
  configType,
  dataType,
} from '../types'

export function CONNECT (
  this: any,
  {
    url,
    params,
    config = {}
  }: {
    url: string|URL;
    params?: Expand<dataType>;
    config?: Expand<configType>;
  },
  listener: (data: MessageEvent<any>) => void
) {
  url = params ? spliceUrl(url as string, params) : url;
  config.method = "CONNECT"
  if (config.baseURL) {
    url = `${config.baseURL}${url}`;
  }
  return new Promise((resolve, reject) => {
    const eventSource: EventSource = new EventSource(url)
    
    eventSource.onopen = () => {
      resolve(eventSource)
    }
    eventSource.onerror = (event) => {
      reject(event)
    }
    eventSource.onmessage = (event) => {
      listener && listener(event)
    }
  })
}

export default CONNECT;
