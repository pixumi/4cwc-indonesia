import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}
function nullable(form: FormData, key: string): string | null {
  const v = str(form, key);
  return v === "" ? null : v;
}
function intOrNull(form: FormData, key: string): number | null {
  const v = str(form, key);
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

const STATUSES = new Set(["scheduled", "live", "done"]);

export const POST: APIRoute = async (context) => {
  if (context.locals.user?.role !== "admin") return new Response("Forbidden", { status: 403 });

  const db = env.DB;
  const form = await context.request.formData();
  const action = str(form, "action");

  if (action === "delete") {
    const id = intOrNull(form, "id");
    if (id) await db.prepare("DELETE FROM matches WHERE id = ?1").bind(id).run();
    return context.redirect("/admin/matches");
  }

  const seasonId = intOrNull(form, "season_id");
  const round = str(form, "round");
  const opponent = str(form, "opponent");
  if (!seasonId || !round || !opponent) return context.redirect("/admin/matches?error=required");

  const status = STATUSES.has(str(form, "status")) ? str(form, "status") : "scheduled";
  const scheduledAt = nullable(form, "scheduled_at");
  const scoreUs = intOrNull(form, "score_us");
  const scoreThem = intOrNull(form, "score_them");
  const mpLink = nullable(form, "mp_link");
  const notes = nullable(form, "notes");
  const sortOrder = intOrNull(form, "sort_order") ?? 0;
  const id = intOrNull(form, "id");

  if (id) {
    await db
      .prepare(
        `UPDATE matches SET season_id=?1, round=?2, opponent=?3, scheduled_at=?4, status=?5,
         score_us=?6, score_them=?7, mp_link=?8, notes=?9, sort_order=?10 WHERE id=?11`,
      )
      .bind(seasonId, round, opponent, scheduledAt, status, scoreUs, scoreThem, mpLink, notes, sortOrder, id)
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO matches (season_id, round, opponent, scheduled_at, status, score_us, score_them, mp_link, notes, sort_order)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`,
      )
      .bind(seasonId, round, opponent, scheduledAt, status, scoreUs, scoreThem, mpLink, notes, sortOrder)
      .run();
  }

  return context.redirect("/admin/matches");
};
