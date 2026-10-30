import { z } from "zod";

import { billingCycles, packageTiers } from "@/lib/types";

export const utmSchema = z.object({
  utm_source: z.string().trim().max(120).optional(),
  utm_medium: z.string().trim().max(120).optional(),
  utm_campaign: z.string().trim().max(120).optional(),
  utm_content: z.string().trim().max(120).optional(),
  utm_term: z.string().trim().max(120).optional(),
});

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(?:\+62|62|0)8\d{8,12}$/;

export function isEmailOrWhatsapp(value: string): boolean {
  const trimmed = value.trim();
  if (emailPattern.test(trimmed)) return true;
  return phonePattern.test(trimmed.replace(/[\s-]/g, ""));
}

const leadObjectSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80, "Nama terlalu panjang."),
  contact: z
    .string()
    .trim()
    .min(1, "Isi email atau nomor WhatsApp.")
    .refine(isEmailOrWhatsapp, "Gunakan email atau nomor WhatsApp yang valid."),
  website: z.string().optional().default(""),
  startedAt: z.number().int(),
  utm: utmSchema.optional().default({}),
});

export type LeadInput = z.infer<typeof leadObjectSchema>;

export type LeadParseResult =
  | { ok: true; data: LeadInput }
  | { ok: false; spam: true }
  | { ok: false; spam: false; message: string };

export function parseLead(input: unknown, now = Date.now()): LeadParseResult {
  const parsed = leadObjectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      spam: false,
      message: parsed.error.issues[0]?.message ?? "Data lead belum lengkap.",
    };
  }
  if (parsed.data.website.trim()) return { ok: false, spam: true };

  const elapsed = now - parsed.data.startedAt;
  if (elapsed < 1500 || elapsed > 24 * 60 * 60 * 1000) {
    return {
      ok: false,
      spam: false,
      message: "Waktu pengisian tidak wajar. Muat ulang halaman, lalu coba lagi.",
    };
  }
  return { ok: true, data: parsed.data };
}

export const cartLineSchema = z.object({
  lineId: z.string().min(1),
  productSlug: z.string().min(1),
  packageId: z.enum(packageTiers),
  cycle: z.enum(billingCycles),
  licenses: z.number().int().positive().max(999),
});

export const checkoutRequestSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(80, "Nama terlalu panjang."),
  email: z.string().trim().email("Email tidak valid."),
  outcome: z.enum(["success", "failed"]),
  utm: utmSchema.optional().default({}),
  items: z.array(cartLineSchema).min(1, "Keranjang masih kosong.").max(30),
});

export type CheckoutInput = z.infer<typeof checkoutRequestSchema>;
