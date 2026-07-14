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
  var PRODUCTS = [
    { id: "ribeye-prime", name: "Rib eye USDA Prime", cat: "res", price: 780, unit: "kg",
      img: img("photo-1603048297172-c92544798d5a"), alt: "Rib eye USDA Prime con marmoleo" },
    { id: "tomahawk", name: "Tomahawk", cat: "res", price: 1290, unit: "pieza", approx: "aprox. 1.4 kg",
      img: img("photo-1615937657715-bc7b4b7962c1"), alt: "Corte tomahawk" },
    { id: "newyork-choice", name: "New York USDA Choice", cat: "res", price: 520, unit: "kg",
      img: img("photo-1592686092916-672fa9e86866"), alt: "Cortes New York con cuchillo de carnicero" },
    { id: "tbone", name: "T-bone", cat: "res", price: 450, unit: "kg",
      img: img("photo-1551028150-64b9f398f678"), alt: "Corte T-bone sobre hielo" },
    { id: "picanha", name: "Picaña", cat: "res", price: 420, unit: "kg",
      img: img("photo-1529692236671-f1f6cf9683ba"), alt: "Picaña asada rebanada" },
    { id: "arrachera", name: "Arrachera marinada", cat: "res", price: 330, unit: "kg",
      img: img("photo-1558030006-450675393462"), alt: "Arrachera asada rebanada en tabla" },
    { id: "ribeye-wagyu", name: "Rib eye Wagyu australiano", cat: "wagyu", price: 1980, unit: "kg",
      img: img("photo-1602470520998-f4a52199a3d6"), alt: "Rib eye Wagyu con marmoleo intenso" },
    { id: "brisket", name: "Brisket", cat: "ahumar", price: 320, unit: "kg",
      img: img("photo-1588168333986-5078d3ae3976"), alt: "Brisket con costra sellada" },
    { id: "costillar-cerdo", name: "Costillar de cerdo", cat: "cerdo", price: 180, unit: "kg",
      img: img("photo-1544025162-d76694265947"), alt: "Costillar de cerdo BBQ" },
    { id: "chuleta-cerdo", name: "Chuleta de cerdo", cat: "cerdo", price: 160, unit: "kg",
      img: img("photo-1432139555190-58524dae6a55"), alt: "Chuleta de cerdo preparada" },
    { id: "paquete-parrillero", name: "Paquete Parrillero (6 pers.)", cat: "paquetes", price: 1499, unit: "pieza", approx: "surtido de cortes",
      img: img("photo-1607623814075-e51df1bdc82f"), alt: "Tabla surtida de cortes y embutidos" }
  ];

  var CATS = [
    ["todos", "Todos"],
    ["res", "Res"],
    ["wagyu", "Wagyu"],
    ["cerdo", "Cerdo"],
    ["ahumar", "Para ahumar"],
    ["paquetes", "Paquetes"]
  ];

  var KG = { step: 0.5, min: 0.5, max: 12, start: 1 };
  var PZ = { step: 1, min: 1, max: 6, start: 1 };

  // --- Estado -------------------------------------------------
  var STORAGE_KEY = "ch_cart_v1";
  var cart = {};              // { productId: qty }
  var delivery = "pickup";    // "pickup" | "delivery"
  var activeCat = "todos";

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

  if (!grid || !drawer) return;

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

  function renderStore() {
    var list = PRODUCTS.filter(function (p) {
      return activeCat === "todos" || p.cat === activeCat;
    });
    grid.innerHTML = list.map(function (p) {
      var r = rules(p);
      return (
        '<article class="p-card" data-id="' + p.id + '">' +
          '<div class="p-media"><img src="' + p.img + '" alt="' + p.alt + '" loading="lazy">' +
            '<span class="p-tag">' + catName(p.cat) + "</span></div>" +
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
    }).join("");
  }

  function adjustStepper(stepEl, dir) {
    var p = byId(stepEl.getAttribute("data-id"));
    if (!p) return;
    var valEl = stepEl.querySelector(".qs-value");
    var q = clampQty(p, parseFloat(valEl.getAttribute("data-qty")) + dir * rules(p).step);
    valEl.setAttribute("data-qty", q);
    valEl.textContent = qtyLabel(p, q);
  }

  filters.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeCat = btn.getAttribute("data-cat");
    renderFilters();
    renderStore();
  });

  grid.addEventListener("click", function (e) {
    var minus = e.target.closest(".qs-minus");
    var plus = e.target.closest(".qs-plus");
    var add = e.target.closest(".p-add");
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
  });

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
    if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
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
  renderFilters();
  renderStore();
  renderCart();
  var radios = drawer.querySelectorAll('input[name="delivery"]');
  for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === delivery;

  // Pequeña API para pruebas / demostraciones
  window.CHStore = { add: addToCart, open: openCart, close: closeCart };
})();
