import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const db = env.DB;
  const form = await context.request.formData();
  const username = String(form.get("username") ?? "").trim();
  const seasonId = form.get("season");

  if (username) {
    await db.prepare("INSERT OR IGNORE INTO players (username) VALUES (?1)").bind(username).run();
  }

  const redirectTo = seasonId ? `/admin/roster-generator?season=${seasonId}` : "/admin/roster-generator";
  return context.redirect(redirectTo);
};
