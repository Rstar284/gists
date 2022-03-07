import {
  Application,
  Context,
  Router,
  Status,
} from "https://deno.land/x/oak@v10.2.0/mod.ts";

const GITHUB_KEY = Deno.env.get("GITHUB_KEY") || "";
const GITHUB_ID = Deno.env.get("GITHUB_ID") || "";
const DISCORD_KEY = Deno.env.get("DISCORD_KEY") || "";
const DISCORD_ID = Deno.env.get("DISCORD_ID") || "";

if (!GITHUB_KEY) {
  console.error("GITHUB_KEY not found");
  Deno.exit(1);
}

if (!GITHUB_ID) {
  console.error("GITHUB_ID not found");
  Deno.exit(1);
}

if(!DISCORD_KEY) {
    console.error("DISCORD_KEY not found");
    Deno.exit(1);
}

if(!DISCORD_ID) {
    console.error("DISCORD_ID not found");
    Deno.exit(1);
}


const router = new Router();

router.get("/", (ctx: Context, _next) => {
  ctx.response.redirect("https://youtube.com/watch?v=dQw4w9WgXcQ");
  ctx.response.status = Status.PermanentRedirect;
});

router.get("/gh", async (ctx: Context) => {
  const code = ctx.request.url.searchParams.get("code");
  if (!code) {
    ctx.response.status = Status.BadRequest;
    return;
  }
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_ID,
        client_secret: GITHUB_KEY,
        code: code,
        redirect_uri: ctx.request.url.searchParams.get("uri"),
      }),
    });
    if (res.status !== 200) {
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = "Error getting access token, Error: " +
        res.statusText;
      return;
    }
    const json = await res.json();
    ctx.response.body = json.access_token;
    ctx.response.type = "text/plain";
    ctx.response.status = Status.OK;
  } catch (e) {
    ctx.response.status = Status.InternalServerError;
    ctx.response.body = e;
    console.error(e);
    return;
  }
});

router.get("/discord", async (ctx: Context) => {
  const code = ctx.request.url.searchParams.get("code");
  if (!code) {
    ctx.response.status = Status.BadRequest;
    return;
  }
  try {
    const res = await fetch("https://discord.com/api/v9/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        client_id: DISCORD_ID,
        client_secret: GITHUB_KEY,
        code: code,
        grant_type: "authorization_code",
      }),
    });
    if (res.status !== 200) {
      ctx.response.status = Status.InternalServerError;
      ctx.response.body = "Error getting access token, Error: " +
        res.statusText;
      return;
    }
    const json = await res.json();
    ctx.response.body = json.access_token;
    ctx.response.type = "text/plain";
    ctx.response.status = Status.OK;
  } catch (e) {
    ctx.response.status = Status.InternalServerError;
    ctx.response.body = e;
    console.error(e);
    return;
  }
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port }) => {
  console.log(`Listening on ${hostname}:${port}`);
});

app.listen({ port: 8080 });
