import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { tokensMatch } from "@/lib/session-token";

type WebhookPayload = {
  _type?: string;
};

/**
 * On-demand revalidation.
 * - Sanity webhook (signed): POST with Sanity-Signature header
 * - Manual/local: POST with x-revalidate-secret header matching REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  const sanitySecret = process.env.SANITY_REVALIDATE_SECRET;
  const hasSanitySignature = Boolean(request.headers.get("sanity-webhook-signature"));

  if (hasSanitySignature && sanitySecret) {
    try {
      const { isValidSignature, body } = await parseBody<WebhookPayload>(request, sanitySecret, true);
      if (!isValidSignature) {
        return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
      }
      revalidateTag("cms", "max");
      if (body?._type) revalidateTag(body._type, "max");
      return NextResponse.json({ ok: true, source: "sanity", type: body?._type ?? null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Webhook error";
      return NextResponse.json({ ok: false, message }, { status: 500 });
    }
  }

  const expected = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get("x-revalidate-secret");
  if (!expected || !tokensMatch(provided, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  revalidateTag("cms", "max");
  revalidateTag("post", "max");
  revalidateTag("landingPage", "max");
  return NextResponse.json({ ok: true, source: "manual" });
}
