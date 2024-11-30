import { Hono } from "hono";

export const manga = new Hono();

export type AppType = typeof manga;
