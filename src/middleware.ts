import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { getSessionUser } from "./lib/db";
import { SESSION_COOKIE } from "./lib/auth";
import { DEFAULT_LANG, LANG_COOKIE, isLang, useTranslations, type Lang } from "./lib/i18n";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login"]);

/** The only API routes reachable without a session. */
const PUBLIC_API_PATHS = new Set(["/api/login"]);
/** API routes any signed-in user may call; everything else needs an admin. */
const ANY_USER_API_PATHS = new Set(["/api/logout"]);

/**
 * Headers applied to every response. These are the parts of "hardening" that
 * actually hold: they constrain what the browser will execute, embed and leak.
 * They cannot stop someone editing the DOM in their own devtools — nothing can,
 * and such edits are local to that person's browser and never reach the server.
 * What protects the data is the authorization check below plus server-side
 * validation, not hiding anything from the client.
 */
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    // Inline styles are used throughout the markup; scripts stay first-party.
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://a.ppy.sh https://assets.ppy.sh https://flagcdn.com",
    "connect-src 'self'",
    "upgrade-insecure-requests",
  ].join("; "),
};

function withSecurityHeaders(res: Response): Response {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!res.headers.has(k)) res.headers.set(k, v);
  }
  return res;
}

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

    // Default-deny for the API surface. Individual routes may still check their
    // own requirements, but a new endpoint is protected the moment it is added
    // rather than only when someone remembers to guard it.
    if (pathname.startsWith("/api/") && !PUBLIC_API_PATHS.has(pathname)) {
      const needsAdmin = !ANY_USER_API_PATHS.has(pathname);
      const allowed = needsAdmin ? user?.role === "admin" : !!user;
      if (!allowed) {
        return withSecurityHeaders(
          new Response(JSON.stringify({ error: "forbidden" }), {
            status: user ? 403 : 401,
            headers: { "content-type": "application/json; charset=utf-8" },
          }),
        );
      }
    }

    return withSecurityHeaders(await next());
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("[4cwc] request failed", pathname, message);
    return withSecurityHeaders(errorPage(lang, isSchemaError(err) ? "db" : "generic", message, 500));
  }
});
