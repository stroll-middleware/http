// 用有效载荷请求替换目标资源的所有当前表示
import { formData, spliceUrl } from "../../data";
import { DelType, Expand, bodyType, configType, dataType } from "../../types";

export function PUTFORM(
  this: any,
  {
    url,
    params,
    body,
    config = {}
  }: {
    url: string;
    params?: Expand<dataType>;
    body: DelType<bodyType, "string" | "null">;
    config?: Expand<configType>
  },
) {
  url = params ? spliceUrl(url, params) : url;
  config.body = formData(body);
  config.method = "PUT";
  return this.request(url, config);
}

export default PUTFORM;
