export interface SessionUser {
  userId: number;
  role: "admin" | "player";
  displayName: string;
  playerId: number | null;
}

export async function createSession(db: D1Database, userId: number, token: string, days: number): Promise<void> {
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  await db
    .prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?1, ?2, ?3)")
    .bind(token, userId, expiresAt)
    .run();
}

export async function getSessionUser(db: D1Database, token: string): Promise<SessionUser | null> {
  const row = await db
    .prepare(
      `SELECT u.id as userId, u.role as role, u.display_name as displayName, u.player_id as playerId
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?1 AND s.expires_at > datetime('now')`,
    )
    .bind(token)
    .first<SessionUser>();
  return row ?? null;
}

export async function deleteSession(db: D1Database, token: string): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE token = ?1").bind(token).run();
}
