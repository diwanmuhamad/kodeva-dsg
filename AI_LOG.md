# AI_LOG — Kodeva skill test

AI tools were used throughout this take-home. This file follows the brief: tools, helpful prompts, wrong AI output that was corrected, a heavily assisted area with edge cases, and a part written without AI.

## Tools and where they were used

| Tool | Used for |
| --- | --- |
| Cursor Agent (Composer) | Scaffold Next.js app, marketplace cart/quota, landing/blog UI, Sanity schema + client wiring, tests, README |
| Sanity docs / Vision | Confirm GROQ, webhook signature parsing (`next-sanity/webhook`), Studio structure singleton |

## Helpful prompts (examples)

1. **“Implement shared promo quota across Basic/Pro/Business for the same product, including cart persistence and unit tests.”**  
   Produced the pure functions in `src/lib/cart.ts` and the Vitest cases that catch double-counting when moving licenses between packages.

2. **“Wire Sanity Studio in `kodeva-blog/studio` as the source of landing + blog data, with local JSON fallback and revalidateTag webhook.”**  
   Led to schemas under `schemaTypes/`, `getCms()` Sanity-first fetch, and `/api/revalidate`.

3. **“Keep UTM from the first Instagram/TikTok hit through lead form and checkout without resetting on internal navigation.”**  
   Drove `utm-capture`, merge rules, and attaching UTM to lead/checkout payloads.

## Wrong / insecure AI output that was corrected

### 1. Trusting client-side promo prices in checkout

- **What AI suggested:** Accept line totals from the browser and only validate email.  
- **Why wrong:** A buyer could lower prices or ignore quota.  
- **Fix:** Recalculate with `priceCart()` on the server (`/api/checkout`) from catalog data; reject carts that exceed quota.  
- **Verified:** Vitest `pricing` cases + manual checkout success/failure UI.

### 2. Session cookie compare with `===`

- **What AI suggested:** Compare admin password / session HMAC with normal string equality.  
- **Why wrong:** Timing side-channel on a demo login is still a bad habit; brief asks for solid validation.  
- **Fix:** `safeEqual` / `tokensMatch` for secrets and revalidate header.  
- **Verified:** Vitest rejects tampered session tokens.

### 3. Revalidate only with `revalidate: 60` and no tags

- **What AI first wired:** Time-based ISR only.  
- **Why incomplete:** Marketing needs publish → site without waiting a full minute or redeploying.  
- **Fix:** `"use cache"` + `cacheTag("cms"|"post"|"landingPage")` and Sanity/manual webhook calling `revalidateTag`.  
- **Verified:** Manual `POST /api/revalidate` with `x-revalidate-secret` returns `{ ok: true }`.

## Heavily AI-assisted area + edge cases tested

**Cart quota + package/cycle moves** (`src/lib/cart.ts`, `commerce.test.ts`)

Edge cases tested:

- Shared quota across packages and monthly/yearly lines  
- Exact quota allowed; overflow rejected without mutating the original array  
- Removing a line frees quota  
- Relocating licenses between packages does not double-count  

## Written without AI

**Product catalog copy and pricing table** in `src/lib/products.ts` (names, quotas, comparison rows, Indonesian marketing tone). Chosen manually so the demo catalog feels consistent with the “Promo Akhir Tahun” story and is easy for reviewers to skim—not a generic AI lorem product list.
