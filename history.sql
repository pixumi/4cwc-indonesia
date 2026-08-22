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
INSERT INTO matches (season_id, round, opponent, scheduled_at, status, bracket, indo_side, score_us, score_them, mp_link, notes, sort_order) VALUES
  ((SELECT id FROM seasons WHERE year=2021), 'Round of 32', 'Vietnam', '2021-10-10', 'done', 'upper', 1, 5, 0, 'https://osu.ppy.sh/community/matches/92197906', NULL, 1),
  ((SELECT id FROM seasons WHERE year=2021), 'Round of 16', 'Poland', '2021-10-17', 'done', 'upper', 1, 5, 1, 'https://osu.ppy.sh/community/matches/92542396', NULL, 2),
  ((SELECT id FROM seasons WHERE year=2021), 'Perempat Final', 'Taiwan', '2021-10-23', 'done', 'upper', 1, 6, 3, 'https://osu.ppy.sh/community/matches/92824642', NULL, 3),
  ((SELECT id FROM seasons WHERE year=2021), 'Semifinal', 'Philippines', '2021-10-30', 'done', 'upper', 2, 6, 0, 'https://osu.ppy.sh/community/matches/93203260', NULL, 4),
  ((SELECT id FROM seasons WHERE year=2021), 'Final', 'Sweden', '2021-11-07', 'done', 'upper', 2, 7, 1, 'https://osu.ppy.sh/community/matches/93609785', NULL, 5),
  ((SELECT id FROM seasons WHERE year=2021), 'Grand Final', 'Germany', '2021-11-14', 'done', 'grand', 2, 7, 1, 'https://osu.ppy.sh/community/matches/93933227', 'Laga penentu gelar juara.', 6),
  ((SELECT id FROM seasons WHERE year=2022), 'Round of 32', 'Netherlands', '2022-08-05', 'done', 'upper', 2, 0, 5, 'https://osu.ppy.sh/community/matches/102835585', NULL, 1),
  ((SELECT id FROM seasons WHERE year=2022), 'Round of 16', 'Sweden', '2022-08-13', 'done', 'lower', 2, 5, 0, 'https://osu.ppy.sh/community/matches/103040057', NULL, 2),
  ((SELECT id FROM seasons WHERE year=2022), 'Perempat Final', 'South Korea', '2022-08-20', 'done', 'lower', 2, 3, 6, 'https://osu.ppy.sh/community/matches/103206106', 'Tersingkir di babak ini.', 3),
  ((SELECT id FROM seasons WHERE year=2023), 'Round of 32', 'Brazil', '2023-08-06T12:00', 'done', 'upper', 1, 5, 2, 'https://osu.ppy.sh/community/matches/109864842', NULL, 1),
  ((SELECT id FROM seasons WHERE year=2023), 'Round of 16', 'Germany', '2023-08-13T14:00', 'done', 'upper', 1, 5, 2, 'https://osu.ppy.sh/community/matches/109975612', NULL, 2),
  ((SELECT id FROM seasons WHERE year=2023), 'Perempat Final', 'United States', '2023-08-20T02:30', 'done', 'upper', 2, 2, 6, 'https://osu.ppy.sh/community/matches/110077569', NULL, 3),
  ((SELECT id FROM seasons WHERE year=2023), 'Semifinal', 'France', '2023-08-27T12:00', 'done', 'lower', 1, 6, 2, 'https://osu.ppy.sh/community/matches/110189592', NULL, 4),
  ((SELECT id FROM seasons WHERE year=2023), 'Semifinal', 'China', '2023-08-27T14:00', 'done', 'lower', 2, 6, 0, 'https://osu.ppy.sh/community/matches/110191233', NULL, 5),
  ((SELECT id FROM seasons WHERE year=2023), 'Final', 'South Korea', '2023-09-02T11:30', 'done', 'lower', 2, 7, 5, 'https://osu.ppy.sh/community/matches/110280983', NULL, 6),
  ((SELECT id FROM seasons WHERE year=2023), 'Final', 'Thailand', '2023-09-03T13:00', 'done', 'lower', 1, 6, 7, 'https://osu.ppy.sh/community/matches/110299819', 'Kekalahan penutup langkah di peringkat 4.', 7),
  ((SELECT id FROM seasons WHERE year=2024), 'Round of 32', 'France', '2024-08-25T13:00', 'done', 'upper', 1, 5, 0, 'https://osu.ppy.sh/community/matches/115228621', NULL, 1),
  ((SELECT id FROM seasons WHERE year=2024), 'Round of 16', 'Oceania', '2024-09-01T12:30', 'done', 'upper', 1, 5, 1, 'https://osu.ppy.sh/community/matches/115324539', NULL, 2),
  ((SELECT id FROM seasons WHERE year=2024), 'Perempat Final', 'Germany', '2024-09-08T13:30', 'done', 'upper', 2, 3, 6, 'https://osu.ppy.sh/community/matches/115416499', NULL, 3),
  ((SELECT id FROM seasons WHERE year=2024), 'Semifinal', 'Singapore', '2024-09-14T13:00', 'done', 'lower', 1, 6, 0, 'https://osu.ppy.sh/community/matches/115488340', NULL, 4),
  ((SELECT id FROM seasons WHERE year=2024), 'Semifinal', 'Argentina', '2024-09-15T14:00', 'done', 'lower', 1, 6, 0, 'https://osu.ppy.sh/community/matches/115505381', NULL, 5),
  ((SELECT id FROM seasons WHERE year=2024), 'Final', 'Chile', '2024-09-20T14:00', 'done', 'lower', 2, NULL, NULL, NULL, 'Menang WBD (win by default) - lawan tidak hadir, tidak ada match yang dimainkan.', 6),
  ((SELECT id FROM seasons WHERE year=2024), 'Final', 'Germany', '2024-09-22T14:00', 'done', 'lower', 1, 7, 3, 'https://osu.ppy.sh/community/matches/115592921', NULL, 7),
  ((SELECT id FROM seasons WHERE year=2024), 'Grand Final', 'China', '2024-10-05T13:30', 'done', 'lower', 2, 5, 7, 'https://osu.ppy.sh/community/matches/115744635', 'Kalah di Grand Final lower bracket. Pemenangnya lanjut memperebutkan juara 1 melawan pemenang upper bracket.', 8);

