"use client";

import Link from "next/link";

import { useHydratedCart } from "@/lib/use-cart";

export function MobileCartBar() {
  const { lines, ready } = useHydratedCart();
  const count = ready ? lines.reduce((sum, line) => sum + line.licenses, 0) : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-card p-3 md:hidden">
      <Link
        href="/keranjang"
        className="flex min-h-11 items-center justify-between rounded-full bg-ink px-4 text-sm font-semibold text-paper"
      >
        <span>Buka keranjang</span>
        <span>{count} lisensi</span>
      </Link>
    </div>
  );
}
