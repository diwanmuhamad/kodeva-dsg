"use client";

import Link from "next/link";
import { useState } from "react";

import { primaryButtonClass } from "@/components/styles";
import { useHydratedCart } from "@/lib/use-cart";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/katalog", label: "Katalog" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { lines, ready } = useHydratedCart();
  const count = ready ? lines.reduce((sum, line) => sum + line.licenses, 0) : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="min-h-11 text-lg font-semibold tracking-tight">
          Kodeva
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Utama">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="min-h-11 leading-[2.75rem]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/keranjang" className={primaryButtonClass} aria-label={`Keranjang, ${count} lisensi`}>
            Keranjang{count > 0 ? ` · ${count}` : ""}
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="menu-ponsel"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <nav id="menu-ponsel" className="grid gap-1 border-t border-line px-4 py-3 md:hidden" aria-label="Ponsel">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="min-h-11 rounded-2xl px-3 leading-[2.75rem]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
