import { createClient } from "next-sanity";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "@/lib/sanity/env";

/** Published content client. CDN off so webhook revalidation always sees fresh data. */
export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: false,
  perspective: "published",
});
