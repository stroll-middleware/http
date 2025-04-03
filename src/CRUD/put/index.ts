// 用有效载荷请求替换目标资源的所有当前表示
import { spliceUrl } from '../../data';
import {
  Expand,
  bodyType,
  configType,
  dataType,
  jsonArrType,
  jsonObjType,
} from '../../types'

export function PUT (
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
  config.method = "PUT"
  
  return this.request(config, true)
}

export default PUT;
