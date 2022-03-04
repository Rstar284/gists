import { Application, Router, Status } from "oak.js";
const GITHUB_KEY = "YOUR_GITHUB_API_KEY";
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
