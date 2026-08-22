export const LANGS = ["id", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_COOKIE = "4cwc_lang";
export const DEFAULT_LANG: Lang = "id";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

type Dict = Record<string, string>;

const id: Dict = {
  "nav.home": "Beranda",
  "nav.players": "Tournament History",
  "nav.login": "Login",
  "nav.logout": "Logout",

  "home.title.line2": "Indonesia Team",
  "home.stat.seasons": "Musim diikuti",
  "home.stat.players": "Pemain terdaftar",
  "home.seasons.title": "Pencapaian per musim",
  "home.highlight.title": "Sorotan roster",
  "home.seasons.empty": "Belum ada data musim.",

  "home.cta.players": "Lihat Tournament History",
  "home.stat.seasonsShort": "Musim Tercatat",
  "home.stat.playersShort": "Total Pemain Roster",
  "home.seasons.heading": "Pencapaian per Musim",
  "home.seasons.sub": "Rekam jejak Tim Indonesia dari tahun ke tahun.",
  "home.season.soon": "Data Segera Hadir",
  "home.highlight.heading": "Sorotan Roster",
  "home.viewAll": "Lihat semua",
  "home.playerLabel": "Pemain",
  "footer.tagline": "4CWC.ID — dibuat oleh Honkenway bersama Claude AI.",
  "players.title": "Tournament History",
  "players.all": "Semua",
  "players.empty": "Roster musim ini belum dipublikasikan.",
  "players.noSeasons": "Belum ada data musim di database.",

  "players.captain": "Kapten",
  "players.record": "Rekor",
  "players.seed": "Seed kualifikasi",
  "players.matchHistory": "Riwayat Pertandingan",
  "players.round": "Babak",
  "players.opponent": "Lawan",
  "players.score": "Skor",
  "players.mp": "MP Link",
  "players.win": "Menang",
  "players.loss": "Kalah",
  "players.walkover": "WBD",
  "players.source": "Sumber data",
  "players.noMatches": "Belum ada data pertandingan untuk musim ini.",
  "players.activeIn": "Aktif",
  "players.pendingTitle": "Roster musim ini belum dipublikasikan. Data akan tampil otomatis setelah admin menerbitkannya lewat Roster Generator.",
  "login.back": "Kembali ke Beranda",
  "login.heading": "Login",
  "login.usernameLabel": "Username atau Email",
  "login.restricted": "Akses terbatas — hanya untuk akun terverifikasi.",
  "login.title": "Masuk",
  "login.lede": "Masuk untuk mengakses dashboard tim.",
  "login.username": "Username",
  "login.password": "Password",
  "login.submit": "Masuk",
  "login.error": "Username atau password salah.",

  "dash.welcome": "Selamat datang kembali,",
  "dash.private": "Privat — Hanya Roster Tim",
  "dash.noSeason": "Belum ada musim aktif",
  "dash.roster.title": "Roster Resmi",
  "dash.roster.empty": "Roster musim ini belum dipublikasikan oleh admin.",
  "dash.roster.subs": "pemain cadangan",
  "dash.position": "Posisi",
  "dash.starter": "Starter",
  "dash.substitute": "Cadangan",

  "bracket.upper": "Upper Bracket",
  "bracket.lower": "Lower Bracket",
  "bracket.grand": "Grand Final",
  "match.teamA": "Tim A",
  "match.teamB": "Tim B",
  "match.title": "Jadwal Pertandingan",
  "match.empty": "Belum ada jadwal pertandingan yang dimasukkan admin.",
  "match.upcoming": "Akan datang",
  "match.live": "Berlangsung",
  "match.done": "Selesai",
  "match.vs": "vs",
  "match.tbd": "Jadwal belum ditentukan",
  "match.watch": "Lihat match",
  "match.result": "Hasil",

  "info.title": "Info Tim",
  "info.empty": "Belum ada info tim yang dimasukkan admin.",
  "info.link": "Buka",

  "err.title": "Situs sedang bermasalah",
  "err.db":
    "Database belum siap atau query gagal dijalankan. Kalau kamu admin, pastikan schema.sql sudah dijalankan ke database D1 production.",
  "err.generic": "Terjadi kesalahan tak terduga saat memuat halaman ini.",
  "err.back": "Kembali ke beranda",

  "admin.matches.title": "Kelola Jadwal Pertandingan",
  "admin.info.title": "Kelola Info Tim",
  "admin.add": "Tambah",
  "admin.delete": "Hapus",
  "admin.save": "Simpan",
  "admin.season": "Musim",
  "admin.round": "Babak",
  "admin.opponent": "Lawan",
  "admin.datetime": "Waktu (UTC)",
  "admin.status": "Status",
  "admin.mplink": "Link match",
  "admin.scoreUs": "Skor ID",
  "admin.scoreThem": "Skor lawan",
  "admin.label": "Judul",
  "admin.value": "Isi / URL",
  "admin.kind": "Tipe",
  "admin.visibleTo": "Terlihat oleh",
  "admin.noSeasons":
    "Belum ada musim di database. Tambahkan baris di tabel seasons terlebih dahulu sebelum membuat jadwal.",
};

const en: Dict = {
  "nav.home": "Home",
  "nav.players": "Tournament History",
  "nav.login": "Login",
  "nav.logout": "Logout",

  "home.title.line2": "Indonesia Team",
  "home.stat.seasons": "Seasons played",
  "home.stat.players": "Registered players",
  "home.seasons.title": "Results by season",
  "home.highlight.title": "Roster highlight",
  "home.seasons.empty": "No season data yet.",

  "home.cta.players": "View Tournament History",
  "home.stat.seasonsShort": "Seasons Recorded",
  "home.stat.playersShort": "Total Roster Players",
  "home.seasons.heading": "Results per Season",
  "home.seasons.sub": "Team Indonesia's track record year by year.",
  "home.season.soon": "Data Coming Soon",
  "home.highlight.heading": "Roster Highlight",
  "home.viewAll": "View all",
  "home.playerLabel": "Player",
  "footer.tagline": "4CWC.ID — built by Honkenway with Claude AI.",
  "players.title": "Tournament History",
  "players.all": "All",
  "players.empty": "This season's roster has not been published.",
  "players.noSeasons": "No season data in the database yet.",

  "players.captain": "Captain",
  "players.record": "Record",
  "players.seed": "Qualifier seed",
  "players.matchHistory": "Match History",
  "players.round": "Round",
  "players.opponent": "Opponent",
  "players.score": "Score",
  "players.mp": "MP Link",
  "players.win": "Win",
  "players.loss": "Loss",
  "players.walkover": "WBD",
  "players.source": "Data source",
  "players.noMatches": "No match data for this season yet.",
  "players.activeIn": "Active",
  "players.pendingTitle": "This season's roster has not been published. It will appear automatically once the admin publishes it via the Roster Generator.",
  "login.back": "Back to Home",
  "login.heading": "Login",
  "login.usernameLabel": "Username or Email",
  "login.restricted": "Restricted access — verified accounts only.",
  "login.title": "Sign in",
  "login.lede": "Sign in to access the team dashboard.",
  "login.username": "Username",
  "login.password": "Password",
  "login.submit": "Sign in",
  "login.error": "Wrong username or password.",

  "dash.welcome": "Welcome back,",
  "dash.private": "Private — Team Roster Only",
  "dash.noSeason": "No active season",
  "dash.roster.title": "Official Roster",
  "dash.roster.empty": "The admin has not published this season's roster yet.",
  "dash.roster.subs": "substitute players",
  "dash.position": "Position",
  "dash.starter": "Starter",
  "dash.substitute": "Substitute",

  "bracket.upper": "Upper Bracket",
  "bracket.lower": "Lower Bracket",
  "bracket.grand": "Grand Final",
  "match.teamA": "Team A",
  "match.teamB": "Team B",
  "match.title": "Match Schedule",
  "match.empty": "The admin has not added any matches yet.",
  "match.upcoming": "Upcoming",
  "match.live": "Live",
  "match.done": "Finished",
  "match.vs": "vs",
  "match.tbd": "Time to be decided",
  "match.watch": "View match",
  "match.result": "Result",

  "info.title": "Team Info",
  "info.empty": "The admin has not added any team info yet.",
  "info.link": "Open",

  "err.title": "Something went wrong",
  "err.db":
    "The database is not ready or a query failed. If you are the admin, make sure schema.sql has been run against the production D1 database.",
  "err.generic": "An unexpected error occurred while loading this page.",
  "err.back": "Back to home",

  "admin.matches.title": "Manage Match Schedule",
  "admin.info.title": "Manage Team Info",
  "admin.add": "Add",
  "admin.delete": "Delete",
  "admin.save": "Save",
  "admin.season": "Season",
  "admin.round": "Round",
  "admin.opponent": "Opponent",
  "admin.datetime": "Time (UTC)",
  "admin.status": "Status",
  "admin.mplink": "Match link",
  "admin.scoreUs": "ID score",
  "admin.scoreThem": "Opponent score",
  "admin.label": "Label",
  "admin.value": "Content / URL",
  "admin.kind": "Type",
  "admin.visibleTo": "Visible to",
  "admin.noSeasons":
    "There are no seasons in the database yet. Add a row to the seasons table before creating a schedule.",
};

const DICTS: Record<Lang, Dict> = { id, en };

export function useTranslations(lang: Lang) {
  const dict = DICTS[lang] ?? DICTS[DEFAULT_LANG];
  return function t(key: string): string {
    return dict[key] ?? DICTS[DEFAULT_LANG][key] ?? key;
  };
}

/**
 * Match times are stored in UTC. Indonesian readers think in WIB (UTC+7), so
 * that is what gets rendered — the timezone is stated explicitly so the number
 * is never ambiguous. Date-only rows (historical matches with no kick-off time
 * recorded) render as a plain date, with no misleading 00:00.
 */
const TZ = "Asia/Jakarta";
const TZ_LABEL = "WIB";

export function formatDateTime(value: string | null | undefined, lang: Lang): string | null {
  if (!value) return null;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const iso = dateOnly
    ? value + "T00:00:00Z"
    : (value.includes("T") ? value : value.replace(" ", "T")) + "Z";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return value;

  const locale = lang === "id" ? "id-ID" : "en-GB";
  if (dateOnly) {
    // No time recorded, so no timezone shift can be justified: show the date
    // exactly as the source published it.
    return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(d);
  }
  return (
    new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: TZ,
    }).format(d) + " " + TZ_LABEL
  );
}
