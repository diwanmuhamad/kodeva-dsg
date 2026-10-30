export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
export const sanityStudioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

export function isSanityConfigured(): boolean {
  return Boolean(sanityProjectId && sanityDataset);
}
