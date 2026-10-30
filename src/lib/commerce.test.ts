import { describe, expect, it } from "vitest";

import { listUnit, priceCart, relocateLine, remainingQuota, setLineLicenses, unitPrice } from "@/lib/cart";
import { filterProducts, minMonthlyPrice } from "@/lib/catalog-query";
import { cmsSchema } from "@/lib/cms/schema";
import { seedCms } from "@/lib/cms/seed";
import { publishedPosts } from "@/lib/cms/posts";
import { resetViewTracking, shouldTrackView } from "@/lib/datalayer";
import { buildAddToCart } from "@/lib/events";
import { formatIdr } from "@/lib/format";
import { products } from "@/lib/products";
import { pageNumber, paginate } from "@/lib/query";
import { createRateLimiter } from "@/lib/rate-limit";
import { signSession, verifySession } from "@/lib/session-token";
import { slugify } from "@/lib/slug";
import type { CartLine, Product } from "@/lib/types";
import { hasUtm, mergeUtm, readUtmFromSearch } from "@/lib/utm";
import { parseLead } from "@/lib/validation";

function sampleProduct(): Product {
  return {
    slug: "sample",
    name: "Sample",
    category: "operasional",
    summary: "Ringkasan produk contoh untuk uji kuota.",
    description: "Deskripsi produk contoh.",
    features: ["Satu"],
    promoQuota: 5,
    packages: [
      { id: "basic", name: "Basic", price: 1000, promoPrice: 800, highlights: ["A"] },
      { id: "pro", name: "Pro", price: 2000, promoPrice: 1500, highlights: ["B"] },
      { id: "business", name: "Business", price: 3000, promoPrice: null, highlights: ["C"] },
    ],
    comparison: [],
  };
}

describe("promo quota", () => {
  const product = sampleProduct();

  it("shares one quota across packages and billing cycles", () => {
    const basic = setLineLicenses([], product, "basic", "monthly", 3);
    expect(basic.ok).toBe(true);
    if (!basic.ok) return;
    const both = setLineLicenses(basic.lines, product, "pro", "yearly", 2);
    expect(both.ok).toBe(true);
    if (!both.ok) return;
    expect(remainingQuota(product, both.lines)).toBe(0);
    const overflow = setLineLicenses(both.lines, product, "business", "monthly", 1);
    expect(overflow.ok).toBe(false);
    if (overflow.ok) return;
    expect(overflow.message).toContain("tersisa 0");
  });

  it("allows a line that lands exactly on the quota", () => {
    const result = setLineLicenses([], product, "basic", "monthly", 5);
    expect(result.ok).toBe(true);
  });

  it("frees quota when a line is removed", () => {
    const basic = setLineLicenses([], product, "basic", "monthly", 3);
    if (!basic.ok) throw new Error("expected basic line");
    const pro = setLineLicenses(basic.lines, product, "pro", "monthly", 2);
    if (!pro.ok) throw new Error("expected pro line");
    const removed = setLineLicenses(pro.lines, product, "pro", "monthly", 0);
    if (!removed.ok) throw new Error("expected removal");
    const business = setLineLicenses(removed.lines, product, "business", "monthly", 2);
    expect(business.ok).toBe(true);
  });

  it("does not mutate the original cart when the quota check fails", () => {
    const original: CartLine[] = [];
    const snapshot = structuredClone(original);
    const result = setLineLicenses(original, product, "basic", "monthly", 1.5);
    expect(result.ok).toBe(false);
    expect(original).toEqual(snapshot);
  });

  it("moves licenses between packages without double-counting quota", () => {
    const basic = setLineLicenses([], product, "basic", "monthly", 3);
    if (!basic.ok) throw new Error("expected line");
    const pro = setLineLicenses(basic.lines, product, "pro", "monthly", 2);
    if (!pro.ok) throw new Error("expected second line");
    const basicLine = pro.lines.find((line) => line.packageId === "basic");
    if (!basicLine) throw new Error("missing basic line");
    const moved = relocateLine(pro.lines, product, basicLine.lineId, "pro", "monthly");
    expect(moved.ok).toBe(true);
    if (!moved.ok) return;
    expect(moved.lines).toHaveLength(1);
    expect(moved.lines[0]?.licenses).toBe(5);
  });
});

describe("pricing", () => {
  const product = sampleProduct();

  it("uses the promo price and bills a year as ten months", () => {
    const basic = product.packages[0];
    const business = product.packages[2];
    if (!basic || !business) throw new Error("missing package");
    expect(unitPrice(basic, "monthly")).toBe(800);
    expect(unitPrice(basic, "yearly")).toBe(8000);
    expect(listUnit(basic, "yearly")).toBe(12000);
    expect(unitPrice(business, "monthly")).toBe(3000);
  });

  it("rejects a cart that exceeds quota even if the lines were built by hand", () => {
    const priced = priceCart(
      [
        {
          lineId: "sample:basic:monthly",
          productSlug: "sample",
          packageId: "basic",
          cycle: "monthly",
          licenses: 4,
        },
        {
          lineId: "sample:pro:monthly",
          productSlug: "sample",
          packageId: "pro",
          cycle: "monthly",
          licenses: 2,
        },
      ],
      [product],
    );
    expect(priced.ok).toBe(false);
  });

  it("totals promo price times licenses", () => {
    const line = setLineLicenses([], product, "basic", "yearly", 2);
    if (!line.ok) throw new Error("expected line");
    const priced = priceCart(line.lines, [product]);
    expect(priced.ok).toBe(true);
    if (!priced.ok) return;
    expect(priced.total).toBe(16000);
  });
});

