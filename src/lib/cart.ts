import type { BillingCycle, CartLine, PackageTier, PricedLine, Product, ProductPackage } from "@/lib/types";

export type QuotaResult = { ok: true; lines: CartLine[] } | { ok: false; message: string };

export function lineKey(slug: string, packageId: PackageTier, cycle: BillingCycle): string {
  return `${slug}:${packageId}:${cycle}`;
}

export function monthlyUnit(pkg: ProductPackage): number {
  return pkg.promoPrice ?? pkg.price;
}

export function unitPrice(pkg: ProductPackage, cycle: BillingCycle): number {
  const monthly = monthlyUnit(pkg);
  return cycle === "yearly" ? monthly * 10 : monthly;
}

export function listUnit(pkg: ProductPackage, cycle: BillingCycle): number {
  return cycle === "yearly" ? pkg.price * 12 : pkg.price;
}

export function licensesForProduct(lines: CartLine[], slug: string): number {
  return lines.reduce((sum, line) => (line.productSlug === slug ? sum + line.licenses : sum), 0);
}

export function remainingQuota(product: Product, lines: CartLine[]): number {
  return Math.max(0, product.promoQuota - licensesForProduct(lines, product.slug));
}

export function setLineLicenses(
  lines: CartLine[],
  product: Product,
  packageId: PackageTier,
  cycle: BillingCycle,
  licenses: number,
): QuotaResult {
  const pkg = product.packages.find((item) => item.id === packageId);
  if (!pkg) return { ok: false, message: "Paket tidak ditemukan." };
  if (!Number.isInteger(licenses) || licenses < 0 || licenses > 999) {
    return { ok: false, message: "Jumlah lisensi harus bilangan bulat." };
  }

  const key = lineKey(product.slug, packageId, cycle);
  const others = lines.reduce((sum, line) => {
    if (line.productSlug !== product.slug || line.lineId === key) return sum;
    return sum + line.licenses;
  }, 0);

  if (others + licenses > product.promoQuota) {
    const room = Math.max(0, product.promoQuota - others);
    return {
      ok: false,
      message: `Kuota promo ${product.name} tersisa ${room} lisensi untuk semua paket.`,
    };
  }

  if (licenses === 0) {
    return { ok: true, lines: lines.filter((line) => line.lineId !== key) };
  }

  const nextLine: CartLine = {
    lineId: key,
    productSlug: product.slug,
    packageId,
    cycle,
    licenses,
  };
  const index = lines.findIndex((line) => line.lineId === key);
  if (index === -1) return { ok: true, lines: [...lines, nextLine] };
  const copy = lines.slice();
  copy[index] = nextLine;
  return { ok: true, lines: copy };
}

export function relocateLine(
  lines: CartLine[],
  product: Product,
  lineId: string,
  packageId: PackageTier,
  cycle: BillingCycle,
): QuotaResult {
  const source = lines.find((line) => line.lineId === lineId);
  if (!source || source.productSlug !== product.slug) {
    return { ok: false, message: "Item keranjang tidak ditemukan." };
  }
  if (source.packageId === packageId && source.cycle === cycle) {
    return { ok: true, lines };
  }
  const without = lines.filter((line) => line.lineId !== lineId);
  const target = without.find((line) => line.lineId === lineKey(product.slug, packageId, cycle));
  return setLineLicenses(without, product, packageId, cycle, (target?.licenses ?? 0) + source.licenses);
}

export function removeLine(lines: CartLine[], lineId: string): CartLine[] {
  return lines.filter((line) => line.lineId !== lineId);
}

export function priceCart(
  lines: CartLine[],
  catalog: Product[],
): { ok: true; rows: PricedLine[]; total: number } | { ok: false; message: string } {
  if (lines.length === 0) return { ok: false, message: "Keranjang masih kosong." };

  const totals = new Map<string, number>();
  for (const line of lines) {
    totals.set(line.productSlug, (totals.get(line.productSlug) ?? 0) + line.licenses);
  }

  for (const [slug, count] of totals) {
    const product = catalog.find((item) => item.slug === slug);
    if (!product) return { ok: false, message: "Ada produk yang tidak lagi tersedia." };
    if (!Number.isInteger(count) || count < 1 || count > product.promoQuota) {
      return { ok: false, message: `Kuota promo ${product.name} tidak cukup.` };
    }
  }

  const rows: PricedLine[] = [];
  for (const line of lines) {
    if (!Number.isInteger(line.licenses) || line.licenses < 1) {
      return { ok: false, message: "Jumlah lisensi tidak valid." };
    }
    const product = catalog.find((item) => item.slug === line.productSlug);
    const pkg = product?.packages.find((item) => item.id === line.packageId);
    if (!product || !pkg) return { ok: false, message: "Paket tidak dikenali." };
    const unit = unitPrice(pkg, line.cycle);
    rows.push({
      ...line,
      name: product.name,
      packageName: pkg.name,
      unit,
      amount: unit * line.licenses,
    });
  }

  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  return { ok: true, rows, total };
}
