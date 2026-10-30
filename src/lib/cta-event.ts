import type { DataLayerEvent } from "@/lib/datalayer";
import type { UtmParams } from "@/lib/types";
import { compactUtm } from "@/lib/utm";

export const CAMPAIGN = "promo-akhir-tahun";

export function buildLandingCta(input: {
  text: string;
  destination: string;
  utm: UtmParams;
}): DataLayerEvent {
  return {
    event: "landing_cta_click",
    campaign: CAMPAIGN,
    cta_text: input.text,
    destination: input.destination,
    ...compactUtm(input.utm),
  };
}
