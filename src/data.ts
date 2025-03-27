import { Expand, dataType, jsonObjType } from "./types";
export function spliceUrl(url: string, params: Expand<dataType>): string {
  params = typeof params === "object" ? toParams(params) : params;
  return `${url}${params ? `?${params}` : ""}`;
}

export function formatValueForFormData(value: any): string | Blob {
  if (
    typeof value === "string" ||
    value instanceof Blob ||
    value instanceof File
  ) {
    return value;
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

export async function progress(
  response: any,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const contentLength = response.headers.get("Content-Length");
  const contentDisposition = response.headers.get("Content-Disposition");
  const contentType = response.headers.get("Content-Type");

  if (!contentLength) {
    console.error("headers 中 Content-Length 字段未设置");
    throw new Error("Content-Length is required");
  }
  if (!contentType) {
    console.error("headers 中 Content-Type 字段未设置");
    throw new Error("Content-Type is required");
  }

  let fileName = "unknown";
  if (contentDisposition) {
    try {
      const filenameMatch = contentDisposition.match(/filename="?(.+?)"?/);
      if (filenameMatch && filenameMatch[1]) {
        fileName = filenameMatch[1].replace(/"/g, "");
      }
    } catch (error) {
      console.error("解析 Content-Disposition 失败:", error);
    }
  }

  const totalSize = parseInt(contentLength, 10);
  let loadedSize = 0;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];

  async function pump(): Promise<Blob> {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      chunks.push(value);
      loadedSize += value.length;

      const progress = Math.min(loadedSize / totalSize, 1);
      onProgress &&
        onProgress(
          progress === 1 ? progress : Math.floor(progress * 100) / 100
        );
    }

    const data = new Blob(chunks, { type: contentType });
    aDL(data, { name: fileName, type: contentType });
    return data;
  }

  return pump();
}

export function aDL(
  file: Blob | File,
  config: { type?: string; name?: string } = {}
): void {
  if (!(file instanceof Blob)) {
    console.error("参数 file 必须是 Blob 或 File 类型");
    return;
  }

  try {
    // 创建 Blob 对象（如果 file 不是 Blob 类型）
    const blob =
      toString.call(file) === "[object Blob]"
        ? file
        : new Blob([file], { type: file.type });

    // 生成文件名
    const fileName = generateFileName(file, config);

    // 创建下载链接
    createDownloadLink(blob, fileName);
  } catch (error) {
    console.error("文件下载失败:", error);
  }
}

// 文件名生成逻辑
function generateFileName(
  file: Blob | File,
  config: { type?: string; name?: string }
): string {
  const defaultName = `${new Date().toISOString().replace(/[:.]/g, "-")}.${
    (config.type || file.type).split("/")[1] || "unknown"
  }`;
  return config.name || (file instanceof File ? file.name : "") || defaultName;
}

// 创建下载链接
function createDownloadLink(blob: Blob, fileName: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    console.warn("无法在非浏览器环境中执行文件下载");
    return;
  }

  const eLink = document.createElement("a");
  eLink.download = fileName;
  eLink.style.display = "none";
  eLink.href = URL.createObjectURL(blob);

  document.body.appendChild(eLink);
  eLink.click();

  // 释放资源
  URL.revokeObjectURL(eLink.href);
  document.body.removeChild(eLink);
}

export function jsonToFile(
  obj: jsonObjType,
  fileName: string = "data.json"
): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    try {
      // 将 JSON 对象转换为字符串
      const jsonString = JSON.stringify(obj);

      // 创建 Blob 对象
      const blob = new Blob([jsonString], { type: "application/json" });

      // 转换为 File 对象
      const file = new File([blob], fileName, { type: "application/json" });

      resolve(file);
    } catch (error: Error | any) {
      // 捕获并记录详细错误信息
      console.error("JSON 转换为文件时发生错误:", error);
      reject(new Error(`JSON 转换失败: ${error.message}`));
    }
  });
}

export async function fileProgress(
  files: File | File[],
  onProgress?: (progress: { [s: string]: number }) => void
) {
  const fileProgressInfo: { [s: string]: number } = {};

  // 单个文件的上传逻辑
  async function pump(file: File, index: number = 0): Promise<void> {
    try {
      const reader = file.stream().getReader();
      const totalSize = file.size;
      let uploadedSize = 0;

      // 读取文件流并更新进度
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        uploadedSize += value?.byteLength || 0;
        const progress = Math.min(uploadedSize / totalSize, 1);
        fileProgressInfo[file.name || index] =
          progress === 1 ? progress : Math.floor(progress * 100) / 100;

        onProgress && onProgress(fileProgressInfo);
      }
    } catch (error) {
      console.error(`文件 ${file.name} 上传失败:`, error);
      fileProgressInfo[file.name || index] = -1; // 标记为失败
      onProgress && onProgress(fileProgressInfo);
    }
  }

  // 并发控制逻辑
  const filesArray = Array.isArray(files) ? files : [files];
  const concurrencyController = new PromiseConcurrentController(100);

  await Promise.all(
    filesArray.map((file, index) =>
      concurrencyController.add(() => pump(file, index))
    )
  );
}

