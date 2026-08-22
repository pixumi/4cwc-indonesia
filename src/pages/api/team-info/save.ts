import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

function str(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}
function intOrNull(form: FormData, key: string): number | null {
  const v = str(form, key);
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

const KINDS = new Set(["note", "link", "contact"]);
const VISIBILITY = new Set(["roster", "admin"]);

export const POST: APIRoute = async (context) => {
  if (context.locals.user?.role !== "admin") return new Response("Forbidden", { status: 403 });

  const db = env.DB;
  const form = await context.request.formData();
  const action = str(form, "action");

  if (action === "delete") {
    const id = intOrNull(form, "id");
    if (id) await db.prepare("DELETE FROM team_info WHERE id = ?1").bind(id).run();
    return context.redirect("/admin/team-info");
  }

  const label = str(form, "label");
  const value = str(form, "value");
  if (!label || !value) return context.redirect("/admin/team-info?error=required");

  const kind = KINDS.has(str(form, "kind")) ? str(form, "kind") : "note";
  const visibleTo = VISIBILITY.has(str(form, "visible_to")) ? str(form, "visible_to") : "roster";
  const seasonId = intOrNull(form, "season_id");
  const sortOrder = intOrNull(form, "sort_order") ?? 0;
  const id = intOrNull(form, "id");

  if (id) {
    await db
      .prepare(
        `UPDATE team_info SET season_id=?1, kind=?2, label=?3, value=?4, visible_to=?5, sort_order=?6 WHERE id=?7`,
      )
      .bind(seasonId, kind, label, value, visibleTo, sortOrder, id)
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO team_info (season_id, kind, label, value, visible_to, sort_order)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)`,
      )
      .bind(seasonId, kind, label, value, visibleTo, sortOrder)
      .run();
  }

  return context.redirect("/admin/team-info");
};
