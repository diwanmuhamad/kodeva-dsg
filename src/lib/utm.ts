import type { UtmParams } from "@/lib/types";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function readUtmFromSearch(params: { get(name: string): string | null }): UtmParams {
  const utm: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) utm[key] = value.slice(0, 120);
  }
  return utm;
}

export function mergeUtm(current: UtmParams, incoming: UtmParams): UtmParams {
  const next: UtmParams = { ...current };
  for (const key of UTM_KEYS) {
    const value = incoming[key];
    if (value) next[key] = value;
  }
  return next;
}

export function hasUtm(utm: UtmParams): boolean {
  return UTM_KEYS.some((key) => Boolean(utm[key]));
}

export function utmFromCookieHeader(cookieHeader: string | null, fallback: UtmParams = {}): UtmParams {
  const compact = compactUtm(fallback);
  if (hasUtm(compact)) return compact;
  if (!cookieHeader) return {};
  const match = cookieHeader.match(/(?:^|; )kodeva_utm=([^;]*)/);
  if (!match?.[1]) return {};
  try {
    return compactUtm(JSON.parse(decodeURIComponent(match[1])) as UtmParams);
  } catch {
    return {};
  }
}

export function compactUtm(utm: UtmParams): UtmParams {
  const next: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = utm[key]?.trim();
    if (value) next[key] = value.slice(0, 120);
  }
  return next;
}
