import { randomUUID } from "node:crypto";

import { appendLead } from "@/lib/cms/disk";
import { leadRateLimit } from "@/lib/rate-limit";
import { utmFromCookieHeader } from "@/lib/utm";
import { parseLead } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Data tidak terbaca." }, { status: 400 });
  }

  const parsed = parseLead(body);
  if (!parsed.ok && parsed.spam) return Response.json({ ok: true });
  if (!parsed.ok) return Response.json({ ok: false, message: parsed.message }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (leadRateLimit.isLimited(ip, Date.now())) {
    return Response.json(
      { ok: false, message: "Terlalu banyak kiriman. Coba lagi beberapa menit lagi." },
      { status: 429 },
    );
  }

  await appendLead({
    id: randomUUID(),
    name: parsed.data.name,
    contact: parsed.data.contact.trim(),
    createdAt: new Date().toISOString(),
    utm: utmFromCookieHeader(request.headers.get("cookie"), parsed.data.utm),
  });

  return Response.json({ ok: true }, { status: 201 });
}