describe("catalog", () => {
  it("filters by category, search, and price", () => {
    expect(filterProducts(products, { category: "sdm" }).map((item) => item.slug)).toEqual([
      "kodeva-hr",
      "kodeva-absensi",
    ]);
    expect(filterProducts(products, { q: "kasir" })).toHaveLength(1);
    expect(filterProducts(products, { q: "zzzz-tidak-ada" })).toHaveLength(0);
    const cheapest = filterProducts(products, { sort: "harga-naik" })[0];
    expect(cheapest?.slug).toBe("kodeva-absensi");
    expect(minMonthlyPrice(cheapest!)).toBe(39000);
  });

  it("paginates published posts and hides drafts", () => {
    const visible = publishedPosts(seedCms.posts);
    expect(visible.some((post) => post.status === "draft")).toBe(false);
    const page = paginate(visible, pageNumber("2"));
    expect(page.totalPages).toBe(2);
    expect(page.items).toHaveLength(1);
    expect(pageNumber("abc")).toBe(1);
  });
});

describe("leads and utm", () => {
  const now = 1_700_000_000_000;

  it("accepts email or WhatsApp and rejects a fast submit", () => {
    const valid = parseLead(
      { name: "Rina", contact: "rina@usaha.id", website: "", startedAt: now - 3000, utm: {} },
      now,
    );
    expect(valid.ok).toBe(true);
    const phone = parseLead(
      { name: "Rina", contact: "0812-3456-7890", website: "", startedAt: now - 3000 },
      now,
    );
    expect(phone.ok).toBe(true);
    const fast = parseLead(
      { name: "Rina", contact: "rina@usaha.id", website: "", startedAt: now - 200 },
      now,
    );
    expect(fast).toMatchObject({ ok: false, spam: false });
  });

  it("treats a filled honeypot as spam", () => {
    const spam = parseLead(
      { name: "Bot", contact: "bot@spam.test", website: "https://spam.test", startedAt: now - 5000 },
      now,
    );
    expect(spam).toMatchObject({ ok: false, spam: true });
  });

  it("keeps earlier utm values when a later visit only replaces the source", () => {
    const params = new URLSearchParams("utm_source=tiktok&utm_campaign=akhir-tahun");
    const incoming = readUtmFromSearch(params);
    const merged = mergeUtm({ utm_source: "instagram", utm_medium: "bio" }, incoming);
    expect(merged).toEqual({
      utm_source: "tiktok",
      utm_medium: "bio",
      utm_campaign: "akhir-tahun",
    });
    expect(hasUtm({})).toBe(false);
  });
});

describe("guards", () => {
  it("limits repeated leads", () => {
    const limiter = createRateLimiter(5, 10_000);
    for (let index = 0; index < 5; index += 1) expect(limiter.isLimited("1.1.1.1", 1_000 + index)).toBe(false);
    expect(limiter.isLimited("1.1.1.1", 1_500)).toBe(true);
    expect(limiter.isLimited("1.1.1.1", 12_000)).toBe(false);
  });

  it("rejects a tampered or expired studio session", () => {
    const now = 1_700_000_000_000;
    const token = signSession("marketing", "secret", now);
    expect(verifySession(token, "secret", now)).toBe("marketing");
    expect(verifySession(`${token}x`, "secret", now)).toBeNull();
    expect(verifySession(token, "secret", now + 13 * 60 * 60 * 1000)).toBeNull();
  });

  it("does not emit a second view event inside the guard window", () => {
    resetViewTracking();
    expect(shouldTrackView("kodeva-kasir", 1_000)).toBe(true);
    expect(shouldTrackView("kodeva-kasir", 1_200)).toBe(false);
    expect(shouldTrackView("kodeva-kasir", 3_000)).toBe(true);
  });

  it("builds an add_to_cart payload from the chosen package", () => {
    const product = products[0];
    if (!product) throw new Error("missing product");
    const event = buildAddToCart(product, "pro", "monthly", 2, { utm_source: "instagram" });
    expect(event.event).toBe("add_to_cart");
    expect(event.utm_source).toBe("instagram");
    const ecommerce = event.ecommerce as { value: number; items: { quantity: number }[] };
    expect(ecommerce.value).toBe(149000 * 2);
    expect(ecommerce.items[0]?.quantity).toBe(2);
  });

  it("formats rupiah and slugs", () => {
    expect(formatIdr(79000)).toContain("79.000");
    expect(slugify("Kodeva HR & Payroll!")).toBe("kodeva-hr-payroll");
  });

  it("accepts the seeded marketing content", () => {
    expect(cmsSchema.safeParse(seedCms).success).toBe(true);
  });
});
