# Annabel Art — project instructions

## What this is
Portfolio + shop for Annabel, a Fort Lauderdale painter (contemporary, figurative, editorial, surreal). Sells originals, limited-edition prints, and takes commissions. Owner is Preston, who has little coding background — explain what you're doing in plain language and one step at a time. Never assume he knows a term.

## Read first
BRAND.md is the design system. It is not optional. Two fonts (Fraunces display, Inter body), five warm-neutral colors, sentence case, no accent color, no logo mark, generous whitespace. If a design choice isn't in BRAND.md, pick the quieter option.

Reference aesthetic: nikeadawi.se — one flat uniform grid, minimal product copy, warm About page.

## Stack
- Astro (static output), Tailwind v4
- Deploy: Cloudflare Pages, auto-deploy from `main`
- Payments: Stripe Checkout via Cloudflare Pages Functions (`/functions`), Stripe Tax enabled
- Email list: MailerLite embed
- Images: Astro `<Image>`, sourced from `src/assets/work/`

## Pages
`/` home · `/portfolio` all work · `/portfolio/<slug>` one piece · `/originals` · `/prints` · `/commissions` · `/about` · `/contact`

## Content model
Every piece on `/portfolio` is one entry in `src/data/work.ts`, with its photo in
`src/assets/work/`. That one file is the whole portfolio — the pages read from it.

Each entry:
  - `slug` (string) — the web address, so `/portfolio/<slug>`
  - `file` (string) — filename inside `src/assets/work/`
  - `title` (string)
  - `year` (number, optional)
  - `medium` (string, optional, e.g. "Acrylic on canvas")
  - `size` (string, optional, e.g. "24 × 36 in")
  - `status`: `available` | `sold` | `print`
  - `price` (number, USD, optional)

Optional fields left out simply don't render. Never print "TBD".

`status` drives the piece page:
  - `available` — price if there is one, plus an Enquire button that opens the
    contact form with the title prefilled
  - `sold` — shows `Sold`, never a price
  - `print` — links to `/prints`

Images are optimized at build time: WebP, 400–1400px, never the originals. Grid
tiles are a uniform shape with the painting contained inside, so nothing is cropped.

Product copy on the site is only: `Title · Medium · Size · Year`. No prose on
product cards — but cards may show status and price: `Available · $1,400` in
ink, `Sold` in stone, plus `Free insured US shipping` on a shop card.

## Page roles
Home sells, Originals is the shop, Portfolio is the gallery.
- `/` — hero is the first available piece with its price and Buy button, then
  every available piece as a shop card, an About teaser, up to six sold
  pieces, and commissions. Nothing available: the hero falls back to
  `FALLBACK_HERO_SLUG` in `src/pages/index.astro`, the selling sections drop
  out, and commissions carries the page.
- `/originals` — only what is for sale, as shop cards (image, title, medium
  and size, price, shipping line, Buy, Details). Empty state when nothing is.
- `/portfolio` — every painting, sold included, in the flat gallery grid with
  a status line under each caption. Available pieces sort to the top.

Two components do the rendering, both fed from `src/data/work.ts`:
`ShopCard.astro`/`ShopGrid.astro` for selling, `WorkGrid.astro` for the gallery.

### Later
Not built, but worth preserving as intent:
  - A real `original` | `print` type split, rather than folding it into `status`
  - Edition sizes and per-size pricing for prints
  - In-situ shots (hung on a wall) as a second image on originals
  - A `featured` flag to pick the home page hero

## Commissions
Quote only. No tiers, no published or "from $" pricing, no standing deposit. Every request comes through the inquiry form and is priced individually; Annabel replies with a quote that states the timeline and revision policy.

## Rules
- Sold work stays visible with a `Sold` badge. Never delete it.
- No color anywhere except the paintings.
- Mobile first. Test at 375px width before calling anything done.
- Don't add libraries or frameworks without asking.
- Keep Stripe keys in Cloudflare env vars, never in code.
- Commit in small steps with plain-language messages.

## How to work with Preston
- Before building, state the plan in 3–5 bullets and wait for a go.
- After each step, say what changed and what to check in the browser.
- If something needs a password, account, or a click outside the terminal, stop and give exact instructions.
