// 用于描述目标资源的通信选项
import { spliceUrl } from '../data';
import {
  Expand,
  bodyType,
  configType,
  dataType,
  jsonArrType,
  jsonObjType,
} from '../types'

export function OPTIONS (
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
  config.body = body && typeof body !== 'string' ? JSON.stringify(body) : body;
  config.method = 'OPTIONS'
  
  return this.request(config)
}

export default OPTIONS;
