import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  // Defence in depth: middleware already gates /api/*, but an endpoint that can
  // write to the database should not rely on a single check somewhere else.
  if (context.locals.user?.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const db = env.DB;
  const form = await context.request.formData();
  const seasonId = Number(form.get("season"));
  if (seasonId) {
    await db.prepare("UPDATE roster_entries SET published = 1 WHERE season_id = ?1").bind(seasonId).run();
  }
  return context.redirect(`/admin/roster-generator?season=${seasonId}`);
};
