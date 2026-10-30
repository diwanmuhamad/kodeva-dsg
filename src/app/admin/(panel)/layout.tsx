import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { getSession } from "@/lib/auth";
import { sanityStudioUrl } from "@/lib/sanity/env";
import { logoutAction } from "@/server/admin-actions";

export const metadata = {
  title: "Panel marketing",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="p-8 text-muted">Memuat panel...</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-full bg-paper">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4">
          <p className="font-semibold">Panel Kodeva</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium" aria-label="Panel">
            <Link className="inline-flex min-h-11 items-center" href="/admin">
              Ringkasan
            </Link>
            <a className="inline-flex min-h-11 items-center" href={sanityStudioUrl} target="_blank" rel="noreferrer">
              Sanity CMS
            </a>
            <Link className="inline-flex min-h-11 items-center" href="/admin/leads">
              Leads
            </Link>
            <Link className="inline-flex min-h-11 items-center" href="/">
              Lihat situs
            </Link>
          </nav>
          <form action={logoutAction} className="md:ml-auto">
            <button type="submit" className="min-h-11 font-semibold">
              Keluar
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
