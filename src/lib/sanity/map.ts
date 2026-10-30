import type { LandingContent, Post, RichBlock } from "@/lib/cms/schema";
import { urlForImage } from "@/lib/sanity/image";
import type {
  SanityCmsImage,
  SanityLandingDoc,
  SanityPortableBlock,
  SanityPostDoc,
} from "@/lib/sanity/types";

function resolveImage(image: SanityCmsImage | undefined, fallback = "preset:toko"): string {
  const mode = image?.mode || "upload";
  if (mode === "product" || mode.startsWith("preset:")) return mode;
  if (mode === "upload" && image?.asset) {
    try {
      return urlForImage(image.asset);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function resolveAlt(image: SanityCmsImage | undefined, fallback: string): string {
  return image?.alt?.trim() || fallback;
}

/** Convert Sanity Portable Text into the app's simple rich-block model. */
export function portableTextToBlocks(body: SanityPortableBlock[] | undefined): RichBlock[] {
  if (!body?.length) {
    return [{ id: "empty", type: "paragraph", text: "Konten belum diisi." }];
  }

  const blocks: RichBlock[] = [];
  let listBuffer: string[] = [];
  let listKey = "list";

  const flushList = () => {
    if (!listBuffer.length) return;
    blocks.push({ id: listKey, type: "list", items: listBuffer });
    listBuffer = [];
  };

  for (const block of body) {
    if (block._type !== "block") continue;
    const text = (block.children ?? [])
      .map((child) => child.text ?? "")
      .join("")
      .trim();
    if (!text) continue;

    if (block.listItem === "bullet") {
      if (!listBuffer.length) listKey = block._key || `list-${blocks.length}`;
      listBuffer.push(text);
      continue;
    }

    flushList();
    const id = block._key || `block-${blocks.length}`;
    if (block.style === "h2") {
      blocks.push({ id, type: "heading", text });
    } else {
      blocks.push({ id, type: "paragraph", text });
    }
  }

  flushList();
  return blocks.length
    ? blocks
    : [{ id: "empty", type: "paragraph", text: "Konten belum diisi." }];
}

export function mapSanityPost(doc: SanityPostDoc): Post {
  return {
    id: doc._id,
    title: doc.title?.trim() || "Tanpa judul",
    slug: doc.slug?.trim() || doc._id,
    excerpt: doc.excerpt?.trim() || "",
    cover: resolveImage(doc.cover),
    coverAlt: resolveAlt(doc.cover, doc.title || "Gambar artikel"),
    category: doc.category?.trim() || "Promo",
    status: doc.status === "published" ? "published" : "draft",
    publishedAt: (doc.publishedAt || "2026-01-01").slice(0, 10),
    productSlug: doc.productSlug || null,
    body: portableTextToBlocks(doc.body),
  };
}

export function mapSanityLanding(doc: SanityLandingDoc): LandingContent {
  return {
    hero: {
      eyebrow: doc.hero?.eyebrow?.trim() || "Promo",
      title: doc.hero?.title?.trim() || "Judul promo",
      subtitle: doc.hero?.subtitle?.trim() || "Subjudul promo belum diisi di Sanity.",
      image: resolveImage(doc.hero?.image),
      imageAlt: resolveAlt(doc.hero?.image, "Gambar hero"),
      ctaLabel: doc.hero?.ctaLabel?.trim() || "Lihat katalog",
      ctaHref: doc.hero?.ctaHref?.trim() || "/katalog",
    },
    featured: {
      heading: doc.featured?.heading?.trim() || "Produk unggulan",
      intro: doc.featured?.intro?.trim() || "",
      items: (doc.featured?.items ?? []).map((item, index) => ({
        id: item._key || `feat-${index}`,
        productSlug: item.productSlug || "kodeva-kasir",
        headline: item.headline?.trim() || "Produk",
        image: resolveImage(item.image, "product"),
        imageAlt: resolveAlt(item.image, item.headline || "Produk"),
      })),
    },
    testimonials: {
      heading: doc.testimonials?.heading?.trim() || "Testimoni",
      intro: doc.testimonials?.intro?.trim() || "",
      items: (doc.testimonials?.items ?? []).map((item, index) => ({
        id: item._key || `tm-${index}`,
        quote: item.quote?.trim() || "",
        name: item.name?.trim() || "",
        role: item.role?.trim() || "",
        company: item.company?.trim() || "",
      })),
    },
    faq: {
      heading: doc.faq?.heading?.trim() || "FAQ",
      intro: doc.faq?.intro?.trim() || "",
      items: (doc.faq?.items ?? []).map((item, index) => ({
        id: item._key || `faq-${index}`,
        question: item.question?.trim() || "",
        answer: item.answer?.trim() || "",
      })),
    },
    lead: {
      heading: doc.lead?.heading?.trim() || "Lead",
      intro: doc.lead?.intro?.trim() || "",
      note: doc.lead?.note?.trim() || "",
      submitLabel: doc.lead?.submitLabel?.trim() || "Kirim",
    },
  };
}
