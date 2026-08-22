CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  osu_id INTEGER,
  cover_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'player')),
  display_name TEXT NOT NULL,
  player_id INTEGER REFERENCES players(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS seasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL UNIQUE,
  label TEXT NOT NULL,
  result TEXT,
  result_note TEXT,
  seed TEXT,
  record TEXT,
  source_url TEXT
);

CREATE TABLE IF NOT EXISTS practice_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  season_id INTEGER NOT NULL REFERENCES seasons(id),
  player_id INTEGER NOT NULL REFERENCES players(id),
  session_no INTEGER NOT NULL,
  score REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS roster_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  season_id INTEGER NOT NULL REFERENCES seasons(id),
  player_id INTEGER NOT NULL REFERENCES players(id),
  status TEXT NOT NULL DEFAULT 'starter' CHECK (status IN ('starter', 'substitute')),
  is_captain INTEGER NOT NULL DEFAULT 0,
  position INTEGER,
  average_score REAL,
  published INTEGER NOT NULL DEFAULT 0,
  UNIQUE(season_id, player_id)
);

CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  season_id INTEGER NOT NULL REFERENCES seasons(id),
  round TEXT NOT NULL,
  opponent TEXT NOT NULL,
  scheduled_at TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'done')),
  score_us INTEGER,
  score_them INTEGER,
  mp_link TEXT,
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_matches_season ON matches(season_id, sort_order, scheduled_at);

CREATE TABLE IF NOT EXISTS team_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  season_id INTEGER REFERENCES seasons(id),
  kind TEXT NOT NULL DEFAULT 'note' CHECK (kind IN ('note', 'link', 'contact')),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  visible_to TEXT NOT NULL DEFAULT 'roster' CHECK (visible_to IN ('roster', 'admin')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_team_info_season ON team_info(season_id, sort_order);
