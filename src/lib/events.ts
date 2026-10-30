import { unitPrice } from "@/lib/cart";
import { CAMPAIGN } from "@/lib/cta-event";
import type { DataLayerEvent } from "@/lib/datalayer";
import { categoryLabel } from "@/lib/catalog-query";
import { cycleLabel } from "@/lib/format";
import type { BillingCycle, PackageTier, PricedLine, Product, UtmParams } from "@/lib/types";
import { compactUtm } from "@/lib/utm";

function gaItem(
  product: Product,
  packageId: PackageTier,
  cycle: BillingCycle,
  quantity: number,
) {
  const pkg = product.packages.find((item) => item.id === packageId);
  const price = pkg ? unitPrice(pkg, cycle) : 0;
  return {
    item_id: product.slug,
    item_name: product.name,
    item_category: categoryLabel(product.category),
    item_variant: `${pkg?.name ?? packageId} / ${cycleLabel(cycle)}`,
    item_list_name: "Promo Akhir Tahun",
    price,
    quantity,
  };
}

export function buildViewItem(
  product: Product,
  packageId: PackageTier,
  cycle: BillingCycle,
  utm: UtmParams,
): DataLayerEvent {
  const item = gaItem(product, packageId, cycle, 1);
  return {
    event: "view_item",
    campaign: CAMPAIGN,
    ecommerce: {
      currency: "IDR",
      value: item.price,
      items: [item],
    },
    ...compactUtm(utm),
  };
}

export function buildAddToCart(
  product: Product,
  packageId: PackageTier,
  cycle: BillingCycle,
  quantity: number,
  utm: UtmParams,
): DataLayerEvent {
  const item = gaItem(product, packageId, cycle, quantity);
  return {
    event: "add_to_cart",
    campaign: CAMPAIGN,
    ecommerce: {
      currency: "IDR",
      value: item.price * quantity,
      items: [item],
    },
    ...compactUtm(utm),
  };
}

export function buildBeginCheckout(rows: PricedLine[], total: number, utm: UtmParams): DataLayerEvent {
  return {
    event: "begin_checkout",
    campaign: CAMPAIGN,
    ecommerce: {
      currency: "IDR",
      value: total,
      items: rows.map((row) => ({
        item_id: row.productSlug,
        item_name: row.name,
        item_variant: `${row.packageName} / ${cycleLabel(row.cycle)}`,
        item_list_name: "Promo Akhir Tahun",
        price: row.unit,
        quantity: row.licenses,
      })),
    },
    ...compactUtm(utm),
  };
}
