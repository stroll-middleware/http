// 用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用
import {
  Expand,
  bodyType,
  configType,
  dataType,
  jsonArrType,
  jsonObjType,
} from '../../types'
import {progress, spliceUrl} from '../../data'

export async function POSTDL (
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
  onProgress?: (progress: number) => void
) {
  
  config.url = params ? spliceUrl(url, params) : url;
  config.body = body && typeof body !== 'string' ? JSON.stringify(body) : body;
  config.method = "POST";
  return this.request(config).then(
    (response: {
      headers: { get: (arg0: string) => any };
      body: { getReader: () => any };
      fileData: any
    }) => {
      response.fileData = progress(response, onProgress)
      return response;
    }
  );
}

export default POSTDL;
