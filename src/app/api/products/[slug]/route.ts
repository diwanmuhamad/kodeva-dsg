import { getProduct } from "@/lib/products";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const { slug } = await context.params;
  const failed = new URL(request.url).searchParams.get("gagal") === "1";
  const headers = { "Cache-Control": "no-store" };
  if (failed) {
    return Response.json({ message: "Layanan produk sedang gangguan (simulasi)." }, { status: 500, headers });
  }
  const product = getProduct(slug);
  if (!product) return Response.json({ message: "Produk tidak ditemukan." }, { status: 404, headers });
  return Response.json(product, { headers });
}
