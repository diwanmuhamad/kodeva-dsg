import { readFile } from "node:fs/promises";

import { uploadPath } from "@/lib/cms/disk";

const types: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name } = await context.params;
  const filePath = uploadPath(name);
  if (!filePath) return new Response("Nama berkas tidak valid.", { status: 400 });
  try {
    const data = await readFile(filePath);
    const extension = name.split(".").pop()?.toLowerCase() ?? "";
    return new Response(data, {
      headers: {
        "Content-Type": types[extension] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Berkas tidak ditemukan.", { status: 404 });
  }
}
