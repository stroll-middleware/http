// 请求一个与 GET 请求的响应相同的响应，但没有响应体
import { spliceUrl } from '../data';
import {
  Expand,
  configType,
  dataType,
} from '../types'

export function HEAD (
  this: any,
  {
    url,
    params,
    config = {}
  }: {
    url: string;
    params?: Expand<dataType>;
    config?: Expand<configType>
  },
) {
  url = params ? spliceUrl(url, params) : url;
  config.method = 'HEAD'
  
  return this.request(url, config)
}

export default HEAD;
