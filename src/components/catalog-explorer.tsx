"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CmsImage } from "@/components/cms-image";
import { secondaryButtonClass } from "@/components/styles";
import { remainingQuota } from "@/lib/cart";
import { catalogHref, categories, categoryLabel, filterProducts, minMonthlyPrice } from "@/lib/catalog-query";
import { formatIdr } from "@/lib/format";
import type { CartLine, Product } from "@/lib/types";
import { useHydratedCart } from "@/lib/use-cart";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; products: Product[] };

export function CatalogExplorer() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("kategori") ?? "semua";
  const q = params.get("q") ?? "";
  const sort = params.get("urut") ?? "unggulan";
  const fail = params.get("gagal") === "1";
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${fail}:${attempt}`;
  const [request, setRequest] = useState<{ key: string; state: LoadState }>({
    key: requestKey,
    state: { status: "loading" },
  });
  if (request.key !== requestKey) {
    setRequest({ key: requestKey, state: { status: "loading" } });
  }
  const state = request.key === requestKey ? request.state : ({ status: "loading" } satisfies LoadState);
  const { lines } = useHydratedCart();

  useEffect(() => {
    const controller = new AbortController();
    const url = fail ? "/api/catalog?gagal=1" : "/api/catalog";
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        const data = (await response.json()) as { message?: string } | Product[];
        if (!response.ok) {
          throw new Error("message" in data && data.message ? data.message : "Gagal memuat katalog.");
        }
        return data as Product[];
      })
      .then((products) => setRequest({ key: requestKey, state: { status: "ready", products } }))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setRequest({
          key: requestKey,
          state: {
            status: "error",
            message: error instanceof Error ? error.message : "Gagal memuat katalog.",
          },
        });
      });
    return () => controller.abort();
  }, [fail, requestKey]);

  const query = { category, q, sort };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">Mini marketplace</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Katalog promo</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Enam produk lebih, dengan filter kategori. Harga di halaman produk berubah saat paket diganti.
      </p>

      <form action="/katalog" className="mt-8 grid gap-3 rounded-[1.75rem] border border-line bg-card p-4 md:grid-cols-[1fr_180px_auto]">
        <label className="grid gap-1 text-sm font-medium">
          Cari
          <input name="q" defaultValue={q} className="min-h-11 rounded-2xl border border-line px-3" placeholder="Nama produk" />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Urutkan
          <select name="urut" defaultValue={sort} className="min-h-11 rounded-2xl border border-line px-3">
            <option value="unggulan">Unggulan</option>
            <option value="nama">Nama</option>
            <option value="harga-naik">Harga terendah</option>
            <option value="harga-turun">Harga tertinggi</option>
          </select>
        </label>
        {category !== "semua" ? <input type="hidden" name="kategori" value={category} /> : null}
        <button className={`${secondaryButtonClass} self-end`} type="submit">
          Terapkan
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2" aria-label="Kategori">
        <Link className={chip(category === "semua")} href={catalogHref({ ...query, category: "semua" })}>
          Semua
        </Link>
        {categories.map((item) => (
          <Link key={item.id} className={chip(category === item.id)} href={catalogHref({ ...query, category: item.id })}>
            {item.label}
          </Link>
        ))}
      </div>

      <p className="mt-4 text-sm">
        <Link className="font-semibold text-forest" href={catalogHref({ ...query, gagal: !fail })}>
          {fail ? "Kembali ke katalog normal" : "Simulasikan gangguan API"}
        </Link>
      </p>

      {state.status === "loading" ? <CatalogSkeleton /> : null}
      {state.status === "error" ? (
        <div role="alert" className="mt-8 rounded-[1.75rem] border border-clay/30 bg-card p-6">
          <h2 className="text-2xl">Katalog tidak dapat dimuat</h2>
          <p className="mt-2 text-muted">{state.message}</p>
          <button
            type="button"
            className={`${secondaryButtonClass} mt-4`}
            onClick={() => {
              const next = new URLSearchParams(params.toString());
              next.delete("gagal");
              const search = next.toString();
              router.replace(search ? `/katalog?${search}` : "/katalog");
              setAttempt((value) => value + 1);
            }}
          >
            Coba lagi
          </button>
        </div>
      ) : null}
      {state.status === "ready" ? (
        <CatalogGrid products={filterProducts(state.products, query)} lines={lines} />
      ) : null}
    </div>
  );
}

function CatalogGrid({
  products,
  lines,
}: {
  products: Product[];
  lines: CartLine[];
}) {
  if (products.length === 0) {
    return (
      <div className="mt-8 rounded-[1.75rem] border border-dashed border-line p-8">
        <h2 className="text-2xl">Tidak ada produk</h2>
        <p className="mt-2 text-muted">Coba kata kunci lain atau tampilkan semua kategori.</p>
        <Link href="/katalog" className={`${secondaryButtonClass} mt-4`}>
          Reset filter
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article key={product.slug} className="rounded-[1.75rem] border border-line bg-card p-3">
          <CmsImage
            src="product"
            alt={product.name}
            productName={product.name}
            category={product.category}
            frameClassName="aspect-[4/3] rounded-[1.25rem]"
          />
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-forest">
            {categoryLabel(product.category)}
          </p>
          <h2 className="mt-1 text-2xl">{product.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{product.summary}</p>
          <p className="mt-3 text-sm font-semibold">Mulai {formatIdr(minMonthlyPrice(product))} / bulan</p>
          <p className="text-sm text-muted">Sisa kuota promo: {remainingQuota(product, lines)}</p>
          <Link href={`/produk/${product.slug}`} className={`${secondaryButtonClass} mt-4 w-full`}>
            Lihat detail
          </Link>
        </article>
      ))}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-[1.75rem] bg-mist" />
      ))}
    </div>
  );
}

function chip(active: boolean) {
  return `inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold ${
    active ? "bg-forest text-white" : "border border-line bg-card"
  }`;
}
