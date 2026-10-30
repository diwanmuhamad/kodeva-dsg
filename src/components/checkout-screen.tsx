"use client";

import Link from "next/link";
import { useState } from "react";

import { fieldClass, clayButtonClass, primaryButtonClass, secondaryButtonClass } from "@/components/styles";
import { priceCart } from "@/lib/cart";
import { useCartStore } from "@/lib/cart-store";
import { buildBeginCheckout } from "@/lib/events";
import { pushDataLayer } from "@/lib/datalayer";
import { cycleLabel, formatIdr } from "@/lib/format";
import { products } from "@/lib/products";
import { checkoutRequestSchema } from "@/lib/validation";
import { useHydratedCart } from "@/lib/use-cart";
import { readStoredUtm } from "@/lib/utm-client";
import { hasUtm } from "@/lib/utm";

type CheckoutResult = {
  status: "success" | "failed";
  message: string;
  orderId?: string;
  order: {
    total: number;
    currency: string;
    utm: Record<string, string | undefined>;
    items: { name: string; packageName: string; cycle: "monthly" | "yearly"; licenses: number; amount: number }[];
  };
};

export function CheckoutScreen() {
  const { lines, ready } = useHydratedCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const utm = ready ? readStoredUtm() : {};

  if (!ready) return <div className="mx-auto max-w-3xl px-4 py-16 text-muted">Memuat checkout...</div>;

  if (result) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className={`text-sm font-semibold uppercase tracking-[0.16em] ${result.status === "success" ? "text-forest" : "text-clay"}`}>
          {result.status === "success" ? "Sukses" : "Gagal"}
        </p>
        <h1 className="mt-2 text-4xl">{result.status === "success" ? "Pembayaran berhasil" : "Pembayaran gagal"}</h1>
        <p className="mt-3 text-muted" role="status">
          {result.message}
        </p>
        {result.orderId ? <p className="mt-4 font-semibold">Nomor order {result.orderId}</p> : null}
        <pre className="mt-6 overflow-x-auto rounded-3xl bg-ink p-4 text-xs leading-5 text-paper">
          {JSON.stringify({ orderId: result.orderId, ...result.order }, null, 2)}
        </pre>
        <Link href="/katalog" className={`${secondaryButtonClass} mt-6`}>
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl">Keranjang kosong</h1>
        <p className="mt-3 text-muted">Checkout baru bisa dilanjutkan setelah ada lisensi di keranjang.</p>
        <Link href="/katalog" className={`${primaryButtonClass} mt-6`}>
          Lihat katalog
        </Link>
      </div>
    );
  }

  const priced = priceCart(lines, products);

  async function pay(outcome: "success" | "failed") {
    if (pending || !priced.ok) return;
    const form = document.getElementById("checkout-form");
    if (!(form instanceof HTMLFormElement)) return;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      outcome,
      utm: readStoredUtm(),
      items: useCartStore.getState().lines,
    };
    const parsed = checkoutRequestSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Periksa nama dan email.");
      return;
    }
    const fresh = priceCart(parsed.data.items, products);
    if (!fresh.ok) {
      setError(fresh.message);
      return;
    }
    setPending(true);
    setError("");
    pushDataLayer(buildBeginCheckout(fresh.rows, fresh.total, parsed.data.utm));
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json()) as CheckoutResult & { message?: string; ok?: boolean };
      if (!response.ok || !body.order) {
        setError(body.message ?? "Checkout gagal diproses.");
        setPending(false);
        return;
      }
      setResult(body);
      if (body.status === "success") useCartStore.getState().clear();
    } catch {
      setError("Tidak terhubung ke server. Coba lagi.");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr]">
      <form id="checkout-form" className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <h1 className="text-4xl">Checkout</h1>
        <label className="grid gap-2 text-sm font-medium">
          Nama
          <input name="name" autoComplete="name" className={fieldClass} required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input name="email" type="email" autoComplete="email" className={fieldClass} required />
        </label>
        <p className="text-sm text-muted">
          {hasUtm(utm)
            ? `Sumber kampanye ikut tersimpan: ${utm.utm_source ?? "-"} / ${utm.utm_medium ?? "-"} / ${utm.utm_campaign ?? "-"}.`
            : "Tidak ada parameter UTM pada kunjungan ini."}
        </p>
        {error ? (
          <p role="alert" className="text-sm font-medium text-clay">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" className={primaryButtonClass} disabled={pending || !priced.ok} onClick={() => pay("success")}>
            {pending ? "Memproses..." : "Bayar sekarang"}
          </button>
          <button type="button" className={clayButtonClass} disabled={pending || !priced.ok} onClick={() => pay("failed")}>
            Simulasikan pembayaran gagal
          </button>
        </div>
      </form>
      <aside className="rounded-[1.75rem] border border-line bg-card p-5">
        <h2 className="text-2xl">Ringkasan</h2>
        {priced.ok ? (
          <ul className="mt-4 grid gap-3 text-sm">
            {priced.rows.map((row) => (
              <li key={row.lineId} className="flex justify-between gap-3">
                <span>
                  {row.name} · {row.packageName} · {cycleLabel(row.cycle)} × {row.licenses}
                </span>
                <span>{formatIdr(row.amount)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-clay">{priced.message}</p>
        )}
        <p className="mt-4 text-lg font-semibold">{priced.ok ? formatIdr(priced.total) : ""}</p>
      </aside>
    </div>
  );
}
