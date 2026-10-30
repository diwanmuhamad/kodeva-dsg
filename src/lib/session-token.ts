import { createHmac, timingSafeEqual } from "node:crypto";

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export function signSession(username: string, secret: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ u: username, exp: now + TWELVE_HOURS })).toString(
    "base64url",
  );
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): string | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      u?: unknown;
      exp?: unknown;
    };
    if (typeof data.u !== "string" || typeof data.exp !== "number" || data.exp < now) return null;
    return data.u;
  } catch {
    return null;
  }
}

export function tokensMatch(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
