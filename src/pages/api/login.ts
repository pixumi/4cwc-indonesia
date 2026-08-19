import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { verifyPassword, generateSessionToken, SESSION_COOKIE, SESSION_DAYS } from "../../lib/auth";
import { createSession } from "../../lib/db";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const db = env.DB;
  const form = await context.request.formData();
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "");

  const user = await db
    .prepare("SELECT id, password_hash, password_salt, role FROM users WHERE username = ?1")
    .bind(username)
    .first<{ id: number; password_hash: string; password_salt: string; role: string }>();

  if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
    return context.redirect("/admin/login?error=1");
  }

  const token = generateSessionToken();
  await createSession(db, user.id, token, SESSION_DAYS);

  context.cookies.set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  const fallback = user.role === "admin" ? "/admin/roster-generator" : "/dashboard";
  const safeNext = next.startsWith("/") ? next : fallback;
  return context.redirect(safeNext);
};
