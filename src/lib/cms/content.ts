import { cacheLife, cacheTag } from "next/cache";

import { readCms } from "@/lib/cms/disk";
import type { CmsData } from "@/lib/cms/schema";
import { sanityClient } from "@/lib/sanity/client";
import { isSanityConfigured } from "@/lib/sanity/env";
import { mapSanityLanding, mapSanityPost } from "@/lib/sanity/map";
import { landingQuery, postsQuery } from "@/lib/sanity/queries";
import type { SanityLandingDoc, SanityPostDoc } from "@/lib/sanity/types";

async function fetchFromSanity(): Promise<CmsData | null> {
  if (!isSanityConfigured()) return null;

  try {
    const [landing, posts] = await Promise.all([
      sanityClient.fetch<SanityLandingDoc | null>(landingQuery),
      sanityClient.fetch<SanityPostDoc[]>(postsQuery),
    ]);

    if (!landing || !posts?.length) {
      // Studio belum di-seed: pakai fallback lokal supaya situs tetap jalan.
      return null;
    }

    const mappedLanding = mapSanityLanding(landing);
    if (!mappedLanding.featured.items.length || !mappedLanding.faq.items.length) {
      return null;
    }

    return {
      landing: mappedLanding,
      posts: posts.map(mapSanityPost),
    };
  } catch (error) {
    console.error("[cms] Sanity fetch failed, using local fallback.", error);
    return null;
  }
}

export async function getCms(): Promise<CmsData> {
  "use cache";
  cacheTag("cms");
  cacheTag("post");
  cacheTag("landingPage");
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const fromSanity = await fetchFromSanity();
  if (fromSanity) return fromSanity;
  return readCms();
}
