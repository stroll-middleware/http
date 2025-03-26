import Koa from "koa";
import Router from "koa-router";
import fs from "fs";
import path from "path";
import {PassThrough} from "stream";

const app = new Koa();
const router = new Router();

// 使用路由器中间件
app.use(router.routes()).use(router.allowedMethods());

router.get("/test", async (ctx) => {
  const { query } = ctx;
  let { text } = query;
  text = text ?? decodeURI(ctx.querystring);
  ctx.status = 200;
  ctx.body = { data: 'text' };
});

// 新增路由：发送 ArrayBuffer 文件
router.get("/arraybuffer", async (ctx) => {
  const filePath = path.join(__dirname, "example.mp4"); // 修改文件名为视频文件
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    );
    ctx.set("Content-Type", "video/mp4"); // 修改 Content-Type 为视频类型
    ctx.body = arrayBuffer;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

// 新增路由：返回数据流
router.get("/stream", async (ctx) => {
  const text = "This is a stream of data from Koa, similar to DeepSeek.";
  const chunkSize = 1; // 每次发送3个字节

  ctx.set({
    'Content-Type': 'application/octet-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const ss = new PassThrough();
  ctx.body = ss;
  // 使用定时器来模拟任务
  for (let i = 0; i < text.length; i += chunkSize) {
    try {// 模拟延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const val = text.slice(i, i + chunkSize)
      console.log('val', val)
      ss.push(val);
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: "Internal Server Error" };
      return;
    }
  }
});

const hostname = "127.0.0.1";
const port = 6060;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});