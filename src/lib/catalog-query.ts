import type { Product } from "@/lib/types";
import { monthlyUnit } from "@/lib/cart";

export const categories = [
  { id: "operasional", label: "Operasional" },
  { id: "sdm", label: "SDM" },
  { id: "keuangan", label: "Keuangan" },
  { id: "addon", label: "Add-on" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type CatalogQuery = {
  category?: string;
  q?: string;
  sort?: string;
};

export function categoryLabel(id: string): string {
  return categories.find((category) => category.id === id)?.label ?? id;
}

export function minMonthlyPrice(product: Product): number {
  return Math.min(...product.packages.map((pkg) => monthlyUnit(pkg)));
}

export function filterProducts(products: Product[], query: CatalogQuery): Product[] {
  const category = query.category?.trim();
  const needle = query.q?.trim().toLowerCase();
  let list = products.filter((product) => {
    const categoryOk = !category || category === "semua" || product.category === category;
    const text = `${product.name} ${product.summary}`.toLowerCase();
    const queryOk = !needle || text.includes(needle);
    return categoryOk && queryOk;
  });

  if (query.sort === "nama") {
    list = [...list].sort((a, b) => a.name.localeCompare(b.name, "id"));
  } else if (query.sort === "harga-naik") {
    list = [...list].sort((a, b) => minMonthlyPrice(a) - minMonthlyPrice(b));
  } else if (query.sort === "harga-turun") {
    list = [...list].sort((a, b) => minMonthlyPrice(b) - minMonthlyPrice(a));
  }

  return list;
}

export function catalogHref(query: CatalogQuery & { gagal?: boolean }): string {
  const params = new URLSearchParams();
  if (query.category && query.category !== "semua") params.set("kategori", query.category);
  if (query.q?.trim()) params.set("q", query.q.trim());
  if (query.sort && query.sort !== "unggulan") params.set("urut", query.sort);
  if (query.gagal) params.set("gagal", "1");
  const search = params.toString();
  return search ? `/katalog?${search}` : "/katalog";
}
