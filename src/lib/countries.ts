/**
 * Team name -> ISO 3166-1 alpha-2, for flag images.
 * Composite/regional 4CWC teams (Oceania, Team Europe, Latam, ...) have no
 * single country code; they return null and the UI renders a neutral badge.
 */
const CODES: Record<string, string> = {
  Indonesia: "id",
  Vietnam: "vn",
  Poland: "pl",
  Taiwan: "tw",
  Philippines: "ph",
  Sweden: "se",
  Germany: "de",
  Netherlands: "nl",
  "South Korea": "kr",
  Brazil: "br",
  "United States": "us",
  France: "fr",
  China: "cn",
  Thailand: "th",
  Singapore: "sg",
  Argentina: "ar",
  Chile: "cl",
  Japan: "jp",
  Malaysia: "my",
  Australia: "au",
  Canada: "ca",
  Mexico: "mx",
  Spain: "es",
  Turkey: "tr",
  Finland: "fi",
  Iceland: "is",
  Ireland: "ie",
  Bulgaria: "bg",
  "Hong Kong": "hk",
  "New Zealand": "nz",
  "United Kingdom": "gb",
  Mongolia: "mn",
  Portugal: "pt",
  "Russian Federation": "ru",
  Latvia: "lv",
};

export function countryCode(team: string): string | null {
  return CODES[team.trim()] ?? null;
}

/** flagcdn serves plain PNG flags over https with no key and no tracking. */
export function flagUrl(team: string, width: 20 | 40 | 80 = 40): string | null {
  const c = countryCode(team);
  return c ? `https://flagcdn.com/w${width}/${c}.png` : null;
}
