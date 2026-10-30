"use server";

import { redirect } from "next/navigation";

import { adminCredentials, clearSessionCookie, setSessionCookie } from "@/lib/auth";
import { safeEqual } from "@/lib/safe-equal";

export type ActionState = { ok: false; message: string } | null;

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const expected = adminCredentials();
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!safeEqual(username, expected.username) || !safeEqual(password, expected.password)) {
    return { ok: false, message: "Nama atau kata sandi salah." };
  }
  await setSessionCookie(expected.username);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
