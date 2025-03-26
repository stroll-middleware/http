import { Expand, bodyType, configType, dataType, jsonArrType, jsonObjType } from "../../types";
import {spliceUrl} from "../../data";
export async function GETSTREAMTEXT(
  this: any,
  {
    url,
    params,
    body,
    config = {},
  }: {
    url: string;
    params?: Expand<dataType>;
    body?: Expand<bodyType>|jsonArrType|jsonObjType;
    config?: Expand<configType>;
  },
  listeners:(res: {data: string, text: string}) => void
) {
  if(body){
    throw new Error('GET请求不允许有body参数')
  }
  config.url = params ? spliceUrl(url, params) : url;
  config.method = "GET"
  if (!config.headers) {
    config.headers = {}
  }
  config.headers["Content-Type"] = 'application/octet-stream'
  url = `${config.baseURL}${config.url}`
  const response: any = await fetch('http://localhost:6060/stream', config as any);
  const reader = response.body.getReader();
  let partialData = '';

  function readStream() {
    return reader.read().then(({ done, value }: any) => {
      if (done) {
        return;
      }
      partialData += value;
      console.log(value)
      listeners({ data: partialData, text: value }) // 确保 listeners 回调函数能够正确接收到数据
      return readStream();
    }).catch((error: any) => {
      console.error('错误读取流：', error);
      return error;
    });
  }

  readStream();
}

export default GETSTREAMTEXT;