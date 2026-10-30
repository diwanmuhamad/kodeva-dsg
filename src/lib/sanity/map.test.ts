import { describe, expect, it } from "vitest";

import { mapSanityLanding, mapSanityPost, portableTextToBlocks } from "@/lib/sanity/map";

describe("portableTextToBlocks", () => {
  it("maps headings, paragraphs, and bullet lists", () => {
    const blocks = portableTextToBlocks([
      {
        _key: "h1",
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Judul" }],
      },
      {
        _key: "p1",
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "Paragraf" }],
      },
      {
        _key: "l1",
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", text: "Satu" }],
      },
      {
        _key: "l2",
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", text: "Dua" }],
      },
    ]);

    expect(blocks).toEqual([
      { id: "h1", type: "heading", text: "Judul" },
      { id: "p1", type: "paragraph", text: "Paragraf" },
      { id: "l1", type: "list", items: ["Satu", "Dua"] },
    ]);
  });
});

describe("mapSanityPost", () => {
  it("keeps draft status and product slug", () => {
    const post = mapSanityPost({
      _id: "post-1",
      title: "Contoh",
      slug: "contoh",
      excerpt: "Ringkasan cukup panjang.",
      category: "Promo",
      status: "draft",
      publishedAt: "2026-10-30",
      productSlug: "kodeva-kasir",
      cover: { mode: "preset:toko", alt: "Toko" },
      body: [
        {
          _key: "b1",
          _type: "block",
          style: "normal",
          children: [{ text: "Isi" }],
        },
      ],
    });

    expect(post.status).toBe("draft");
    expect(post.productSlug).toBe("kodeva-kasir");
    expect(post.cover).toBe("preset:toko");
  });
});

describe("mapSanityLanding", () => {
  it("maps featured product cards", () => {
    const landing = mapSanityLanding({
      hero: {
        eyebrow: "Promo",
        title: "Judul hero yang cukup",
        subtitle: "Subjudul hero yang panjang supaya valid.",
        ctaLabel: "Katalog",
        ctaHref: "/katalog",
        image: { mode: "preset:toko", alt: "Hero" },
      },
      featured: {
        heading: "Unggulan",
        intro: "Intro unggulan",
        items: [
          {
            _key: "a",
            productSlug: "kodeva-kasir",
            headline: "Kasir",
            image: { mode: "product", alt: "Kasir" },
          },
        ],
      },
      testimonials: { heading: "T", intro: "I", items: [] },
      faq: { heading: "F", intro: "I", items: [] },
      lead: { heading: "L", intro: "I", note: "N", submitLabel: "Kirim" },
    });

    expect(landing.featured.items[0]?.productSlug).toBe("kodeva-kasir");
    expect(landing.featured.items[0]?.image).toBe("product");
  });
});
