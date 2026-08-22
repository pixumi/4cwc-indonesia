import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { getSessionUser } from "./lib/db";
import { SESSION_COOKIE } from "./lib/auth";
import { DEFAULT_LANG, LANG_COOKIE, isLang, useTranslations, type Lang } from "./lib/i18n";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

/** Looks like "no such table: x" / "D1_ERROR" — i.e. the schema was never run. */
function isSchemaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /no such table|no such column|D1_ERROR/i.test(msg);
}

function errorPage(lang: Lang, kind: "db" | "generic", detail: string, status: number): Response {
  const t = useTranslations(lang);
  const body = `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${t("err.title")} · 4CWC Indonesia</title>
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
        background: #0b0b10; color: #ecebf2; padding: 32px;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
      }
      .box { max-width: 560px; }
      h1 { font-size: 24px; font-weight: 600; margin: 0 0 14px; }
      p { font-size: 15px; line-height: 1.65; color: #a5a3b5; margin: 0 0 18px; }
      pre {
        background: #15151d; border: 1px solid #262633; border-radius: 10px; padding: 14px;
        font-size: 12.5px; color: #8f8da3; overflow-x: auto; white-space: pre-wrap; word-break: break-word;
      }
      a { color: #e8b866; }
    </style>
  </head>
  <body>
    <div class="box">
      <h1>${t("err.title")}</h1>
      <p>${kind === "db" ? t("err.db") : t("err.generic")}</p>
      <pre>${detail.replace(/[<&]/g, (c) => (c === "<" ? "&lt;" : "&amp;"))}</pre>
      <p><a href="/">${t("err.back")}</a></p>
    </div>
  </body>
</html>`;
  return new Response(body, { status, headers: { "content-type": "text/html; charset=utf-8" } });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const { pathname } = url;

  // --- language resolution: ?lang= wins, then cookie, then default ---
  const queryLang = url.searchParams.get("lang");
  const cookieLang = context.cookies.get(LANG_COOKIE)?.value;
  let lang: Lang = DEFAULT_LANG;
  if (isLang(queryLang)) {
    lang = queryLang;
    context.cookies.set(LANG_COOKIE, lang, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60,
    });
  } else if (isLang(cookieLang)) {
    lang = cookieLang;
  }
  context.locals.lang = lang;
  context.locals.t = useTranslations(lang);

  try {
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

    return await next();
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[4cwc] request failed", pathname, message);
    return errorPage(lang, isSchemaError(err) ? "db" : "generic", message, 500);
  }
});
