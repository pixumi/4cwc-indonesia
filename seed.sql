-- Optional demo/historical seed data. Not part of schema.sql.
-- Run only if you want the 2022 season pre-filled:
--   npx wrangler d1 execute 4cwc-db --remote --file=./seed.sql

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
