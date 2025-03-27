import {
  Expand,
  bodyType,
  configType,
  dataType,
  jsonArrType,
  jsonObjType,
} from "../../types";
import { spliceUrl, isJSON } from "../../data";
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
    body?: Expand<bodyType> | jsonArrType | jsonObjType;
    config?: Expand<configType>;
  },
  listeners: (res: any) => void
) {
  if (body) {
    throw new Error("GET请求不允许有body参数");
  }
  config.url = params ? spliceUrl(url, params) : url;
  config.method = "GET";
  if (!config.headers) {
    config.headers = {};
  }
  // 创建中止控制器
  const controller = new AbortController();
  config.signal = controller.signal;
  // 发起 fetch 请求
  const response = await this.request(config)
  return new Promise(async (resolve, reject) => {
    const textArr: string[] = []
    // 创建读取器
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // 持续读取流数据
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
          response.textArr = textArr
          resolve(response)
          controller.abort('请求结束');
          break;
        }
        
        // 解析数据块
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
            try {
                let event = line.replace('data: ', '');
                if(isJSON(event)){
                  event = JSON.parse(event)
                }
                textArr.push(event)
                listeners && listeners(event)
            } catch (e) {
              reject({mag:'解析错误:', e});
            }
        }
    }
  });
}

export default GETSTREAMTEXT;
