import Link from "next/link";

import { EventLog } from "@/components/event-log";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-serif text-2xl">Kodeva</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            Perangkat usaha untuk UMKM. Promo Akhir Tahun berlaku selama kuota lisensi produk masih tersedia.
          </p>
          <Link href="/admin" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-forest">
            Panel leads (marketing)
          </Link>
        </div>
        <EventLog />
      </div>
    </footer>
  );
}
