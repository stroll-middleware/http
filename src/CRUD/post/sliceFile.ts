// 大文件分片上传
import { Expand, configType, dataType } from "../../types";
import { spliceUrl } from "../../data";
import md5 from "@stroll/data/dist/md5";

export async function POSTSLICEFILE(
  this: any,
  {
    url,
    params,
    body,
    config = {},
  }: {
    url: string;
    params?: Expand<dataType>;
    body: {
      file: File;
      chunkSize?: number;
      passedBlocks?: number[];
      needBlock?: number[];
    };
    config?: Expand<configType>;
  },
  onProgress?: Function
) {
  config.url = params ? spliceUrl(url, params) : url;
  config.method = "POST";

  const { file, chunkSize = 1024 * 1024 * 2, passedBlocks, needBlock } = body;
  const totalChunks = Math.ceil(file.size / chunkSize);
  const uploadPromises: Promise<Response>[] = [];
  let count: number = 0;
  const md5AllChunk = md5(await file.text());
  for (let i = 0; i < totalChunks; i++) {
    if (
      (passedBlocks && passedBlocks.length && passedBlocks.includes(i)) ||
      (needBlock && needBlock.length && !needBlock.includes(i))
    ) {
      continue;
    }

    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    const md5Chunk = md5(await chunk.text());
    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("fileName", file.name);
    formData.append("fileType", file.type);
    formData.append("chunkIndex", `${i}`);
    formData.append("totalChunks", `${totalChunks}`);
    formData.append("md5", md5Chunk);
    formData.append("md5All", md5AllChunk);

    config.body = formData;
    uploadPromises.push(this.request(config, true).then((response: Response) => {
      if (onProgress) {
        count++;
        const progress = count/totalChunks;
        onProgress(progress === 1 ? progress : Math.floor(progress * 100) / 100)
      }
      return response;
    }));
  }

  return Promise.allSettled(uploadPromises);
}

export default POSTSLICEFILE;
