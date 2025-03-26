// 用于对资源应用部分修改
import {
  Expand,
  bodyType,
  configType,
  dataType,
  jsonArrType,
  jsonObjType,
} from '../../types'
import { spliceUrl } from '../../data'

export function PATCH (
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
  config.method = 'PATCH'
  
  return this.request(config)
}

export default PATCH;
