import { Application, Router, Status } from "oak.js";
const GITHUB_KEY = "ef879b5f60a060c100c99c24a02c659d541dd51f";
const router = new Router();
router.get("/", (ctx, _next) => {
    ctx.response.body = "Hi";
    ctx.response.type = "text/plain";
    ctx.response.status = Status.OK;
});
router.post("/gist", async (ctx, _next) => {
});
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: 8080 });
