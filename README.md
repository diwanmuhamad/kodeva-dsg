# Kodeva — Promo Akhir Tahun (Skill Test DSG)

Landing page + blog (Sanity CMS) and a mini marketplace frontend for the fictional brand **Kodeva**. Built for the PT Digital Solusi Grup fullstack skill test.

## Actual time spent

About **7 hours** of focused work (scaffolding, marketplace, CMS wiring, tracking/UTM, tests, Sanity integration, docs).

## Stack

| Area | Choice | Why |
| --- | --- | --- |
| App | Next.js 16 (App Router) + TypeScript | SSR/ISR, strong SEO metadata, one repo for site + APIs |
| Styles | Tailwind CSS 4 | Fast mobile layout without heavy UI kits |
| CMS | **Sanity** (`kodeva-blog/studio`, project `ao3rfvgu`) | Non-technical editors, draft/publish, images, no redeploy for content |
| Marketplace data | Typed JSON modules + route handlers | Brief allows mock/JSON; keeps checkout frontend-only |
| Cart | Zustand + `localStorage` | Persists after refresh; shared quota logic is pure TS (tested) |
| Validation | Zod | Shared rules for leads, checkout, CMS shapes |
| Tests | Vitest | Quotas, pricing, UTM, spam guards, GA payloads |

## Demo accounts

### Sanity Studio (content: landing + blog)

1. Run studio: `npm run studio` → http://localhost:3333  
2. Sign in with the Sanity account that owns project `ao3rfvgu`, **or** invite `hendrawan.putra@dsg.id` as Viewer/Editor in [sanity.io/manage](https://www.sanity.io/manage).  
3. Edit **Halaman promo (landing)** and **Artikel blog**. Set article status to **Terbit** to appear on `/blog`.

### Local leads panel (form submissions)

- URL: `/admin/login`  
- Username: `marketing`  
- Password: `PromoAkhirTahun2026`  

Leads are stored by the Next.js API (honeypot + timing spam checks + rate limit). This panel is **leads only** — landing/blog content is edited in Sanity Studio.

## Run locally

```bash
# 1) Site
cp .env.example .env.local   # already matches project ao3rfvgu
npm install
npm run dev                  # http://localhost:3000

# 2) Sanity Studio (separate terminal)
npm run studio               # http://localhost:3333

# 3) Optional: re-seed Sanity from data/cms.seed.json (already seeded once in ao3rfvgu)
# Create an Editor API token in sanity.io/manage → copy to SANITY_API_WRITE_TOKEN
SANITY_API_WRITE_TOKEN=... npm run seed:sanity
```

Content is already published in Sanity project `ao3rfvgu` / dataset `production` (landing singleton + blog posts). The Next.js site reads that first and falls back to `data/cms.json` only if Sanity is empty or unreachable.


```bash
npm test
npm run build
```

## Architecture (short)

```
Browser → Next.js (landing, blog, katalog, keranjang, checkout)
                ├─ getCms() → Sanity GROQ (fallback: data/cms.json)
                ├─ products.ts → mock catalog API routes
                ├─ POST /api/leads → data/leads.json (admin panel)
                └─ POST /api/revalidate ← Sanity webhook / manual secret
```

### Caching / revalidation (no redeploy)

- `getCms()` uses `"use cache"` + tags `cms`, `post`, `landingPage`, with ~60s stale-while-revalidate.
- Sanity webhook (or `POST /api/revalidate` with `x-revalidate-secret`) calls `revalidateTag(...)`.
- Impact: editors see updates within about one minute after publish (or immediately after webhook). No Vercel redeploy needed for copy/images.

### Marketplace notes

- Catalog ≥ 6 products, category filter, search/sort reflected in URL (bonus).
- Product detail: screenshots, promo strikethrough, package + monthly/yearly, shared promo quota.
- Cart persists; quantity cannot exceed remaining product quota across packages.
- Checkout is simulated (success/failure) with buyer validation + UTM on the order payload.

### Marketing / tracking

- GA4-shaped events to `window.dataLayer`: `view_item`, `add_to_cart`, `begin_checkout`, landing CTA clicks.
- View events are guarded against React re-render duplicates.
- UTM from Instagram/TikTok is captured once, stored, and attached to leads + checkout.

## Assumptions

1. **MY/SG expansion** is future work: content model is English-friendly and Sanity can add locales later; no multi-currency/i18n UI in this 6–8h cut.
2. Marketplace stays frontend-only per brief; a backend payment plan is documented below.
3. If Sanity has no seeded documents yet, the site falls back to local seed content so reviewers can still browse.
4. Ambiguous CMS “custom vs ready-made”: we chose Sanity (ready-made) for marketing usability.

## Status

| Area | Status |
| --- | --- |
| Landing (hero, featured, testimonials, FAQ, lead) | Done — Sanity fields |
| Blog list + detail + slug + draft/publish + product link | Done — Sanity |
| Mini marketplace cart/checkout/quota | Done |
| GA4 dataLayer + UTM persistence | Done |
| Vitest for quotas/pricing/UTM/spam | Done |
| Lighthouse mobile ≥ 80 | Verify on deploy (images remotePatterns + App Router caching in place) |
| Sanity seed in cloud | Done — landing + 7 published posts + 1 draft in project `ao3rfvgu` |
| Deploy + invite reviewer to Sanity | Pending your GitHub/Vercel push |

### If one more week

- Sanity Localization for MY/SG, preview pane, scheduled publish.
- Real payment webhook sketch implemented against a sandbox gateway.
- Playwright smoke tests for cart quota and checkout.

## Backend plan (marketplace → real payments)

Required endpoints (sketch):

| Method | Path | Role |
| --- | --- | --- |
| GET | `/api/products` | Catalog + live promo quota |
| POST | `/api/cart/quote` | Server-side price + quota check |
| POST | `/api/orders` | Create order (pending), attach UTM |
| POST | `/api/payments/session` | Create gateway session (Midtrans/Xendit/Stripe) |
| POST | `/api/payments/webhook` | Verify signature, mark paid/failed, decrement quota |
| GET | `/api/orders/:id` | Buyer status |
| POST | `/api/licenses/fulfill` | Email/license delivery after paid |

Secure flow: never trust client prices; verify webhook signatures; idempotent payment events; quota decrement in a transaction only after `paid`; store license keys encrypted; promo quota audited.

## Submission checklist

1. Push repo (visible commit history, no squash).  
2. Deploy (Vercel recommended).  
3. Invite Sanity viewer + send `/admin` demo credentials.  
4. Email `recruitment@dsg.id` (CC listed in brief) with repo, deploy URL, CMS access.
