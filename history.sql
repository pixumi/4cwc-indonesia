-- =============================================================================
-- 4CWC Team Indonesia - historical record, 2021-2024.
--
-- Sources (read from the raw source, not from summaries):
--   2021  https://osu.ppy.sh/wiki/en/Tournaments/4CWC/2021
--   2022  https://osu.ppy.sh/wiki/en/Tournaments/4CWC/2022
--   2023  https://wybin.xyz/4cwc23  (placement cross-checked on challonge.com/4cwc23)
--   2024  https://wybin.xyz/4cwc24  (placement cross-checked on challonge.com/4CWC24/standings)
--
-- There was no official 4CWC in 2025, so no 2025 season row exists.
-- Scores are always written from Indonesia's point of view.
-- Idempotent: safe to re-run.
-- =============================================================================

-- ---------- seasons ----------
INSERT INTO seasons (year, label, result, result_note, seed, record, source_url) VALUES
  (2021, '4CWC 2021', 'Juara 1', 'Menyapu bersih seluruh babak tanpa kekalahan dan menjadi juara dunia.', '#3 (37 poin)', '6-0', 'https://osu.ppy.sh/wiki/en/Tournaments/4CWC/2021'),
  (2022, '4CWC 2022', 'Perempat Final', 'Kalah di Ro32 dari Belanda, bangkit mengalahkan Swedia di Ro16, lalu tersingkir oleh Korea Selatan.', '#19 (150 poin)', '1-2', 'https://osu.ppy.sh/wiki/en/Tournaments/4CWC/2022'),
  (2023, '4CWC 2023', 'Peringkat 4', 'Melaju sampai babak Final lower bracket sebelum dihentikan Thailand.', NULL, '5-2', 'https://wybin.xyz/4cwc23/home'),
  (2024, '4CWC 2024', 'Juara 3', 'Melaju lewat lower bracket sampai Grand Final lower bracket, kalah 5-7 dari Tiongkok sehingga finis di peringkat 3.', NULL, '6-2', 'https://wybin.xyz/4cwc24/home')
ON CONFLICT(year) DO UPDATE SET
  label=excluded.label, result=excluded.result, result_note=excluded.result_note,
  seed=excluded.seed, record=excluded.record, source_url=excluded.source_url;

-- ---------- players ----------
INSERT OR IGNORE INTO players (username) VALUES
  ('ARTPHONEY'),
  ('BitDust'),
  ('Copano_Lucky'),
  ('Execration-'),
  ('Foranex'),
  ('Honkenway'),
  ('Kinora'),
  ('Mixuri'),
  ('Nomiru'),
  ('Nyeko Kawaii'),
  ('Reid Hezzel'),
  ('Reissfelt'),
  ('Ruu'),
  ('Shierii'),
  ('Zvenx'),
  ('dalyz');

