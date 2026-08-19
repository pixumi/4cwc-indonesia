CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
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
  result_note TEXT
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
  position INTEGER,
  average_score REAL,
  published INTEGER NOT NULL DEFAULT 0,
  UNIQUE(season_id, player_id)
);

-- Real public tournament record (osu.ppy.sh wiki, 4CWC 2022): Indonesia beat
-- Sweden 5-0 in Round of 16, then lost to South Korea 3-6 in the Quarterfinals.
INSERT OR IGNORE INTO seasons (year, label, result, result_note) VALUES
  (2022, '4CWC 2022', 'Perempat Final', 'Ro16: menang atas Swedia 5-0 · Perempat Final: kalah dari Korea Selatan 3-6');

INSERT OR IGNORE INTO players (username) VALUES
  ('Kinora'), ('Mixuri'), ('ARTPHONEY'), ('Execration-'), ('dalyz'), ('Foranex');

INSERT OR IGNORE INTO roster_entries (season_id, player_id, status, position, published)
SELECT
  (SELECT id FROM seasons WHERE year = 2022),
  p.id,
  'starter',
  ROW_NUMBER() OVER (ORDER BY p.username),
  1
FROM players p
WHERE p.username IN ('Kinora', 'Mixuri', 'ARTPHONEY', 'Execration-', 'dalyz', 'Foranex');
