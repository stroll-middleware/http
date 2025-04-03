// 请求一个指定资源的表示形式，使用 GET 的请求应该只被用于获取数据
import { Expand, configType, dataType, bodyType, jsonArrType, jsonObjType } from "../../types";
import { spliceUrl, progress } from "../../data";

// 封装 URL 拼接逻辑
function buildRequestUrl(url: string, params?: Expand<dataType>): string {
  return params ? spliceUrl(url, params) : url;
}

export async function GETDL(
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
): Promise<Response> {
  if(body){
    throw new Error('GET请求不允许有body参数')
  }
  // 构建完整 URL
  config.url = buildRequestUrl(url, params);

  // 设置默认请求方法
  config.method = "GET";

  // 发起请求并处理响应
  return this.request(config).then((response: Response&{fileData: any}) => {
    try {
      response.fileData = progress(response, onProgress)
      return response;
    } catch (error) {
      console.error("错误处理响应随进度的响应:", error);
      throw error; // 重新抛出错误以便调用方处理
    }
  });
}


export default GETDL
