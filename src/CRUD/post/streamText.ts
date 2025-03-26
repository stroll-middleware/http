import {
  Expand,
  bodyType,
  configType,
  dataType,
  jsonArrType,
  jsonObjType,
} from '../../types'
import {spliceUrl} from '../../data'

export async function POSTSTREAMTEXT (
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
  listeners: (res: {data: string, text: string}) => void
) {
  config.url = params ? spliceUrl(url, params) : url;
  config.body = body && typeof body !== 'string' ? JSON.stringify(body) : body;
  config.method = "POST"
  
  try {
    const response = await this.request(config)
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let partialData = '';

    function readStream() {
      return reader.read().then(({ done, value }: any) => {
        if (done) {
          console.log('Stream complete');
          return;
        }
        const text = decoder.decode(value, { stream: true });
        partialData += text;
        listeners({ data: partialData,text: partialData })
        return readStream();
      });
    }

    return readStream().catch((error: any) => {
      console.error('错误读取流：', error);
      return error;
    });
  } catch (error) {
    return error;
  }
}

export default POSTSTREAMTEXT;