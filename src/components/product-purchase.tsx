"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { secondaryButtonClass, primaryButtonClass } from "@/components/styles";
import { lineKey, listUnit, remainingQuota, setLineLicenses, unitPrice } from "@/lib/cart";
import { buildAddToCart, buildViewItem } from "@/lib/events";
import { pushDataLayer, shouldTrackView } from "@/lib/datalayer";
import { cycleLabel, formatIdr } from "@/lib/format";
import { useCartStore } from "@/lib/cart-store";
import type { BillingCycle, PackageTier, Product } from "@/lib/types";
import { useHydratedCart } from "@/lib/use-cart";
import { readStoredUtm } from "@/lib/utm-client";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "missing" }
  | { status: "ready"; product: Product };

export function ProductPurchase({ slug }: { slug: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const fail = params.get("gagal") === "1";
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${slug}:${fail}:${attempt}`;
  const [request, setRequest] = useState<{ key: string; state: LoadState }>({
    key: requestKey,
    state: { status: "loading" },
  });
  if (request.key !== requestKey) {
    setRequest({ key: requestKey, state: { status: "loading" } });
  }
  const state = request.key === requestKey ? request.state : ({ status: "loading" } satisfies LoadState);
  const [packageId, setPackageId] = useState<PackageTier>("basic");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [licenses, setLicenses] = useState(1);
  const [message, setMessage] = useState("");
  const { lines, ready } = useHydratedCart();

  useEffect(() => {
    const controller = new AbortController();
    const url = fail ? `/api/products/${slug}?gagal=1` : `/api/products/${slug}`;
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        const data = (await response.json()) as Product & { message?: string };
        if (response.status === 404) return { status: "missing" } as const;
        if (!response.ok) throw new Error(data.message ?? "Gagal memuat produk.");
        return { status: "ready", product: data } as const;
      })
      .then((next) => {
        if (next.status === "missing") setRequest({ key: requestKey, state: { status: "missing" } });
        else setRequest({ key: requestKey, state: { status: "ready", product: next.product } });
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setRequest({
          key: requestKey,
          state: {
            status: "error",
            message: error instanceof Error ? error.message : "Gagal memuat produk.",
          },
        });
      });
    return () => controller.abort();
  }, [slug, fail, requestKey]);

  useEffect(() => {
    if (state.status !== "ready") return;
    if (!shouldTrackView(state.product.slug)) return;
    pushDataLayer(buildViewItem(state.product, "basic", "monthly", readStoredUtm()));
  }, [state]);

  if (state.status === "loading") {
    return <div className="h-80 animate-pulse rounded-[1.75rem] bg-mist" aria-hidden="true" />;
  }

  if (state.status === "missing") {
    return (
      <div className="rounded-[1.75rem] border border-line bg-card p-5">
        <h2 className="text-2xl">Produk tidak ditemukan</h2>
        <p className="mt-2 text-muted">Produk ini tidak ada di katalog.</p>
        <Link href="/katalog" className={`${secondaryButtonClass} mt-4`}>
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div role="alert" className="rounded-[1.75rem] border border-clay/30 bg-card p-5">
        <h2 className="text-2xl">Data produk gagal dimuat</h2>
        <p className="mt-2 text-muted">{state.message}</p>
        <button
          type="button"
          className={`${secondaryButtonClass} mt-4`}
          onClick={() => {
            const next = new URLSearchParams(params.toString());
            next.delete("gagal");
            const search = next.toString();
            router.replace(search ? `/produk/${slug}?${search}` : `/produk/${slug}`);
            setAttempt((value) => value + 1);
          }}
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const product = state.product;
  const pkg = product.packages.find((item) => item.id === packageId) ?? product.packages[0];
  const room = remainingQuota(product, lines);
  const count = room > 0 ? Math.min(licenses, room) : 1;
  const unit = unitPrice(pkg, cycle);
  const struck = listUnit(pkg, cycle);

  function addToCart() {
    if (!ready || room < 1) return;
    const current = useCartStore.getState().lines;
    const existing = current.find((line) => line.lineId === lineKey(product.slug, packageId, cycle))?.licenses ?? 0;
    const result = setLineLicenses(current, product, packageId, cycle, existing + count);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    useCartStore.getState().setLines(result.lines);
    pushDataLayer(buildAddToCart(product, packageId, cycle, count, readStoredUtm()));
    setMessage(`${count} lisensi masuk keranjang.`);
  }

  return (
    <div className="rounded-[1.75rem] border border-line bg-card p-5">
      <p className="text-sm font-semibold text-forest">Sisa kuota promo: {room} lisensi</p>
      <p className="mt-1 text-sm text-muted">Kuota ini dipakai bersama Basic, Pro, dan Business, termasuk durasi bulanan dan tahunan.</p>
      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">Pilih paket</legend>
        <div className="mt-2 grid gap-2">
          {product.packages.map((item) => (
            <label key={item.id} className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-line px-3 py-2">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paket"
                  checked={packageId === item.id}
                  onChange={() => setPackageId(item.id)}
                />
                {item.name}
              </span>
              <span className="text-sm font-semibold">{formatIdr(unitPrice(item, cycle))}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 grid grid-cols-2 gap-2" role="group" aria-label="Jangka waktu">
        {(["monthly", "yearly"] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={cycle === item}
            className={cycle === item ? primaryButtonClass : secondaryButtonClass}
            onClick={() => setCycle(item)}
          >
            {cycleLabel(item)}
          </button>
        ))}
      </div>
      <p className="mt-4 text-3xl font-semibold">{formatIdr(unit)}</p>
      {pkg.promoPrice !== null ? (
        <p className="text-sm text-muted">
          <span className="line-through">{formatIdr(struck)}</span>
          {cycle === "yearly" ? " · setara 10 bulan" : " · harga normal"}
        </p>
      ) : (
        <p className="text-sm text-muted">Harga normal</p>
      )}
      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-medium" id="lisensi-label">
          Jumlah lisensi
        </span>
        <button type="button" className="size-11 rounded-full border border-line" onClick={() => setLicenses(Math.max(1, count - 1))} disabled={count <= 1}>
          −
        </button>
        <span aria-labelledby="lisensi-label" className="min-w-8 text-center font-semibold">
          {count}
        </span>
        <button
          type="button"
          className="size-11 rounded-full border border-line"
          onClick={() => setLicenses(count + 1)}
          disabled={count >= room}
        >
          +
        </button>
      </div>
      <button type="button" className={`${primaryButtonClass} mt-5 w-full`} onClick={addToCart} disabled={!ready || room < 1}>
        {room < 1 ? "Kuota promo habis" : "Tambah ke keranjang"}
      </button>
      {message ? (
        <p role="status" className="mt-3 text-sm font-medium">
          {message}{" "}
          <Link href="/keranjang" className="text-forest">
            Lihat keranjang
          </Link>
        </p>
      ) : null}
      <p className="mt-4 text-sm">
        <Link className="font-semibold text-forest" href={fail ? `/produk/${slug}` : `/produk/${slug}?gagal=1`}>
          {fail ? "Muat data normal" : "Simulasikan gangguan API"}
        </Link>
      </p>
    </div>
  );
}