-- ---------- roster (position 1 = captain) ----------
DELETE FROM roster_entries WHERE season_id IN (SELECT id FROM seasons WHERE year BETWEEN 2021 AND 2024);
INSERT INTO roster_entries (season_id, player_id, status, is_captain, position, published) VALUES
  ((SELECT id FROM seasons WHERE year=2021), (SELECT id FROM players WHERE username='Reid Hezzel'), 'starter', 1, 1, 1),
  ((SELECT id FROM seasons WHERE year=2021), (SELECT id FROM players WHERE username='Reissfelt'), 'starter', 0, 2, 1),
  ((SELECT id FROM seasons WHERE year=2021), (SELECT id FROM players WHERE username='Zvenx'), 'starter', 0, 3, 1),
  ((SELECT id FROM seasons WHERE year=2021), (SELECT id FROM players WHERE username='Nyeko Kawaii'), 'starter', 0, 4, 1),
  ((SELECT id FROM seasons WHERE year=2021), (SELECT id FROM players WHERE username='Ruu'), 'starter', 0, 5, 1),
  ((SELECT id FROM seasons WHERE year=2021), (SELECT id FROM players WHERE username='BitDust'), 'starter', 0, 6, 1),
  ((SELECT id FROM seasons WHERE year=2022), (SELECT id FROM players WHERE username='Kinora'), 'starter', 1, 1, 1),
  ((SELECT id FROM seasons WHERE year=2022), (SELECT id FROM players WHERE username='Mixuri'), 'starter', 0, 2, 1),
  ((SELECT id FROM seasons WHERE year=2022), (SELECT id FROM players WHERE username='ARTPHONEY'), 'starter', 0, 3, 1),
  ((SELECT id FROM seasons WHERE year=2022), (SELECT id FROM players WHERE username='Execration-'), 'starter', 0, 4, 1),
  ((SELECT id FROM seasons WHERE year=2022), (SELECT id FROM players WHERE username='dalyz'), 'starter', 0, 5, 1),
  ((SELECT id FROM seasons WHERE year=2022), (SELECT id FROM players WHERE username='Foranex'), 'starter', 0, 6, 1),
  ((SELECT id FROM seasons WHERE year=2023), (SELECT id FROM players WHERE username='Honkenway'), 'starter', 1, 1, 1),
  ((SELECT id FROM seasons WHERE year=2023), (SELECT id FROM players WHERE username='Nomiru'), 'starter', 0, 2, 1),
  ((SELECT id FROM seasons WHERE year=2023), (SELECT id FROM players WHERE username='Copano_Lucky'), 'starter', 0, 3, 1),
  ((SELECT id FROM seasons WHERE year=2023), (SELECT id FROM players WHERE username='dalyz'), 'starter', 0, 4, 1),
  ((SELECT id FROM seasons WHERE year=2023), (SELECT id FROM players WHERE username='Mixuri'), 'starter', 0, 5, 1),
  ((SELECT id FROM seasons WHERE year=2023), (SELECT id FROM players WHERE username='Shierii'), 'starter', 0, 6, 1),
  ((SELECT id FROM seasons WHERE year=2024), (SELECT id FROM players WHERE username='Nomiru'), 'starter', 1, 1, 1),
  ((SELECT id FROM seasons WHERE year=2024), (SELECT id FROM players WHERE username='ARTPHONEY'), 'starter', 0, 2, 1),
  ((SELECT id FROM seasons WHERE year=2024), (SELECT id FROM players WHERE username='dalyz'), 'starter', 0, 3, 1),
  ((SELECT id FROM seasons WHERE year=2024), (SELECT id FROM players WHERE username='Execration-'), 'starter', 0, 4, 1),
  ((SELECT id FROM seasons WHERE year=2024), (SELECT id FROM players WHERE username='Honkenway'), 'starter', 0, 5, 1),
  ((SELECT id FROM seasons WHERE year=2024), (SELECT id FROM players WHERE username='Mixuri'), 'starter', 0, 6, 1);

