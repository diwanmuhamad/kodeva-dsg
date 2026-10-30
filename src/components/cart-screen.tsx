"use client";

import Link from "next/link";

import { fieldClass, primaryButtonClass, secondaryButtonClass } from "@/components/styles";
import { priceCart, relocateLine, removeLine, setLineLicenses } from "@/lib/cart";
import { useCartStore } from "@/lib/cart-store";
import { cycleLabel, formatIdr } from "@/lib/format";
import { getProduct, products } from "@/lib/products";
import type { BillingCycle, PackageTier } from "@/lib/types";
import { useHydratedCart } from "@/lib/use-cart";
import { useState } from "react";

export function CartScreen() {
  const { lines, ready } = useHydratedCart();
  const [message, setMessage] = useState("");

  if (!ready) return <div className="mx-auto max-w-3xl px-4 py-16 text-muted">Memuat keranjang...</div>;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl">Keranjang kosong</h1>
        <p className="mt-3 text-muted">Belum ada lisensi yang dipilih.</p>
        <Link href="/katalog" className={`${primaryButtonClass} mt-6`}>
          Lihat katalog
        </Link>
      </div>
    );
  }

  const priced = priceCart(lines, products);

  function updateLicenses(lineId: string, licenses: number) {
    const line = useCartStore.getState().lines.find((item) => item.lineId === lineId);
    const product = line ? getProduct(line.productSlug) : undefined;
    if (!line || !product) return;
    const result = setLineLicenses(useCartStore.getState().lines, product, line.packageId, line.cycle, licenses);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    useCartStore.getState().setLines(result.lines);
    setMessage("");
  }

  function move(lineId: string, packageId: PackageTier, cycle: BillingCycle) {
    const line = useCartStore.getState().lines.find((item) => item.lineId === lineId);
    const product = line ? getProduct(line.productSlug) : undefined;
    if (!line || !product) return;
    const result = relocateLine(useCartStore.getState().lines, product, lineId, packageId, cycle);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    useCartStore.getState().setLines(result.lines);
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl">Keranjang</h1>
      <p className="mt-2 text-sm text-muted">Isi keranjang tetap ada setelah halaman dimuat ulang.</p>
      <ul className="mt-8 grid gap-4">
        {lines.map((line) => {
          const product = getProduct(line.productSlug);
          if (!product) {
            return (
              <li key={line.lineId} className="rounded-3xl border border-line p-4">
                Produk tidak ditemukan.
                <button type="button" className={secondaryButtonClass} onClick={() => useCartStore.getState().setLines(removeLine(lines, line.lineId))}>
                  Hapus
                </button>
              </li>
            );
          }
          const row = priced.ok ? priced.rows.find((item) => item.lineId === line.lineId) : undefined;
          return (
            <li key={line.lineId} className="grid gap-3 rounded-[1.75rem] border border-line bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl">{product.name}</h2>
                  <p className="text-sm text-muted">{row ? formatIdr(row.amount) : ""}</p>
                </div>
                <button
                  type="button"
                  className={secondaryButtonClass}
                  onClick={() => useCartStore.getState().setLines(removeLine(useCartStore.getState().lines, line.lineId))}
                >
                  Hapus
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1 text-sm font-medium">
                  Paket
                  <select
                    className={fieldClass}
                    value={line.packageId}
                    onChange={(event) => move(line.lineId, event.target.value as PackageTier, line.cycle)}
                  >
                    {product.packages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Durasi
                  <select
                    className={fieldClass}
                    value={line.cycle}
                    onChange={(event) => move(line.lineId, line.packageId, event.target.value as BillingCycle)}
                  >
                    <option value="monthly">{cycleLabel("monthly")}</option>
                    <option value="yearly">{cycleLabel("yearly")}</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium">
                  Lisensi
                  <input
                    className={fieldClass}
                    inputMode="numeric"
                    type="number"
                    min={1}
                    value={line.licenses}
                    onChange={(event) => updateLicenses(line.lineId, Number(event.target.value))}
                  />
                </label>
              </div>
            </li>
          );
        })}
      </ul>
      {message ? (
        <p role="alert" className="mt-4 text-sm font-medium text-clay">
          {message}
        </p>
      ) : null}
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-lg font-semibold">{priced.ok ? `Subtotal ${formatIdr(priced.total)}` : priced.message}</p>
        {priced.ok ? (
          <Link href="/checkout" className={primaryButtonClass}>
            Lanjut checkout
          </Link>
        ) : null}
      </div>
    </div>
  );
}
