const encoder = new TextEncoder();

const PBKDF2_ITERATIONS = 100_000;
export const SESSION_COOKIE = "4cwc_session";
export const SESSION_DAYS = 7;

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const salt = fromHex(saltHex);
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return toHex(bits);
}

export async function verifyPassword(password: string, saltHex: string, expectedHashHex: string): Promise<boolean> {
  const actual = await hashPassword(password, saltHex);
  if (actual.length !== expectedHashHex.length) return false;
  let mismatch = 0;
  for (let i = 0; i < actual.length; i++) {
    mismatch |= actual.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  }
  return mismatch === 0;
}

export function generateSessionToken(): string {
  return toHex(crypto.getRandomValues(new Uint8Array(32)).buffer);
}
