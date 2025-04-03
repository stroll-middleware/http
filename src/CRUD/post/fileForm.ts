// 用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用
import {
  DelType,
  Expand,
  bodyType,
  configType,
  dataType,
} from '../../types'
import {fileProgress, formData, spliceUrl} from '../../data'

export async function POSTFILEFORM (
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
  onProgress?: (progress: { [s: string]: number; }) => void
) {
  config.url = params ? spliceUrl(url, params) : url;
  config.method = "POST";
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
  return this.request(config, true);
}

export default POSTFILEFORM;
