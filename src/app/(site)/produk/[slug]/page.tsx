import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CmsImage } from "@/components/cms-image";
import { ProductPurchase } from "@/components/product-purchase";
import { categoryLabel, minMonthlyPrice } from "@/lib/catalog-query";
import { formatIdr } from "@/lib/format";
import { getProduct, products } from "@/lib/products";

export const instant = false;

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/produk/${product.slug}` },
    openGraph: { title: product.name, description: product.summary },
  };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="px-4 py-16 text-center text-muted">Memuat produk...</p>}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-clay">
            {categoryLabel(product.category)}
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-muted">{product.description}</p>
          <p className="mt-3 text-sm font-semibold">Mulai {formatIdr(minMonthlyPrice(product))} / lisensi / bulan</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <div className="mt-6">
            <CmsImage src="product" alt={`Tangkapan layar ${product.name}`} productName={product.name} category={product.category} />
          </div>
        </div>
        <Suspense fallback={<div className="h-80 animate-pulse rounded-[1.75rem] bg-mist" />}>
          <ProductPurchase slug={product.slug} />
        </Suspense>
      </div>
      <section className="mt-12" aria-labelledby="perbandingan">
        <h2 id="perbandingan" className="text-3xl">
          Perbandingan paket
        </h2>
        <div className="mt-4 overflow-x-auto rounded-[1.75rem] border border-line">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">Perbandingan Basic, Pro, dan Business untuk {product.name}</caption>
            <thead className="bg-mist">
              <tr>
                <th className="px-4 py-3 font-semibold">Fitur</th>
                <th className="px-4 py-3 font-semibold">Basic</th>
                <th className="px-4 py-3 font-semibold">Pro</th>
                <th className="px-4 py-3 font-semibold">Business</th>
              </tr>
            </thead>
            <tbody>
              {product.comparison.map((row) => (
                <tr key={row.label} className="border-t border-line">
                  <th className="px-4 py-3 font-medium">{row.label}</th>
                  <td className="px-4 py-3">{row.basic}</td>
                  <td className="px-4 py-3">{row.pro}</td>
                  <td className="px-4 py-3">{row.business}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
