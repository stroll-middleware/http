// 用有效载荷请求替换目标资源的所有当前表示
import { formData, fileProgress, spliceUrl } from "../../data";
import { DelType, Expand, bodyType, configType, dataType } from "../../types";

export function PUTFILEFORM(
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
    config?: Expand<configType>;
  },
  onProgress?: (progress: {[s: string]:number}) => void
) {
  config.url = params ? spliceUrl(url, params) : url;
  config.method = "PUT";
  config.body = formData(body);
  if (onProgress) {
    const fileArr: File[] = []
    Object.values(body).forEach((val) => {
      if (Array.isArray(val)) {
        val.forEach((item) => {
          if (item instanceof File) {
            fileArr.push(item);
          }
        })
      } else if (val instanceof File) {
        fileArr.push(val);
      }
    })
    
    fileProgress(fileArr, onProgress);
  }
  return this.request(config);
}

export default PUTFILEFORM;
