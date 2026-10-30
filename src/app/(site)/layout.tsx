import { Suspense, type ReactNode } from "react";

import { MobileCartBar } from "@/components/mobile-cart-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UtmCapture } from "@/components/utm-capture";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
      >
        Lewati ke konten
      </a>
      <Suspense fallback={null}>
        <UtmCapture />
      </Suspense>
      <p className="bg-ink px-4 py-2 text-center text-sm text-paper">
        Promo Akhir Tahun · kuota lisensi dipakai bersama untuk semua paket
      </p>
      <SiteHeader />
      <main id="konten" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>
      <SiteFooter />
      <MobileCartBar />
    </>
  );
}
