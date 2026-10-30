import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ao3rfvgu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-10-01",
  useCdn: false,
});

const landing = await client.fetch(
  `*[_type == "landingPage" && _id == "landingPage"][0]{ title, hero{ title }, "featuredCount": count(featured.items) }`,
);
const posts = await client.fetch(
  `*[_type == "post"]{ title, status, "slug": slug.current } | order(publishedAt desc)`,
);

console.log(
  JSON.stringify(
    {
      landing,
      postCount: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status === "draft").length,
      slugs: posts.map((p) => p.slug),
    },
    null,
    2,
  ),
);
