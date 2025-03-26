// 请求一个指定资源的表示形式，使用 GET 的请求应该只被用于获取数据
import { Expand, bodyType, configType, dataType, jsonArrType, jsonObjType } from "../../types";
import {spliceUrl} from "../../data";
export function GET(
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
  if(body){
    throw new Error('GET请求不允许有body参数')
  }
  config.url = params ? spliceUrl(url, params) : url;
  config.method = "GET"
  return this.request(config)
}

export default GET;
