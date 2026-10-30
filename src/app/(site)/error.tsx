"use client";

import { secondaryButtonClass } from "@/components/styles";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-4xl">Ada gangguan</h1>
      <p className="mt-3 text-muted">Halaman ini belum bisa ditampilkan. Coba muat ulang.</p>
      <button type="button" className={`${secondaryButtonClass} mt-6`} onClick={reset}>
        Coba lagi
      </button>
    </div>
  );
}
