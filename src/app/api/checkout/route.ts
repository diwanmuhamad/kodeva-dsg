import { priceCart } from "@/lib/cart";
import { products } from "@/lib/products";
import { utmFromCookieHeader } from "@/lib/utm";
import { checkoutRequestSchema } from "@/lib/validation";

function orderCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let index = 0; index < 6; index += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)] ?? "K";
  }
  return `KV-${suffix}`;
}

export async function POST(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 400));
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Data tidak terbaca." }, { status: 400 });
  }

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Periksa data checkout." },
      { status: 400 },
    );
  }

  const priced = priceCart(parsed.data.items, products);
  if (!priced.ok) return Response.json({ ok: false, message: priced.message }, { status: 400 });

  const utm = utmFromCookieHeader(request.headers.get("cookie"), parsed.data.utm);
  const order = {
    customer: { name: parsed.data.name, email: parsed.data.email },
    items: priced.rows,
    total: priced.total,
    currency: "IDR",
    utm,
  };

  if (parsed.data.outcome === "failed") {
    return Response.json({
      ok: true,
      status: "failed",
      message: "Pembayaran ditolak oleh bank simulasi. Tidak ada dana yang terpotong.",
      order,
    });
  }

  return Response.json({
    ok: true,
    status: "success",
    message: "Pembayaran simulasi berhasil. Pada sistem nyata, lisensi dikirim setelah pembayaran terverifikasi.",
    orderId: orderCode(),
    order,
  });
}
