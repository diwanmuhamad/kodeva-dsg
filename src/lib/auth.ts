import { cookies } from "next/headers";

import { signSession, verifySession } from "@/lib/session-token";

export const ADMIN_COOKIE = "kodeva_admin";

export function adminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "marketing",
    password: process.env.ADMIN_PASSWORD || "PromoAkhirTahun2026",
    secret: process.env.ADMIN_SECRET || "kodeva-demo-secret",
  };
}

export async function getSession(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token, adminCredentials().secret);
}

export async function setSessionCookie(username: string) {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, signSession(username, adminCredentials().secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