-- ---------- osu! identity ----------
-- osu! identity for each player: numeric id (avatar comes from a.ppy.sh/<id>)
-- and the profile cover used as the card background.
-- Shierii's osu! account is no longer reachable, so no cover is stored;
-- the UI falls back to an initial + gradient when an image fails to load.
UPDATE players SET osu_id=5604201, cover_url='https://assets.ppy.sh/user-profile-covers/5604201/ada5679d025395414a095774edcec63bb61c93a0ce5f02dcc59f60dd1046689e.gif' WHERE username='Reid Hezzel';
UPDATE players SET osu_id=1096240, cover_url='https://assets.ppy.sh/user-profile-covers/1096240/99286ce1e67d4c571287d9c8d18a4adf8d27fc3d198dd1c28ac41423bcf9c96f.jpeg' WHERE username='Reissfelt';
UPDATE players SET osu_id=14613788, cover_url='https://assets.ppy.sh/user-profile-covers/14613788/2422f850fe2daf1c0937e23bfd61c28a569eb60cac7ad73b70a7366134f860c5.jpeg' WHERE username='Zvenx';
UPDATE players SET osu_id=15931741, cover_url='https://assets.ppy.sh/user-profile-covers/15931741/a294d2bcc169688f40c4c461d1bc2f986ffbaf490733dcbbf13de1857441ce78.jpeg' WHERE username='Nyeko Kawaii';
UPDATE players SET osu_id=3212755, cover_url='https://assets.ppy.sh/user-profile-covers/3212755/36e87e82802b7c4d770be138468b8620d445bc0c9c9692d2a6f4cacce0819eb5.jpeg' WHERE username='Ruu';
UPDATE players SET osu_id=9573836, cover_url='https://assets.ppy.sh/user-profile-covers/9573836/060541b2d8d1b32ceae982381901e42f659f18e0e710943cebacb4b71aa33acd.jpeg' WHERE username='BitDust';
UPDATE players SET osu_id=20571283, cover_url='https://assets.ppy.sh/user-profile-covers/20571283/6e70be59deb6d6e93667017b5f1212b4020e5fba95453c277eb0df5a227a7082.gif' WHERE username='Kinora';
UPDATE players SET osu_id=9153772, cover_url='https://assets.ppy.sh/user-profile-covers/9153772/03a8ba3d5bfb93f036ed11f2b5dd54184448dbf086b6c5a1ee70a0221c456182.png' WHERE username='Mixuri';
UPDATE players SET osu_id=2128050, cover_url='https://assets.ppy.sh/user-profile-covers/2128050/35423a2812853352e9136a1c5dc969f213548bb3c823f75427898627eff3294a.jpeg' WHERE username='ARTPHONEY';
UPDATE players SET osu_id=9260926, cover_url='https://assets.ppy.sh/user-profile-covers/9260926/7747eb51597577069a44f035afd55db7444dadf7557d72e7ec51be961ee0c8da.jpeg' WHERE username='Execration-';
UPDATE players SET osu_id=3951909, cover_url='https://assets.ppy.sh/user-profile-covers/3951909/5624ceeb26826c134349321f10d5307ebf097ffe330ad363b2a4f94e021cfce3.jpeg' WHERE username='dalyz';
UPDATE players SET osu_id=9888039, cover_url='https://assets.ppy.sh/user-profile-covers/9888039/70ab61c89bd43175e1bd32d458525884d837c662fc5551b1b57b33a24569ef37.jpeg' WHERE username='Foranex';
UPDATE players SET osu_id=11582543, cover_url='https://assets.ppy.sh/user-profile-covers/11582543/148878305bde303ff4f14d6b722aa7dbcd1fcaa2d63520e2b880b0009a03275d.png' WHERE username='Honkenway';
UPDATE players SET osu_id=17514687, cover_url='https://assets.ppy.sh/user-profile-covers/17514687/7f4939c69c4747a5632ef70f2769ec126b4cd4ce1c95967b006c4bd68d191c8b.png' WHERE username='Nomiru';
UPDATE players SET osu_id=26377086, cover_url='https://assets.ppy.sh/user-profile-covers/26377086/2fc9fa953274e5dc63a624c5e2fd2ceeb160de47c680acf3d5efd2ecefa04908.jpeg' WHERE username='Copano_Lucky';
UPDATE players SET osu_id=31130464, cover_url=NULL WHERE username='Shierii';
