# Carnes Hildebrandt — Demo Website

> ## 🔗 [**OPEN THE LIVE SITE →**](https://alejandrothiessen.github.io/carnes-hildebrandt-demo/)
>
> **This is the link to show the client:** `https://alejandrothiessen.github.io/carnes-hildebrandt-demo/`
> The `github.com` page you are reading now is only the source code.

A multi-page demo/proposal website for **Carnes Hildebrandt** (boutique de carnes, Cuauhtémoc, Chihuahua). Built as a static site — no frameworks, no build step, nothing to install.

## How to preview it

Just double-click `index.html` and it opens in your browser.

> The photos, fonts, and the map are loaded from the internet, so preview it while online. Everything else works offline.

## The pages

The site follows the structure real butcher-shop sites use (home, products, story, store, guides/blog, shipping+FAQ, contact):

| Page | What's on it |
|---|---|
| `index.html` | Landing page: hero, teasers into every other page, featured store products, sample reviews, map |
| `nosotros.html` | The story (garage → boutique), timeline, values, brands/sourcing |
| `cortes.html` | The full counter: 6 product categories + the Wagyu showcase (`#wagyu`) |
| `tienda.html` | The online store: filters, full catalog, WhatsApp checkout |
| `guia.html` | "Guía del parrillero": which cut for what, doneness temperatures, butcher tips — the blog/SEO role |
| `envios.html` | How ordering works, shipping perks, FAQ (`#faq`), wholesale/event CTA |
| `contacto.html` | Address, phone/WhatsApp, hours, map, social cards |
| `404.html` | Custom "not found" page (GitHub Pages serves it automatically) |

Old single-page links still work: `/#tienda`, `/#nosotros`, etc. redirect to the new pages (see `LEGACY` in `main.js`).

## Other files

| File | What it is |
|---|---|
| `styles.css` | All the design — colors/fonts are variables at the top of the file |
| `main.js` | Sticky header, mobile menu, scroll animations, legacy-anchor redirects |
| `store.js` | The online store: product catalog, cart, WhatsApp checkout |
| `store.css` | Styles for the store grids and the cart drawer |

> A cinematic slow-motion video section ("La experiencia Hildebrandt") was built and later parked — it lives in the git history (commit `789622f` and earlier) and can be restored anytime, ideally with footage filmed in the actual shop.

**Editing note:** the header, footer, cart drawer, and floating buttons are duplicated in every HTML page (no build step = no template includes). If you change one of those blocks, copy the change to all pages.

## The online store (no Shopify)

The cart button in the header works on **every** page; the full catalog lives in `tienda.html` and three featured products render on the home page. Checkout goes **through WhatsApp**: the customer picks cuts, adjusts weight (0.5 kg steps) or pieces, and "Enviar pedido por WhatsApp" opens a chat with the shop's number containing the itemized order, estimated subtotal, and pickup/delivery choice. No platform, no fees, no backend.

- **Products & prices** live in the `PRODUCTS` array at the top of `store.js` — names, categories, price per kg/piece, and photos are all edited there. The `FEATURED` array (same file) picks the three home-page products. **All prices in the demo are made up** and marked as such on the page.
- The cart persists in the visitor's browser (localStorage) across pages and visits.
- If they later want **online card payments** without Shopify: Mercado Pago (most common in Mexico) or Stripe checkout links can be wired to the same cart — that step needs a business account and a small serverless function, so it's a phase 2.

## What's real vs. what needs confirming

Info was gathered from their public Facebook/Instagram/TikTok presence and a public review of the shop. **Nothing here came from the owners directly yet**, so confirm everything before launch:

| Item | Value used in the demo | Status |
|---|---|---|
| Name | Carnes Hildebrandt | ✅ From their Facebook page |
| Tagline | "Si lo que buscas es carne de alta calidad, llegaste para quedarte." | ✅ Their own FB tagline |
| City | Cuauhtémoc, Chihuahua | ✅ From their Facebook page |
| Address | Km 11 Corredor Comercial Menonita | ⚠️ From a public review (2024) — confirm |
| Phone / WhatsApp | 625 150 7388 | ⚠️ From a public review (2024) — confirm |
| Hours | Mon–Sat 9:00–19:00, Sun 11:00–16:00 | ⚠️ From a public review (2024) — confirm |
| Products / brands | USDA Prime/Choice, Certified Angus Beef, Wagyu (Japanese & Australian, Stone Axe), Ganadería Revuelta beef, Norson pork, rubs, knives, shipping nationwide, cash & card | ⚠️ From a public review (2024) — confirm current lineup (shown in `nosotros.html`) |
| "Started in the family garage in 2021" story + timeline | `nosotros.html` and home teaser | ⚠️ From a public review — confirm wording with the family |
| **Customer reviews** on the home page | Three quotes under "Lo que se dice del mostrador" | 🔴 **Written as placeholders** (labeled as such on the page) — replace with real Facebook/Google reviews before launch |
| Wholesale/"restaurantes y eventos" invitation | `envios.html` FAQ + closing band | ⚠️ Phrased as an invitation to chat, but confirm they want B2B orders |
| FAQ answers | `envios.html` | ⚠️ Written from what the site already claims — have the owners read them |
| Social links | facebook.com/CarnesHildebrandt, instagram/tiktok @carneshildebrandt | ✅ Verified handles |

A small **"Maqueta de demostración"** badge floats at the bottom-left of every page as a reminder; delete that block from each HTML file (and its CSS) for the final version.

## Photos are placeholders

All images are free-to-use Unsplash stock photos, hot-linked. For the real site, replace them with the shop's own photos (their Facebook/Instagram have plenty of great ones — ask the owners for the originals):

- Home hero background: edit the `url(...)` inside `.hero-bg` in `styles.css`
- Sub-page headers: edit the `--ph-img` inline style on each page's `.page-hero`
- All other images: edit the `<img src="...">` tags in each HTML file

## Changing the look

Open `styles.css` — the first block (`:root`) holds every color and font. Swap those variables and the whole site follows.

## Suggested next steps to go live

1. Confirm the ⚠️/🔴 items above with the owners and drop in their real photos/logo.
2. Buy a domain (e.g. `carneshildebrandt.com` / `.mx`).
3. Host it free on Netlify, Vercel, GitHub Pages, or Cloudflare Pages (drag-and-drop the folder).
4. Verify the WhatsApp number works with `wa.me` (it must have WhatsApp active).
5. Set up / claim their **Google Business Profile** so the map pin is exact — it's also where real reviews will come from.
