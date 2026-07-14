# Carnes Hildebrandt — Demo Website

> ## 🔗 [**OPEN THE LIVE SITE →**](https://alejandrothiessen.github.io/carnes-hildebrandt-demo/)
>
> **This is the link to show the client:** `https://alejandrothiessen.github.io/carnes-hildebrandt-demo/`
> The `github.com` page you are reading now is only the source code.

A single-page demo/proposal website for **Carnes Hildebrandt** (boutique de carnes, Cuauhtémoc, Chihuahua). Built as a static site — no frameworks, no build step, nothing to install.

## How to preview it

Just double-click `index.html` and it opens in your browser.

> The photos, fonts, and the map are loaded from the internet, so preview it while online. Everything else works offline.

## Files

| File | What it is |
|---|---|
| `index.html` | All the content (Spanish, es-MX) |
| `styles.css` | All the design — colors/fonts are variables at the top of the file |
| `main.js` | Small touches: sticky header, mobile menu, scroll animations |
| `store.js` | The online store: product catalog, cart, WhatsApp checkout |
| `store.css` | Styles for the store section and the cart drawer |

## The online store (no Shopify)

The "Tienda en línea" section is a working cart that **checks out through WhatsApp**: the customer picks cuts, adjusts weight (0.5 kg steps) or pieces, and "Enviar pedido por WhatsApp" opens a chat with the shop's number containing the itemized order, estimated subtotal, and pickup/delivery choice. No platform, no fees, no backend — it can be deployed exactly as-is, and it matches how the shop already takes orders.

- **Products & prices** live in the `PRODUCTS` array at the top of `store.js` — names, categories, price per kg/piece, and photos are all edited there. **All prices in the demo are made up** and marked as such on the page.
- The cart persists in the visitor's browser (localStorage) and the final total is framed as "confirmed on WhatsApp when the cuts are weighed" — which is how butcher shops actually work.
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
| Products | USDA Prime/Choice, Certified Angus Beef, Wagyu (Japanese & Australian), pork, rubs, knives, shipping nationwide, cash & card | ⚠️ From a public review (2024) — confirm current lineup |
| "Started in the family garage in 2021" story | Used in the "Nosotros" section | ⚠️ From a public review — confirm wording with the family |
| Social links | facebook.com/CarnesHildebrandt, instagram/tiktok @carneshildebrandt | ✅ Verified handles |

A small **"Maqueta de demostración"** badge floats at the bottom-left of the page as a reminder; delete that block from `index.html` (and its CSS) for the final version.

## Photos are placeholders

All images are free-to-use Unsplash stock photos, hot-linked. For the real site, replace them with the shop's own photos (their Facebook/Instagram have plenty of great ones — ask the owners for the originals):

- Hero background: edit the `url(...)` inside `.hero-bg` in `styles.css`
- All other images: edit the `<img src="...">` tags in `index.html`

## Changing the look

Open `styles.css` — the first block (`:root`) holds every color and font. Swap those variables and the whole site follows.

## Suggested next steps to go live

1. Confirm the ⚠️ items above with the owners and drop in their real photos/logo.
2. Buy a domain (e.g. `carneshildebrandt.com` / `.mx`).
3. Host it free on Netlify, Vercel, GitHub Pages, or Cloudflare Pages (drag-and-drop the folder).
4. Verify the WhatsApp number works with `wa.me` (it must have WhatsApp active).
5. Set up / claim their **Google Business Profile** so the map pin is exact.
