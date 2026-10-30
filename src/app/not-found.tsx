import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-4xl">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-muted">Alamat ini tidak ada. Kalau ini artikel, mungkin masih berstatus draf.</p>
        <Link href="/" className="mt-6 inline-flex min-h-11 items-center font-semibold text-forest">
          Ke beranda
        </Link>
      </main>
    </>
  );
}
