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
| `index.html` | Storefront home: light hero with "Comprar en línea", shop-by-category tiles, four featured products, the grill calculator, how-ordering-works steps, story teaser + "en números", sample reviews, map |
| `nosotros.html` | The story (garage → boutique), timeline, values, brands/sourcing |
| `cortes.html` | The full counter: 6 product categories + the Wagyu showcase (`#wagyu`) |
| `tienda.html` | The online store: category filters (linkable as `tienda.html?cat=wagyu` etc.), name search, full catalog, WhatsApp checkout |
| `guia.html` | "Guía del parrillero": which cut for what, the grill calculator, doneness temperatures, butcher tips — the blog/SEO role |
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
| `fx.css` / `fx.js` | The motion & effects layer (see below) — **fully optional** |

> A cinematic slow-motion video section ("La experiencia Hildebrandt") was built and later parked — it lives in the git history (commit `789622f` and earlier) and can be restored anytime, ideally with footage filmed in the actual shop.

**Editing note:** the header, footer, cart drawer, and floating buttons are duplicated in every HTML page (no build step = no template includes). If you change one of those blocks, copy the change to all pages. The same goes for the two `fx` lines — `<link rel="stylesheet" href="fx.css?v=7">` in the `<head>` and `<script src="fx.js?v=7"></script>` before `</body>`.

## The motion & effects layer (`fx.css` + `fx.js`)

Everything showy lives in these two files, deliberately kept apart from the base design. **To remove all of it, delete those two lines from the eight HTML pages** — the site keeps working exactly as before, just without the movement. Nothing needed to browse or buy depends on it.

What it adds:

| | |
|---|---|
| **Page transitions** | Pages cross-fade into each other instead of flashing white; the header and WhatsApp button stay put. (Chrome/Edge/Safari; Firefox just navigates normally.) |
| **Welcome curtain** | A brand splash that splits open — once per visit, not on every page |
| **Headlines** | Every `h1`/`h2` rises into place word by word |
| **Grids** | Category tiles, product cards, steps, reviews and perks come in one after another instead of as a block |
| **Photos** | Framed photos rise behind a curtain; the home hero cycles through three shots with a slow zoom and a light sweep |
| **Product cards** | Tilt in 3D under the cursor with a moving highlight, and a gold frame draws itself on hover |
| **Add to cart** | The photo flies into the cart icon, the icon jolts, and a small confirmation appears |
| **Wagyu / closing bands** | Live embers drift up over the red band, and the giant outlined word drifts with the scroll |
| **Category tiles** | Editorial layout — "Res" and "Paquetes" run double width — and each photo drifts inside its tile as you scroll |
| **Store page** | The filter/search bar sticks under the header, and cards animate back in each time you filter or search |
| **Small stuff** | Reading-progress bar, header that shrinks as you scroll, cursor ring on desktop, buttons that lean toward the pointer and catch a glint, the cuts ribbon speeding up with your scroll, counters that count up |

Accessibility and safety nets are built in: with **“reduce motion”** turned on in the operating system, everything is shown immediately and nothing animates; the curtain and the calculator are drawn by JavaScript, so with JS off they simply never appear rather than leaving anything blank; and content is force-revealed if you land mid-page via an anchor or a reload.

## The grill calculator

`index.html` and `guia.html` both carry a **“¿Cuánta carne para tu asado?”** tool (the `<div id="grill-calc">` container; `fx.js` builds it). Pick how many people, how big their appetite, and the style of the cookout, and it works out the kilos, suggests a basket from the real `PRODUCTS` catalog with prices, and fills the cart in one click.

The per-person amounts are the usual butcher rules of thumb — **280 g / 380 g / 550 g** of meat per person for the three appetite levels — plus one bag of charcoal per eight guests. They live in the `HUNGER` and `STYLES` arrays near the bottom of `fx.js`; **have the owners adjust them to what they actually recommend at the counter.**

## The online store (no Shopify)

The cart button in the header works on **every** page; the full catalog lives in `tienda.html` and three featured products render on the home page. Checkout goes **through WhatsApp**: the customer picks cuts, adjusts weight (0.5 kg steps) or pieces, and "Enviar pedido por WhatsApp" opens a chat with the shop's number containing the itemized order, estimated subtotal, and pickup/delivery choice. No platform, no fees, no backend.

### The product sheet (quick view)

Clicking a product photo, its title, or the **“Ver detalle”** button opens a panel with a large photo, what the cut actually is, how to cook it, and a weight stepper that adds straight to the cart. It's built once by `store.js` and reused, so there's no extra markup in the HTML pages.

**When the shop's photo gallery arrives, this is where it goes.** Every product accepts an optional `imgs` array in `store.js`:

```js
{ id: "ribeye-prime", name: "Rib eye USDA Prime", …,
  img:  "fotos/ribeye-1.jpg",                       // la de la tarjeta
  imgs: ["fotos/ribeye-1.jpg",                      // la ficha muestra
         "fotos/ribeye-2.jpg",                      // miniaturas sola
         "fotos/ribeye-3.jpg"] },
```

Add `imgs` and the sheet grows a thumbnail strip by itself; leave it out and it just shows the single `img`. Nothing else needs changing.

- **Products & prices** live in the `PRODUCTS` array at the top of `store.js` — names, categories, price per kg/piece, and photos are all edited there. The `FEATURED` array (same file) picks the four home-page products. **All prices in the demo are made up** and marked as such on the page — including the "Para la parrilla" items (rub de la casa, carbón, tabla) added to make the store feel complete.
- Categories are deep-linkable: `tienda.html?cat=res|wagyu|cerdo|ahumar|parrilla|paquetes` opens the store pre-filtered (the home tiles and the cortes-page "Pedir en línea" links use this), and the search box filters by name, accents optional.
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
| "En números" strip on the home page | 2021 · 32 estados · 6 familias de producto · 2 orígenes de Wagyu | ⚠️ Each figure only restates something the site already claims (founding year, nationwide shipping = Mexico's 32 states, the six store categories, Japanese + Australian Wagyu) — confirm the framing reads right to them |
| Grill-calculator amounts | 280/380/550 g of meat per person, 1 bag of charcoal per 8 guests | ⚠️ Standard butcher rules of thumb, not theirs — adjust in `HUNGER`/`STYLES` in `fx.js` |
| Product sheet copy (`desc` / `cook` in `store.js`) | What each cut is and how to cook it | ⚠️ General butchery/cooking knowledge, written by us. A few make claims about *their* products specifically (the house rub's blend, what's inside the Paquete Parrillero) — have them read those two |
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

The site uses a **light theme** (July 2026 redesign, at the owners' request): cream/warm-white backgrounds, dark text, the oxblood red as the action color and gold as decoration. Heads-up for editors: a few class names survive from the original dark design (`.section-dark`, `.on-dark`, `h2.on-dark`) — they now render as the white accent panel / dark-on-light text, so don't let the names fool you.

## Suggested next steps to go live

1. Confirm the ⚠️/🔴 items above with the owners and drop in their real photos/logo.
2. Buy a domain (e.g. `carneshildebrandt.com` / `.mx`).
3. Host it free on Netlify, Vercel, GitHub Pages, or Cloudflare Pages (drag-and-drop the folder).
4. Verify the WhatsApp number works with `wa.me` (it must have WhatsApp active).
5. Set up / claim their **Google Business Profile** so the map pin is exact — it's also where real reviews will come from.
