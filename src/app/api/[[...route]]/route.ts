import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

export type AppType = typeof app;

export { handle as GET, handle as POST };
