import { Hono } from "hono";
import { handle } from "hono/vercel";
import { comics } from "./comics";

const app = new Hono()
  .get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }))
  .route("/comics", comics);

export type AppType = typeof app;

const handler = handle(app);

export { handler as GET, handler as POST };
