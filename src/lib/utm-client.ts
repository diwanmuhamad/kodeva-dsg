"use client";

import { compactUtm, hasUtm, mergeUtm, readUtmFromSearch } from "@/lib/utm";
import type { UtmParams } from "@/lib/types";

export const UTM_STORAGE_KEY = "kodeva_utm";

export function readStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    return compactUtm(JSON.parse(raw) as UtmParams);
  } catch {
    return {};
  }
}

export function captureUtmFromLocation(href: string): UtmParams {
  const url = new URL(href, "http://localhost");
  const incoming = readUtmFromSearch(url.searchParams);
  if (!hasUtm(incoming)) return readStoredUtm();
  const merged = mergeUtm(readStoredUtm(), incoming);
  window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
  document.cookie = `kodeva_utm=${encodeURIComponent(JSON.stringify(merged))}; path=/; max-age=2592000; samesite=lax`;
  return merged;
}
