// 用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用
import {
  DelType,
  Expand,
  bodyType,
  configType,
  dataType,
} from '../../types'
import {formData, spliceUrl} from '../../data'

export function POSTFORM (
  this: any,
  {
    url,
    params,
    body,
    config = {}
  }: {
    url: string;
    params?: Expand<dataType>;
    body: DelType<bodyType, 'string'|'null'>;
    config?: Expand<configType>;
  },
) {
  config.url = params ? spliceUrl(url, params) : url;
  config.body = formData(body);
  config.method = "POST"
  
  return this.request(config)
}

export default POSTFORM;
