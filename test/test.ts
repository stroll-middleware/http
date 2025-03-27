import Koa from "koa";
import Router from "koa-router";
import {PassThrough} from "stream";
import cors from "koa2-cors";

const app = new Koa();
const router = new Router();
app.use(cors());
// 使用路由器中间件
app.use(router.routes()).use(router.allowedMethods());

// 修改路由：发送流式数据
router.get("/stream", async (ctx) => {
  // 设置流式响应头
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  // 模拟的对话数据
  const responseText = [
    "你好！我是 DeepSeek 的智能助手。\n",
    "我正在分析您的问题...\n",
    "根据现有数据，建议如下：\n",
    "1. 首先检查网络连接\n",
    "2. 验证 API 密钥有效性\n",
    "3. 查看服务状态面板\n",
    "\n需要更详细的帮助吗？"
  ];
  const stream = new PassThrough();
  ctx.status = 200;

  for (let i = 0; i < responseText.length; i++) {
    const content = responseText[i]
    setTimeout(() => {
      stream.write(
        `${JSON.stringify({
          id: i + 1,
          content,
          length: responseText.length
        })}\n`
      );
      if (i === responseText.length - 1) {
        stream.end();
      }
    }, i * 1000);
  }
  ctx.body = stream;

  // 处理客户端断开连接
  ctx.req.on("close", () => {
    console.log("客户端断开连接");
    ctx.res.end();
  });
});


const hostname = "127.0.0.1";
const port = 6060;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});