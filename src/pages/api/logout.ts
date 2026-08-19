import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { deleteSession } from "../../lib/db";
import { SESSION_COOKIE } from "../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const db = env.DB;
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  if (token) await deleteSession(db, token);
  context.cookies.delete(SESSION_COOKIE, { path: "/" });
  return context.redirect("/");
};
