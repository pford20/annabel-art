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
- Images: Astro `<Image>`, sourced from `src/content/work/<slug>/`

## Pages
`/` home · `/originals` · `/prints` · `/commissions` · `/about` · `/contact`

## Content model
Every painting is one folder in `src/content/work/<slug>/` containing:
- `index.md` with frontmatter:
  - `title` (string)
  - `medium` (string, e.g. "Oil on canvas")
  - `width`, `height` (inches, numbers)
  - `year` (number)
  - `type`: `original` | `print`
  - `price` (number, USD) — for prints this is the smallest size
  - `status`: `available` | `sold`
  - `edition` (number, prints only)
  - `sizes` (array of {label, price}, prints only)
  - `featured` (boolean)
- `catalog.jpg` — flat square-on shot, required
- `insitu.jpg` — hung on a wall, originals only

Product copy on the site is only: `Title · Medium · W × H in · Year`. No prose on product cards.

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