-- ---------- matches ----------
DELETE FROM matches WHERE season_id IN (SELECT id FROM seasons WHERE year BETWEEN 2021 AND 2024);
INSERT INTO matches (season_id, round, opponent, scheduled_at, status, score_us, score_them, mp_link, notes, sort_order) VALUES
  ((SELECT id FROM seasons WHERE year=2021), 'Round of 32', 'Vietnam', '2021-10-10', 'done', 5, 0, 'https://osu.ppy.sh/community/matches/92197906', NULL, 1),
  ((SELECT id FROM seasons WHERE year=2021), 'Round of 16', 'Poland', '2021-10-17', 'done', 5, 1, 'https://osu.ppy.sh/community/matches/92542396', NULL, 2),
  ((SELECT id FROM seasons WHERE year=2021), 'Perempat Final', 'Taiwan', '2021-10-23', 'done', 6, 3, 'https://osu.ppy.sh/community/matches/92824642', NULL, 3),
  ((SELECT id FROM seasons WHERE year=2021), 'Semifinal', 'Philippines', '2021-10-30', 'done', 6, 0, 'https://osu.ppy.sh/community/matches/93203260', NULL, 4),
  ((SELECT id FROM seasons WHERE year=2021), 'Final', 'Sweden', '2021-11-07', 'done', 7, 1, 'https://osu.ppy.sh/community/matches/93609785', NULL, 5),
  ((SELECT id FROM seasons WHERE year=2021), 'Grand Final', 'Germany', '2021-11-14', 'done', 7, 1, 'https://osu.ppy.sh/community/matches/93933227', 'Laga penentu gelar juara.', 6),
  ((SELECT id FROM seasons WHERE year=2022), 'Round of 32', 'Netherlands', '2022-08-05', 'done', 0, 5, 'https://osu.ppy.sh/community/matches/102835585', NULL, 1),
  ((SELECT id FROM seasons WHERE year=2022), 'Round of 16', 'Sweden', '2022-08-13', 'done', 5, 0, 'https://osu.ppy.sh/community/matches/103040057', 'Lower bracket.', 2),
  ((SELECT id FROM seasons WHERE year=2022), 'Perempat Final', 'South Korea', '2022-08-20', 'done', 3, 6, 'https://osu.ppy.sh/community/matches/103206106', 'Tersingkir di babak ini.', 3),
  ((SELECT id FROM seasons WHERE year=2023), 'Round of 32', 'Brazil', '2023-08-06T12:00', 'done', 5, 2, 'https://osu.ppy.sh/community/matches/109864842', NULL, 1),
  ((SELECT id FROM seasons WHERE year=2023), 'Round of 16', 'Germany', '2023-08-13T14:00', 'done', 5, 2, 'https://osu.ppy.sh/community/matches/109975612', NULL, 2),
  ((SELECT id FROM seasons WHERE year=2023), 'Perempat Final', 'United States', '2023-08-20T02:30', 'done', 2, 6, 'https://osu.ppy.sh/community/matches/110077569', NULL, 3),
  ((SELECT id FROM seasons WHERE year=2023), 'Semifinal', 'France', '2023-08-27T12:00', 'done', 6, 2, 'https://osu.ppy.sh/community/matches/110189592', NULL, 4),
  ((SELECT id FROM seasons WHERE year=2023), 'Semifinal', 'China', '2023-08-27T14:00', 'done', 6, 0, 'https://osu.ppy.sh/community/matches/110191233', NULL, 5),
  ((SELECT id FROM seasons WHERE year=2023), 'Final', 'South Korea', '2023-09-02T11:30', 'done', 7, 5, 'https://osu.ppy.sh/community/matches/110280983', NULL, 6),
  ((SELECT id FROM seasons WHERE year=2023), 'Final', 'Thailand', '2023-09-03T13:00', 'done', 6, 7, 'https://osu.ppy.sh/community/matches/110299819', 'Kekalahan penutup langkah di peringkat 4.', 7),
  ((SELECT id FROM seasons WHERE year=2024), 'Round of 32', 'France', '2024-08-25T13:00', 'done', 5, 0, 'https://osu.ppy.sh/community/matches/115228621', NULL, 1),
  ((SELECT id FROM seasons WHERE year=2024), 'Round of 16', 'Oceania', '2024-09-01T12:30', 'done', 5, 1, 'https://osu.ppy.sh/community/matches/115324539', NULL, 2),
  ((SELECT id FROM seasons WHERE year=2024), 'Perempat Final', 'Germany', '2024-09-08T13:30', 'done', 3, 6, 'https://osu.ppy.sh/community/matches/115416499', NULL, 3),
  ((SELECT id FROM seasons WHERE year=2024), 'Semifinal', 'Singapore', '2024-09-14T13:00', 'done', 6, 0, 'https://osu.ppy.sh/community/matches/115488340', NULL, 4),
  ((SELECT id FROM seasons WHERE year=2024), 'Semifinal', 'Argentina', '2024-09-15T14:00', 'done', 6, 0, 'https://osu.ppy.sh/community/matches/115505381', NULL, 5),
  ((SELECT id FROM seasons WHERE year=2024), 'Final', 'Chile', '2024-09-20T14:00', 'done', NULL, NULL, NULL, 'Menang WBD (win by default) - lawan tidak hadir, tidak ada match yang dimainkan.', 6),
  ((SELECT id FROM seasons WHERE year=2024), 'Final', 'Germany', '2024-09-22T14:00', 'done', 7, 3, 'https://osu.ppy.sh/community/matches/115592921', NULL, 7),
  ((SELECT id FROM seasons WHERE year=2024), 'Grand Final (Lower Bracket)', 'China', '2024-10-05T13:30', 'done', 5, 7, 'https://osu.ppy.sh/community/matches/115744635', 'Kalah di Grand Final lower bracket. Pemenangnya lanjut memperebutkan juara 1 melawan pemenang upper bracket.', 8);