// 并发控制器类
class PromiseConcurrentController {
  private queue: (() => Promise<any>)[] = [];
  private runningCount = 0;
  private maxConcurrency: number;

  constructor(maxConcurrency: number) {
    this.maxConcurrency = maxConcurrency;
  }

  public add(task: () => Promise<any>): Promise<any> {
    const promise = this.runTask(task);
    this.queue.push(() => promise);
    return promise;
  }

  private async runTask(task: () => Promise<any>): Promise<any> {
    const executeTask = async () => {
      this.runningCount++;
      try {
        return await task();
      } finally {
        this.runningCount--;
        this.processQueue();
      }
    };

    if (this.runningCount < this.maxConcurrency) {
      return executeTask();
    } else {
      return new Promise((resolve) => {
        this.queue.push(async () => {
          const result = await executeTask();
          resolve(result);
        });
        this.processQueue();
      });
    }
  }

  private processQueue() {
    if (this.queue.length > 0 && this.runningCount < this.maxConcurrency) {
      const nextTask = this.queue.shift();
      if (nextTask) {
        nextTask();
      }
    }
  }
}

export function toData<T extends Record<string, any>>(params: string): T {
  if (!params || params.indexOf("?") !== -1) {
    params = params.split("?")[1] || "";
  }

  // 将 prev 的类型显式定义为 Record<string, any>
  return params.split("&").reduce((prev: Record<string, any>, cur) => {
    if (!cur) return prev;

    const [key, value] = cur.split("=");
    if (key && value !== undefined) {
      try {
        // 尝试解析 JSON 格式的值
        prev[key] = JSON.parse(decodeURIComponent(value));
      } catch (e) {
        // 如果解析失败，则直接解码字符串
        prev[key] = decodeURIComponent(value);
      }
    }
    return prev;
  }, {} as Record<string, any>) as T; // 最终将结果转换回 T 类型
}

export function toParams<T extends Record<string, any>>(data: T): string {
  const esc = encodeURIComponent;

  return Object.entries(data)
    .flatMap(([key, value]) => {
      if (value === null || value === undefined) {
        return [];
      }

      // 处理数组类型
      if (Array.isArray(value)) {
        return value.map((item, index) => {
          const itemValue =
            typeof item === "object" && item !== null
              ? JSON.stringify(item)
              : item;
          return `${esc(key)}[${index}]=${esc(itemValue)}`;
        });
      }

      // 处理对象类型
      if (typeof value === "object" && value !== null) {
        return Object.entries(value).map(([nestedKey, nestedValue]) => {
          const itemValue =
            nestedValue !== null && typeof nestedValue === "object"
              ? JSON.stringify(nestedValue)
              : nestedValue;
          return `${esc(key)}[${esc(nestedKey)}]=${esc(
            safeStringify(itemValue)
          )}`;
        });
      }

      // 处理普通值
      const strValue =
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : value;
      return [`${esc(key)}=${esc(strValue)}`];
    })
    .join("&");
}

function safeStringify(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function formData<T extends Record<string, any>>(data: T): FormData {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value instanceof Blob || value instanceof File) {
      formData.append(key, value);
    }
    // 处理数组类型
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.keys(item).forEach((nestedKey) => {
            if (item[nestedKey] != null) {
              // 确保 item 是对象类型
              formData.append(
                `${key}[${index}].${nestedKey}`,
                formatValueForFormData(item[nestedKey])
              );
            }
          });
        } else {
          formData.append(`${key}[${index}]`, formatValueForFormData(item));
        }
      });
    }
    // 处理对象类型
    else if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((nestedKey) => {
        if (value[nestedKey] != null) {
          // 确保 value 是对象类型
          formData.append(
            `${key}[${nestedKey}]`,
            formatValueForFormData(value[nestedKey])
          );
        }
      });
    }
    // 处理普通值
    else if (value != null) {
      formData.append(key, formatValueForFormData(value));
    }
  });

  return formData;
}

export function isJSON(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    // 转换出错，抛出异常
    return false;
  }
  return true;
}

export default {
  spliceUrl,
  formatValueForFormData,
  toData,
  toParams,
  formData,
  progress,
  aDL,
  isJSON,
  fileProgress,
};
