import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const db = env.DB;
  const form = await context.request.formData();
  const seasonId = Number(form.get("season"));
  if (seasonId) {
    await db.prepare("UPDATE roster_entries SET published = 1 WHERE season_id = ?1").bind(seasonId).run();
  }
  return context.redirect(`/admin/roster-generator?season=${seasonId}`);
};
