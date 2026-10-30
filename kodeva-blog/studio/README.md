# Kodeva Sanity Studio

Project ID: `ao3rfvgu` · Dataset: `production`

This studio is the **source of truth** for the Kodeva landing page and blog. The Next.js app in the repo root reads published documents via GROQ.

## Run

From the monorepo root:

```bash
npm run studio
```

Or from this folder:

```bash
npm install
npm run dev
```

Open http://localhost:3333 and sign in with your Sanity account.

## Content model

| Type | Purpose |
| --- | --- |
| `landingPage` (singleton id `landingPage`) | Hero, featured products, testimonials, FAQ, lead copy |
| `post` | Blog articles with slug, cover, rich text, category, draft/publish, optional product link |

## Seed from the Next.js app

```bash
# from repo root — needs Editor API token
SANITY_API_WRITE_TOKEN=sk... npm run seed:sanity
```

## Invite reviewers

In [sanity.io/manage](https://www.sanity.io/manage) → project `ao3rfvgu` → Members → invite `hendrawan.putra@dsg.id` (Viewer or Editor).

## Deploy studio (optional)

```bash
npm run deploy
```

Then set `NEXT_PUBLIC_SANITY_STUDIO_URL` on the Next.js deploy to the hosted studio URL.
