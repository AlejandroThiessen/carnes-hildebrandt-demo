// ============================================================
// Carnes Hildebrandt — Tienda en línea (maqueta)
// ------------------------------------------------------------
// Carrito 100% en el navegador + "checkout" por WhatsApp:
// el pedido llega itemizado al WhatsApp del negocio, sin
// plataformas ni comisiones de por medio.
//
// PRODUCTOS y PRECIOS son de demostración: edita la lista
// PRODUCTS de aquí abajo para cambiar el catálogo.
// ============================================================

(function () {
  "use strict";

  var WA_NUMBER = "526251507388"; // ⚠ confirmar con el negocio

  function img(id) {
    return "https://images.unsplash.com/" + id + "?w=700&q=75&auto=format&fit=crop";
  }

  // --- Catálogo (demo) ---------------------------------------
  // unit: "kg" se vende por peso (pasos de 0.5 kg)
  //       "pieza" se vende por unidad
  //
  // Campos de la ficha (la ventana de detalle):
  //   desc  — qué es el corte
  //   cook  — cómo llevarlo a la mesa
  //   imgs  — OPCIONAL: varias fotos. Cuando lleguen las fotos del
  //           local, se ponen aquí (["url1","url2",…]) y la ficha
  //           muestra miniaturas sola. Sin este campo usa `img`.
  var PRODUCTS = [
    { id: "ribeye-prime", name: "Rib eye USDA Prime", cat: "res", price: 780, unit: "kg",
      img: img("photo-1603048297172-c92544798d5a"), alt: "Rib eye USDA Prime con marmoleo",
      desc: "El corte del lomo alto, con el marmoleo más generoso de la vitrina. La grasa infiltrada se derrite durante la cocción y es la que le da jugosidad y sabor sin necesidad de nada más.",
      cook: "Sartén de hierro o parrilla a fuego alto. Grosor de 3–4 cm, sal de grano al sellar y término medio rojo." },
    { id: "tomahawk", name: "Tomahawk", cat: "res", price: 1290, unit: "pieza", approx: "aprox. 1.4 kg",
      img: img("photo-1615937657715-bc7b4b7962c1"), alt: "Corte tomahawk",
      desc: "Un rib eye al que se le deja el hueso de la costilla largo y limpio. Mismo corte, misma calidad — pero es el que hace voltear a todos cuando sale a la mesa.",
      cook: "Dos zonas de fuego: sella por fuera y termina en calor indirecto con termómetro. Reposa 8 minutos antes de rebanar." },
    { id: "newyork-choice", name: "New York USDA Choice", cat: "res", price: 520, unit: "kg",
      img: img("photo-1592686092916-672fa9e86866"), alt: "Cortes New York con cuchillo de carnicero",
      desc: "Del lomo bajo, de fibra más apretada que el rib eye y con una capa de grasa en el borde. Más carnoso y menos untuoso: el favorito de quien prefiere morder el corte.",
      cook: "Fuego alto y directo. Pon el borde de grasa contra la parrilla unos segundos para que dore antes de acostarlo." },
    { id: "tbone", name: "T-bone", cat: "res", price: 450, unit: "kg",
      img: img("photo-1551028150-64b9f398f678"), alt: "Corte T-bone sobre hielo",
      desc: "Dos cortes en una sola pieza: lomo bajo de un lado del hueso y filete del otro. Un corte para compartir, o para quien quiere probar las dos texturas de una vez.",
      cook: "Calor medio-alto y paciencia: el filete se cocina más rápido, así que ponlo del lado menos caliente de la parrilla." },
    { id: "picanha", name: "Picaña", cat: "res", price: 420, unit: "kg",
      img: img("photo-1529692236671-f1f6cf9683ba"), alt: "Picaña asada rebanada",
      desc: "La tapa del cuadril con su capa de grasa intacta — el corte insignia de la parrilla brasileña. Esa grasa se va derritiendo sobre la carne mientras se asa.",
      cook: "Grasa hacia abajo primero, a fuego medio, hasta que dore. Rebana siempre contra la fibra." },
    { id: "arrachera", name: "Arrachera marinada", cat: "res", price: 330, unit: "kg",
      img: img("photo-1558030006-450675393462"), alt: "Arrachera asada rebanada en tabla",
      desc: "El clásico del asado norteño: fibra larga y suelta que atrapa la marinada como ningún otro corte. Va lista para poner al fuego.",
      cook: "Fuego alto y poco tiempo — se cocina en minutos. Rebana en tiras delgadas contra la fibra." },
    { id: "ribeye-wagyu", name: "Rib eye Wagyu australiano", cat: "wagyu", price: 1980, unit: "kg",
      img: img("photo-1602470520998-f4a52199a3d6"), alt: "Rib eye Wagyu con marmoleo intenso",
      desc: "Marmoleo en otra escala: la grasa del Wagyu se derrite a menor temperatura, y por eso se deshace en el paladar. Disponibilidad limitada y rotación constante.",
      cook: "Menos es más. Fuego medio, sal al final, término inglés a medio y rebanadas delgadas para compartir." },
    { id: "brisket", name: "Brisket", cat: "ahumar", price: 320, unit: "kg",
      img: img("photo-1588168333986-5078d3ae3976"), alt: "Brisket con costra sellada",
      desc: "El pecho de la res: una pieza dura y llena de colágeno que, tras horas de humo bajo, se transforma en la carne más tierna del asador.",
      cook: "Ahumador a 110 °C, alrededor de una hora por cada 500 g. No te asustes con la meseta de temperatura: es normal." },
    { id: "costillar-cerdo", name: "Costillar de cerdo", cat: "cerdo", price: 180, unit: "kg",
      img: img("photo-1544025162-d76694265947"), alt: "Costillar de cerdo BBQ",
      desc: "Costillar completo, con la carne entre hueso y hueso que es la que todos buscan. Funciona igual de bien con humo que en el horno.",
      cook: "Calor indirecto de 2 a 3 horas y barniza con salsa en los últimos 20 minutos, para que no se queme el azúcar." },
    { id: "chuleta-cerdo", name: "Chuleta de cerdo", cat: "cerdo", price: 160, unit: "kg",
      img: img("photo-1432139555190-58524dae6a55"), alt: "Chuleta de cerdo preparada",
      desc: "Corte de lomo con hueso, de sabor suave y cocción rápida. El comodín de la parrilla cuando hay niños en la mesa.",
      cook: "Fuego medio y retírala a 63 °C internos: pasada de término se seca. Un reposo corto y a la mesa." },
    { id: "paquete-parrillero", name: "Paquete Parrillero (6 pers.)", cat: "paquetes", price: 1499, unit: "pieza", approx: "surtido de cortes",
      img: img("photo-1607623814075-e51df1bdc82f"), alt: "Tabla surtida de cortes y embutidos",
      desc: "Un surtido armado por nosotros para que no tengas que decidir: cortes de res, algo de cerdo y acompañamientos, calculado para seis personas.",
      cook: "Empieza por lo que más tarda y cierra con los cortes de res. Escríbenos si quieres cambiar alguna pieza del paquete." },
    { id: "rub-casa", name: "Rub de la casa", cat: "parrilla", price: 180, unit: "pieza", approx: "frasco 250 g",
      img: img("photo-1596040033229-a9821ebd058d"), alt: "Especias y chiles para sazonar",
      desc: "Nuestra mezcla de sal, especias y chiles secos para sazonar antes del fuego. Pensada para carnes rojas, pero se lleva bien con el cerdo.",
      cook: "Espolvorea generoso 20 minutos antes de asar, para que la sal alcance a trabajar la superficie." },
    { id: "carbon-encino", name: "Carbón de encino", cat: "parrilla", price: 150, unit: "pieza", approx: "bolsa 3 kg",
      img: img("photo-1475738972911-5b44ce984c42"), alt: "Fuego de carbón y leña encendido",
      desc: "Carbón de encino, que enciende parejo, dura y da una brasa estable — la diferencia entre pelear con el fuego y disfrutar el asado.",
      cook: "Calcula una bolsa por cada ocho comensales y enciéndelo 30 minutos antes de poner la primera pieza." },
    { id: "tabla-madera", name: "Tabla de madera para servir", cat: "parrilla", price: 850, unit: "pieza",
      img: img("photo-1466637574441-749b8f19452f"), alt: "Tabla de madera con cuchillo de cocina",
      desc: "Tabla de madera maciza para rebanar y llevar el corte directo a la mesa, sin perder los jugos por el camino.",
      cook: "Lávala a mano y sécala de inmediato. Un poco de aceite mineral cada tanto y te dura años." }
  ];

  // Fotos de la ficha: varias si el producto trae `imgs`, si no la suya
  function gallery(p) {
    return (p.imgs && p.imgs.length) ? p.imgs : [p.img];
  }

  var CATS = [
    ["todos", "Todos"],
    ["res", "Res"],
    ["wagyu", "Wagyu"],
    ["cerdo", "Cerdo"],
    ["ahumar", "Para ahumar"],
    ["parrilla", "Para la parrilla"],
    ["paquetes", "Paquetes"]
  ];

  function validCat(key) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === key) return true;
    return false;
  }

  var KG = { step: 0.5, min: 0.5, max: 12, start: 1 };
  var PZ = { step: 1, min: 1, max: 6, start: 1 };

  // --- Estado -------------------------------------------------
  var STORAGE_KEY = "ch_cart_v1";
  var cart = {};              // { productId: qty }
  var delivery = "pickup";    // "pickup" | "delivery"
  var activeCat = "todos";
  var query = "";             // búsqueda por nombre (solo en la tienda)

  var fmt = new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN", maximumFractionDigits: 0
  });

  function byId(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function rules(p) { return p.unit === "kg" ? KG : PZ; }
  function qtyLabel(p, q) {
    if (p.unit === "kg") return (q % 1 === 0 ? String(q) : q.toFixed(1)) + " kg";
    return q === 1 ? "1 pieza" : q + " piezas";
  }
  function priceLabel(p) {
    return p.unit === "kg" ? "/ kg" : "/ pieza" + (p.approx ? " · " + p.approx : "");
  }
  function clampQty(p, q) {
    var r = rules(p);
    q = Math.round(q * 2) / 2;
    return Math.min(r.max, Math.max(r.min, q));
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: cart, delivery: delivery }));
    } catch (e) { /* modo privado, etc. */ }
  }
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      delivery = raw.delivery === "delivery" ? "delivery" : "pickup";
      var items = raw.items || {};
      for (var id in items) {
        var p = byId(id);
        var q = parseFloat(items[id]);
        if (p && q > 0) cart[id] = clampQty(p, q);
      }
    } catch (e) { cart = {}; }
  }

  // --- Elementos ----------------------------------------------
  var grid = document.getElementById("store-grid");
  var filters = document.getElementById("store-filters");
  var cartBtn = document.getElementById("cart-btn");
  var cartCount = document.getElementById("cart-count");
  var drawer = document.getElementById("cart-drawer");
  var overlay = document.getElementById("cart-overlay");
  var closeBtn = document.getElementById("cart-close");
  var itemsEl = document.getElementById("cart-items");
  var emptyEl = document.getElementById("cart-empty");
  var footEl = document.getElementById("cart-foot");
  var subtotalEl = document.getElementById("cart-subtotal");
  var submitBtn = document.getElementById("cart-submit");
  var emptyLink = document.getElementById("cart-empty-link");
  var featuredEl = document.getElementById("store-featured");
  var searchEl = document.getElementById("store-search");
  var countEl = document.getElementById("store-count");
  var noResultsEl = document.getElementById("store-empty");
  var resetEl = document.getElementById("store-reset");

  // El carrito vive en todas las páginas; la cuadrícula completa
  // solo existe en la tienda y los destacados solo en el inicio.
  if (!drawer || !cartBtn) return;

  // --- Tienda: filtros y productos ----------------------------
  function stepperHTML(p, q, small) {
    return (
      '<div class="qty-stepper' + (small ? " qty-small" : "") + '" data-id="' + p.id + '">' +
        '<button type="button" class="qs-minus" aria-label="Reducir cantidad">−</button>' +
        '<span class="qs-value" data-qty="' + q + '">' + qtyLabel(p, q) + "</span>" +
        '<button type="button" class="qs-plus" aria-label="Aumentar cantidad">+</button>' +
      "</div>"
    );
  }

  function renderFilters() {
    filters.innerHTML = CATS.map(function (c) {
      return '<button type="button" class="filter-btn' + (c[0] === activeCat ? " active" : "") +
        '" data-cat="' + c[0] + '">' + c[1] + "</button>";
    }).join("");
  }

  function catName(key) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === key) return CATS[i][1];
    return key;
  }

  function productCardHTML(p) {
    var r = rules(p);
    return (
      '<article class="p-card" data-id="' + p.id + '">' +
        '<div class="p-media"><img src="' + p.img + '" alt="' + p.alt + '" loading="lazy">' +
          '<span class="p-tag">' + catName(p.cat) + "</span>" +
          '<button type="button" class="p-view" data-id="' + p.id + '" aria-label="Ver detalle de ' + p.name + '">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.5 15.5L21 21M10.5 7.6v5.8M7.6 10.5h5.8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>' +
            "<span>Ver detalle</span>" +
          "</button></div>" +
        '<div class="p-body">' +
          "<h3>" + p.name + "</h3>" +
          '<p class="p-price">' + fmt.format(p.price) + " <span>" + priceLabel(p) + "</span></p>" +
          '<div class="p-actions">' +
            stepperHTML(p, r.start, false) +
            '<button type="button" class="p-add" data-id="' + p.id + '">' +
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.3 10.3A2 2 0 0 0 9.45 16H17a2 2 0 0 0 1.95-1.55L20.8 7H6M12 8v5M9.5 10.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              "Agregar" +
            "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  // Búsqueda sin acentos: "picana" encuentra "Picaña"
  function norm(s) {
    s = String(s).toLowerCase();
    return s.normalize ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : s;
  }

  // `animate` en los cambios de filtro o búsqueda: las tarjetas
  // entran escalonadas en vez de aparecer de golpe. En el primer
  // dibujado no se anima — de esa entrada se encarga fx.js al hacer
  // scroll, y si no está fx.js las tarjetas salen visibles y ya.
  function renderStore(animate) {
    var q = norm(query.trim());
    var list = PRODUCTS.filter(function (p) {
      var okCat = activeCat === "todos" || p.cat === activeCat;
      return okCat && (!q || norm(p.name).indexOf(q) !== -1);
    });
    grid.innerHTML = list.map(productCardHTML).join("");
    if (animate) {
      var cards = grid.querySelectorAll(".p-card");
      for (var i = 0; i < cards.length; i++) {
        cards[i].style.setProperty("--i", i);
        cards[i].classList.add("p-in");
      }
    }
    if (countEl) {
      countEl.textContent = list.length === 1 ? "1 producto" : list.length + " productos";
    }
    if (noResultsEl) noResultsEl.hidden = list.length > 0;
  }

  // Mantiene ?cat= en la URL para poder compartir/enlazar categorías
  function syncCatUrl() {
    if (!window.history || !history.replaceState) return;
    var url = location.pathname + (activeCat === "todos" ? "" : "?cat=" + activeCat) + location.hash;
    history.replaceState(null, "", url);
  }

  // Destacados de la página de inicio
  var FEATURED = ["ribeye-wagyu", "tomahawk", "ribeye-prime", "paquete-parrillero"];
  function renderFeatured() {
    featuredEl.innerHTML = FEATURED.map(byId).filter(Boolean).map(productCardHTML).join("");
  }

  function adjustStepper(stepEl, dir) {
    var p = byId(stepEl.getAttribute("data-id"));
    if (!p) return;
    var valEl = stepEl.querySelector(".qs-value");
    var q = clampQty(p, parseFloat(valEl.getAttribute("data-qty")) + dir * rules(p).step);
    valEl.setAttribute("data-qty", q);
    valEl.textContent = qtyLabel(p, q);
  }

  if (filters) {
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;
      activeCat = btn.getAttribute("data-cat");
      syncCatUrl();
      renderFilters();
      renderStore(true);
    });
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      query = searchEl.value;
      renderStore(true);
    });
  }
  if (resetEl) {
    resetEl.addEventListener("click", function () {
      query = "";
      if (searchEl) searchEl.value = "";
      activeCat = "todos";
      syncCatUrl();
      renderFilters();
      renderStore(true);
    });
  }

  // ==========================================================
  // FICHA DEL PRODUCTO (ventana de detalle)
  // ----------------------------------------------------------
  // Se construye una sola vez, la primera vez que se abre, y se
  // reutiliza. Así no hay que repetir este bloque en las 8 páginas.
  // ==========================================================
  var pv = null, pvLastFocus = null, pvId = null;

  function buildQuickView() {
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="pv-overlay" id="pv-overlay"></div>' +
      '<aside class="pv" id="pv" role="dialog" aria-modal="true" aria-labelledby="pv-title" aria-hidden="true">' +
        '<button type="button" class="pv-close" id="pv-close" aria-label="Cerrar ficha">×</button>' +
        '<div class="pv-media">' +
          '<img id="pv-img" src="" alt="">' +
          '<div class="pv-thumbs" id="pv-thumbs"></div>' +
        "</div>" +
        '<div class="pv-info">' +
          '<span class="pv-tag" id="pv-tag"></span>' +
          '<h3 id="pv-title"></h3>' +
          '<p class="pv-price" id="pv-price"></p>' +
          '<p class="pv-desc" id="pv-desc"></p>' +
          '<div class="pv-cook"><strong>En la parrilla</strong><span id="pv-cook"></span></div>' +
          '<div class="pv-actions" id="pv-actions"></div>' +
          '<p class="pv-fine">Los cortes se pesan al preparar tu pedido: el total final se confirma ' +
            "por WhatsApp. Precios de demostración.</p>" +
        "</div>" +
      "</aside>";
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);

    pv = {
      panel: document.getElementById("pv"),
      overlay: document.getElementById("pv-overlay"),
      close: document.getElementById("pv-close"),
      img: document.getElementById("pv-img"),
      thumbs: document.getElementById("pv-thumbs"),
      tag: document.getElementById("pv-tag"),
      title: document.getElementById("pv-title"),
      price: document.getElementById("pv-price"),
      desc: document.getElementById("pv-desc"),
      cook: document.getElementById("pv-cook"),
      actions: document.getElementById("pv-actions")
    };

    pv.close.addEventListener("click", closeQuickView);
    pv.overlay.addEventListener("click", closeQuickView);

    // Miniaturas: cambian la foto grande
    pv.thumbs.addEventListener("click", function (e) {
      var b = e.target.closest(".pv-thumb");
      if (!b) return;
      pv.img.src = b.getAttribute("data-src");
      var all = pv.thumbs.querySelectorAll(".pv-thumb");
      for (var i = 0; i < all.length; i++) all[i].classList.toggle("on", all[i] === b);
    });

    // El mismo par de controles que en la tarjeta
    pv.actions.addEventListener("click", function (e) {
      var minus = e.target.closest(".qs-minus");
      var plus = e.target.closest(".qs-plus");
      var add = e.target.closest(".p-add");
      if (minus || plus) {
        adjustStepper((minus || plus).closest(".qty-stepper"), minus ? -1 : 1);
      } else if (add) {
        var q = parseFloat(pv.actions.querySelector(".qs-value").getAttribute("data-qty"));
        addToCart(pvId, q);
        closeQuickView();
        openCart();
      }
    });
  }

  function openQuickView(id) {
    var p = byId(id);
    if (!p) return;
    if (!pv) buildQuickView();
    pvId = id;
    pvLastFocus = document.activeElement;

    var shots = gallery(p);
    pv.img.src = shots[0];
    pv.img.alt = p.alt;
    pv.thumbs.innerHTML = shots.length > 1 ? shots.map(function (s, i) {
      return '<button type="button" class="pv-thumb' + (i ? "" : " on") + '" data-src="' + s +
        '" aria-label="Foto ' + (i + 1) + '"><img src="' + s + '" alt=""></button>';
    }).join("") : "";
    pv.thumbs.hidden = shots.length < 2;

    pv.tag.textContent = catName(p.cat);
    pv.title.textContent = p.name;
    pv.price.innerHTML = fmt.format(p.price) + " <span>" + priceLabel(p) + "</span>";
    pv.desc.textContent = p.desc || "";
    pv.cook.textContent = p.cook || "";
    pv.actions.innerHTML = stepperHTML(p, rules(p).start, false) +
      '<button type="button" class="p-add" data-id="' + p.id + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l2.3 10.3A2 2 0 0 0 9.45 16H17a2 2 0 0 0 1.95-1.55L20.8 7H6M12 8v5M9.5 10.5h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "Agregar al pedido</button>";

    pv.panel.classList.add("open");
    pv.overlay.classList.add("open");
    pv.panel.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    pv.close.focus();
  }

  function closeQuickView() {
    if (!pv) return;
    pv.panel.classList.remove("open");
    pv.overlay.classList.remove("open");
    pv.panel.setAttribute("aria-hidden", "true");
    // El carrito puede seguir abierto: solo se libera el scroll si no lo está
    if (!drawer.classList.contains("open")) document.documentElement.style.overflow = "";
    if (pvLastFocus && pvLastFocus.focus) pvLastFocus.focus();
  }

  function onGridClick(e) {
    var minus = e.target.closest(".qs-minus");
    var plus = e.target.closest(".qs-plus");
    var add = e.target.closest(".p-add");
    var view = e.target.closest(".p-view, .p-media, .p-body h3");
    if (view && !minus && !plus && !add) {
      var card = view.closest(".p-card");
      if (card) { openQuickView(card.getAttribute("data-id")); return; }
    }
    if (minus || plus) {
      adjustStepper((minus || plus).closest(".qty-stepper"), minus ? -1 : 1);
    } else if (add) {
      var card = add.closest(".p-card");
      var q = parseFloat(card.querySelector(".qs-value").getAttribute("data-qty"));
      addToCart(add.getAttribute("data-id"), q);
      add.classList.add("added");
      var label = add.innerHTML;
      add.innerHTML = "✓ Agregado";
      setTimeout(function () { add.classList.remove("added"); add.innerHTML = label; }, 1300);
    }
  }
  if (grid) grid.addEventListener("click", onGridClick);
  if (featuredEl) featuredEl.addEventListener("click", onGridClick);

  // --- Carrito -------------------------------------------------
  function addToCart(id, qty) {
    var p = byId(id);
    if (!p) return;
    cart[id] = clampQty(p, (cart[id] || 0) + qty);
    save();
    renderCart();
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth; // reinicia la animación
    cartCount.classList.add("bump");
  }

  function cartLines() {
    var lines = [];
    for (var id in cart) {
      var p = byId(id);
      if (p) lines.push({ p: p, qty: cart[id], total: p.price * cart[id] });
    }
    return lines;
  }

  function renderCart() {
    var lines = cartLines();
    var count = lines.length;
    var total = 0;

    itemsEl.innerHTML = lines.map(function (l) {
      total += l.total;
      return (
        '<li class="cart-item" data-id="' + l.p.id + '">' +
          '<div class="ci-top"><strong>' + l.p.name + "</strong><span>" + fmt.format(l.total) + "</span></div>" +
          '<div class="ci-sub">' + fmt.format(l.p.price) + " " + priceLabel(l.p) + "</div>" +
          '<div class="ci-row">' +
            stepperHTML(l.p, l.qty, true) +
            '<button type="button" class="ci-remove" data-id="' + l.p.id + '">Quitar</button>' +
          "</div>" +
        "</li>"
      );
    }).join("");

    emptyEl.style.display = count ? "none" : "";
    footEl.style.display = count ? "" : "none";
    subtotalEl.textContent = fmt.format(total);
    submitBtn.disabled = !count;

    cartCount.textContent = String(count);
    cartCount.hidden = !count;
  }

  itemsEl.addEventListener("click", function (e) {
    var minus = e.target.closest(".qs-minus");
    var plus = e.target.closest(".qs-plus");
    var remove = e.target.closest(".ci-remove");
    if (minus || plus) {
      var stepEl = (minus || plus).closest(".qty-stepper");
      var p = byId(stepEl.getAttribute("data-id"));
      var q = clampQty(p, cart[p.id] + (minus ? -1 : 1) * rules(p).step);
      cart[p.id] = q;
      save();
      renderCart();
    } else if (remove) {
      delete cart[remove.getAttribute("data-id")];
      save();
      renderCart();
    }
  });

  drawer.addEventListener("change", function (e) {
    if (e.target.name === "delivery") {
      delivery = e.target.value;
      save();
    }
  });

  // --- Abrir / cerrar el panel ---------------------------------
  var lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.documentElement.style.overflow = "hidden";
    closeBtn.focus();
  }
  function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.documentElement.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  cartBtn.addEventListener("click", openCart);
  closeBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  emptyLink.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    // La ficha se cierra primero: puede estar abierta sobre el carrito
    if (pv && pv.panel.classList.contains("open")) closeQuickView();
    else if (drawer.classList.contains("open")) closeCart();
  });

  // --- Checkout por WhatsApp -----------------------------------
  submitBtn.addEventListener("click", function () {
    var lines = cartLines();
    if (!lines.length) return;
    var total = 0;
    var msg = "Hola Carnes Hildebrandt 👋\nQuiero hacer un pedido desde el sitio web:\n\n";
    lines.forEach(function (l) {
      total += l.total;
      msg += "• " + l.p.name + " — " + qtyLabel(l.p, l.qty) + " — " + fmt.format(l.total) + "\n";
    });
    msg += "\nSubtotal estimado: " + fmt.format(total);
    msg += "\nEntrega: " + (delivery === "delivery" ? "Envío a domicilio" : "Recoger en tienda");
    msg += "\n\n(Pedido de demostración)";
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  // --- Init ----------------------------------------------------
  load();
  // Enlaces profundos a una categoría: tienda.html?cat=wagyu
  if (grid) {
    var catParam = location.search.match(/[?&]cat=([^&]+)/);
    if (catParam && validCat(decodeURIComponent(catParam[1]))) {
      activeCat = decodeURIComponent(catParam[1]);
    }
  }
  if (filters) renderFilters();
  if (grid) renderStore();
  if (featuredEl) renderFeatured();
  renderCart();
  var radios = drawer.querySelectorAll('input[name="delivery"]');
  for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === delivery;

  // Pequeña API para pruebas / demostraciones y para la
  // calculadora de parrillada de fx.js, que arma un carrito
  // sugerido a partir de este mismo catálogo.
  window.CHStore = {
    add: addToCart,
    open: openCart,
    close: closeCart,
    products: PRODUCTS,
    byId: byId,
    view: openQuickView
  };
})();
