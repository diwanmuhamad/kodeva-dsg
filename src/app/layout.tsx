import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Kodeva — Promo Akhir Tahun",
    template: "%s · Kodeva",
  },
  description:
    "Software kasir, SDM, dan keuangan untuk UMKM. Promo Akhir Tahun dengan kuota lisensi yang jelas.",
  openGraph: {
    title: "Kodeva — Promo Akhir Tahun",
    description: "Lihat katalog promo dan baca artikel produk yang bisa dibagikan.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${outfit.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
