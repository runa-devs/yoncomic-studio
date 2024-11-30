import { Hono } from "hono";

export const comics = new Hono();

export type AppType = typeof comics;
