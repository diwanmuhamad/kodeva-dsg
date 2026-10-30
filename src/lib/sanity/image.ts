import { createImageUrlBuilder } from "@sanity/image-url";

import { sanityDataset, sanityProjectId } from "@/lib/sanity/env";

const builder = createImageUrlBuilder({
  projectId: sanityProjectId,
  dataset: sanityDataset,
});

export function urlForImage(source: Parameters<typeof builder.image>[0]): string {
  return builder.image(source).width(1600).height(1200).fit("crop").auto("format").url();
}
