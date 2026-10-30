export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ao3rfvgu";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-01";
export const sanityStudioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

export function isSanityConfigured(): boolean {
  return Boolean(sanityProjectId && sanityDataset);
}
