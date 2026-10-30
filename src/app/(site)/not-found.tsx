import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-4xl">Tidak ditemukan</h1>
      <p className="mt-3 text-muted">Produk atau artikel itu tidak ada, atau artikelnya masih draf.</p>
      <Link href="/katalog" className="mt-6 inline-flex min-h-11 items-center font-semibold text-forest">
        Ke katalog
      </Link>
    </div>
  );
}
