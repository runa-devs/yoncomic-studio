import { comics } from "@/app/api/[[...route]]/comics";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono()
  .basePath("/api")
  .get("health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }))
  .route("comics", comics);

export type AppType = typeof app;

const handler = handle(app);

export { handler as GET, handler as POST };
