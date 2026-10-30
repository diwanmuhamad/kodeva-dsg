import { products } from "@/lib/products";

export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const failed = new URL(request.url).searchParams.get("gagal") === "1";
  if (failed) {
    return Response.json(
      { message: "Layanan katalog sedang gangguan (simulasi)." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
  return Response.json(products, { headers: { "Cache-Control": "no-store" } });
}
