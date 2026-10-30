/**
 * Seed landing + blog posts into Sanity from data/cms.json.
 *
 * Usage:
 *   set SANITY_API_WRITE_TOKEN=... (token with Editor access)
 *   node scripts/seed-sanity.mjs
 *
 * Project/dataset default to ao3rfvgu / production.
 */
import { createClient } from "@sanity/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ao3rfvgu";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN. Create a token with Editor rights in sanity.io/manage.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-10-01",
  token,
  useCdn: false,
});

function key() {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function cmsImage(mode, alt) {
  return { _type: "cmsImage", mode, alt };
}

function blocksFromBody(body) {
  const out = [];
  for (const block of body) {
    if (block.type === "heading") {
      out.push({
        _type: "block",
        _key: key(),
        style: "h2",
        markDefs: [],
        children: [{ _type: "span", _key: key(), text: block.text, marks: [] }],
      });
      continue;
    }
    if (block.type === "list") {
      for (const item of block.items) {
        out.push({
          _type: "block",
          _key: key(),
          style: "normal",
          listItem: "bullet",
          level: 1,
          markDefs: [],
          children: [{ _type: "span", _key: key(), text: item, marks: [] }],
        });
      }
      continue;
    }
    out.push({
      _type: "block",
      _key: key(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(), text: block.text, marks: [] }],
    });
  }
  return out;
}

const seedPath = path.join(root, "data", "cms.seed.json");
const localPath = path.join(root, "data", "cms.json");
let seedFile = seedPath;
try {
  await readFile(seedPath, "utf8");
} catch {
  seedFile = localPath;
}
const raw = JSON.parse(await readFile(seedFile, "utf8"));
const landing = raw.landing;

const landingDoc = {
  _id: "landingPage",
  _type: "landingPage",
  title: "Promo Akhir Tahun",
  hero: {
    eyebrow: landing.hero.eyebrow,
    title: landing.hero.title,
    subtitle: landing.hero.subtitle,
    ctaLabel: landing.hero.ctaLabel,
    ctaHref: landing.hero.ctaHref,
    image: cmsImage(landing.hero.image, landing.hero.imageAlt),
  },
  featured: {
    heading: landing.featured.heading,
    intro: landing.featured.intro,
    items: landing.featured.items.map((item) => ({
      _key: key(),
      productSlug: item.productSlug,
      headline: item.headline,
      image: cmsImage(item.image, item.imageAlt),
    })),
  },
  testimonials: {
    heading: landing.testimonials.heading,
    intro: landing.testimonials.intro,
    items: landing.testimonials.items.map((item) => ({
      _key: key(),
      quote: item.quote,
      name: item.name,
      role: item.role,
      company: item.company,
    })),
  },
  faq: {
    heading: landing.faq.heading,
    intro: landing.faq.intro,
    items: landing.faq.items.map((item) => ({
      _key: key(),
      question: item.question,
      answer: item.answer,
    })),
  },
  lead: { ...landing.lead },
};

console.log("Upserting landingPage...");
await client.createOrReplace(landingDoc);

for (const post of raw.posts) {
  const id = `post-${post.slug}`;
  const doc = {
    _id: id,
    _type: "post",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    excerpt: post.excerpt,
    cover: cmsImage(post.cover, post.coverAlt),
    category: post.category,
    status: post.status,
    publishedAt: post.publishedAt,
    productSlug: post.productSlug || undefined,
    body: blocksFromBody(post.body),
  };
  console.log(`Upserting ${id}...`);
  await client.createOrReplace(doc);
}

console.log(`Done. Seeded landing + ${raw.posts.length} posts into ${projectId}/${dataset}.`);
