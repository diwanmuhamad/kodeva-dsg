import { Suspense } from "react";

import { CatalogExplorer } from "@/components/catalog-explorer";

export const metadata = {
  title: "Katalog",
  description: "Katalog promo Kodeva dengan filter kategori, pencarian, dan urutan harga.",
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-center text-muted">Memuat katalog...</p>}>
      <CatalogExplorer />
    </Suspense>
  );
}
