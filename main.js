// ============================================================
// Carnes Hildebrandt — interacciones de la maqueta
// ============================================================

(function () {
  "use strict";

  // --- Enlaces viejos: el sitio antes era una sola página -----
  // Anclas guardadas (p. ej. /#tienda) llevan a su nueva página.
  var LEGACY = {
    nosotros: "nosotros.html",
    cortes: "cortes.html",
    wagyu: "cortes.html#wagyu",
    tienda: "tienda.html",
    pedidos: "envios.html",
    visitanos: "contacto.html"
  };
  if (document.body.getAttribute("data-page") === "inicio" && location.hash) {
    var legacyDest = LEGACY[location.hash.slice(1)];
    if (legacyDest) location.replace(legacyDest);
  }

  var header = document.querySelector(".site-header");
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");

  // --- Header: fondo sólido y encogido al hacer scroll -------
  // El encogido va atado al scroll, cuadro a cuadro: `--hp` va de 0
  // (arriba del todo) a 1 (encogido) en los primeros 72 px. Antes era
  // un cambio de clase con transición de .35s y curva muy adelantada
  // —cubic-bezier(.16,1,.3,1)—, así que los 16 px de altura se iban
  // casi enteros en el primer cuadro: bajando se veía un corte seco.
  // (en la página 404 el header siempre lleva fondo sólido)
  var alwaysSolid = document.body.hasAttribute("data-header-solid");
  var SHRINK = 72;
  var lastHp = -1;
  var queued = false;

  function paintHeader() {
    queued = false;
    var y = window.scrollY || window.pageYOffset || 0;
    var hp = y / SHRINK;
    if (hp > 1) hp = 1; else if (hp < 0) hp = 0;
    if (Math.abs(hp - lastHp) > .002) {
      lastHp = hp;
      header.style.setProperty("--hp", hp.toFixed(3));
    }
    header.classList.toggle("scrolled", alwaysSolid || y > 24);
  }
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(paintHeader);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  paintHeader();

  // --- Menú móvil --------------------------------------------
  toggle.addEventListener("click", function () {
    var open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  // Cierra el menú al elegir una sección
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // --- Animaciones de entrada (reveal) -----------------------
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // --- Año en el pie ------------------------------------------
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // --- Aviso de maqueta ---------------------------------------
  // Sale una vez pasada la primera pantalla: fijo desde el arranque se
  // ponía justo encima del contenido —la línea de pagos del hero, el
  // horario del domingo en Visítanos, una tarjeta de la tienda—. Y al
  // cerrarlo se recuerda para todo el sitio, no solo para la página en
  // la que se cerró. (El pie de página lo sigue diciendo siempre.)
  var ribbon = document.getElementById("demo-ribbon");
  var ribbonClose = document.getElementById("demo-ribbon-close");
  var RIBBON_KEY = "ch_demo_seen";
  var dismissed = false;
  try { dismissed = localStorage.getItem(RIBBON_KEY) === "1"; } catch (e) { /* modo privado */ }

  if (ribbon && ribbonClose && !dismissed) {
    var shown = false;
    var showRibbon = function () {
      if (shown) return;
      shown = true;
      ribbon.classList.add("is-ready");
      window.removeEventListener("scroll", onRibbonScroll);
    };
    var onRibbonScroll = function () { if (window.scrollY > 320) showRibbon(); };
    window.addEventListener("scroll", onRibbonScroll, { passive: true });
    // Páginas cortas (404, Visítanos) donde no hay 320 px que bajar
    if (document.documentElement.scrollHeight < window.innerHeight + 320) {
      setTimeout(showRibbon, 1500);
    }
    ribbonClose.addEventListener("click", function () {
      ribbon.classList.add("hidden");
      try { localStorage.setItem(RIBBON_KEY, "1"); } catch (e) { /* modo privado */ }
    });
  } else if (ribbon) {
    ribbon.classList.add("hidden");
  }
})();
