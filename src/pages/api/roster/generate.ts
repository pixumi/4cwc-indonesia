import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

const STARTER_COUNT = 6;

export const POST: APIRoute = async (context) => {
  // Defence in depth: middleware already gates /api/*, but an endpoint that can
  // write to the database should not rely on a single check somewhere else.
  if (context.locals.user?.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const db = env.DB;
  const form = await context.request.formData();
  const seasonId = Number(form.get("season"));
  if (!seasonId) return context.redirect("/admin/roster-generator");

  const players = (await db.prepare("SELECT id FROM players").all()).results as { id: number }[];

  const scoreInserts = [];
  const averages: { playerId: number; average: number }[] = [];

  for (const p of players) {
    const scores: number[] = [];
    for (let session = 1; session <= 3; session++) {
      const raw = form.get(`score_${p.id}_${session}`);
      if (raw === null || raw === "") continue;
      const value = Number(raw);
      if (!Number.isFinite(value)) continue;
      scores.push(value);
      scoreInserts.push(
        db
          .prepare("INSERT INTO practice_scores (season_id, player_id, session_no, score) VALUES (?1, ?2, ?3, ?4)")
          .bind(seasonId, p.id, session, value),
      );
    }
    if (scores.length > 0) {
      averages.push({ playerId: p.id, average: scores.reduce((a, b) => a + b, 0) / scores.length });
    }
  }

  averages.sort((a, b) => b.average - a.average);

  const rosterInserts = averages.map((a, index) =>
    db
      .prepare(
        `INSERT INTO roster_entries (season_id, player_id, status, position, average_score, published)
         VALUES (?1, ?2, ?3, ?4, ?5, 0)`,
      )
      .bind(seasonId, a.playerId, index < STARTER_COUNT ? "starter" : "substitute", index + 1, a.average),
  );

  await db.batch([
    db.prepare("DELETE FROM practice_scores WHERE season_id = ?1").bind(seasonId),
    ...scoreInserts,
    db.prepare("DELETE FROM roster_entries WHERE season_id = ?1").bind(seasonId),
    ...rosterInserts,
  ]);

  return context.redirect(`/admin/roster-generator?season=${seasonId}`);
};
