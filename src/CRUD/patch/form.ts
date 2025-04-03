// 用于对资源应用部分修改
import {
  Expand,
  bodyType,
  configType,
  DelType,
  dataType,
} from '../../types'
import {formData, spliceUrl} from '../../data'

export function PATCHFORM (
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
  config.method = 'PATCH'
  return this.request(config, true)
}

export default PATCHFORM;

