import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { getSessionUser } from "./lib/db";
import { SESSION_COOKIE } from "./lib/auth";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);
  const db = env.DB;
  const token = context.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? await getSessionUser(db, token) : null;
  context.locals.user = user;

  const isAdminRoute = pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.has(pathname);
  const isDashboardRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isAdminRoute && user?.role !== "admin") {
    return context.redirect(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }
  if (isDashboardRoute && !user) {
    return context.redirect(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }

  return next();
});
