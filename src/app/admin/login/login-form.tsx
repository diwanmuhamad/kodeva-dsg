"use client";

import { useActionState } from "react";

import { fieldClass, primaryButtonClass } from "@/components/styles";
import { loginAction, type ActionState } from "@/server/admin-actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null as ActionState);

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">Kodeva</p>
      <h1 className="mt-2 text-4xl">Studio konten</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        Untuk tim marketing. Perubahan yang disimpan langsung tampil di situs.
      </p>
      <form action={action} className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm font-medium">
          Nama pengguna
          <input name="username" autoComplete="username" className={fieldClass} required />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Kata sandi
          <input name="password" type="password" autoComplete="current-password" className={fieldClass} required />
        </label>
        {state?.ok === false ? (
          <p role="alert" className="text-sm font-medium text-clay">
            {state.message}
          </p>
        ) : null}
        <button className={primaryButtonClass} type="submit" disabled={pending}>
          {pending ? "Memeriksa..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}
