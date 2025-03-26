// 沿着到目标资源的路径执行一个消息环回测试
import { spliceUrl } from '../data';
import {
  Expand,
  bodyType,
  configType,
  dataType,
  jsonArrType,
  jsonObjType,
} from '../types'

export function TRACE (
  this: any,
  {
    url,
    params,
    body,
    config = {}
  }: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType>|jsonArrType|jsonObjType;
    config?: Expand<configType>;
  },
) {
  config.url = params ? spliceUrl(url, params) : url;
  config.body = (body && typeof body !== 'string') ? JSON.stringify(body) : body;
  config.method = 'TRACE'
  
  return this.request(config)
}

export default TRACE;
