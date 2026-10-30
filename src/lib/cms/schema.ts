import { z } from "zod";

import { products } from "@/lib/products";

const slugSet = new Set(products.map((product) => product.slug));

const imageSchema = z
  .string()
  .trim()
  .min(1, "Gambar wajib diisi.")
  .max(500)
  .refine(
    (value) =>
      value === "product" ||
      value.startsWith("preset:") ||
      value.startsWith("/media/") ||
      value.startsWith("https://cdn.sanity.io/"),
    "Gambar harus pilihan studio, unggahan lokal, atau URL Sanity CDN.",
  );

const pathSchema = z
  .string()
  .trim()
  .regex(/^\/(?!\/)[a-z0-9\-/?=&%]*$/i, "Tautan harus mengarah ke halaman di situs ini.");

export const richBlockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string().min(1),
    type: z.literal("heading"),
    text: z.string().trim().min(1, "Judul bagian masih kosong.").max(200),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("paragraph"),
    text: z.string().trim().min(1, "Paragraf masih kosong.").max(2000),
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal("list"),
    items: z.array(z.string().trim().min(1).max(300)).min(1, "Daftar butuh minimal satu baris.").max(12),
  }),
]);

export const postSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(4, "Judul artikel terlalu pendek.").max(140),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya huruf kecil, angka, dan tanda hubung."),
  excerpt: z.string().trim().min(10, "Ringkasan terlalu pendek.").max(240),
  cover: imageSchema,
  coverAlt: z.string().trim().min(2, "Teks alternatif gambar wajib diisi.").max(160),
  category: z.string().trim().min(2).max(40),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal belum benar."),
  productSlug: z
    .string()
    .nullable()
    .refine((slug) => slug === null || slugSet.has(slug), "Produk yang ditautkan tidak ada di katalog."),
  body: z.array(richBlockSchema).min(1, "Isi artikel masih kosong.").max(40),
});

const featuredItemSchema = z.object({
  id: z.string().min(1),
  productSlug: z.string().refine((slug) => slugSet.has(slug), "Pilih produk dari katalog."),
  headline: z.string().trim().min(4, "Judul produk unggulan terlalu pendek.").max(120),
  image: imageSchema,
  imageAlt: z.string().trim().min(2).max(160),
});

export const landingSchema = z.object({
  hero: z.object({
    eyebrow: z.string().trim().min(2).max(80),
    title: z.string().trim().min(8, "Judul hero terlalu pendek.").max(140),
    subtitle: z.string().trim().min(20, "Subjudul terlalu pendek.").max(400),
    image: imageSchema,
    imageAlt: z.string().trim().min(2).max(160),
    ctaLabel: z.string().trim().min(2, "Teks tombol wajib diisi.").max(40),
    ctaHref: pathSchema,
  }),
  featured: z.object({
    heading: z.string().trim().min(4).max(80),
    intro: z.string().trim().min(10).max(240),
    items: z.array(featuredItemSchema).min(1).max(6),
  }),
  testimonials: z.object({
    heading: z.string().trim().min(4).max(80),
    intro: z.string().trim().min(10).max(240),
    items: z
      .array(
        z.object({
          id: z.string().min(1),
          quote: z.string().trim().min(10).max(320),
          name: z.string().trim().min(2).max(80),
          role: z.string().trim().min(2).max(80),
          company: z.string().trim().min(2).max(80),
        }),
      )
      .min(1)
      .max(8),
  }),
  faq: z.object({
    heading: z.string().trim().min(4).max(80),
    intro: z.string().trim().min(10).max(240),
    items: z
      .array(
        z.object({
          id: z.string().min(1),
          question: z.string().trim().min(8).max(160),
          answer: z.string().trim().min(10).max(500),
        }),
      )
      .min(1)
      .max(10),
  }),
  lead: z.object({
    heading: z.string().trim().min(4).max(80),
    intro: z.string().trim().min(10).max(300),
    note: z.string().trim().min(4).max(180),
    submitLabel: z.string().trim().min(2).max(40),
  }),
});

export const cmsSchema = z.object({
  landing: landingSchema,
  posts: z.array(postSchema).max(40),
});

export const leadRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  contact: z.string(),
  createdAt: z.string(),
  utm: utmRecordSchema(),
});

function utmRecordSchema() {
  return z.object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_content: z.string().optional(),
    utm_term: z.string().optional(),
  });
}

export type RichBlock = z.infer<typeof richBlockSchema>;
export type Post = z.infer<typeof postSchema>;
export type LandingContent = z.infer<typeof landingSchema>;
export type CmsData = z.infer<typeof cmsSchema>;
export type LeadRecord = z.infer<typeof leadRecordSchema>;
